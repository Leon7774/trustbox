import Link from "next/link";
import { UserButton } from "@/components/UserButton";
import Image from "next/image";
import { getAuthUser } from "@/lib/auth";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();

  return (
    <>
      <header className="inset-x-0 h-16 border-b border-trust-border backdrop-blur-md bg-trust-dark/50 flex items-center justify-center sticky top-0 z-50">
        <div className="w-full px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              className="w-10"
              alt="TrustBox Logo"
              width={100}
              height={40}
            />
            <Image
              src="/name.svg"
              className="w-40 fill-white"
              alt="TrustBox Name"
              width={100}
              height={40}
            />
          </Link>

          <div className="flex items-center gap-4">
            {authUser ? (
              <UserButton
                email={authUser.name || authUser.email || "User"}
                pastAssessments={[]}
              />
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-trust-blue hover:bg-trust-blue/90 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
