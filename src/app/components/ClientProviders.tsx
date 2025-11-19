"use client";
import { ReduxProvider } from "@/lib/redux/provider";
import { SocketProvider } from "@/providers/SocketProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SocketProvider>{children}</SocketProvider>
    </ReduxProvider>
  );
}
