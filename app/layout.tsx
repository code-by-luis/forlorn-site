// app/layout.tsx
import "./globals.css";


export const metadata = {
  title: "Your DayZ Server",
  description: "Dayz server.",
  metadataBase: new URL("https://dayz.derwydd.net"),
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
