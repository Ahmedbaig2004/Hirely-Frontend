"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Calendar, ChevronDown, CheckCircle, XCircle, ArrowRight, Inbox, Zap, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import SignOutButton from "@/components/logOutButton";
import { LoaderFour } from "@/components/ui/loader";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Navbar } from "@/components/landing/Navbar";

interface InterviewFeedback {
  decision?: string;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
}

interface Interview {
  id: string;
  jobDescription: string;
  finalScore: number;
  finalFeedback?: InterviewFeedback | null;
  createdAt: string;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? { gradient: "linear-gradient(90deg, #10B981, #34D399)", glow: "rgba(16,185,129,0.5)" }
      : score >= 50
      ? { gradient: "linear-gradient(90deg, #F59E0B, #FCD34D)", glow: "rgba(245,158,11,0.5)" }
      : { gradient: "linear-gradient(90deg, #EF4444, #F87171)", glow: "rgba(239,68,68,0.5)" };

  const textColor =
    score >= 70 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color.gradient, boxShadow: `0 0 8px ${color.glow}` }}
        />
      </div>
      <span className={`text-xs font-bold shrink-0 ${textColor}`}>{score}%</span>
    </div>
  );
}

function DecisionBadge({ decision }: { decision?: string }) {
  if (!decision) return null;
  const d = decision.toLowerCase();
  const isHire = d.includes("hire") && !d.includes("no") && !d.includes("not");
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
        isHire
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
          : "bg-rose-500/15 text-rose-400 border-rose-500/20"
      }`}
    >
      {decision}
    </span>
  );
}

function InterviewCard({
  item,
  index,
  expanded,
  onToggle,
  onNavigate,
  onDelete,
}: {
  item: Interview;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fb = item.finalFeedback;
  const strengths = fb?.strengths?.slice(0, 2) ?? [];
  const weaknesses = fb?.weaknesses?.slice(0, 2) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="glass-card rounded-xl transition-all duration-200"
      style={
        expanded
          ? {
              borderColor: "color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent)",
              boxShadow: "0 0 20px color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent)",
            }
          : undefined
      }
    >
      {/* Card header — click to expand */}
      <div className="p-6 flex items-center gap-3">
        <button
          onClick={onToggle}
          className="flex-1 min-w-0 flex justify-between items-center text-left"
        >
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h2 className="font-bold text-lg text-on-surface truncate opacity-90">
                {item.jobDescription.substring(0, 50)}
                {item.jobDescription.length > 50 ? "…" : ""}
              </h2>
              <DecisionBadge decision={fb?.decision} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-on-surface-variant text-sm opacity-40">
                <Calendar size={14} />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <ScoreBar score={item.finalScore} />
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-on-surface-variant shrink-0 transition-transform duration-300 opacity-40 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Delete control */}
        <div className="shrink-0 flex items-center gap-1.5 ml-2">
          {confirmDelete ? (
            <>
              <button
                onClick={() => { setConfirmDelete(false); onDelete(); }}
                className="text-xs font-bold text-rose-400 border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 rounded-lg hover:bg-rose-500/20 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-white/40 hover:text-white/70 transition-colors px-1.5 py-1"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
              className="p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
              title="Delete interview"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-outline-variant pt-4 space-y-4">
              {/* Summary */}
              {fb?.summary && (
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 opacity-65">
                  {fb.summary}
                </p>
              )}

              {/* Strengths & Weaknesses */}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider">
                        Strengths
                      </span>
                      {strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                          <span className="text-xs text-on-surface-variant leading-relaxed opacity-65">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {weaknesses.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-400/60 uppercase tracking-wider">
                        Areas to Improve
                      </span>
                      {weaknesses.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <XCircle size={12} className="mt-0.5 shrink-0 text-rose-500" />
                          <span className="text-xs text-on-surface-variant leading-relaxed opacity-65">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={onNavigate}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity mt-1"
              >
                View full report <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      await axios.delete(`${backendUrl}/api/interviews/${id}?userId=${user?.id ?? ""}`);
      setInterviews((prev) => prev.filter((iv) => iv.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Interview deleted.");
    } catch (err: any) {
      toast.error("Failed to delete: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    if (user) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      axios
        .get(`${backendUrl}/api/interviews?userId=${user?.id ?? ""}`)
        .then((res) => {
          setInterviews(res.data);
          setLoading(false);
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.error || err.message || "Failed to load interviews";
          toast.error(`Error: ${errorMsg}`);
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="dark flex h-screen w-full items-center justify-center bg-background">
        <LoaderFour />
      </div>
    );
  }

  const Header = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-on-surface opacity-90">Your Interviews</h1>
        <p className="text-on-surface-variant text-sm mt-1 opacity-50">Welcome back, {user?.email}</p>
      </div>
      <div className="flex gap-3">
        <SignOutButton />
        <button onClick={() => router.push("/")} className="btn-violet flex items-center gap-2">
          <Zap size={16} />
          New Interview
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="relative min-h-screen bg-background overflow-hidden">
        <MeshGradient />
        <Navbar />
        <div className="relative z-10 max-w-4xl mx-auto px-8 pt-32 pb-8">
          <Header />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container p-6 rounded-xl border border-outline-variant animate-pulse">
                <div className="h-6 w-3/4 bg-surface-container-high rounded mb-4"></div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-32 bg-surface-container-high rounded"></div>
                  <div className="h-4 w-24 bg-surface-container-high rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <MeshGradient />
      <Navbar />
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-8 pt-32 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Header />

        <div className="grid gap-4">
          {interviews.map((item, i) => (
            <InterviewCard
              key={item.id}
              item={item}
              index={i}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              onNavigate={() => router.push(`/dashboard/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}

          {interviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Inbox size={48} className="text-on-surface-variant mb-4 opacity-25" />
              <p className="text-on-surface-variant text-lg font-medium mb-2 opacity-55">No interviews yet</p>
              <p className="text-on-surface-variant text-sm mb-6 opacity-30">Start your first interview to see results here</p>
              <button onClick={() => router.push("/")} className="btn-violet flex items-center gap-2">
                <Zap size={16} />
                Start your first interview
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
