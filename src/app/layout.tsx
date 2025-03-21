import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientStateCreator from "@/components/ClientStateCreator";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Flow - Glide Through Tasks!",
  description: "Organize, prioritize, and complete tasks effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ClientStateCreator />
      <html lang="en">
        <body className={inter.className}>
          <header className="flex justify-between items-center p-4 h-16 border-b shadow-md">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/TaskFlowLogo.png"
                  alt="Task Flow Logo"
                  width={200}
                  height={100}
                  className="h-20 p-3 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
