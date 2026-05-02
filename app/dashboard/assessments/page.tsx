import { getAssessmentsAction } from "@/app/actions/assessment";
import {
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  LucideShieldQuestion,
  ShieldQuestion,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1");
  const pageSize = 10;

  const result = await getAssessmentsAction(page, pageSize);

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
        <p className="text-slate-400">{result.error}</p>
      </div>
    );
  }

  const { assessments, totalCount, totalPages } = result;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center border-b border-trust-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Assessment Logs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your security posture over time.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-trust-blue">{totalCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Total Assessments
          </div>
        </div>
      </div>

      <Card className="border-trust-border bg-trust-surface/30 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-trust-border bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-trust-border">
                {assessments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500 italic"
                    >
                      No assessments found. Start one today!
                    </td>
                  </tr>
                ) : (
                  assessments.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-200">
                          {formatDate(new Date(a.createdAt))}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatTime(new Date(a.createdAt))}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-white">
                          {a.totalScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge level={a.riskLevel as any} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/dashboard/tools/assessment/results/${a.id}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-trust-blue hover:bg-trust-blue/10 transition-all"
                          >
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <Link
            href={`/dashboard/assessments?page=${page - 1}`}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <Button variant="outline" size="sm" disabled={page <= 1}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
          </Link>
          <span className="text-sm text-slate-400">
            Page <span className="text-white font-medium">{page}</span> of{" "}
            {totalPages}
          </span>
          <Link
            href={`/dashboard/assessments?page=${page + 1}`}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            <Button variant="outline" size="sm" disabled={page >= totalPages}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function RiskBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  const configs = {
    Low: {
      color: "text-secondary border-secondary/20 bg-secondary/10",
      icon: ShieldCheck,
      text: "Low Risk",
    },
    Medium: {
      color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
      icon: ShieldQuestion,
      text: "Medium Risk",
    },
    High: {
      color: "text-destructive border-destructive/20 bg-destructive/10",
      icon: ShieldAlert,
      text: "High Risk",
    },
  };

  const config = configs[level] || configs.Medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}
