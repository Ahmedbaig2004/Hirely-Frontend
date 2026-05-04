"use client";

import { usePathname } from "next/navigation";
import {
  AppPageGraphicsBackdrop,
  type AppPageBackdropVariant,
} from "@/components/backgrounds/AppPageGraphicsBackdrop";

function variantFromPath(pathname: string): AppPageBackdropVariant {
  if (pathname.startsWith("/dashboard")) {
    if (pathname.includes("/analytics")) return "analytics";
    return "dashboard";
  }
  if (pathname.startsWith("/pricing")) return "pricing";
  return "about";
}

/**
 * Animated app backdrop on all routes except the landing page (`/`).
 * Palette follows the route (dashboard / analytics / pricing / about-style default).
 */
export function GlobalSubpageBackdrop() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return <AppPageGraphicsBackdrop variant={variantFromPath(pathname)} />;
}
