import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center · Hirely",
  description: "Guides, FAQs, and answers to common questions about Hirely.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
