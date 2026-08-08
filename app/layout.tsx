import type { Metadata } from "next";
import { headers } from "next/headers";
import { APP_VERSION } from "./app-config";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = new URL("/og.png", origin).toString();
  const description = "Unofficial English-exam study app for IREB CPRE Foundation Level.";
  return {
    metadataBase: new URL(origin),
    title: "CPRE English Study",
    description,
    applicationName: "CPRE English Study",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "CPRE English Study", description, type: "website", images: [{ url: imageUrl, width: 1536, height: 1024, alt: "CPRE English Study — 185-question bank and 75-minute mock exam" }] },
    twitter: { card: "summary_large_image", title: "CPRE English Study", description, images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <div
          aria-label={`Application version ${APP_VERSION}`}
          style={{
            position: "fixed",
            top: 10,
            right: 12,
            zIndex: 1000,
            padding: "4px 8px",
            borderRadius: 999,
            background: "rgba(12, 18, 28, 0.82)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.72)",
            fontSize: 11,
            lineHeight: 1.2,
            letterSpacing: "0.04em",
            pointerEvents: "none",
            backdropFilter: "blur(8px)",
          }}
        >
          v{APP_VERSION}
        </div>
      </body>
    </html>
  );
}
