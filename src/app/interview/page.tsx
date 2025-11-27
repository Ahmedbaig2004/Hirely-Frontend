"use client";
import { useInterviewStore } from "@/stores/useInterviewStore";
import InterviewPanel from "@/components/InterviewPanel";

export default function InterviewPage() {
  const { currentQuestion } = useInterviewStore();

  return (
    <main className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-10 text-slate-300">
        Technical Interview
      </h1>

      {/* We will build this component next! */}
      <InterviewPanel />

      <div className="mt-8 p-4 bg-slate-800 rounded-lg max-w-2xl w-full text-center">
        <p className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-2">
          Current Question
        </p>
        <p className="text-xl">{currentQuestion || "Loading question..."}</p>
      </div>
    </main>
  );
}
