"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogout = async () => {
    // 1. Tell Supabase to kill the session
    await supabase.auth.signOut();
    
    // 2. Clear local state
    setUser(null);
    
    // 3. Redirect to Login
    router.push("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
    >
      <LogOut size={18} />
      Sign Out
    </button>
  );
}