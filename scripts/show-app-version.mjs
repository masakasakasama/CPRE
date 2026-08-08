import { readFileSync, writeFileSync } from "node:fs";

const appPath = "app/page.tsx";
let app = readFileSync(appPath, "utf8");

const introNeedle = '<div className="intro-top"><span className="intro-brand">CPRE <b>English Study</b></span><button onClick={() => finishIntro("home")}>案内をスキップ</button></div>';
const introReplacement = '<div className="intro-top"><span className="intro-brand">CPRE <b>English Study</b> <small>v{APP_VERSION}</small></span><button onClick={() => finishIntro("home")}>案内をスキップ</button></div>';
if (app.includes(introNeedle)) app = app.replace(introNeedle, introReplacement);

const footerNeedle = '<footer><span>Unofficial CPRE Foundation Level study tool.</span><button onClick={() => setView("sources")}>Sources & copyright</button></footer>';
const footerReplacement = '<footer><span>Unofficial CPRE Foundation Level study tool. · v{APP_VERSION}</span><button onClick={() => setView("sources")}>Sources & copyright</button></footer>';
if (app.includes(footerNeedle)) app = app.replace(footerNeedle, footerReplacement);

if (!app.includes('v{APP_VERSION}')) {
  throw new Error("Version display was not added");
}
writeFileSync(appPath, app);

for (const path of ["package.json", "package-lock.json"]) {
  let source = readFileSync(path, "utf8");
  source = source.replaceAll('"version": "0.1.0"', '"version": "0.12.0"');
  writeFileSync(path, source);
}

console.log("Displayed v0.12.0 in the web UI and aligned package metadata");
