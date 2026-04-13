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
      <span className="label-caps block mb-1">Interview Type</span>
      {OPTIONS.map(({ type, label, description, Icon }) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`glass-card rounded-xl p-4 text-left transition-all duration-200 border ${
              isActive
                ? "border-violet-500/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                : "border-transparent hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <Icon
                size={16}
                className={isActive ? "text-violet-400" : "text-white/40"}
              />
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-white/90" : "text-white/60"
                }`}
              >
                {label}
              </span>
            </div>
            <p className="text-xs text-white/35 leading-snug pl-7">
              {description}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
