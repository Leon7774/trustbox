import {
  KeyRoundIcon,
  LinkIcon,
  LucideSparkles,
  ShieldCheck,
  Sparkle,
  SparklesIcon,
  UserLock,
} from "lucide-react";
import HeroCard from "./HeroCard";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <div className="mt-4 text-center flex-col lg:flex-row flex gap-8 lg:px-40 lg:gap-20  mb-30">
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
          icon={<LinkIcon size={40} color="#50e0f9" />}
          description=" Real-time link scanning and suspicious pattern detection to neutralize phishing attempts and malicious redirects instantly."
          title="URL Safety Analyzer"
        ></HeroCard>
      </div>

      {/* Bottom Cards */}
      <div className="flex gap-10 lg:px-40 w-full">
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
          <Image
            src="/logo.svg"
            alt="TrustBox Decorative Logo"
            width={200}
            height={200}
            className="absolute bottom-5 right-5 w-40 h-40 opacity-20 brightness-0 invert"
          />
        </div>
        <div className="flex-1 flex-col flex text-background rounded-2xl p-10 bg-brand-primary relative overflow-hidden group">
          <div className="relative z-10">
            <SparklesIcon size={40} className="mb-5"></SparklesIcon>
            <h2 className="font-black text-xl">Personalized Guidance</h2>
            <p className="mt-2">
              Powered by our proprietary LLM, receiving actionable,
              hyper-personalized security recommendations tailored to your
              behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:px-40">
        <div className="w-full relative px-20 my-20 group rounded-4xl  overflow-hidden h-60 flex items-center justify-center bg-black/20 border border-white/5">
          <h2 className="text-4xl font-bold font-space-grotesk">
            Science-backed assessment methods
          </h2>
          <Image
            src="/abstract-bg-1.webp"
            alt="abstract-bg-footer"
            fill
            className="object-cover opacity-10 group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </div>
      <div className=" w-full py-80 flex items-center justify-center flex-col bg-black/20 gap-8 rounded-4xl">
        <h2 className="text-7xl font-black">
          Your Security is{" "}
          <span className="text-trust-blue">in your hands</span>.
        </h2>
        <Link href="#login-section">
          <Button className="w-64 h-16 text-xl gap-2" variant="default">
            Get Started Now <LucideSparkles size={20}></LucideSparkles>
          </Button>
        </Link>
      </div>
    </div>
  );
}
