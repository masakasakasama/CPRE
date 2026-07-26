"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { questions, sources, units, type Question } from "./data";
import { calculateNextReview, calculateReadiness, calculateSchedule, getAnswerStats, initialProgress, makeSyncDocument, parseActiveExam, parseProgress, parseSyncDocument, selectNextQuestionId, upsertAnswerAttempt, type ActiveExam, type Confidence, type MockResult, type Progress } from "./progress";
import { studyGuides } from "./study";

type View = "home" | "learn" | "practice" | "exam" | "review" | "sources";
type SyncStatus = "loading" | "synced" | "saving" | "offline" | "setup";

const STORAGE_KEY = "cpre-english-study:v1";
const EXAM_KEY = "cpre-english-study:exam:v1";
const INTRO_KEY = "cpre-english-study:intro:v1";
const APP_VERSION = "0.6.0";

const navItems: { id: View; label: string; short: string }[] = [
  { id: "home", label: "Overview", short: "Home" },
  { id: "learn", label: "Study guides", short: "Study" },
  { id: "practice", label: "Quick test", short: "Test" },
  { id: "exam", label: "Mock exam", short: "Exam" },
  { id: "review", label: "Review", short: "Review" },
];

function sameAnswer(a: number[], b: number[]) {
  return a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]);
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTimer(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function localDateInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatChecked(value?: string) {
  if (!value) return "Not checked yet";
  return `Last checked ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value))}`;
}

function formatAttemptDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function questionScore(question: Question, selected: number[]) {
  if (selected.length > question.correct.length) return 0;
  if (question.kind !== "multiple") return sameAnswer(selected, question.correct) ? question.points : 0;
  const hits = selected.filter((option) => question.correct.includes(option)).length;
  return (hits / question.correct.length) * question.points;
}

function ChoiceList({ question, selected, onChange, disabled = false }: { question: Question; selected: number[]; onChange: (value: number[]) => void; disabled?: boolean }) {
  const multi = question.kind === "multiple";
  return (
    <div className="choices" role={multi ? "group" : "radiogroup"} aria-label="Answer choices">
      {question.options.map((option, index) => {
        const checked = selected.includes(index);
        return (
          <label className={`choice ${checked ? "selected" : ""}`} key={option}>
            <input
              type={multi ? "checkbox" : "radio"}
              name={question.id}
              checked={checked}
              disabled={disabled}
              onChange={() => {
                if (multi) onChange(checked ? selected.filter((item) => item !== index) : [...selected, index]);
                else onChange([index]);
              }}
            />
            <span className="choice-key">{String.fromCharCode(65 + index)}</span>
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [showIntro, setShowIntro] = useState(() => typeof window === "undefined" || localStorage.getItem(INTRO_KEY) !== "done");
  const [selectedStudyUnit, setSelectedStudyUnit] = useState<number | null>(null);
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [hydrated, setHydrated] = useState(false);
  const [practiceQuestionId, setPracticeQuestionId] = useState(questions[0]?.id ?? "");
  const [practiceSelected, setPracticeSelected] = useState<number[]>([]);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practiceConfidence, setPracticeConfidence] = useState<Confidence | null>(null);
  const [practiceAttemptAt, setPracticeAttemptAt] = useState<string | null>(null);
  const [practiceUnit, setPracticeUnit] = useState<number | "all">("all");
  const [exam, setExam] = useState<ActiveExam | null>(null);
  const [examResult, setExamResult] = useState<MockResult | null>(null);
  const [now, setNow] = useState(Date.now());
  const [sourceStatus, setSourceStatus] = useState<"idle" | "checking" | "online" | "cached">("idle");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [syncKey, setSyncKey] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [remoteReady, setRemoteReady] = useState(false);
  const [toast, setToast] = useState("");
  const lastSynced = useRef("");

  function syncHeaders(key = syncKey, token = githubToken): Record<string, string> {
    return {
      ...(key ? { "x-cpre-sync-key": key } : {}),
      ...(token ? { "x-cpre-github-token": token } : {}),
    };
  }

  async function saveRemote(nextProgress = progress, nextExam = exam, key = syncKey, token = githubToken) {
    const document = makeSyncDocument(nextProgress, nextExam);
    const serialized = JSON.stringify({ progress: document.progress, activeExam: document.activeExam });
    if (serialized === lastSynced.current) return true;
    setSyncStatus("saving");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...syncHeaders(key, token) },
        body: JSON.stringify(document),
      });
      if (response.status === 401 || response.status === 503) {
        setSyncStatus("setup");
        return false;
      }
      if (!response.ok) throw new Error("sync_failed");
      lastSynced.current = serialized;
      setSyncStatus("synced");
      return true;
    } catch {
      setSyncStatus("offline");
      return false;
    }
  }

  useEffect(() => {
    let cancelled = false;
    try {
      const shared = new URLSearchParams(window.location.search).get("share");
      const cachedSyncKey = sessionStorage.getItem("cpre-english-study:sync-key") || "";
      const cachedGithubToken = sessionStorage.getItem("cpre-english-study:github-token") || "";
      // Restore the external browser cache before the first interactive render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (cachedSyncKey) setSyncKey(cachedSyncKey);
      if (cachedGithubToken) setGithubToken(cachedGithubToken);
      const stored = localStorage.getItem(STORAGE_KEY);
      const decoded = shared ? parseProgress(JSON.parse(decodeURIComponent(escape(atob(shared.replace(/-/g, "+").replace(/_/g, "/")))))) : null;
      const cached = stored ? parseProgress(JSON.parse(stored)) : null;
      const next = decoded || cached || initialProgress;
      const storedExam = localStorage.getItem(EXAM_KEY);
      let nextExam: ActiveExam | null = null;
      if (storedExam) {
        const parsed = parseActiveExam(JSON.parse(storedExam));
        if (parsed && parsed.endsAt > Date.now()) nextExam = parsed;
        else localStorage.removeItem(EXAM_KEY);
      }
      setProgress(next);
      if (nextExam) setExam(nextExam);
      const restore = async () => {
        setSyncStatus("loading");
        try {
          const response = await fetch("/api/progress", { headers: syncHeaders(cachedSyncKey, cachedGithubToken), cache: "no-store" });
          if (response.status === 401 || response.status === 503) {
            if (!cancelled) setSyncStatus("setup");
            return;
          }
          if (!response.ok) throw new Error("sync_failed");
          const payload = await response.json() as { exists?: boolean; document?: unknown };
          const remote = parseSyncDocument(payload.document);
          if (!cancelled && payload.exists && remote && !decoded) {
            setProgress(remote.progress);
            setExam(remote.activeExam && remote.activeExam.endsAt > Date.now() ? remote.activeExam : null);
            lastSynced.current = JSON.stringify({ progress: remote.progress, activeExam: remote.activeExam });
            setSyncStatus("synced");
          } else if (!cancelled) {
            await saveRemote(next, nextExam, cachedSyncKey, cachedGithubToken);
          }
        } catch {
          if (!cancelled) setSyncStatus("offline");
        } finally {
          if (!cancelled) setRemoteReady(true);
        }
      };
      void restore();
    } catch {
      setProgress(initialProgress);
      setSyncStatus("offline");
      setRemoteReady(true);
    } finally {
      setHydrated(true);
    }
    return () => { cancelled = true; };
    // Initial migration reads the existing browser cache before GitHub.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch { /* Storage can be unavailable in private browsing. */ }
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (exam) localStorage.setItem(EXAM_KEY, JSON.stringify(exam));
    else localStorage.removeItem(EXAM_KEY);
  }, [exam, hydrated]);

  useEffect(() => {
    if (!hydrated || !remoteReady) return;
    const timeout = window.setTimeout(() => void saveRemote(progress, exam), 1200);
    return () => window.clearTimeout(timeout);
    // Save the latest combined progress/exam snapshot after local changes settle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, exam, hydrated, remoteReady, syncKey, githubToken]);

  useEffect(() => {
    if (!exam) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [exam]);

  useEffect(() => {
    if (exam && exam.endsAt <= now) submitExam(exam);
    // submitExam is intentionally driven by the timer boundary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, exam]);

  useEffect(() => {
    if (!hydrated || progress.lastSourceCheck) return;
    void refreshSources();
    // Run once after the first local load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const practicePool = useMemo(() => practiceUnit === "all" ? questions : questions.filter((question) => question.unit === practiceUnit), [practiceUnit]);
  const practiceQuestion = practicePool.find((question) => question.id === practiceQuestionId) ?? null;
  const readiness = useMemo(() => calculateReadiness(progress), [progress]);
  const schedule = useMemo(() => calculateSchedule(progress, readiness.total), [progress, readiness.total]);
  const examQuestions = exam ? exam.order.map((id) => questions.find((question) => question.id === id)!).filter(Boolean) : [];
  const currentExamQuestion = exam ? examQuestions[exam.index] : null;
  const secondsLeft = exam ? Math.max(0, Math.ceil((exam.endsAt - now) / 1000)) : 75 * 60;

  function recordAnswer(question: Question, selected: number[], confidence: Confidence, replaceAttemptAt: string | null = null) {
    const correct = sameAnswer(selected, question.correct);
    const at = replaceAttemptAt || new Date().toISOString();
    setProgress((current) => {
      const existing = current.answered[question.id];
      return {
        ...current,
        answered: {
          ...current.answered,
          [question.id]: upsertAnswerAttempt(existing, selected, correct, confidence, at, replaceAttemptAt),
        },
        review: correct ? current.review : Array.from(new Set([...current.review, question.id])),
      };
    });
    return at;
  }

  function nextPractice() {
    setPracticeQuestionId(selectNextQuestionId(practicePool.map((question) => question.id), practiceQuestion?.id ?? null, progress) ?? "");
    setPracticeSelected([]);
    setPracticeChecked(false);
    setPracticeConfidence(null);
    setPracticeAttemptAt(null);
  }

  function beginPractice(unit: number | "all" = practiceUnit) {
    const pool = unit === "all" ? questions : questions.filter((question) => question.unit === unit);
    setPracticeUnit(unit);
    setPracticeQuestionId(selectNextQuestionId(pool.map((question) => question.id), null, progress) ?? "");
    setPracticeSelected([]);
    setPracticeChecked(false);
    setPracticeConfidence(null);
    setPracticeAttemptAt(null);
    setView("practice");
  }

  function startExam() {
    const next: ActiveExam = {
      order: shuffle(questions).map((question) => question.id),
      answers: {},
      index: 0,
      endsAt: Date.now() + 75 * 60 * 1000,
    };
    setExamResult(null);
    setExam(next);
    setNow(Date.now());
    setView("exam");
  }

  function submitExam(target: ActiveExam) {
    let points = 0;
    let correct = 0;
    let total = 0;
    const wrong: string[] = [];
    const nextAnswered = { ...progress.answered };
    for (const question of questions) {
      const selected = target.answers[question.id] ?? [];
      const exact = sameAnswer(selected, question.correct);
      points += questionScore(question, selected);
      total += question.points;
      if (exact) correct += 1;
      else wrong.push(question.id);
      nextAnswered[question.id] = { selected, correct: exact, lastAt: new Date().toISOString() };
    }
    const result: MockResult = { at: new Date().toISOString(), percent: Math.round((points / total) * 100), correct, points: Math.round(points * 10) / 10, total };
    setProgress((current) => ({
      ...current,
      answered: nextAnswered,
      review: Array.from(new Set([...current.review, ...wrong])),
      mockHistory: [result, ...current.mockHistory].slice(0, 20),
    }));
    setExamResult(result);
    setExam(null);
  }

  async function refreshSources() {
    setSourceStatus("checking");
    try {
      await fetch("https://cpre.ireb.org/en/downloads-and-resources/downloads", { mode: "no-cors", cache: "no-store" });
      const checkedAt = new Date().toISOString();
      setProgress((current) => ({ ...current, lastSourceCheck: checkedAt }));
      setSourceStatus("online");
    } catch {
      setSourceStatus("cached");
    }
  }

  async function shareProgress() {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(progress)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const url = `${window.location.origin}${window.location.pathname}?share=${payload}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Progress link copied. It contains a snapshot, not live sync.");
    } catch {
      window.prompt("Copy this progress link", url);
    }
  }

  function setTargetExamDate(value: string) {
    setProgress((current) => {
      if (!value) {
        const next = { ...current };
        delete next.targetExamDate;
        delete next.planStartedAt;
        return next;
      }
      return {
        ...current,
        targetExamDate: value,
        planStartedAt: current.planStartedAt || new Date().toISOString(),
      };
    });
  }

  async function connectSync() {
    if (syncKey) sessionStorage.setItem("cpre-english-study:sync-key", syncKey);
    if (githubToken) sessionStorage.setItem("cpre-english-study:github-token", githubToken);
    setSyncStatus("loading");
    try {
      const response = await fetch("/api/progress", { headers: syncHeaders(), cache: "no-store" });
      if (response.status === 401 || response.status === 503) {
        setSyncStatus("setup");
        return;
      }
      if (!response.ok) throw new Error("sync_failed");
      const payload = await response.json() as { exists?: boolean; document?: unknown };
      const remote = parseSyncDocument(payload.document);
      if (payload.exists && remote) {
        setProgress(remote.progress);
        setExam(remote.activeExam && remote.activeExam.endsAt > Date.now() ? remote.activeExam : null);
        lastSynced.current = JSON.stringify({ progress: remote.progress, activeExam: remote.activeExam });
        setSyncStatus("synced");
      } else {
        await saveRemote(progress, exam);
      }
      setRemoteReady(true);
    } catch {
      setSyncStatus("offline");
    }
  }

  const syncLabel = syncStatus === "synced" ? "Synced to GitHub" : syncStatus === "saving" ? "Saving to GitHub…" : syncStatus === "loading" ? "Loading GitHub data…" : syncStatus === "setup" ? "GitHub sync needs setup" : "Offline · cached locally";

  function finishIntro(target: View) {
    localStorage.setItem(INTRO_KEY, "done");
    if (target === "practice") beginPractice("all");
    else setView(target);
    setShowIntro(false);
  }

  function openStudy(unitId: number) {
    setSelectedStudyUnit(unitId);
    setView("learn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startUnitPractice(unitId: number) {
    beginPractice(unitId);
  }

  function renderIntro() {
    const courseGroups = [
      { range: "EU 1–2", title: "まず、要求工学の土台", description: "要求の意味、必要な理由、9つの基本原則", keywords: "requirement · stakeholder · validation" },
      { range: "EU 3–5", title: "次に、実務での進め方", description: "文書・モデル・プロトタイプ、要求の引き出しと合意、プロセス設計", keywords: "work product · elicitation · RE process" },
      { range: "EU 6–7", title: "最後に、管理とツール", description: "要求と関連資料のつながり、変更、優先順位、ツール導入", keywords: "traceability · change request · RE tool" },
    ];
    return (
      <main className="intro-shell" lang="ja">
        <div className="intro-top"><span className="intro-brand">CPRE <b>English Study</b></span><button onClick={() => finishIntro("home")}>案内をスキップ</button></div>
        <section className="intro-hero">
          <span className="eyebrow">IREB CPRE FOUNDATION LEVEL</span>
          <h1>英語試験の前に、<br />まず全体像をつかむ</h1>
          <p>要求工学を7単元で学ぶコース。問題と重要用語は英語、答え合わせ後の補足は日本語</p>
          <div className="intro-actions"><button className="button primary" onClick={() => finishIntro("practice")}>まず1問やってみる</button><button className="button secondary" onClick={() => finishIntro("learn")}>7単元を詳しく見る</button></div>
          <small>45問の模擬試験は後回しでOK。最初から75分に取り組む必要なし</small>
        </section>
        <section className="intro-route" aria-labelledby="course-outline">
          <div className="intro-section-head"><span>学ぶ順番</span><h2 id="course-outline">コースの概略</h2></div>
          <div className="intro-course-grid">{courseGroups.map((group, index) => <article className="intro-course-card" key={group.range}><div><em>{index + 1}</em><span>{group.range}</span></div><h3>{group.title}</h3><p>{group.description}</p><small>{group.keywords}</small></article>)}</div>
        </section>
        <section className="intro-promise">
          <div><strong>今日のゴール</strong><span>英語の問題を1問だけ解く</span></div>
          <button className="button primary" onClick={() => finishIntro("practice")}>学習を始める →</button>
        </section>
      </main>
    );
  }

  function renderHome() {
    const latest = progress.mockHistory[0];
    const readinessLabel = readiness.total >= 85 ? "仕上げ段階" : readiness.total >= 70 ? "合格圏へ接近" : readiness.total >= 50 ? "知識を接続中" : readiness.total >= 30 ? "基礎を形成中" : "導入段階";
    const scheduleLabel = schedule?.status === "ahead" ? "予定より先行" : schedule?.status === "on-track" ? "ほぼ予定どおり" : schedule?.status === "behind" ? "予定より遅れ" : "受験予定日";
    const scheduleMessage = schedule
      ? schedule.status === "ahead"
        ? `${schedule.difference}ポイント先行。次は復習と模試`
        : schedule.status === "behind"
          ? `${Math.abs(schedule.difference)}ポイント遅れ。1日${schedule.questionsPerDay}問が目安`
          : schedule.status === "due"
            ? readiness.total >= 70 ? "受験予定日。新しい範囲より復習を優先" : "受験予定日。未復習問題と重要用語を優先"
            : `現在の進み方を維持。1日${schedule.questionsPerDay}問が目安`
      : "";
    return (
      <>
        <section className="hero panel">
          <div>
            <span className="eyebrow">ENGLISH EXAM PREP · SYLLABUS 3.3.0</span>
            <h1>Build precise RE judgment,<br />one objective at a time.</h1>
            <p>45 original questions grounded in the official English syllabus. Explanations appear only after you answer.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => beginPractice("all")}>Continue practice</button>
              <button className="button secondary" onClick={startExam}>Start 75-min exam</button>
              <button className="button secondary" lang="ja" onClick={() => setShowIntro(true)}>コース概要を見る</button>
            </div>
          </div>
          <div className="score-orbit" aria-label={`Knowledge estimate ${readiness.total}%`}>
            <div className="score-ring" style={{ "--score": `${readiness.total * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{readiness.total}%</strong><span>定着度</span></div>
            </div>
            <p lang="ja">{readinessLabel}</p>
          </div>
        </section>

        <section className="mode-grid" lang="ja" aria-label="学習方法を選ぶ">
          <article className="mode-card study-mode panel"><span>01 · STUDY</span><h2>勉強する</h2><p>7単元の日本語ドキュメント、図解、英語キーワード</p><button className="button primary" onClick={() => { setSelectedStudyUnit(null); setView("learn"); }}>学習ドキュメントを開く →</button></article>
          <article className="mode-card test-mode panel"><span>02 · TEST</span><h2>テストする</h2><p>1問ずつの練習と、45問・75分の模擬試験</p><div><button className="button primary" onClick={() => beginPractice("all")}>1問ずつ練習</button><button className="button secondary" onClick={() => setView("exam")}>45問の模擬試験</button></div></article>
        </section>

        <section className="progress-board panel" lang="ja" aria-labelledby="progress-title">
          <header className="progress-board-head">
            <div><span className="eyebrow">LEARNING PROGRESS</span><h2 id="progress-title">いまの定着度と受験日までの進み具合</h2></div>
            <label className="exam-date-field">受験予定日<input type="date" min={localDateInput()} value={progress.targetExamDate || ""} onChange={(event) => setTargetExamDate(event.target.value)} /></label>
          </header>
          <div className="progress-summary">
            <div className="readiness-total"><div className="readiness-number"><strong>{readiness.total}</strong><span>/ 100</span></div><div><b>{readinessLabel}</b><p>「どのくらい頭に入っていそうか」の推定値。合格を保証する数値ではない</p></div></div>
            {schedule && progress.targetExamDate ? <div className={`schedule-summary ${schedule.status}`}><span>{scheduleLabel}</span><strong>あと {schedule.daysLeft} 日</strong><p>{new Intl.DateTimeFormat("ja-JP", { dateStyle: "long" }).format(new Date(`${progress.targetExamDate}T00:00:00`))}</p><small>{scheduleMessage}</small></div> : <div className="schedule-summary unset"><span>STUDY PLAN</span><strong>受験日を設定</strong><p>予定日から、今日必要な進捗と1日あたりの問題数を計算</p></div>}
          </div>
          <div className="readiness-breakdown">
            {[
              ["問題の網羅", readiness.coverage, "25%"],
              ["正答率", readiness.accuracy, "30%"],
              ["教材の読了", readiness.study, "15%"],
              ["復習の消化", readiness.review, "10%"],
              ["最新模試", readiness.mock, "20%"],
            ].map(([label, value, weight]) => <div className="readiness-factor" key={String(label)}><div><span>{label}</span><small>比重 {weight}</small><strong>{value}%</strong></div><div className="factor-bar"><i style={{ width: `${value}%` }} /></div></div>)}
          </div>
          {schedule && <div className="schedule-track"><div><span>今日までに必要な進捗</span><strong>{schedule.expectedByToday}%</strong></div><div className="schedule-rail"><i style={{ width: `${schedule.expectedByToday}%` }} /><b style={{ left: `${readiness.total}%` }} aria-label={`現在の定着度 ${readiness.total}%`} /></div><div className="schedule-legend"><span>計画</span><span>現在 {readiness.total}%</span></div></div>}
          <details className="readiness-definition"><summary>定着度の計算方法</summary><p>問題の網羅率25%、正答率30%、学習ドキュメントの読了率15%、復習キューの消化率10%、最新模試スコア20%の合算。少数の問題だけで高くなりすぎず、学習・練習・復習・模試を進めるほど上がる設計</p></details>
        </section>

        <section className="metric-grid" aria-label="Study metrics">
          <article className="metric panel"><span>Units complete</span><strong>{progress.completedUnits.length}<small>/ 7</small></strong><div className="mini-bar"><i style={{ width: `${progress.completedUnits.length / 7 * 100}%` }} /></div></article>
          <article className="metric panel"><span>Review queue</span><strong>{progress.review.length}<small> items</small></strong><button className="text-button" onClick={() => setView("review")}>Review now →</button></article>
          <article className="metric panel"><span>Latest mock</span><strong>{latest ? `${latest.percent}%` : "—"}</strong><small>{latest ? `${latest.correct}/45 exact answers` : "No attempts yet"}</small></article>
          <article className="metric panel"><span>Knowledge estimate</span><strong>{readiness.total}%</strong><small>{readinessLabel}</small></article>
        </section>

        <section className="section-head"><div><span className="eyebrow">SYLLABUS MAP</span><h2>Seven educational units</h2></div><button className="text-button" onClick={() => setView("learn")}>View all units →</button></section>
        <div className="unit-strip">
          {units.map((unit) => (
            <button key={unit.id} className="unit-mini panel" onClick={() => openStudy(unit.id)}>
              <span>EU {unit.id}</span><strong>{unit.title}</strong><em>{unit.level} · {unit.duration}</em>
            </button>
          ))}
        </div>

        <section className="focus panel">
          <div><span className="eyebrow">TODAY&apos;S FOCUS</span><h2>Differentiate requirement types</h2><p>Functional requirement, quality requirement, or constraint? Train the distinction in English.</p></div>
          <button className="button primary" onClick={() => beginPractice(1)}>Practice EU 1</button>
        </section>
      </>
    );
  }

  function renderLearn() {
    const guide = selectedStudyUnit ? studyGuides.find((item) => item.unit === selectedStudyUnit) : null;
    if (guide) {
      const unit = units.find((item) => item.id === guide.unit)!;
      const complete = progress.completedUnits.includes(guide.unit);
      return (
        <article className="study-document" lang="ja">
          <button className="study-back" onClick={() => setSelectedStudyUnit(null)}>← 7単元の一覧へ</button>
          <header className="study-doc-head"><div><span className="eyebrow">STUDY DOCUMENT · EU {guide.unit}</span><h1>{guide.titleJa}</h1><p className="study-en-title" lang="en">{unit.title}</p><p>{guide.lead}</p></div><div className="study-time"><strong>{unit.duration}</strong><span>公式シラバスの学習時間</span></div></header>

          <section className="study-section"><div className="study-section-title"><span>01</span><div><small>VISUAL MAP</small><h2>{guide.diagramTitle}</h2></div></div><div className={`concept-flow count-${guide.diagram.length}`}>{guide.diagram.map((node, index) => <div className="concept-step" key={node.title}><div className="concept-index">{index + 1}</div><small>{node.label}</small><strong>{node.title}</strong><p>{node.note}</p>{index < guide.diagram.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div></section>

          <section className="study-section"><div className="study-section-title"><span>02</span><div><small>EXAM FOCUS</small><h2>試験で押さえるポイント</h2></div></div><div className="study-points">{guide.points.map((point, index) => <div key={point}><b>{String(index + 1).padStart(2, "0")}</b><p>{point}</p></div>)}</div></section>

          <section className="study-section"><div className="study-section-title"><span>03</span><div><small>ENGLISH KEYWORDS</small><h2>英語で覚える重要用語</h2></div></div><div className="term-table">{guide.terms.map((term) => <div className="term-row" key={term.en}><strong lang="en">{term.en}</strong><span>{term.ja}</span><p>{term.note}</p></div>)}</div></section>

          <footer className="study-doc-actions"><div><small>SOURCE</small><p>{guide.source}</p><p>公式文の転載ではなく、学習目標に基づく独自要約</p></div><div><button className={`button ${complete ? "complete" : "secondary"}`} onClick={() => setProgress((current) => ({ ...current, completedUnits: complete ? current.completedUnits.filter((id) => id !== guide.unit) : [...current.completedUnits, guide.unit] }))}>{complete ? "読了済み ✓" : "この単元を読了にする"}</button><button className="button primary" onClick={() => startUnitPractice(guide.unit)}>この単元の問題を解く →</button></div></footer>
        </article>
      );
    }
    return (
      <>
        <header className="page-head study-index-head" lang="ja"><span className="eyebrow">STUDY DOCUMENTS</span><h1>まず読んで理解する</h1><p>各単元に、日本語の要点、関係が分かる図解、英語の試験用語を収録。理解後は単元別の小テストへ</p></header>
        <section className="study-how" lang="ja"><strong>使い方</strong><span>単元を開く</span><i>→</i><span>図解と要点を読む</span><i>→</i><span>その単元の問題を解く</span></section>
        <div className="learning-grid">
          {units.map((unit) => {
            const complete = progress.completedUnits.includes(unit.id);
            const unitQuestions = questions.filter((question) => question.unit === unit.id);
            const attempted = unitQuestions.filter((question) => progress.answered[question.id]).length;
            return (
              <article className="unit-card panel" key={unit.id}>
                <div className="unit-number">{String(unit.id).padStart(2, "0")}</div>
                <div className="unit-content">
                  <div className="unit-meta"><span>EU {unit.id}</span><span>{unit.level}</span><span>{unit.duration}</span></div>
                  <h2>{unit.title}</h2>
                  <p className="jp-note" lang="ja">{unit.summaryJa}</p>
                  <div className="chips">{unit.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                  <div className="unit-footer"><small>{unit.source} · {attempted}/{unitQuestions.length} questions attempted {complete ? "· 読了済み" : ""}</small><button className="button compact primary" onClick={() => openStudy(unit.id)}>学習ドキュメントを開く →</button></div>
                </div>
              </article>
            );
          })}
        </div>
      </>
    );
  }

  function renderPractice() {
    const changePracticeUnit = (unit: number | "all") => {
      const pool = unit === "all" ? questions : questions.filter((question) => question.unit === unit);
      setPracticeUnit(unit);
      setPracticeQuestionId(selectNextQuestionId(pool.map((question) => question.id), null, progress) ?? "");
      setPracticeSelected([]);
      setPracticeChecked(false);
      setPracticeConfidence(null);
      setPracticeAttemptAt(null);
    };
    if (!practiceQuestion) {
      const nextDates = practicePool
        .map((question) => getAnswerStats(progress.answered[question.id]).nextReviewAt)
        .filter((value): value is string => Boolean(value))
        .sort();
      return (
        <>
          <header className="page-head practice-head"><div><span className="eyebrow">PRACTICE</span><h1>Decide in English.</h1></div><label className="filter">Unit<select value={practiceUnit} onChange={(event) => changePracticeUnit(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">All units</option>{units.map((unit) => <option key={unit.id} value={unit.id}>EU {unit.id}</option>)}</select></label></header>
          <section className="empty panel" lang="ja"><span>✓</span><h2>今すぐ復習する問題なし</h2><p>正解した問題は復習間隔を確保。{nextDates[0] ? `次回は ${formatAttemptDate(nextDates[0])}` : "まず学習ドキュメントから"}</p><button className="button primary" onClick={() => setView("home")}>学習状況へ戻る</button></section>
        </>
      );
    }
    const prior = progress.answered[practiceQuestion.id];
    const stats = getAnswerStats(prior);
    const history = prior?.attempts?.slice(-10).reverse() ?? [];
    const answerCorrect = sameAnswer(practiceSelected, practiceQuestion.correct);
    const scheduleRecord = prior && practiceAttemptAt
      ? { ...prior, attempts: prior.attempts.filter((attempt) => attempt.at !== practiceAttemptAt) }
      : prior;
    const confidenceOptions: { value: Confidence; label: string; note: string }[] = [
      { value: "low", label: "自信なし", note: "かなり迷った" },
      { value: "medium", label: "少し迷った", note: "考えて答えた" },
      { value: "high", label: "自信あり", note: "すぐ判断できた" },
    ];
    return (
      <>
        <header className="page-head practice-head"><div><span className="eyebrow">PRACTICE</span><h1>Decide in English.</h1></div><label className="filter">Unit<select value={practiceUnit} onChange={(event) => changePracticeUnit(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">All units</option>{units.map((unit) => <option key={unit.id} value={unit.id}>EU {unit.id}</option>)}</select></label></header>
        <section className="question-card panel">
          <div className="question-top"><div><span className={`kind ${practiceQuestion.kind}`}>{practiceQuestion.kind === "boolean" ? "TRUE / FALSE" : practiceQuestion.kind.toUpperCase()}</span><span>{practiceQuestion.id} · {practiceQuestion.eo}</span></div><button className={`bookmark ${progress.bookmarks.includes(practiceQuestion.id) ? "active" : ""}`} aria-label="Bookmark question" onClick={() => setProgress((current) => ({ ...current, bookmarks: current.bookmarks.includes(practiceQuestion.id) ? current.bookmarks.filter((id) => id !== practiceQuestion.id) : [...current.bookmarks, practiceQuestion.id] }))}>☆</button></div>
          <h2>{practiceQuestion.prompt}</h2>
          {practiceQuestion.kind === "multiple" && <p className="instruction">Select {practiceQuestion.correct.length} answers.</p>}
          <ChoiceList question={practiceQuestion} selected={practiceSelected} onChange={setPracticeSelected} disabled={practiceChecked} />
          {!practiceChecked ? <button className="button primary full" disabled={!practiceSelected.length} onClick={() => setPracticeChecked(true)}>Check answer</button> : (
            <div className={`feedback ${answerCorrect ? "correct" : "incorrect"}`}>
              <strong>{answerCorrect ? "Correct" : "Not quite"}</strong>
              <p lang="ja">{practiceQuestion.explanationJa}</p>
              <div className="feedback-meta"><span>Keyword: {practiceQuestion.keyword}</span><span>{practiceQuestion.source}</span></div>
              <div className="confidence-prompt" lang="ja">
                <strong>答えるときの自信は？</strong>
                <p>正誤と自信から次回日を計算</p>
                <div className="confidence-options">{confidenceOptions.map((option) => {
                  const schedule = calculateNextReview(scheduleRecord, answerCorrect, option.value);
                  return <button key={option.value} className={practiceConfidence === option.value ? "selected" : ""} aria-pressed={practiceConfidence === option.value} onClick={() => { const attemptAt = recordAnswer(practiceQuestion, practiceSelected, option.value, practiceAttemptAt); setPracticeAttemptAt(attemptAt); setPracticeConfidence(option.value); }}><span>{option.label}</span><small>{option.note}</small><strong>{schedule.intervalDays}日後</strong></button>;
                })}</div>
              </div>
              <details className="schedule-formula" lang="ja">
                <summary>次回日の計算式</summary>
                <p><b>初回正解</b>：自信なし 1日／少し迷った 2日／自信あり 5日</p>
                <p><b>2回目以降の正解</b>：max（前回間隔＋1日, 四捨五入［前回間隔 × 自信係数］）</p>
                <p>自信係数：自信なし ×1.2／少し迷った ×2.5／自信あり ×3.25</p>
                <p><b>不正解</b>：max（1日, 四捨五入［前回間隔 × 戻し係数］）</p>
                <p>戻し係数：自信なし ×0.25／少し迷った ×0.15／自信あり ×0.05。自信を持った不正解は、誤った確信として強く間隔を短縮</p>
                <p className="formula-example">例：少し迷って正解を続けた場合 2日 → 5日 → 13日 → 33日</p>
              </details>
              {practiceConfidence && <button className="button primary" onClick={nextPractice}>Next question →</button>}
            </div>
          )}
          <div className="attempt-summary" lang="ja">
            {prior ? <><div className="attempt-stats"><span><small>解答</small><strong>{stats.attempts}回</strong></span><span><small>正解</small><strong>{stats.correctCount}回</strong></span><span><small>連続</small><strong>{stats.consecutiveCorrect}回</strong></span><span><small>次回</small><strong>{stats.due ? "今日" : stats.nextReviewAt ? formatAttemptDate(stats.nextReviewAt) : "未設定"}</strong></span></div>{history.length > 0 && <details><summary>解答履歴</summary><ol>{history.map((attempt, index) => <li key={`${attempt.at}-${index}`}><strong className={attempt.correct ? "history-correct" : "history-wrong"}>{attempt.correct ? "正解" : "不正解"}</strong><span>{attempt.confidence === "high" ? "自信あり" : attempt.confidence === "medium" ? "少し迷った" : attempt.confidence === "low" ? "自信なし" : "旧データ"}</span><time>{formatAttemptDate(attempt.at)}</time>{attempt.intervalDays && <em>→ {attempt.intervalDays}日後</em>}</li>)}</ol>{stats.attempts > history.length && <small>直近{history.length}件</small>}</details>}</> : <p>解答履歴なし</p>}
          </div>
        </section>
      </>
    );
  }

  function renderExam() {
    if (examResult) return (
      <section className="result-card panel">
        <span className="eyebrow">MOCK EXAM COMPLETE</span><div className={`result-score ${examResult.percent >= 70 ? "pass" : "retry"}`}>{examResult.percent}%</div><h1>{examResult.percent >= 70 ? "Reference target reached." : "Keep building precision."}</h1><p>{examResult.points} / {examResult.total} points · {examResult.correct} / 45 exact answers</p><div className="result-actions"><button className="button primary" onClick={() => { setExamResult(null); setView("review"); }}>Review mistakes</button><button className="button secondary" onClick={startExam}>Try another order</button></div><small>Unofficial simulation. This result does not predict or certify an official exam result.</small>
      </section>
    );
    if (!exam || !currentExamQuestion) return (
      <section className="exam-intro panel"><span className="eyebrow">FULL MOCK EXAM</span><h1>45 questions.<br />75 minutes.</h1><p>All prompts, choices, and instructions stay in English. Explanations and answer feedback remain hidden until submission.</p><div className="exam-facts"><div><strong>45</strong><span>questions</span></div><div><strong>75</strong><span>minutes</span></div><div><strong>70%</strong><span>reference target</span></div></div><button className="button primary" onClick={startExam}>Begin exam</button><small>Based on Examination Regulations 5.6.2. Unofficial questions and blueprint.</small></section>
    );
    const selected = exam.answers[currentExamQuestion.id] ?? [];
    return (
      <>
        <header className="exam-bar"><div><span>MOCK EXAM</span><strong>Question {exam.index + 1} / 45</strong></div><div className={secondsLeft < 300 ? "timer urgent" : "timer"}><span>Time remaining</span><strong>{formatTimer(secondsLeft)}</strong></div></header>
        <div className="exam-layout">
          <section className="question-card panel exam-question"><div className="question-top"><div><span className={`kind ${currentExamQuestion.kind}`}>{currentExamQuestion.kind === "boolean" ? "TRUE / FALSE" : currentExamQuestion.kind.toUpperCase()}</span><span>{currentExamQuestion.points} {currentExamQuestion.points === 1 ? "point" : "points"}</span></div><button className="bookmark" aria-label="Flag question">☆</button></div><h2>{currentExamQuestion.prompt}</h2>{currentExamQuestion.kind === "multiple" && <p className="instruction">Select {currentExamQuestion.correct.length} answers.</p>}<ChoiceList question={currentExamQuestion} selected={selected} onChange={(value) => setExam((current) => current ? { ...current, answers: { ...current.answers, [currentExamQuestion.id]: value } } : current)} /><div className="exam-actions"><button className="button secondary" disabled={exam.index === 0} onClick={() => setExam((current) => current ? { ...current, index: current.index - 1 } : current)}>← Previous</button>{exam.index < 44 ? <button className="button primary" onClick={() => setExam((current) => current ? { ...current, index: current.index + 1 } : current)}>Next →</button> : <button className="button danger" onClick={() => submitExam(exam)}>Submit exam</button>}</div></section>
          <aside className="exam-map panel"><div><strong>Question map</strong><span>{Object.keys(exam.answers).filter((id) => exam.answers[id]?.length).length} answered</span></div><div className="number-grid">{examQuestions.map((question, index) => <button key={question.id} className={`${index === exam.index ? "current" : ""} ${exam.answers[question.id]?.length ? "answered" : ""}`} onClick={() => setExam((current) => current ? { ...current, index } : current)}>{index + 1}</button>)}</div><button className="button danger full" onClick={() => submitExam(exam)}>Submit exam</button></aside>
        </div>
      </>
    );
  }

  function renderReview() {
    const reviewQuestions = progress.review.map((id) => questions.find((question) => question.id === id)).filter(Boolean) as Question[];
    return (
      <>
        <header className="page-head"><span className="eyebrow">REVIEW</span><h1>Turn misses into signals.</h1><p>Your queue is saved to private Git history and cached locally for offline use.</p></header>
        {!reviewQuestions.length ? <section className="empty panel"><span>✓</span><h2>Your review queue is clear.</h2><p>Missed practice and mock-exam questions will appear here.</p><button className="button primary" onClick={() => beginPractice("all")}>Practice now</button></section> : <div className="review-list">{reviewQuestions.map((question) => { const record = progress.answered[question.id]; return <article className="review-card panel" key={question.id}><div className="review-label"><span>EU {question.unit}</span><span>{question.eo}</span><span>{question.id}</span></div><h2>{question.prompt}</h2><p className="answer-line">Correct: {question.correct.map((index) => question.options[index]).join(" · ")}</p><p className="jp-note" lang="ja">{question.explanationJa}</p><div className="feedback-meta"><span>Keyword: {question.keyword}</span><span>{question.source}</span></div><div className="review-actions"><small>{record ? `Last attempt: ${record.correct ? "correct" : "incorrect"}` : "From mock exam"}</small><button className="button compact secondary" onClick={() => setProgress((current) => ({ ...current, review: current.review.filter((id) => id !== question.id) }))}>Mark mastered</button></div></article>; })}</div>}
      </>
    );
  }

  function renderSources() {
    return (
      <>
        <header className="page-head source-head"><div><span className="eyebrow">ABOUT & SOURCES</span><h1>Grounded, traceable, unofficial.</h1><p>Only the listed English IREB materials are used. Official long-form text and official practice questions are not republished.</p></div><button className="button secondary" onClick={() => void refreshSources()} disabled={sourceStatus === "checking"}>{sourceStatus === "checking" ? "Checking…" : "Refresh source status"}</button></header>
        <div className={`status-line ${sourceStatus === "cached" ? "warning" : ""}`}><i />{sourceStatus === "cached" ? `Offline — showing cached metadata. ${formatChecked(progress.lastSourceCheck)}` : `${sourceStatus === "online" ? "Official download center reached. " : ""}${formatChecked(progress.lastSourceCheck)}`}</div>
        <div className="source-list">{sources.map((source) => <a className="source-card panel" href={source.url} target="_blank" rel="noreferrer" key={source.id}><div><span>{source.id}</span><h2>{source.title}</h2><p>Version {source.version} · {source.chapter}</p></div><strong>↗</strong></a>)}</div>
        <section className="policy-grid"><article className="panel"><span className="eyebrow">CONTENT POLICY</span><h2>Original questions only</h2><p>Question scenarios, prompts, options, and explanations are independently written from syllabus objectives. They are not official exam questions.</p></article><article className="panel sync-panel"><span className="eyebrow">YOUR DATA</span><h2>Private GitHub sync</h2><p>Progress and active exams are committed to the private CPRE-data repository. Browser storage is only an offline cache.</p><div className={`sync-state ${syncStatus}`}><i />{syncLabel}</div>{syncStatus === "setup" && <><label>Fine-grained GitHub token<input type="password" value={githubToken} autoComplete="off" onChange={(event) => setGithubToken(event.target.value)} placeholder="github_pat_…" /></label><p className="sync-help">Create it for <strong>CPRE-data</strong> only, with <strong>Contents: Read and write</strong>. It stays in this browser tab session and is never committed.</p><a className="text-button" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Create token on GitHub ↗</a></>}<div className="sync-actions"><button className="button compact secondary" onClick={() => void connectSync()} disabled={syncStatus === "setup" && !githubToken}>{syncStatus === "setup" ? "Connect" : "Sync now"}</button><button className="text-button" onClick={() => void shareProgress()}>Copy backup snapshot</button></div></article></section>
      </>
    );
  }

  if (!hydrated) return <main className="loading"><span>CPRE</span><div /></main>;
  if (showIntro) return renderIntro();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("home")}><span>CR</span><div><strong>CPRE</strong><small>English Study</small></div></button>
        <nav aria-label="Primary navigation">{navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => item.id === "practice" ? beginPractice("all") : setView(item.id)}><i>{item.id === "home" ? "⌂" : item.id === "learn" ? "≡" : item.id === "practice" ? "◇" : item.id === "exam" ? "◷" : "↺"}</i><span>{item.label}</span>{item.id === "review" && progress.review.length > 0 && <em>{progress.review.length}</em>}</button>)}</nav>
        <div className="sidebar-foot"><button lang="ja" onClick={() => setShowIntro(true)}>コース概要を見る</button><button onClick={() => setView("sources")}>About & sources</button><button onClick={() => void connectSync()}>{syncLabel}</button><small>v{APP_VERSION} · GitHub + offline cache</small></div>
      </aside>
      <main className="main-content">{view === "home" && renderHome()}{view === "learn" && renderLearn()}{view === "practice" && renderPractice()}{view === "exam" && renderExam()}{view === "review" && renderReview()}{view === "sources" && renderSources()}<footer><span>Unofficial CPRE Foundation Level study tool.</span><button onClick={() => setView("sources")}>Sources & copyright</button></footer></main>
      <nav className="bottom-nav" aria-label="Mobile navigation">{navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => item.id === "practice" ? beginPractice("all") : setView(item.id)}><i>{item.id === "home" ? "⌂" : item.id === "learn" ? "≡" : item.id === "practice" ? "◇" : item.id === "exam" ? "◷" : "↺"}</i><span>{item.short}</span></button>)}</nav>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
