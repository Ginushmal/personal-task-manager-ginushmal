"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export default function BackButton({ className, label = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={`flex items-center gap-2 ${className}`}
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-10 w-10" />
      {label}
    </Button>
  );
}
