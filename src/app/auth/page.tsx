"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle, IconBrandLinkedin } from "@tabler/icons-react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion"; 
import { AuroraBackground } from "@/components/ui/aurora-background"; 

export default function AuthPage() {
  const router = useRouter();
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

    // Client-side validation
    if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created! Check your email to confirm.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        // ✅ FIXED: Added 'z-10' here. 
        // This forces the form to sit ON TOP of the Aurora Background blobs.
        className="relative z-10 flex flex-col gap-4 items-center justify-center px-4 w-full"
      >
        <div className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-xl border border-slate-200 bg-white/90 backdrop-blur-sm">
            <h2 className="font-bold text-xl text-slate-900">
                Welcome to HIRELY
            </h2>
            <p className="text-slate-600 text-sm max-w-sm mt-2">
                {isLogin ? "Login to access your dashboard" : "Create an account to start interviewing"}
            </p>

            {error && (
                <div className="mt-4 p-3 rounded bg-red-50 border border-red-100 text-red-600 text-sm">
                    {error}
                </div>
            )}
            {msg && (
                <div className="mt-4 p-3 rounded bg-green-50 border border-green-100 text-green-600 text-sm">
                    {msg}
                </div>
            )}

            <form className="my-8" onSubmit={handleSubmit}>
                
                <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                    id="email" 
                    placeholder="you@example.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </LabelInputContainer>
                
                <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input 
                        id="password" 
                        placeholder="••••••••" 
                        type={isVisible ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                    >
                        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                </LabelInputContainer>

                {!isLogin && (
                    <LabelInputContainer className="mb-8">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                        id="confirmPassword" 
                        placeholder="••••••••" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    </LabelInputContainer>
                )}

                <button
                className="bg-slate-900 hover:bg-slate-800 no-underline group cursor-pointer relative shadow-lg shadow-slate-900/20 rounded-full p-px text-sm font-semibold leading-6 text-white inline-block w-full disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                type="submit"
                disabled={loading}
                >
                {loading ? (
                    <div className="relative flex space-x-2 items-center z-10 rounded-full bg-slate-950 py-2.5 px-4 ring-1 ring-white/10 justify-center">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Please wait</span>
                    </div>
                ) : (
                    <>
                        <span className="absolute inset-0 overflow-hidden rounded-full">
                            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </span>
                        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-slate-950 py-2.5 px-4 ring-1 ring-white/10 justify-center">
                            <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                            <svg
                                fill="none"
                                height="16"
                                viewBox="0 0 24 24"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.75 8.75L14.25 12L10.75 15.25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </div>
                        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </>
                )}
                </button>

                <div className="bg-gradient-to-r from-transparent via-slate-300 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                <button
                    className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-slate-900 rounded-md h-10 font-medium shadow-sm bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                    type="button"
                    onClick={() => alert("Github Auth coming soon!")}
                >
                    <IconBrandGithub className="h-4 w-4 text-slate-800" />
                    <span className="text-slate-700 text-sm">
                    GitHub
                    </span>
                </button>
                <button
                    className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-slate-900 rounded-md h-10 font-medium shadow-sm bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                    type="button"
                    onClick={() => alert("Google Auth coming soon!")}
                >
                    <IconBrandGoogle className="h-4 w-4 text-slate-800" />
                    <span className="text-slate-700 text-sm">
                    Google
                    </span>
                </button>
                <button
                    className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-slate-900 rounded-md h-10 font-medium shadow-sm bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                    type="button"
                    onClick={() => alert("LinkedIn Auth coming soon!")}
                >
                    <IconBrandLinkedin className="h-4 w-4 text-slate-800" />
                    <span className="text-slate-700 text-sm">
                    LinkedIn
                    </span>
                </button>
                </div>

                <p className="text-center mt-8 text-sm text-slate-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-slate-900 font-bold hover:underline" type="button">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </form>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

// --- HELPER COMPONENTS ---

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
        "text-sm font-medium text-slate-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
        )}
        {...props}
    />
));
Label.displayName = "Label";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";