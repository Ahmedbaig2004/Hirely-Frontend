"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
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
  Sun,
  User,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
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
    return { ...defaultPrefs, ...JSON.parse(raw) };
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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [active, setActive] = useState<(typeof NAV)[number]["id"]>("account");
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

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

  const saveAccount = () => {
    toast.success(user ? "Profile updated locally — sync coming soon." : "Sign in to sync profile to the cloud.");
  };

  const saveSecurity = () => {
    if (!currentPw && !newPw) {
      toast.info("Nothing to update.");
      return;
    }
    toast.success("Password change simulated — connect your auth backend to enable.");
    setCurrentPw("");
    setNewPw("");
  };

  const toggleWeekend = (d: number) => {
    const set = new Set(prefs.weekendDays);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    persistPrefs({ weekendDays: [...set].sort((a, b) => a - b) });
  };

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
      style={{ color: "var(--lp-foreground)" }}
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
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-slate-400 transition hover:border-cyan-500/25 hover:text-slate-200"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-300">Settings</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-caps lp-dim mb-2">Control center</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Settings</h1>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-400">
                Tune how Hirely looks, notifies you, and keeps your account secure — all in one place.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-4 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-600/40">
                    <BookOpen className="h-6 w-6 text-cyan-300/90" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Tip</p>
                    <p className="text-sm text-slate-300">Changes save to this device instantly.</p>
                  </div>
                </div>
              </div>
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
            <nav className="flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-slate-950/40 p-2 backdrop-blur-xl sm:flex-row sm:overflow-x-auto lg:flex-col">
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
                        ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
                        on ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" : "border-white/[0.06] bg-white/[0.03] text-slate-500",
                      )}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="block truncate text-[11px] text-slate-500">{item.desc}</span>
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
            <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-slate-950/50 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.75)] backdrop-blur-xl">
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
                        <h2 className="text-xl font-semibold text-slate-50">Account</h2>
                        <p className="mt-1 text-sm text-slate-500">Profile details tied to your Hirely identity.</p>
                      </header>

                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="relative h-24 w-24 shrink-0">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 ring-2 ring-white/10" />
                          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-400">
                            {(firstName || email || "?").slice(0, 1).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/30"
                            onClick={() => toast.info("Upload will be available when storage is connected.")}
                          >
                            Upload photo
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-500 transition hover:text-rose-400"
                            onClick={() => toast.info("Removed locally — sync pending backend.")}
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 sm:ml-auto">PNG or JPEG · max 15MB</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">First name</span>
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/35 focus:ring-2 focus:ring-cyan-500/15"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last name</span>
                          <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/35 focus:ring-2 focus:ring-cyan-500/15"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Work email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/35 focus:ring-2 focus:ring-cyan-500/15"
                        />
                      </label>

                      <div className="flex justify-end border-t border-white/[0.06] pt-6">
                        <button type="button" className="btn-violet rounded-xl px-6 py-2.5 text-sm font-semibold" onClick={saveAccount}>
                          Save changes
                        </button>
                      </div>
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
                        <h2 className="text-xl font-semibold text-slate-50">Preferences</h2>
                        <p className="mt-1 text-sm text-slate-500">Appearance and how dates & times are shown.</p>
                      </header>

                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Theme</p>
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
                                    ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                                    : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12]",
                                )}
                              >
                                <Icon size={20} className={activeCard ? "text-cyan-300" : "text-slate-500"} />
                                <span className="text-sm font-semibold text-slate-100">{c.label}</span>
                                <span className="text-xs text-slate-500">{c.sub}</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-xs text-slate-600">Resolved: {resolvedTheme ?? "—"}</p>
                      </div>

                      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-violet-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">Accent color</p>
                            <p className="text-xs text-slate-500">Used for highlights in the dashboard.</p>
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
                              toast.success("Accent updated");
                            }}
                            className="h-10 w-14 cursor-pointer rounded-lg border border-white/[0.1] bg-transparent p-0.5"
                          />
                          <span className="font-mono text-xs text-slate-400">{prefs.accent}</span>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          <Globe size={14} />
                          Regional format
                        </p>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-sm text-slate-300">First day of week</span>
                            <select
                              value={prefs.firstDayOfWeek}
                              onChange={(e) => {
                                const firstDayOfWeek = e.target.value as Prefs["firstDayOfWeek"];
                                persistPrefs({ firstDayOfWeek });
                              }}
                              className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-400/35"
                            >
                              <option value="sunday">Sunday</option>
                              <option value="monday">Monday</option>
                            </select>
                          </div>

                          <div>
                            <span className="mb-2 block text-sm text-slate-300">Weekend days</span>
                            <div className="flex flex-wrap gap-2">
                              {["S", "M", "T", "W", "T", "F", "S"].map((label, d) => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => toggleWeekend(d)}
                                  className={cn(
                                    "h-9 w-9 rounded-lg text-xs font-semibold transition",
                                    prefs.weekendDays.includes(d)
                                      ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                      : "border border-white/[0.08] bg-white/[0.04] text-slate-500 hover:border-white/15",
                                  )}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                              <span className="text-xs text-slate-500">Date format</span>
                              <select
                                value={prefs.dateFormat}
                                onChange={(e) => {
                                  persistPrefs({ dateFormat: e.target.value });
                                }}
                                className="mt-1 w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2.5 text-sm text-slate-200"
                              >
                                <option value="MMM d, yyyy">Feb 18, 2026</option>
                                <option value="dd/MM/yyyy">18/02/2026</option>
                                <option value="yyyy-MM-dd">2026-02-18</option>
                              </select>
                            </label>
                            <label className="block">
                              <span className="text-xs text-slate-500">Time format</span>
                              <select
                                value={prefs.timeFormat}
                                onChange={(e) => {
                                  persistPrefs({ timeFormat: e.target.value as Prefs["timeFormat"] });
                                }}
                                className="mt-1 w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2.5 text-sm text-slate-200"
                              >
                                <option value="12">4:30 PM</option>
                                <option value="24">16:30</option>
                              </select>
                            </label>
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
                        <h2 className="text-xl font-semibold text-slate-50">Notifications</h2>
                        <p className="mt-1 text-sm text-slate-500">Choose what we send to your inbox.</p>
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
                            className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                                <Icon size={18} />
                              </div>
                              <div>
                                <p className="font-medium text-slate-200">{row.title}</p>
                                <p className="text-sm text-slate-500">{row.sub}</p>
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
                                on ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-700",
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
                        <h2 className="text-xl font-semibold text-slate-50">Security</h2>
                        <p className="mt-1 text-sm text-slate-500">Password and active sessions.</p>
                      </header>

                      <div className="space-y-4">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current password</span>
                          <div className="relative mt-1.5">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type={showPass ? "text" : "password"}
                              value={currentPw}
                              onChange={(e) => setCurrentPw(e.target.value)}
                              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 pl-10 pr-10 text-sm text-slate-100 outline-none focus:border-cyan-400/35"
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                              onClick={() => setShowPass((s) => !s)}
                              aria-label={showPass ? "Hide password" : "Show password"}
                            >
                              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">New password</span>
                          <div className="relative mt-1.5">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type={showPass ? "text" : "password"}
                              value={newPw}
                              onChange={(e) => setNewPw(e.target.value)}
                              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 pl-10 pr-10 text-sm text-slate-100 outline-none focus:border-cyan-400/35"
                              autoComplete="new-password"
                            />
                          </div>
                        </label>
                      </div>

                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-slate-200">Google</p>
                            <p className="text-sm text-slate-500">Sign in faster with your Google account.</p>
                          </div>
                          <span className="inline-flex w-fit rounded-full border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-400">
                            Connected
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-white/[0.06] pt-6">
                        <button type="button" className="btn-violet rounded-xl px-6 py-2.5 text-sm font-semibold" onClick={saveSecurity}>
                          Update password
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
