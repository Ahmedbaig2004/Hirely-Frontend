"use client";

import { Briefcase, Code2, Users } from "lucide-react";
import { InterviewType } from "@/stores/useInterviewStore";

interface SidebarOption {
  type: InterviewType;
  label: string;
  description: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const OPTIONS: SidebarOption[] = [
  {
    type: "job-specific",
    label: "Job-Specific",
    description: "Resume + job description gap analysis",
    Icon: Briefcase,
  },
  {
    type: "technical",
    label: "Technical",
    description: "Stack-focused coding & concepts",
    Icon: Code2,
  },
  {
    type: "behavioral",
    label: "Behavioral",
    description: "Soft skills & STAR-method questions",
    Icon: Users,
  },
];

interface Props {
  selected: InterviewType;
  onSelect: (type: InterviewType) => void;
}

export function InterviewTypeSidebar({ selected, onSelect }: Props) {
  return (
    <aside className="flex flex-col gap-3">
      <span className="label-caps mb-2 block text-slate-600 dark:text-slate-400/90">
        Interview Type
      </span>
      {OPTIONS.map(({ type, label, description, Icon }) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`rounded-2xl border p-4 text-left backdrop-blur-md transition-all duration-200 ${
              isActive
                ? "border-cyan-600/35 bg-gradient-to-br from-cyan-500/18 to-violet-600/10 shadow-[0_8px_28px_-8px_rgba(14,116,144,0.2)] dark:border-cyan-400/35 dark:from-cyan-500/[0.12] dark:to-violet-600/[0.08] dark:shadow-[0_0_28px_-6px_rgba(34,211,238,0.25)]"
                : "border-slate-300/70 bg-white/55 hover:border-cyan-600/30 hover:bg-white/75 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-cyan-400/20 dark:hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <Icon
                size={16}
                className={
                  isActive ? "text-cyan-700 dark:text-cyan-300" : "text-slate-600 dark:text-slate-500"
                }
              />
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-slate-900 dark:lp-hi" : "text-slate-800 dark:lp-body"
                }`}
              >
                {label}
              </span>
            </div>
            <p className="pl-7 text-xs leading-snug text-slate-600 dark:lp-dim">
              {description}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
