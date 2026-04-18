import {
  KeyRoundIcon,
  LinkIcon,
  ShieldCheck,
  Sparkle,
  SparklesIcon,
  UserLock,
} from "lucide-react";
import HeroCard from "./HeroCard";
import Image from "next/image";

interface HeroSectionProps {
  propName?: string;
}

export default function HeroSection({ propName }: HeroSectionProps) {
  return (
    <div className=" flex flex-col items-center inset-x-0 bg-background min-h-128 w-full pt-40">
      <h2 className="text-lg text-brand-primary font-manrope ">
        ENGINE COMPONENTS
      </h2>
      <h1 className="font-space-grotesk font-bold text-4xl mb-16">
        Core Defense Modules
      </h1>

      {/* Cards */}
      <div className="mt-4 text-center flex-col lg:flex-row flex gap-8 lg:gap-20 px-10 lg:px-40 mb-30">
        <HeroCard
          icon={<UserLock size={40} color="#50e0f9" />}
          description="Deep psychological profiling based on HBM/PMT frameworks to identify risk-taking tendencies before they become liabilities."
          title="Behavioral Assessment"
        ></HeroCard>
        <HeroCard
          icon={<KeyRoundIcon size={40} color="#50e0f9" />}
          description="  Advanced analysis of length, entropy, and complex patterns to ensure your keys are as unbreakable as modern math allows."
          title="Password Strength Checker"
        ></HeroCard>
        <HeroCard
          icon={<LinkIcon />}
          description=" Real-time link scanning and suspicious pattern detection to neutralize phishing attempts and malicious redirects instantly."
          title="URL Safety Analyzer"
        ></HeroCard>
      </div>

      {/* Bottom Cards */}
      <div className="flex gap-10 w-full px-40 ">
        <div className="flex-2 bg-accent p-20 rounded-2xl relative">
          <h2 className="text-4xl text-left font-bold mb-8">
            The Personal Cyber Risk Score
          </h2>
          <div className="relative z-10">
            <p>
              We synthesize data from all defense modules to calculate your
              unique Risk Profile. It&apos;s not just a number; it&apos;s a
              roadmap to your digital invincibility.
            </p>
          </div>
          <div className="flex gap-4 mt-10 ">
            <div className="bg-brand-primary/20 text-brand-primary px-4 py-2 rounded-xl">
              Low
            </div>
            <div className="bg-background text-foreground/70 px-4 py-2 rounded-xl">
              Medium
            </div>
            <div className="bg-background text-foreground/70 px-4 py-2 rounded-xl">
              High
            </div>
          </div>
          <ShieldCheck
            size={200}
            color={"#46582e"}
            className="absolute bottom-5 right-5"
          />
        </div>
        <div className="flex-1 flex-col flex text-accent rounded-2xl p-10 bg-brand-primary">
          <SparklesIcon size={40} className="mb-5"></SparklesIcon>
          <h2 className="font-black text-xl">Personalized Guidance</h2>
          <p className="mt-2">
            Powered by our proprietary LLM, receiving actionable,
            hyper-personalized security recommendations tailored to your
            behavior.
          </p>
        </div>
        <Image height={40}  src="/abstract-bg-1.webp" alt="abstract bg"></Image>
      </div>
    </div>
  );
}
