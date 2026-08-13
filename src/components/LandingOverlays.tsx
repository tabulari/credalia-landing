'use client';

import dynamic from 'next/dynamic';

const StickyPaymentBar = dynamic(
  () => import('@/components/StickyPaymentBar').then((m) => ({ default: m.StickyPaymentBar })),
  { ssr: false },
);
const ApplyModal = dynamic(
  () => import('@/components/ApplyModal').then((m) => ({ default: m.ApplyModal })),
  { ssr: false },
);
const ResumeNudge = dynamic(
  () => import('@/components/ResumeNudge').then((m) => ({ default: m.ResumeNudge })),
  { ssr: false },
);

export function LandingOverlays() {
  return (
    <>
      <StickyPaymentBar />
      <ApplyModal />
      <ResumeNudge />
    </>
  );
}
