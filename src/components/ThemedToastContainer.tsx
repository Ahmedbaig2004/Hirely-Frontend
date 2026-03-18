"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export function ThemedToastContainer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ToastContainer
      position="bottom-right"
      theme={mounted && resolvedTheme === "light" ? "light" : "dark"}
      autoClose={3000}
      toastStyle={{ zIndex: 99999 }}
    />
  );
}
