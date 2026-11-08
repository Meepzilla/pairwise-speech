"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
  className?: string;
}

export function SignupForm({ onSwitchToLogin, className }: SignupFormProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="full-name-signup">Full Name</Label>
        <Input id="full-name-signup" placeholder="Max" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input id="password-signup" type="password" />
      </div>
      <Button type="submit" className="w-full" asChild>
        <Link href="/dashboard">Create an account</Link>
      </Button>
      <Button variant="outline" className="w-full" disabled>
        Sign up with Google
      </Button>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        {onSwitchToLogin ? (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto"
            onClick={onSwitchToLogin}
          >
            Login
          </Button>
        ) : (
          <Link href="/login" className="underline">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
