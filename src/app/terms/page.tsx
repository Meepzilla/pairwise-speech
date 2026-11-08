import { LandingHeader } from "@/components/landing-header";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: July 02, 2024</p>

            <p>
              Please read these terms and conditions carefully before using Our
              Service.
            </p>

            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter">Acknowledgment</h2>
                <p>
                These are the Terms and Conditions governing the use of this
                Service and the agreement that operates between You and the
                Company. These Terms and Conditions set out the rights and
                obligations of all users regarding the use of the Service.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter">Termination</h2>
                <p>
                We may terminate or suspend Your access immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if You breach these Terms and Conditions. Upon
                termination, Your right to use the Service will cease
                immediately.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter">Contact Us</h2>
                <p>
                If you have any questions about these Terms and Conditions, You
                can contact us by email.
                </p>
            </div>

          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 PairWise Speech. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
