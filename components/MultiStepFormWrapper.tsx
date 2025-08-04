"use client";

import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Step = {
  label: string;
  content: ReactNode;
  canProceed?: () => boolean | string;
};

interface MultiStepFormWrapperProps {
  steps: Step[];
  onSubmit: () => void;
  canSubmit?: () => boolean;
  isSubmitting?: boolean;
}

export function MultiStepFormWrapper({
  steps,
  onSubmit,
  canSubmit = () => true,
  isSubmitting = false,
}: MultiStepFormWrapperProps) {
  const [step, setStep] = useState(0);
  const total = steps.length;

  const nextStep = () => {
    const guard = steps[step].canProceed?.();
    if (guard === false) return;
    if (typeof guard === "string") {
      alert(guard);
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const canJumpTo = (target: number) => {
    if (target === step) return true;
    if (target < step) return true;
    for (let i = step; i < target; i++) {
      const guard = steps[i].canProceed?.();
      if (guard === false || typeof guard === "string") return false;
    }
    return true;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <nav className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto bg-amber-100">
        {steps.map((s, i) => {
          const active = i === step;
          const enabled = canJumpTo(i);
          return (
            <button
              key={s.label}
              onClick={() => enabled && setStep(i)}
              disabled={!enabled}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 relative 
                ${
                  active
                    ? "text-primary border-b-10 border-amber-500 bg-amber-300"
                    : enabled
                    ? "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                    : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }
              `}
            >
              {s.label}
              {enabled && !active && (
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      <Card className="shadow-lg dark:shadow-gray-800/50">
        <CardContent className="p-6 animate-fade-in">
          <div key={step} className="space-y-6">
            {steps[step].content}

            <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-6">
              {step > 0 ? (
                <Button 
                  type="button" 
                  variant="brand" 
                  onClick={prevStep}
                  className="gap-1"
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {step < total - 1 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="gap-1"
                  variant="brand"
                  disabled={isSubmitting}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isSubmitting && canSubmit()) {
                      onSubmit();
                    }
                  }}
                  disabled={!canSubmit() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : "Submit Order"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}