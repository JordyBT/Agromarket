"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Sprout } from "lucide-react";

import { getSession } from "@/services/sessionService";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    setCheckingSession(false);
  }, [router]);

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] text-[#172019]">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173c29] text-white">
            <Sprout size={25} />
          </div>

          <LoaderCircle
            size={22}
            className="mt-6 animate-spin text-[#4f7759]"
          />

          <p className="mt-4 text-sm font-semibold">
            Verificando sesión...
          </p>

          <p className="mt-1 text-xs text-[#747c75]">
            Estamos preparando tu espacio de trabajo.
          </p>
        </div>
      </main>
    );
  }

  return children;
}