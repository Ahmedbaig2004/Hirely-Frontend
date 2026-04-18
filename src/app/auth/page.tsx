"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAnimatedLaptop } from "@/components/auth/AuthAnimatedLaptop";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconBrandLinkedin } from "@tabler/icons-react";
import { Eye, EyeOff, Loader2, Rocket, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
export default function AuthPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signErr) throw signErr;
        router.push("/");
      } else {
        const { error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });
        if (signErr) throw signErr;
        setMsg("Account created! Check your email to confirm.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setMsg(null);
    if (!email.trim()) {
      setError("Enter your email address first, then reset your password.");
      return;
    }
    setLoading(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined,
      });
      if (resetErr) throw resetErr;
      setMsg("Check your email for a password reset link.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send reset email";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page lp-page relative min-h-screen w-full overflow-x-hidden bg-transparent text-[var(--lp-foreground)]">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Left — branding (deeper + gradient vs. right panel) */}
        <div className="auth-split-left relative hidden flex-col justify-between overflow-hidden px-10 py-12 lg:flex lg:px-14 xl:px-16">
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold tracking-tight"
              style={{ color: "#99f6e4" }}
            >
              Hirely
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-10 max-w-lg text-4xl font-bold leading-[1.15] tracking-tight text-white xl:text-5xl"
            >
              Master your next{" "}
              <span className="lp-gradient-text bg-clip-text text-transparent">interview session.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-5 max-w-md text-sm leading-relaxed text-[var(--lp-muted-foreground)]"
            >
              The digital sanctuary for high-growth professionals. Prepare with AI-driven insights in a distraction-free
              environment.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="auth-laptop-scene relative z-10 mt-12 flex flex-1 items-end pb-4"
          >
            <div className="auth-laptop-glow" aria-hidden />
            <AuthAnimatedLaptop />
          </motion.div>
        </div>

        {/* Right — form (flatter, slightly lighter than left) */}
        <div className="auth-split-right relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
          <div
            className="pointer-events-none absolute inset-0 lg:border-l lg:border-white/[0.07]"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className="mb-2 lg:hidden">
              <p className="text-lg font-bold" style={{ color: "#99f6e4" }}>
                Hirely
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {isLogin ? "Welcome Back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-[var(--lp-muted-foreground)]">
                {isLogin ? "Sign in to continue your journey." : "Start your interview prep in minutes."}
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button type="button" className="auth-social-btn" onClick={() => alert("Google Auth coming soon!")}>
                <IconBrandGoogle className="h-4 w-4 opacity-90" />
                Google
              </button>
              <button type="button" className="auth-social-btn" onClick={() => alert("LinkedIn Auth coming soon!")}>
                <IconBrandLinkedin className="h-4 w-4 opacity-90" />
                LinkedIn
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t" style={{ borderColor: "var(--lp-border)" }} />
              </div>
              <div className="relative flex justify-center">
                <span className="label-caps bg-[var(--auth-bg-right)] px-3 text-[var(--lp-muted-foreground)]">
                  or use email
                </span>
              </div>
            </div>

            {error && (
              <div
                className="mb-4 rounded-xl border px-4 py-3 text-sm"
                style={{
                  background: "rgba(248, 113, 113, 0.08)",
                  borderColor: "rgba(248, 113, 113, 0.25)",
                  color: "var(--lp-danger)",
                }}
              >
                {error}
              </div>
            )}
            {msg && (
              <div
                className="mb-4 rounded-xl border px-4 py-3 text-sm"
                style={{
                  background: "rgba(52, 211, 153, 0.08)",
                  borderColor: "rgba(52, 211, 153, 0.25)",
                  color: "var(--lp-success)",
                }}
              >
                {msg}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <LabelInputContainer>
                  <Label htmlFor="name">Full name</Label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                    required={!isLogin}
                  />
                </LabelInputContainer>
              )}

              <LabelInputContainer>
                <Label htmlFor="email">Email address</Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-[var(--lp-muted-foreground)] transition-colors hover:text-[var(--lp-primary-light)]"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lp-muted-foreground)] transition-colors hover:text-[var(--lp-card-foreground)]"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </LabelInputContainer>

              {!isLogin && (
                <LabelInputContainer>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    required={!isLogin}
                  />
                </LabelInputContainer>
              )}

              <button className="auth-primary-btn" type="submit" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create account"
                )}
              </button>

              <p className="text-center text-sm text-[var(--lp-muted-foreground)]">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setMsg(null);
                  }}
                  className="font-semibold text-white underline-offset-4 transition-colors hover:text-[var(--lp-primary-light)] hover:underline"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </form>

            <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--lp-muted-foreground)]">
                <span>Trusted by</span>
                <span className="flex items-center gap-2 text-[var(--lp-muted-foreground)]">
                  <Rocket className="h-4 w-4" aria-hidden />
                  <Shield className="h-4 w-4" aria-hidden />
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--lp-muted-foreground)]"
            style={{
              borderColor: "var(--lp-glass-border)",
              background: "var(--lp-glass)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            System online
          </div>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-xs font-medium leading-none text-[var(--lp-muted-foreground)]", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";
