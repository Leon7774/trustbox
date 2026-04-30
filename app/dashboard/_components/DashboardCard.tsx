import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import Link from "next/link";

export type DashboardCardProps = {
  href: string;
  title: string;
  description: string;
  callToAction: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export default function DashboardCard({
  title,
  description,
  callToAction,
  href,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-trust-surface border border-trust-border backdrop-blur-xl shadow-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)] hover:border-trust-blue/50"
    >
      <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
        <Icon className="w-64 h-64 text-trust-blue transform rotate-12" />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-trust-blue/20 to-trust-blue/5 border border-trust-blue/20 flex items-center justify-center text-trust-blue mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-white tracking-tight">
          {title}
        </h2>
        <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto flex items-center text-trust-blue font-medium text-sm">
          <span className="group-hover:mr-2 transition-all">
            {callToAction}
          </span>
          <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
