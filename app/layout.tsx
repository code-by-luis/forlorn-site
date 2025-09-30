// app/layout.tsx
import "./globals.css";


export const metadata = {
  title: "FORLORN",
  description: "Deerisle PVP",
  metadataBase: new URL("https://forlorn.uk"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-zinc-200 selection:bg-fuchsia-500/40">
        {children}
      </body>
    </html>
  );
}
