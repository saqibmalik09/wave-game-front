"use client";
import { ReduxProvider } from "@/lib/redux/provider";
import { SocketProvider } from "@/providers/SocketProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthInitializer>
        <SocketProvider>{children}</SocketProvider>
      </AuthInitializer>
    </ReduxProvider>
  );
}
