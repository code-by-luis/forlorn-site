// app/layout.tsx
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
} as const;

export const metadata = {
  title: "FORLORN",
  description: "Deerisle PVP",
  metadataBase: new URL("https://forlorn.uk"),
  icons: {
    icon: [{ url: "/forlorn_logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/forlorn_logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/forlorn_logo.svg" }],
    other: [{ rel: "mask-icon", url: "/forlorn_logo.svg", color: "#d31818" }],
  },
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full overflow-x-clip text-zinc-200 selection:bg-[#d31818]/40">
        {children}
      </body>
    </html>
  );
}
