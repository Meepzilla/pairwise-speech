"use client";

import { useState } from "react";
import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Target,
  BrainCircuit,
  FileText,
  BookOpenCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: "Intelligent Target Generation",
    description:
      "Leverage state-of-the-art AI to generate targets based on specific phonological errors and intervention approaches.",
  },
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    title: "Multiple Therapy Approaches",
    description:
      "Supports Minimal Pairs, Maximal Pairs, Multiple Oppositions, and the Cycles Approach to fit your client's needs.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Streamlined Workflow",
    description:
      "A clean, intuitive interface designed by SLPs for SLPs. Reduce prep time and focus on what matters most: your clients.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Save & Manage Lists",
    description:
      "Keep track of generated target lists for each client, making it easy to review progress and plan future sessions.",
  },
];

const approaches = [
  {
    title: "Minimal Pairs",
    description:
      "Contrast word pairs that differ by a single sound to help children learn the semantic importance of correct phoneme production.",
    example:
      "For a child who substitutes /t/ for /k/ (fronting), a minimal pair would be 'tea' vs. 'key'. The only difference is the initial sound.",
    protocol: [
      "Familiarization: Show the child pictures of both words and name them. 'This is tea. This is a key.'",
      "Perceptual Training: Place both pictures on the table. Ask the child to 'Point to the key' or 'Give me the tea.'",
      "Production Practice: Encourage the child to say both words. If they say 'tea' for 'key,' provide feedback: 'You said tea, like something you drink. The one that opens a door is a key.'",
    ],
  },
  {
    title: "Maximal Pairs",
    description:
      "Use word pairs that differ by multiple features (place, manner, voicing) to facilitate greater generalization to the child's sound system.",
    example:
      "For a child who substitutes /t/ for many sounds, contrast /t/ with a maximally different sound they are missing, like /m/. A pair could be 'me' vs. 'key'.",
    protocol: [
      "Selection: Choose a target sound that is maximally different from the error sound.",
      "Contrastive Practice: Use the word pairs in activities. Focus on the child hearing and producing the different sounds.",
      "Generalization: The goal is for the child to learn the features of the target sound, which should generalize to other untaught sounds.",
    ],
  },
  {
    title: "Multiple Oppositions",
    description:
      "Simultaneously contrast a child's error sound with multiple target sounds, ideal for children who substitute one sound for many others.",
    example:
      "If a child uses /t/ for /s/, /k/, and /ch/, a set might be 'tip' vs. 'sip,' 'kip,' and 'chip.'",
    protocol: [
      "Target Selection: Identify the phoneme collapse and select up to four target sounds to contrast with the error.",
      "Familiarization: Introduce the characters/words for the error sound and the target sounds.",
      "Contrastive Production: The child is prompted to produce the target words, receiving feedback based on their production.",
    ],
  },
  {
    title: "Cycles Approach",
    description:
      "Target phonological patterns in a cyclical manner, designed for highly unintelligible children to gradually improve their speech.",
    example:
      "A child with Final Consonant Deletion might work on words ending in /p/ and /t/ for a few weeks (one cycle), then move to another pattern like S-clusters.",
    protocol: [
      "Pattern Identification: Identify the primary phonological patterns to target.",
      "Cycle Structure: Each pattern is targeted for a short period (e.g., 2-6 hours). Then, cycle to the next pattern, regardless of mastery.",
      "Session Structure: A typical session includes auditory bombardment, production practice with a small set of words, and home practice.",
    ],
  },
];

type Approach = (typeof approaches)[0];

export default function Home() {
  const [selectedApproach, setSelectedApproach] = useState<Approach | null>(
    null
  );

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <LandingHeader />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Smarter Speech Therapy Starts Here
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      PairWise Speech is the AI-powered assistant for Speech
                      Language Pathologists. Effortlessly generate therapy
                      targets for multiple evidence-based approaches in
                      seconds.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg">
                      <Link href="/dashboard">Get Started for Free</Link>
                    </Button>
                  </div>
                </div>
                <Image
                  src="https://placehold.co/800x450.png"
                  width="800"
                  height="450"
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                  data-ai-hint="speech therapy abstract"
                />
              </div>
            </div>
          </section>

          <section
            id="features"
            className="w-full bg-secondary py-12 md:py-24 lg:py-32"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    Core Features
                  </div>
                  <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                    Designed for Modern SLPs
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our features are carefully crafted to enhance your clinical
                    workflow, allowing you to deliver the highest quality
                    therapy with greater efficiency.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    {feature.icon}
                    <div className="grid gap-1">
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="approaches"
            className="w-full bg-background py-12 md:py-24 lg:py-32"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    Therapy Methods
                  </div>
                  <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                    Evidence-Based Approaches
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    PairWise Speech supports a variety of proven phonological
                    intervention approaches, giving you the flexibility to choose
                    the best fit for each client.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
                {approaches.map((approach, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedApproach(approach)}
                    className="grid gap-4 bg-card p-6 rounded-lg border text-left hover:border-primary hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-bold">{approach.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {approach.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-semibold mt-2">
                      <span>Learn More</span>
                      <BookOpenCheck className="ml-2 h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
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
      <Dialog
        open={selectedApproach !== null}
        onOpenChange={(open) => !open && setSelectedApproach(null)}
      >
        <DialogContent className="sm:max-w-xl">
          {selectedApproach && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedApproach.title}</DialogTitle>
                <DialogDescription className="pt-2">
                  {selectedApproach.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6 py-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Example</h4>
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                      {selectedApproach.example}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      Protocol Walkthrough
                    </h4>
                    <ul className="space-y-3">
                      {selectedApproach.protocol.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
