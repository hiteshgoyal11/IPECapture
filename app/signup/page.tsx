"use client";

import Step2Credentials from "./components/step-2-credentials";
import React, { useState } from "react";
import Link from "next/link";
import StepIndicator from "./components/step-indicator";
import Step1NameDob from "./components/step-1-name-dob";
import { SignupFormData } from "./types";
import Step3CourseBranch from "./components/step-3-course-branch";

export default function SignupWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Master State for all 5 steps
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "B.Tech",
    branch: "CSE",
    username: "",
    avatarUrl: null,
  });

  const updateFormData = (newData: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 flex flex-col justify-between p-4 sm:p-8 transition-colors">
      
      {/* Header */}
      <header className="max-w-md mx-auto w-full pt-4">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={prevStep}
        />
      </header>

      {/* Main Wizard Card */}
      <main className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* STEP 1: Name & DOB */}
          {currentStep === 1 && (
            <Step1NameDob
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}

          {/* STEP 2: Email & Password */}
          {currentStep === 2 && (
            <Step2Credentials
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}

          {/* STEP 3: Course & Branch */}
          {currentStep === 3 && (
            <Step3CourseBranch
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}

          {/* Placeholder for remaining steps (4 & 5) */}
          {currentStep > 3 && (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm font-semibold">Step {currentStep} is ready for code.</p>
              <button
                type="button"
                onClick={prevStep}
                className="text-xs text-zinc-500 underline"
              >
                Go back
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Bottom Login Link */}
      <footer className="max-w-md mx-auto w-full pb-4 text-center">
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl p-4 text-center">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-semibold text-black dark:text-white hover:underline ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </footer>

    </div>
  );
}