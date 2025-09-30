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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full overflow-x-clip text-zinc-200 selection:bg-fuchsia-500/40">
        {children}
      </body>
    </html>
  );
}
