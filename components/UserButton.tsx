"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/authActions";

interface Assessment {
  id: number;
  totalScore: number;
  riskLevel: string;
  createdAt: string | Date;
}

interface UserButtonProps {
  email: string;
  pastAssessments: Assessment[];
}

export function UserButton({ email, pastAssessments }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-trust-surface border border-transparent hover:border-trust-border transition-all cursor-pointer"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{email}</span>
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-trust-border bg-[#0B0F19] backdrop-blur-md shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-trust-border/50">
            <p className="text-sm font-medium text-white">Signed in as</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>

          <div className="py-2">
            <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Past Assessments
            </h3>
            {pastAssessments.length === 0 ? (
              <div className="px-4 py-2 text-sm text-slate-400">
                No assessments yet.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {pastAssessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/tools/assessment/results/${assessment.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 font-medium">
                          <FileText className="w-3.5 h-3.5 text-trust-blue" />
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            assessment.riskLevel === "Low"
                              ? "bg-green-500/10 text-green-400"
                              : assessment.riskLevel === "Medium"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          Risk: {assessment.riskLevel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 pl-5">
                        Score: {assessment.totalScore}/300
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-trust-border/50 mt-1 pt-2">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
