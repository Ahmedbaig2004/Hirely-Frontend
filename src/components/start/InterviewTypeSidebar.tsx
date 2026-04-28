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

/** Matches setup pills on /start — selected glow vs faded idle (light + dark). */
const SIDEBAR_SELECTED =
  "cursor-pointer rounded-2xl border-2 border-violet-500/65 bg-white p-4 text-left shadow-[0_6px_26px_-10px_rgba(124,58,237,0.42)] ring-1 ring-violet-400/30 backdrop-blur-md transition-all duration-200 dark:border-violet-400/55 dark:bg-gradient-to-br dark:from-violet-950 dark:to-slate-950 dark:shadow-[0_0_36px_-8px_rgba(167,139,250,0.48)] dark:ring-violet-400/35";

const SIDEBAR_IDLE =
  "cursor-pointer rounded-2xl border border-slate-300/45 bg-white/55 p-4 text-left opacity-[0.82] backdrop-blur-md transition-all duration-200 hover:border-slate-400/55 hover:bg-white/90 hover:opacity-100 hover:shadow-sm dark:border-white/[0.09] dark:bg-white/[0.045] dark:opacity-[0.62] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.09] dark:hover:opacity-[0.94]";

interface Props {
  selected: InterviewType;
  onSelect: (type: InterviewType) => void;
}

export function InterviewTypeSidebar({ selected, onSelect }: Props) {
  return (
    <aside className="flex flex-col gap-3">
      <span className="label-caps mb-2 block text-slate-600 dark:text-slate-300">
        Interview Type
      </span>
      {OPTIONS.map(({ type, label, description, Icon }) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={isActive ? SIDEBAR_SELECTED : SIDEBAR_IDLE}
          >
            <div className="mb-1 flex items-center gap-3">
              <Icon
                size={16}
                className={
                  isActive
                    ? "text-violet-600 dark:text-violet-300"
                    : "text-slate-500 dark:text-slate-400"
                }
              />
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-slate-900 dark:text-violet-50" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {label}
              </span>
            </div>
            <p
              className={`pl-7 text-xs leading-snug ${
                isActive
                  ? "text-slate-600 dark:text-violet-200/85"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {description}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
