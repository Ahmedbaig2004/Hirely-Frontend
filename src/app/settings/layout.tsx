import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings · Hirely",
  description: "Manage your account, preferences, notifications, and security.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
