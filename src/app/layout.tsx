import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import ClientProviders from "./components/ClientProviders";
import '@/../public/teenpattigamecss.css';

export const metadata: Metadata = {
  title: "Wave Games",
  description: "Game platform using Next.js + Redux + shadcn + Bootstrap",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
