import { LandingHeader } from "@/components/landing-header";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: July 02, 2024</p>

            <p>
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use the
              Service and tells You about Your privacy rights and how the law
              protects You.
            </p>

            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter">Interpretation and Definitions</h2>
                <h3 className="font-headline text-xl font-bold tracking-tighter">Interpretation</h3>
                <p>
                The words of which the initial letter is capitalized have meanings
                defined under the following conditions. The following definitions
                shall have the same meaning regardless of whether they appear in
                singular or in plural.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter">Collecting and Using Your Personal Data</h2>
                <h3 className="font-headline text-xl font-bold tracking-tighter">Types of Data Collected</h3>
                <h4 className="font-headline text-lg font-bold">Personal Data</h4>
                <p>
                While using Our Service, We may ask You to provide Us with certain
                personally identifiable information that can be used to contact or
                identify You. Personally identifiable information may include, but
                is not limited to: Email address, First name and last name, Usage Data.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter">Contact Us</h2>
                <p>
                If you have any questions about this Privacy Policy, You can
                contact us by email.
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
