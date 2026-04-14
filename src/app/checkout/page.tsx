"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "pro";

  return (
    <div
      className="lp-page relative min-h-screen"
      style={{
        background: "var(--lp-background)",
        color: "var(--lp-foreground)",
      }}
    >
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 pb-24 pt-32 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">
          Plan: <span className="font-semibold capitalize text-foreground">{plan}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Billing checkout is not wired up yet. You can continue using Hirely from the dashboard or start a session.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/start"
            className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary"
          >
            Go to interview
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          className="lp-page flex min-h-screen items-center justify-center"
          style={{
            background: "var(--lp-background)",
            color: "var(--lp-muted-foreground)",
          }}
        >
          Loading…
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
