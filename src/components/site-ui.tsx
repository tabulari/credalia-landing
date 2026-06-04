"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/**
 * Shared client UI state for cross-section overlays. Slice 2 only tracks the
 * application-modal open intent so every apply CTA (nav, hero, simulator, CTA
 * banner, sticky bar) routes through one seam. Slice 4 renders <ApplyModal>
 * inside this provider and consumes `applyOpen`.
 */

export type ApplyOrigin = "direct" | "simulator" | "resume";

interface SiteUi {
  applyOpen: boolean;
  applyOrigin: ApplyOrigin;
  openApply: (origin?: ApplyOrigin) => void;
  closeApply: () => void;
}

const SiteUiContext = createContext<SiteUi | null>(null);

export function SiteUiProvider({ children }: { children: React.ReactNode }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyOrigin, setApplyOrigin] = useState<ApplyOrigin>("direct");

  const openApply = useCallback((origin: ApplyOrigin = "direct") => {
    setApplyOrigin(origin);
    setApplyOpen(true);
  }, []);

  const closeApply = useCallback(() => setApplyOpen(false), []);

  const value = useMemo<SiteUi>(
    () => ({ applyOpen, applyOrigin, openApply, closeApply }),
    [applyOpen, applyOrigin, openApply, closeApply],
  );

  return (
    <SiteUiContext.Provider value={value}>{children}</SiteUiContext.Provider>
  );
}

export function useSiteUi(): SiteUi {
  const ctx = useContext(SiteUiContext);
  if (!ctx) throw new Error("useSiteUi must be used within <SiteUiProvider>");
  return ctx;
}
