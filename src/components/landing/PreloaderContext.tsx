"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type PreloaderContextValue = {
  navbarLogoVisible: boolean;
  revealNavbarLogo: () => void;
};

const PreloaderContext = createContext<PreloaderContextValue | null>(null);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [landingLogoRevealed, setLandingLogoRevealed] = useState(false);
  const prevPathname = useRef(pathname);

  /* Reset reveal synchronously when navigating to `/` so the navbar wordmark does not flash visible for one frame. */
  if (pathname !== prevPathname.current) {
    if (pathname === "/") {
      setLandingLogoRevealed(false);
    }
    prevPathname.current = pathname;
  }

  const navbarLogoVisible = pathname !== "/" || landingLogoRevealed;

  const revealNavbarLogo = useCallback(() => {
    setLandingLogoRevealed(true);
  }, []);

  const value = useMemo(
    () => ({ navbarLogoVisible, revealNavbarLogo }),
    [navbarLogoVisible, revealNavbarLogo],
  );

  return (
    <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>
  );
}

export function usePreloaderContext() {
  const ctx = useContext(PreloaderContext);
  if (!ctx) {
    throw new Error("usePreloaderContext must be used within PreloaderProvider");
  }
  return ctx;
}

export function usePreloaderContextOptional() {
  return useContext(PreloaderContext);
}
