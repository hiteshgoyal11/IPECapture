import React from "react";
import { ArrowLeft } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  onBack,
}: StepIndicatorProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-3 pb-4">
      <div className="flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <span className="text-xs font-mono text-zinc-400">IPECapture</span>
        )}
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}