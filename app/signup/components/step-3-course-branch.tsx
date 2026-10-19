import React, { useState } from "react";
import { ChevronDown, Check} from "lucide-react";

interface Step3Props {
  formData: {
    course: string;
    branch: string;
  };
  updateFormData: (data: Partial<{ course: string; branch: string }>) => void;
  onNext: () => void;
}

const COURSES = [
  "B.Tech",
  "BCA",
  "BBA",
  "MCA",
  "MBA",
  "M.Tech",
  "Others",
];

const BTECH_BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Electronics & Communication (ECE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering",
  "Artificial Intelligence & ML (AIML)",
  "Data Science",
];

const MTECH_BRANCHES = [
  "Computer Science",
  "VLSI Design",
  "Thermal Engineering",
];

export default function Step3CourseBranch({ formData, updateFormData, onNext }: Step3Props) {
    const [isCourseOpen, setIsCourseOpen] = useState(false);
    const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState(() => {
    if (COURSES.includes(formData.course)) return formData.course;
    return formData.course ? "Others" : "B.Tech";
  });
  const [customCourse, setCustomCourse] = useState(() => {
    return COURSES.includes(formData.course) ? "" : formData.course;
  });
  const [error, setError] = useState("");

  const hasBranches = selectedDropdown === "B.Tech" || selectedDropdown === "M.Tech";
  const isOther = selectedDropdown === "Others";

  const handleDropdownChange = (value: string) => {
    setSelectedDropdown(value);
    setError("");

    if (value === "Others") {
      updateFormData({ course: customCourse || "", branch: "" });
    } else {
      let defaultBranch = "";
      if (value === "B.Tech") defaultBranch = BTECH_BRANCHES[0];
      else if (value === "M.Tech") defaultBranch = MTECH_BRANCHES[0];

      updateFormData({
        course: value,
        branch: defaultBranch,
      });
    }
  };

  const handleCustomCourseChange = (val: string) => {
    setCustomCourse(val);
    updateFormData({ course: val, branch: "" });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOther && !customCourse.trim()) {
      setError("Please specify your course name.");
      return;
    }

    if (!formData.course) {
      setError("Please select your course.");
      return;
    }

    if (hasBranches && !formData.branch) {
      setError("Please select your branch.");
      return;
    }

    setError("");
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          What are you studying?
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Select your course and department at IPEC.
        </p>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Sleek Custom Course Dropdown (No Blue Highlight) */}
      <div className="relative">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
          Select Course / Program
        </label>
        
        <button
          type="button"
          onClick={() => {
            setIsCourseOpen(!isCourseOpen);
            setIsBranchOpen(false);
          }}
          className="w-full flex items-center justify-between text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
        >
          <span className="font-medium">{selectedDropdown}</span>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isCourseOpen ? "rotate-180" : ""}`} />
        </button>

        {isCourseOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {COURSES.map((course) => (
              <div
                key={course}
                onClick={() => {
                  handleDropdownChange(course);
                  setIsCourseOpen(false);
                }}
                className={`px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-colors ${
                  selectedDropdown === course
                    ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
              >
                <span>{course}</span>
                {selectedDropdown === course && <Check className="w-3.5 h-3.5 text-black dark:text-white" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input for "Others" Course */}
      {isOther && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
            Specify Your Course
          </label>
          <input
            type="text"
            required
            value={customCourse}
            onChange={(e) => handleCustomCourseChange(e.target.value)}
            placeholder="e.g. Diploma in CS, B.Com, B.Sc"
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
          />
        </div>
      )}

      {/* Sleek Custom Branch Dropdown (B.Tech / M.Tech only) */}
      {hasBranches && (
        <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
            Select Branch / Stream
          </label>

          <button
            type="button"
            onClick={() => {
              setIsBranchOpen(!isBranchOpen);
              setIsCourseOpen(false);
            }}
            className="w-full flex items-center justify-between text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition text-left"
          >
            <span className="font-medium truncate pr-2">{formData.branch}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isBranchOpen ? "rotate-180" : ""}`} />
          </button>

          {isBranchOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl z-50 py-1.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              {(selectedDropdown === "B.Tech" ? BTECH_BRANCHES : MTECH_BRANCHES).map((branch) => (
                <div
                  key={branch}
                  onClick={() => {
                    updateFormData({ branch });
                    setIsBranchOpen(false);
                  }}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    formData.branch === branch
                      ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-100"
                  }`}
                >
                  <span className="truncate pr-2">{branch}</span>
                  {formData.branch === branch && <Check className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        type="submit"
        className="w-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.99] transition shadow-md mt-2"
      >
        Next
      </button>
    </form>
  );
}