"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { track } from "@/lib/analytics";

/**
 * Shared client UI state for cross-section overlays: the application modal
 * open intent (so every apply CTA routes through one seam) and the resume
 * nudge that appears after "Editar monto".
 */

export type ApplyOrigin = "direct" | "simulator" | "resume" | "hiw";

interface SiteUi {
  applyOpen: boolean;
  applyOrigin: ApplyOrigin;
  openApply: (origin?: ApplyOrigin) => void;
  closeApply: () => void;
  resumeNudgeOpen: boolean;
  showResumeNudge: () => void;
  hideResumeNudge: () => void;
}

const SiteUiContext = createContext<SiteUi | null>(null);

export function SiteUiProvider({ children }: { children: React.ReactNode }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyOrigin, setApplyOrigin] = useState<ApplyOrigin>("direct");
  const [resumeNudgeOpen, setResumeNudgeOpen] = useState(false);

  const openApply = useCallback((origin: ApplyOrigin = "direct") => {
    setResumeNudgeOpen(false);
    setApplyOrigin(origin);
    setApplyOpen(true);
    track("apply_start", { origin });
  }, []);

  const closeApply = useCallback(() => setApplyOpen(false), []);
  const showResumeNudge = useCallback(() => setResumeNudgeOpen(true), []);
  const hideResumeNudge = useCallback(() => setResumeNudgeOpen(false), []);

  const value = useMemo<SiteUi>(
    () => ({
      applyOpen,
      applyOrigin,
      openApply,
      closeApply,
      resumeNudgeOpen,
      showResumeNudge,
      hideResumeNudge,
    }),
    [
      applyOpen,
      applyOrigin,
      openApply,
      closeApply,
      resumeNudgeOpen,
      showResumeNudge,
      hideResumeNudge,
    ],
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
