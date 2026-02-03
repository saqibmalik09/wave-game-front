import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import ClientProviders from "./components/ClientProviders";
import '@/../public/teenpattigamecss.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Wave Games",
  description: "Game platform using Next.js + Redux + shadcn + Bootstrap",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>{children}</ClientProviders>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
