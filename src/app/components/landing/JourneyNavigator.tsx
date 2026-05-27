"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepInfo {
  id: number;
  label: string;
  subtitle: string;
}

interface JourneyNavigatorProps {
  steps: StepInfo[];
  activeStep: number;
  onNavigate: (stepId: number) => void;
}

export default function JourneyNavigator({ steps, activeStep, onNavigate }: JourneyNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      setShowScrollLeft(el.scrollLeft > 20);
      setShowScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      const el = scrollRef.current;
      if (el) {
        setShowScrollRight(el.scrollWidth > el.clientWidth);
      }
    };

    setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const handleStepClick = (stepId: number) => {
    onNavigate(stepId);
    setIsOpen(false);
  };

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] lg:hidden"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(244, 241, 234, 0.9)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(164, 134, 98, 0.3)",
              boxShadow: "0 4px 24px rgba(43, 41, 37, 0.1)",
            }}
          >
            <span
              className="text-xs font-medium tracking-wider"
              style={{
                color: "rgb(43, 41, 37)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Journey
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "#A48662" }}
            >
              <path
                d="M12 5v14M12 19l5-5M12 19l-5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div
              className="flex items-center gap-1 p-1.5 rounded-full mb-3"
              style={{
                background: "rgba(43, 41, 37, 0.08)",
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/50"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(43, 41, 37)"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              className="relative px-4 py-3 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(244, 241, 234, 0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(164, 134, 98, 0.25)",
                boxShadow: "0 8px 32px rgba(43, 41, 37, 0.15)",
                maxWidth: "calc(100vw - 48px)",
              }}
            >
              {showScrollLeft && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-8 z-10 flex items-center pointer-events-none"
                  style={{
                    background: "linear-gradient(to right, rgba(244,241,234,0.95) 0%, transparent 100%)",
                  }}
                />
              )}
              {showScrollRight && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-8 z-10 flex items-center pointer-events-none"
                  style={{
                    background: "linear-gradient(to left, rgba(244,241,234,0.95) 0%, transparent 100%)",
                  }}
                />
              )}

              <div
                ref={scrollRef}
                className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
                style={{
                  maxWidth: "calc(100vw - 80px)",
                  scrollBehavior: "smooth",
                }}
              >
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const stepNumber = String(index + 1).padStart(2, "0");

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 flex-shrink-0"
                      style={{
                        background: isActive ? "rgba(164, 134, 98, 0.15)" : "transparent",
                        border: `1px solid ${isActive ? "#A48662" : "transparent"}`,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] tracking-wider"
                          style={{
                            color: isActive ? "#A48662" : "rgba(43, 41, 37, 0.4)",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {stepNumber}
                        </span>
                        <span
                          className="text-xs whitespace-nowrap"
                          style={{
                            color: isActive ? "rgb(43, 41, 37)" : "rgba(43, 41, 37, 0.6)",
                            fontFamily: "var(--font-sans)",
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {step.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}