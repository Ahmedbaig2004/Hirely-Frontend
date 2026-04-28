"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Monitor,
  Moon,
  Palette,
  Shield,
  LogOut,
  Sun,
  User,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import {
  uploadProfileAvatar,
  removeProfileAvatarFromStorage,
} from "@/lib/profileAvatar";
import { pageStagger, fadeInUp } from "@/lib/motion";
import { cn } from "@/components/lib/utils";

const STORAGE_KEY = "hirely-settings-v1";

type Prefs = {
  firstDayOfWeek: "sunday" | "monday";
  weekendDays: number[];
  dateFormat: string;
  timeFormat: "12" | "24";
  accent: string;
  emailDigest: boolean;
  sessionReminders: boolean;
  marketingEmails: boolean;
};

const defaultPrefs: Prefs = {
  firstDayOfWeek: "sunday",
  weekendDays: [0, 6],
  dateFormat: "MMM d, yyyy",
  timeFormat: "12",
  accent: "#3b82f6",
  emailDigest: true,
  sessionReminders: true,
  marketingEmails: false,
};

/** Sun=0 … Sat=6. Unique labels (avoids S/M/T duplicates in the row). */
const WEEKDAYS = [
  { value: 0, abbr: "Sun", long: "Sunday" },
  { value: 1, abbr: "Mon", long: "Monday" },
  { value: 2, abbr: "Tue", long: "Tuesday" },
  { value: 3, abbr: "Wed", long: "Wednesday" },
  { value: 4, abbr: "Thu", long: "Thursday" },
  { value: 5, abbr: "Fri", long: "Friday" },
  { value: 6, abbr: "Sat", long: "Saturday" },
] as const;

const WEEKEND_PRESETS: { label: string; hint: string; days: readonly [number, ...number[]] }[] = [
  { label: "Sat & Sun", hint: "Typical in US / UK / many regions", days: [6, 0] },
  { label: "Fri & Sat", hint: "Gulf and others", days: [5, 6] },
  { label: "Fri–Sun", hint: "Long weekend (Fri+Sat+Sun)", days: [5, 6, 0] },
  { label: "Sun only", hint: "Single rest day", days: [0] },
];

function normalizeWeekendDays(input: unknown): number[] {
  if (!Array.isArray(input)) return [...defaultPrefs.weekendDays];
  const nums = input.filter(
    (x): x is number => typeof x === "number" && x >= 0 && x <= 6 && x === Math.floor(x)
  );
  const uniq = [...new Set(nums)].sort((a, b) => a - b);
  if (uniq.length === 0) return [...defaultPrefs.weekendDays];
  return uniq;
}

const NAV = [
  { id: "account" as const, label: "Account", icon: User, desc: "Profile & sign-in" },
  { id: "preferences" as const, label: "Preferences", icon: Palette, desc: "Appearance & region" },
  { id: "notifications" as const, label: "Notifications", icon: Bell, desc: "Email & alerts" },
  { id: "security" as const, label: "Security", icon: Shield, desc: "Password & sessions" },
];

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      ...defaultPrefs,
      ...parsed,
      weekendDays: normalizeWeekendDays(parsed.weekendDays),
    };
  } catch {
    return defaultPrefs;
  }
}

function savePrefs(p: Partial<Prefs>) {
  const cur = loadPrefs();
  const next = { ...cur, ...p };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function SettingsPageContent() {
  const reduceMotion = useReducedMotion();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [active, setActive] = useState<(typeof NAV)[number]["id"]>("account");
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [accountBusy, setAccountBusy] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarInputId = useId();

  useEffect(() => setPrefs(loadPrefs()), []);

  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata as { full_name?: string } | undefined;
    const full = meta?.full_name ?? "";
    const parts = full.trim().split(/\s+/);
    if (parts.length > 1) {
      setLastName(parts.pop() ?? "");
      setFirstName(parts.join(" "));
    } else {
      setFirstName(full);
    }
    setEmail(user.email ?? "");
  }, [user]);

  const persistPrefs = useCallback((patch: Partial<Prefs>) => {
    const next = savePrefs(patch);
    setPrefs(next);
  }, []);

  const saveAccount = async () => {
    if (!user) return;
    setAccountMsg(null);
    setAccountBusy(true);
    const full = [firstName, lastName].filter(Boolean).join(" ").trim();
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: full } });
    setAccountBusy(false);
    if (error) {
      setAccountMsg({ type: "err", text: error.message });
      return;
    }
    if (data.user) setUser(data.user);
    setAccountMsg({ type: "ok", text: "Profile name saved to your account." });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  const hasEmailPassword = Boolean(
    user?.identities?.some((i) => i.provider === "email"),
  );

  const saveSecurity = async () => {
    setPwMsg(null);
    if (!user?.email) {
      setPwMsg({ type: "err", text: "Not signed in." });
      return;
    }
    if (!hasEmailPassword) {
      setPwMsg({
        type: "err",
        text: "This account only uses a social sign-in. Use “Forgot password” on the login page with the same email to set a password, or contact support to add one.",
      });
      return;
    }
    if (!newPw.trim()) {
      setPwMsg({ type: "err", text: "Enter a new password." });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: "err", text: "New password must be at least 6 characters." });
      return;
    }
    if (!currentPw) {
      setPwMsg({ type: "err", text: "Enter your current password to confirm it’s you." });
      return;
    }
    setPwBusy(true);
    try {
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPw,
      });
      if (signErr) {
        setPwMsg({ type: "err", text: "Current password is wrong or could not be verified. Try again." });
        return;
      }
      const { data, error: updErr } = await supabase.auth.updateUser({ password: newPw });
      if (updErr) {
        setPwMsg({ type: "err", text: updErr.message });
        return;
      }
      if (data.user) setUser(data.user);
      setCurrentPw("");
      setNewPw("");
      setPwMsg({ type: "ok", text: "Password updated. On your next sign in, use this new password." });
    } finally {
      setPwBusy(false);
    }
  };

  const openAvatarPicker = () => {
    setAvatarMsg(null);
    avatarInputRef.current?.click();
  };

  const onAvatarFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    setAvatarMsg(null);
    setAvatarBusy(true);
    const prevPath = (user.user_metadata as { avatar_path?: string } | undefined)?.avatar_path;
    const result = await uploadProfileAvatar(file, user.id);
    if ("error" in result) {
      setAvatarMsg(result.error);
      setAvatarBusy(false);
      return;
    }
    const existing = (user.user_metadata || {}) as Record<string, unknown>;
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...existing,
        avatar_url: result.publicUrl,
        avatar_path: result.path,
      },
    });
    if (!error && prevPath && prevPath !== result.path) {
      void removeProfileAvatarFromStorage(prevPath);
    }
    setAvatarBusy(false);
    if (error) {
      setAvatarMsg(error.message);
      return;
    }
    if (data.user) setUser(data.user);
  };

  const removeAvatar = async () => {
    if (!user) return;
    setAvatarMsg(null);
    setAvatarBusy(true);
    const meta = user.user_metadata as { avatar_path?: string } | undefined;
    if (meta?.avatar_path) {
      try {
        await removeProfileAvatarFromStorage(meta.avatar_path);
      } catch {
        // continue clearing metadata
      }
    }
    const existing = (user.user_metadata || {}) as Record<string, unknown>;
    const { data, error } = await supabase.auth.updateUser({
      data: { ...existing, avatar_url: null, avatar_path: null },
    });
    setAvatarBusy(false);
    if (error) {
      setAvatarMsg(error.message);
      return;
    }
    if (data.user) setUser(data.user);
  };

  const applyWeekendPreset = useCallback(
    (days: readonly [number, ...number[]]) => {
      const sorted = normalizeWeekendDays([...days]);
      persistPrefs({ weekendDays: sorted });
    },
    [persistPrefs],
  );

  const toggleWeekend = (d: number) => {
    const set = new Set(prefs.weekendDays);
    if (set.has(d)) {
      if (set.size <= 1) {
        return;
      }
      set.delete(d);
    } else {
      set.add(d);
    }
    persistPrefs({ weekendDays: [...set].sort((a, b) => a - b) });
  };

  const weekendSummary = useMemo(() => {
    const s = new Set(prefs.weekendDays);
    return WEEKDAYS.filter((d) => s.has(d.value))
      .map((d) => d.long)
      .join(", ");
  }, [prefs.weekendDays]);

  const themeCards = useMemo(
    () =>
      [
        { id: "system" as const, label: "System", sub: "Match device", icon: Monitor },
        { id: "light" as const, label: "Light", sub: "Bright UI", icon: Sun },
        { id: "dark" as const, label: "Dark", sub: "Easy on eyes", icon: Moon },
      ] as const,
    [],
  );

  const transition = reduceMotion ? { duration: 0.15 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div
      className="lp-page relative min-h-screen overflow-x-hidden pb-24 pt-24 sm:pb-28 sm:pt-28"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -left-20 top-0 h-[420px] w-[420px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.35), transparent 60%)" }}
        />
        <div
          className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full opacity-25 blur-[100px]"
          style={{ background: "radial-gradient(circle at 70% 40%, rgba(124,58,237,0.35), transparent 58%)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-px w-[min(900px,90vw)] -translate-x-1/2 opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)",
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial="hidden" animate="visible" variants={pageStagger} className="mb-10">
          <motion.div variants={fadeInUp} className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                "border-slate-300/90 bg-white/85 text-slate-800 shadow-sm backdrop-blur-md",
                "hover:border-cyan-500/45 hover:bg-white hover:text-slate-950",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-slate-300 dark:shadow-none",
                "dark:hover:border-cyan-400/35 dark:hover:bg-white/[0.1] dark:hover:text-white",
                "dark:focus-visible:ring-offset-slate-950",
              )}
            >
              <ArrowLeft size={14} aria-hidden />
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" aria-hidden />
            <span className="text-slate-700 dark:text-slate-300">Settings</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-400/95">
                Control center
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-slate-50">
                Your{" "}
                <span className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-800 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500">
                  settings
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
                Tune how Hirely looks, notifies you, and keeps your account secure — all in one place.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-10">
          {/* Sidebar */}
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <nav className="flex flex-col gap-1 rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] p-2 shadow-md shadow-slate-400/10 backdrop-blur-xl sm:flex-row sm:overflow-x-auto lg:flex-col dark:border-white/[0.08] dark:bg-slate-950/40 dark:shadow-none">
              {NAV.map((item) => {
                const Icon = item.icon;
                const on = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                      on
                        ? "bg-gradient-to-r from-blue-600/12 to-cyan-600/8 text-slate-900 shadow-[inset_0_0_0_1px_rgba(14,116,144,0.22)] dark:from-blue-600/20 dark:to-cyan-600/10 dark:text-white dark:shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]"
                        : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
                        on
                          ? "border-cyan-600/35 bg-cyan-500/12 text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
                          : "border-slate-300/70 bg-white/70 text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-500",
                      )}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="block truncate text-[11px] text-slate-500 dark:text-slate-500">
                        {item.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>

          {/* Panels */}
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="min-w-0"
          >
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] shadow-[0_24px_80px_-32px_rgba(15,23,42,0.15)] ring-1 ring-cyan-500/15 backdrop-blur-xl dark:border-white/[0.09] dark:bg-slate-950/50 dark:shadow-[0_32px_80px_-32px_rgba(0,0,0,0.75)] dark:ring-cyan-500/10">
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-cyan-400" aria-hidden />
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {active === "account" && (
                    <motion.section
                      key="account"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <header>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                          Account
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                          Profile details tied to your Hirely identity.
                        </p>
                      </header>

                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
                          <div
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-200/90 ring-2 ring-cyan-500/20 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 dark:ring-white/10"
                            aria-hidden
                          />
                          {user && (user.user_metadata as { avatar_url?: string } | undefined)?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={(user.user_metadata as { avatar_url: string }).avatar_url}
                              alt=""
                              className="relative z-[1] h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 z-[1] flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-400">
                              {(firstName || email || "?").slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            <input
                              ref={avatarInputRef}
                              id={avatarInputId}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className="sr-only"
                              onChange={onAvatarFile}
                            />
                            <button
                              type="button"
                              disabled={!user || avatarBusy}
                              className="rounded-xl border border-slate-300/90 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-cyan-600/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-cyan-500/30"
                              onClick={openAvatarPicker}
                            >
                              {avatarBusy ? "Uploading…" : "Upload photo"}
                            </button>
                            <button
                              type="button"
                              disabled={!user || avatarBusy || !(user?.user_metadata as { avatar_url?: string })?.avatar_url}
                              className="rounded-xl border border-slate-300/70 px-4 py-2 text-sm text-slate-600 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:text-slate-500 dark:hover:text-rose-400"
                              onClick={removeAvatar}
                            >
                              Remove
                            </button>
                          </div>
                          {avatarMsg && (
                            <p className="text-xs leading-snug text-rose-600 dark:text-rose-400">{avatarMsg}</p>
                          )}
                          <p className="text-xs text-slate-600 dark:text-slate-500">
                            PNG, JPEG, or WebP · max 15MB. Requires a public Storage bucket <code className="rounded bg-slate-200/80 px-1 dark:bg-white/10">avatars</code> — see <code className="rounded bg-slate-200/80 px-1 dark:bg-white/10">supabase/avatars-storage.sql</code>.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                            First name
                          </span>
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600/45 focus:ring-2 focus:ring-cyan-500/25 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-100 dark:focus:border-cyan-400/35 dark:focus:ring-cyan-500/15"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                            Last name
                          </span>
                          <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600/45 focus:ring-2 focus:ring-cyan-500/25 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-100 dark:focus:border-cyan-400/35 dark:focus:ring-cyan-500/15"
                          />
                        </label>
                      </div>

                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                          Work email
                        </span>
                        <input
                          type="email"
                          readOnly
                          value={email}
                          title="Email is managed in Supabase. Contact support to change it."
                          className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-[var(--lp-glass-border)] bg-slate-100/80 px-4 py-3 text-sm text-slate-600 outline-none dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-400"
                        />
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">
                          Shown for reference. To change it, use your account provider or an email change flow in Supabase.
                        </p>
                      </div>

                      {accountMsg && (
                        <p
                          className={cn(
                            "text-sm",
                            accountMsg.type === "ok"
                              ? "text-emerald-700 dark:text-emerald-400/90"
                              : "text-rose-600 dark:text-rose-400",
                          )}
                        >
                          {accountMsg.text}
                        </p>
                      )}

                      <div className="flex justify-end border-t border-slate-200/90 pt-6 dark:border-white/[0.06]">
                        <button
                          type="button"
                          disabled={accountBusy}
                          className="btn-violet rounded-xl px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => void saveAccount()}
                        >
                          {accountBusy ? "Saving…" : "Save changes"}
                        </button>
                      </div>

                      {user && (
                        <div className="border-t border-rose-200/80 pt-6 dark:border-rose-500/20">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Session</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-500">
                            Sign out of Hirely on this device. You can sign in again anytime.
                          </p>
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300/80 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 dark:border-rose-500/35 dark:bg-rose-500/10 dark:text-rose-100 dark:hover:bg-rose-500/20"
                          >
                            <LogOut size={16} strokeWidth={2} aria-hidden />
                            Sign out
                          </button>
                        </div>
                      )}
                    </motion.section>
                  )}

                  {active === "preferences" && (
                    <motion.section
                      key="preferences"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <header>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                          Preferences
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                          Appearance and how dates & times are shown.
                        </p>
                      </header>

                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                          Theme
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {themeCards.map((c) => {
                            const Icon = c.icon;
                            const activeCard =
                              c.id === "system"
                                ? theme === "system"
                                : c.id === "light"
                                  ? theme === "light"
                                  : theme === "dark";
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setTheme(c.id)}
                                className={cn(
                                  "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition",
                                  activeCard
                                    ? "border-cyan-600/40 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(14,116,144,0.2)] dark:border-cyan-500/40 dark:shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                                    : "border-slate-300/80 bg-white/70 hover:border-slate-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/[0.12]",
                                )}
                              >
                                <Icon
                                  size={20}
                                  className={activeCard ? "text-cyan-800 dark:text-cyan-300" : "text-slate-500"}
                                />
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {c.label}
                                </span>
                                <span className="text-xs text-slate-600 dark:text-slate-500">{c.sub}</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-600">
                          Resolved: {resolvedTheme ?? "—"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-inner-well)] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-violet-700 dark:text-violet-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Accent color</p>
                            <p className="text-xs text-slate-600 dark:text-slate-500">
                              Used for highlights in the dashboard.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={prefs.accent}
                            onChange={(e) => {
                              const accent = e.target.value;
                              setPrefs((p) => ({ ...p, accent }));
                              savePrefs({ accent });
                            }}
                            className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300/90 bg-transparent p-0.5 dark:border-white/[0.1]"
                          />
                          <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{prefs.accent}</span>
                        </div>
                      </div>

                      <div>
                        <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                          <Globe size={14} className="text-cyan-800 opacity-90 dark:text-cyan-400" aria-hidden />
                          Regional format
                        </p>
                        <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                          Saved in this browser only. More of the app will respect these as we expand scheduling and
                          history views.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-800 dark:text-cyan-400/90">
                              Date &amp; time display
                            </p>
                            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--lp-glass-border)] bg-white/60 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-300">
                                  First day of the week
                                </span>
                                <select
                                  value={prefs.firstDayOfWeek}
                                  onChange={(e) => {
                                    const firstDayOfWeek = e.target.value as Prefs["firstDayOfWeek"];
                                    persistPrefs({ firstDayOfWeek });
                                  }}
                                  className="w-full min-w-0 rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-600/45 sm:w-48 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-200 dark:focus:border-cyan-400/35"
                                >
                                  <option value="sunday">Sunday (common in the Americas)</option>
                                  <option value="monday">Monday (ISO, much of Europe &amp; Asia)</option>
                                </select>
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Date format</span>
                                  <p className="mb-1 text-[11px] text-slate-500 dark:text-slate-500">How dates appear in the product.</p>
                                  <select
                                    value={prefs.dateFormat}
                                    onChange={(e) => {
                                      persistPrefs({ dateFormat: e.target.value });
                                    }}
                                    className="mt-0.5 w-full rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] px-3 py-2.5 text-sm text-slate-900 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-200"
                                  >
                                    <option value="MMM d, yyyy">Feb 18, 2026 (MMM d, yyyy)</option>
                                    <option value="dd/MM/yyyy">18/02/2026 (dd/MM/yyyy)</option>
                                    <option value="yyyy-MM-dd">2026-02-18 (yyyy-MM-dd)</option>
                                  </select>
                                </label>
                                <label className="block">
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Time format</span>
                                  <p className="mb-1 text-[11px] text-slate-500 dark:text-slate-500">12h or 24h clock.</p>
                                  <select
                                    value={prefs.timeFormat}
                                    onChange={(e) => {
                                      persistPrefs({ timeFormat: e.target.value as Prefs["timeFormat"] });
                                    }}
                                    className="mt-0.5 w-full rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] px-3 py-2.5 text-sm text-slate-900 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-200"
                                  >
                                    <option value="12">4:30 PM (12-hour)</option>
                                    <option value="24">16:30 (24-hour)</option>
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div
                            className="rounded-2xl border border-[var(--lp-glass-border)] bg-white/60 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]"
                            role="group"
                            aria-labelledby="weekend-heading"
                            aria-describedby="weekend-desc"
                          >
                            <h4
                              id="weekend-heading"
                              className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100"
                            >
                              Which days are your “weekend”?
                            </h4>
                            <p
                              id="weekend-desc"
                              className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-500"
                            >
                              Hirely uses this for calendar-style week views, local highlights, and anything that should
                              feel like “time off” — only on <strong className="font-medium text-slate-800 dark:text-slate-300">this device</strong> (same as the rest of these preferences).
                            </p>

                            <p className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-800 dark:text-cyan-400/90">
                              Quick picks
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
                              {WEEKEND_PRESETS.map((p) => {
                                const active =
                                  p.days.length === prefs.weekendDays.length &&
                                  [...p.days].sort((a, b) => a - b).join(",") ===
                                    [...prefs.weekendDays].sort((a, b) => a - b).join(",");
                                return (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => applyWeekendPreset(p.days)}
                                    className={cn(
                                      "flex flex-1 flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                                      active
                                        ? "border-cyan-500/50 bg-cyan-500/10 text-slate-900 dark:border-cyan-400/40 dark:bg-cyan-500/15 dark:text-slate-100"
                                        : "border-slate-200/90 bg-white/80 text-slate-800 hover:border-cyan-500/30 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-400/30",
                                    )}
                                  >
                                    <span className="font-semibold">{p.label}</span>
                                    <span className="text-xs font-normal text-slate-500 dark:text-slate-500">
                                      {p.hint}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-800 dark:text-cyan-400/90">
                              Or tap days
                            </p>
                            <div
                              className="flex flex-wrap gap-2"
                              role="group"
                              aria-label="Toggle weekend days, multiple selection allowed"
                            >
                              {WEEKDAYS.map(({ value, abbr, long }) => {
                                const on = prefs.weekendDays.includes(value);
                                return (
                                  <button
                                    key={value}
                                    type="button"
                                    aria-pressed={on}
                                    aria-label={`${long} — ${on ? "weekend" : "not weekend"}. Press to toggle.`}
                                    title={long}
                                    onClick={() => toggleWeekend(value)}
                                    className={cn(
                                      "min-w-[2.75rem] rounded-lg px-2.5 py-2 text-center text-xs font-bold transition",
                                      on
                                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20"
                                        : "border border-slate-300/80 bg-white/90 text-slate-700 hover:border-slate-400 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/20",
                                    )}
                                  >
                                    {abbr}
                                  </button>
                                );
                              })}
                            </div>
                            <p
                              className="mt-3 text-sm text-slate-700 dark:text-slate-300"
                              aria-live="polite"
                            >
                              <span className="font-medium text-cyan-800 dark:text-cyan-300/95">You chose: </span>
                              {weekendSummary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  )}

                  {active === "notifications" && (
                    <motion.section
                      key="notifications"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <header>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                          Notifications
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                          Choose what we send to your inbox.
                        </p>
                      </header>

                      {[
                        {
                          key: "emailDigest" as const,
                          title: "Weekly digest",
                          sub: "Summary of practice streak and tips.",
                          icon: Calendar,
                        },
                        {
                          key: "sessionReminders" as const,
                          title: "Session reminders",
                          sub: "Nudges before scheduled practice blocks.",
                          icon: Bell,
                        },
                        {
                          key: "marketingEmails" as const,
                          title: "Product updates",
                          sub: "New features and interview guides.",
                          icon: BookOpen,
                        },
                      ].map((row) => {
                        const Icon = row.icon;
                        const on = prefs[row.key];
                        return (
                          <div
                            key={row.key}
                            className="flex flex-col gap-4 rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-inner-well)] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:bg-white/[0.03]"
                          >
                            <div className="flex gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-400">
                                <Icon size={18} />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-200">{row.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-500">{row.sub}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={on}
                              onClick={() => {
                                const next = !prefs[row.key];
                                persistPrefs({ [row.key]: next });
                              }}
                              className={cn(
                                "relative h-8 w-14 shrink-0 rounded-full transition",
                                on ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-300 dark:bg-slate-700",
                              )}
                            >
                              <span
                                className={cn(
                                  "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition",
                                  on ? "left-7" : "left-1",
                                )}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </motion.section>
                  )}

                  {active === "security" && (
                    <motion.section
                      key="security"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <header>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                          Security
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                          Update the password you use with your email. We verify your current password, then apply the
                          new one in Supabase so the next sign-in works with it.
                        </p>
                      </header>

                      {user && !hasEmailPassword && (
                        <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100/95">
                          You are signed in with a social account only. To set an email+password, open the{" "}
                          <Link href="/auth" className="font-semibold underline-offset-2 hover:underline">
                            login page
                          </Link>{" "}
                          and use &quot;Forgot password&quot; with the same email, or add an email+password in your Supabase
                          Auth settings.
                        </p>
                      )}

                      <div className="space-y-4">
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                            Current password
                          </span>
                          <div className="relative mt-1.5">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type={showPass ? "text" : "password"}
                              value={currentPw}
                              onChange={(e) => setCurrentPw(e.target.value)}
                              className="w-full rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] py-3 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-cyan-600/45 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-100 dark:focus:border-cyan-400/35"
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500"
                              onClick={() => setShowPass((s) => !s)}
                              aria-label={showPass ? "Hide password" : "Show password"}
                            >
                              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </label>
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-800 dark:text-cyan-400/90">
                            New password
                          </span>
                          <div className="relative mt-1.5">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type={showPass ? "text" : "password"}
                              value={newPw}
                              onChange={(e) => setNewPw(e.target.value)}
                              className="w-full rounded-xl border border-[var(--lp-glass-border)] bg-[var(--lp-input-bg)] py-3 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-cyan-600/45 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-100 dark:focus:border-cyan-400/35"
                              autoComplete="new-password"
                            />
                          </div>
                        </label>
                      </div>

                      {pwMsg && (
                        <p
                          className={cn(
                            "text-sm",
                            pwMsg.type === "ok"
                              ? "text-emerald-700 dark:text-emerald-400/90"
                              : "text-rose-600 dark:text-rose-400",
                          )}
                        >
                          {pwMsg.text}
                        </p>
                      )}

                      <div className="rounded-2xl border border-emerald-600/25 bg-emerald-500/10 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-200">Google</p>
                            <p className="text-sm text-slate-600 dark:text-slate-500">
                              Sign in faster with your Google account.
                            </p>
                          </div>
                          <span className="inline-flex w-fit rounded-full border border-emerald-600/40 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-400">
                            Connected
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-slate-200/90 pt-6 dark:border-white/[0.06]">
                        <button
                          type="button"
                          className="btn-violet rounded-xl px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={pwBusy || (user != null && !hasEmailPassword)}
                          onClick={() => void saveSecurity()}
                        >
                          {pwBusy ? "Updating…" : "Update password"}
                        </button>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
