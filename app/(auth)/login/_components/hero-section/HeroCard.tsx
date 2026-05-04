import { Icon, KeyRoundIcon, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, ReactElement, RefAttributes } from "react";

interface MiddleCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export default function HeroCard({
  icon,
  title,
  description,
}: MiddleCardProps) {
  return (
    <div className="flex flex-col items-start bg-accent/50 p-10 hover:ring-2 hover:ring-brand-primary rounded-2xl transition-all duration-300">
      <div className="w-16 h-16 flex items-center justify-center bg-[#182e31] rounded-lg mb-10">
        {icon}
      </div>
      <h2 className="text-2xl text-left font-bold mb-8">{title}</h2>
      <p className="font-sans text-left">{description}</p>
    </div>
  );
}
