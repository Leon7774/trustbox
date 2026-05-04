import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-white/10 pt-20 pb-10 px-8 lg:px-40">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-20">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo.svg"
              alt="TrustBox Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold font-space-grotesk text-white">TrustBox</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Advanced behavioral analysis and security parameter evaluation tailored to keep your digital identity safe. Backed by proprietary models and science-driven methodology.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-trust-blue/20 transition-colors text-white hover:text-trust-teal">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-trust-blue/20 transition-colors text-white hover:text-trust-teal">
              <Github size={18} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-trust-blue/20 transition-colors text-white hover:text-trust-teal">
              <Linkedin size={18} />
            </Link>
          </div>
        </div>

        <div className="flex gap-20">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white font-space-grotesk mb-2">Platform</h4>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Features</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Security Modules</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Pricing</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Enterprise</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white font-space-grotesk mb-2">Company</h4>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Contact</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-trust-teal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} TrustBox. All rights reserved.</p>
        <p>Built for a secure tomorrow.</p>
      </div>
    </footer>
  );
}
