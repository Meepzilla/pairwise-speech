"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export function LandingHeader() {
  const [modalView, setModalView] = React.useState<"login" | "signup" | null>(
    null
  );

  const closeModal = () => setModalView(null);

  return (
    <>
      <header className="px-4 lg:px-6 h-20 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Logo />
        </Link>
        <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#approaches"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Approaches
          </Link>
          <Button variant="outline" onClick={() => setModalView("login")}>
            Login
          </Button>
          <Button onClick={() => setModalView("signup")}>Sign Up</Button>
        </nav>
        <div className="ml-auto lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="grid gap-4 p-4">
                <Logo />
                <Link
                  href="#features"
                  className="text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Features
                </Link>
                <Link
                  href="#approaches"
                  className="text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Approaches
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setModalView("login")}
                  className="w-full"
                >
                  Login
                </Button>
                <Button onClick={() => setModalView("signup")} className="w-full">
                  Sign Up
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <Dialog
        open={modalView !== null}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent className="sm:max-w-md">
          {modalView === "login" && (
            <>
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                  Enter your email below to login to your account.
                </DialogDescription>
              </DialogHeader>
              <LoginForm onSwitchToSignup={() => setModalView("signup")} />
            </>
          )}
          {modalView === "signup" && (
            <>
              <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>
                  Create an account to start generating speech targets.
                </DialogDescription>
              </DialogHeader>
              <SignupForm onSwitchToLogin={() => setModalView("login")} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
