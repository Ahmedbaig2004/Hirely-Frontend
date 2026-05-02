"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/useAuthStore";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { useRouter, usePathname } from "next/navigation";
import { LoaderFour } from "@/components/ui/loader";


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  
  // 1. Start in a "Loading" state
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Handle redirect logic immediately
      if (!session && pathname.startsWith('/dashboard')) {
        router.push('/auth');
      }

      // 2. We are done checking, now we can show the app
      setIsMounting(false);
    };

    initAuth();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        useInterviewStore.getState().resetSession();
        if (pathname.startsWith('/dashboard')) {
          router.push('/auth');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, setUser]);

  // 3. THE SHIELD: If we are still checking, show spinner, NOT the dashboard
  if (isMounting) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-[var(--lp-background)] text-[var(--lp-foreground)]">
        <LoaderFour />
      </div>
    );
  }

  return <>{children}</>;
}