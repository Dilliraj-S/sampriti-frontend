"use client";

interface StepInfo {
  id: number;
  label: string;
  subtitle: string;
}

interface StickyStepIndicatorProps {
  steps: StepInfo[];
  activeStep: number;
  isVisible: boolean;
}

export default function StickyStepIndicator({ steps, activeStep, isVisible }: StickyStepIndicatorProps) {
  const currentStep = steps[activeStep];
  const stepNumber = String(activeStep + 1).padStart(2, "0");

  if (!isVisible) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[9990] lg:hidden"
      style={{ top: "104px" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "rgba(247, 244, 240, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(164, 134, 98, 0.4)",
          boxShadow: "0 4px 24px rgba(43, 41, 37, 0.12)",
        }}
      >
        <span 
          className="text-xs font-medium" 
          style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}
        >
          {stepNumber}
        </span>
        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#A48662" }} />
        <span 
          className="text-xs font-medium" 
          style={{ color: "#2B2925", fontFamily: "var(--font-sans)" }}
        >
          {currentStep?.subtitle}
        </span>
      </div>
    </div>
  );
}
