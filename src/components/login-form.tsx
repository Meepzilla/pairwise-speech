"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  className?: string;
}

export function LoginForm({ onSwitchToSignup, className }: LoginFormProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email-login">Email</Label>
        <Input
          id="email-login"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password-login">Password</Label>
          <Link href="#" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input id="password-login" type="password" required />
      </div>
      <Button type="submit" className="w-full" asChild>
        <Link href="/dashboard">Login</Link>
      </Button>
      <Button variant="outline" className="w-full" disabled>
        Login with Google
      </Button>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        {onSwitchToSignup ? (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto"
            onClick={onSwitchToSignup}
          >
            Sign up
          </Button>
        ) : (
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        )}
      </div>
    </div>
  );
}
