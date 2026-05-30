"use client";

import { useState, useEffect, useRef } from "react";

export interface Step {
  id: number;
  label: string;
  subtitle: string;
}

interface UseScrollTrackingOptions {
  steps: Step[];
  threshold?: number;
  rootMargin?: string;
}

export function useScrollTracking({ steps, threshold = 0.5, rootMargin = "-10% 0px -60% 0px" }: UseScrollTrackingOptions) {
  const [activeStep, setActiveStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const stepRefs = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    setIsReady(true);

    const handleObserve: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepId = Number(entry.target.getAttribute("data-step-id"));
          if (!isNaN(stepId)) {
            setActiveStep(stepId);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleObserve, {
      threshold,
      rootMargin,
    });

    stepRefs.current.forEach((el) => {
      if (observerRef.current && el) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [steps, threshold, rootMargin]);

  const registerStepRef = (id: number, el: HTMLElement | null) => {
    if (el) {
      stepRefs.current.set(id, el);
    }
  };

  const scrollToStep = (stepId: number) => {
    const el = stepRefs.current.get(stepId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return {
    activeStep,
    isReady,
    registerStepRef,
    scrollToStep,
  };
}