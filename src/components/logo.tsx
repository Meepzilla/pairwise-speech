import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="https://placehold.co/32x32.png"
        width={32}
        height={32}
        alt="PairWise Speech Logo"
        data-ai-hint="logo abstract"
      />
      <span className="font-headline text-xl font-bold">PairWise Speech</span>
    </div>
  );
}
