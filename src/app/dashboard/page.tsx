"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Calendar, ChevronDown, CheckCircle, XCircle, ArrowRight, Inbox, Zap, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { LoaderFour } from "@/components/ui/loader";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { PersonalDashboardExperience } from "@/components/dashboard/PersonalDashboardExperience";

interface InterviewFeedback {
  decision?: string;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
}

interface Interview {
  id: string;
  jobDescription: string | null;
  interviewType?: string;
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
    score >= 70
      ? "text-emerald-700 dark:text-emerald-400"
      : score >= 50
        ? "text-amber-700 dark:text-amber-400"
        : "text-rose-700 dark:text-rose-400";

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
          ? "bg-emerald-500/15 text-emerald-800 border-emerald-600/35 dark:text-emerald-400 dark:border-emerald-500/20"
          : "bg-rose-500/15 text-rose-800 border-rose-600/35 dark:text-rose-400 dark:border-rose-500/20"
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
              <h2 className="font-bold text-lg text-slate-900 truncate dark:text-on-surface dark:opacity-90">
                {item.jobDescription
                  ? item.jobDescription.substring(0, 50) + (item.jobDescription.length > 50 ? "…" : "")
                  : item.interviewType === "TECHNICAL"
                  ? "Technical Interview"
                  : item.interviewType === "BEHAVIORAL"
                  ? "Behavioral Interview"
                  : "Interview"}
              </h2>
              <DecisionBadge decision={fb?.decision} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-400">
                <Calendar size={14} />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <ScoreBar score={item.finalScore} />
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`shrink-0 text-slate-700 transition-transform duration-300 dark:text-slate-400 ${expanded ? "rotate-180" : ""}`}
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
                className="text-xs lp-muted hover:lp-body transition-colors px-1.5 py-1"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
              className="p-1.5 rounded-lg lp-faint hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
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
                <p className="text-sm leading-relaxed line-clamp-3 text-slate-800 dark:text-on-surface-variant dark:opacity-90">
                  {fb.summary}
                </p>
              )}

              {/* Strengths & Weaknesses */}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider dark:text-emerald-400/90">
                        Strengths
                      </span>
                      {strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle size={12} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-500" />
                          <span className="text-sm leading-relaxed text-slate-800 dark:text-on-surface-variant dark:opacity-90">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {weaknesses.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider dark:text-rose-400/90">
                        Areas to Improve
                      </span>
                      {weaknesses.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <XCircle size={12} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-500" />
                          <span className="text-sm leading-relaxed text-slate-800 dark:text-on-surface-variant dark:opacity-90">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={onNavigate}
                className="btn-violet mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold"
              >
                View full report <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type FilterType = "all" | "JOB_SPECIFIC" | "TECHNICAL" | "BEHAVIORAL";

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "JOB_SPECIFIC", label: "Job-Specific" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "BEHAVIORAL", label: "Behavioral" },
];

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [dashSection, setDashSection] = useState<"overview" | "sessions">("overview");
  const { user } = useAuthStore();
  const userId = user?.id;
  const router = useRouter();

  const filteredInterviews =
    filter === "all"
      ? interviews
      : interviews.filter((iv) => (iv.interviewType ?? "JOB_SPECIFIC") === filter);

  const handleDelete = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      await axios.delete(`${backendUrl}/api/interviews/${id}?userId=${user?.id ?? ""}`);
      setInterviews((prev) => prev.filter((iv) => iv.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err: unknown) {
      let message = "Unknown error";
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { error?: string } | undefined;
        message = data?.error ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error("Failed to delete: " + message);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
    axios
      .get(`${backendUrl}/api/interviews?userId=${userId}`)
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
  }, [userId]);

  if (!user) {
    return (
      <div
        className="lp-page dark flex h-screen w-full items-center justify-center"
        style={{ background: "transparent" }}
      >
        <LoaderFour />
      </div>
    );
  }

  const sessionsBlock = (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = filter === opt.value;
          const count =
            opt.value === "all"
              ? interviews.length
              : interviews.filter((iv) => (iv.interviewType ?? "JOB_SPECIFIC") === opt.value).length;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "border-violet-600/45 bg-violet-500/15 text-slate-900 shadow-[0_0_20px_rgba(124,58,237,0.18)] dark:border-violet-400/45 dark:bg-violet-500/20 dark:text-slate-100 dark:shadow-[0_0_22px_rgba(124,58,237,0.28)]"
                  : "border-slate-400/55 bg-white/55 text-slate-800 hover:border-slate-500/70 hover:bg-white/75 hover:text-slate-900 dark:border-white/18 dark:bg-white/[0.07] dark:text-slate-200 dark:hover:border-white/28 dark:hover:bg-white/10 dark:hover:text-slate-50"
              }`}
            >
              {opt.label}
              <span
                className={`ml-2 tabular-nums ${isActive ? "text-slate-700 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filteredInterviews.map((item, i) => (
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

        {filteredInterviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Inbox size={48} className="text-on-surface-variant mb-4 opacity-25" />
            <p className="text-on-surface-variant text-lg font-medium mb-2 opacity-55">
              {interviews.length === 0
                ? "No interviews yet"
                : `No ${FILTER_OPTIONS.find((o) => o.value === filter)?.label} interviews`}
            </p>
            <p className="text-on-surface-variant text-sm mb-6 opacity-30">
              {interviews.length === 0
                ? "Start your first interview to see results here"
                : "Try a different filter or start a new interview"}
            </p>
            <button
              type="button"
              onClick={() => router.push("/start")}
              className="btn-violet flex items-center gap-2 rounded-lg px-4 py-2"
            >
              <Zap size={16} />
              {interviews.length === 0 ? "Start your first interview" : "New Interview"}
            </button>
          </motion.div>
        )}
      </div>
    </>
  );

  return (
    <main
      className="lp-page relative min-h-screen overflow-hidden"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <div className="relative z-[2]">
        <PersonalDashboardExperience
          interviews={interviews}
          loading={loading}
          drillType={filter !== "all" ? filter : null}
          onDrill={(type) => {
            setFilter(type as FilterType);
            setDashSection("sessions");
          }}
          onClearDrill={() => setFilter("all")}
          section={dashSection}
          onSectionChange={setDashSection}
        >
          {sessionsBlock}
        </PersonalDashboardExperience>
      </div>
    </main>
  );
}
