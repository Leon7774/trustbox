import { Button } from "@/components/ui/button";
import {
  BotIcon,
  KeyIcon,
  LayoutDashboard,
  LinkIcon,
  List,
  LucideProps,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type NavButton = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const items: NavButton[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Trustie AI Advice", href: "/dashboard/trustie", icon: BotIcon },
  {
    name: "Risk Assessment",
    href: "/dashboard/tools/assessment",
    icon: ShieldCheck,
  },
  {
    name: "Password Strength",
    href: "/dashboard/tools/password",
    icon: KeyIcon,
  },
  { name: "URL Analyzer", href: "/dashboard/tools/url", icon: LinkIcon },
  {
    name: "Assessment Log",
    href: "/dashboard/assessments",
    icon: List,
  },
];

export default function NavButtons() {
  const pathname = usePathname();

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/dashboard");

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300`}
            >
              <Button
                className="w-80 gap-2 justify-start"
                variant={isActive ? "default" : "ghost"}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : ""}`} />
                {item.name}
              </Button>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
