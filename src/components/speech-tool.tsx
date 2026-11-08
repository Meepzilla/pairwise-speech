
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrainCircuit } from "lucide-react";
import { PhonemeSelector } from "./phoneme-selector";

const phonologicalErrors = [
    { value: "Final Consonant Deletion", label: "Final Consonant Deletion (e.g., 'ca' for 'cat')" },
    { value: "Fronting of Velars (t/k, d/g)", label: "Fronting (e.g., 'tea' for 'key')" },
    { value: "Stopping of Fricatives (p/f, t/s)", label: "Stopping (e.g., 'pan' for 'fan')" },
    { value: "Gliding of Liquids (w/r, w/l)", label: "Gliding (e.g., 'wabbit' for 'rabbit')" },
    { value: "Cluster Reduction (s-blends)", label: "Cluster Reduction (e.g., 'pot' for 'spot')" },
    { value: "Voicing/Devoicing (b/p, d/t, g/k)", label: "Voicing/Devoicing (e.g., 'pig' for 'big')" },
    { value: "Weak Syllable Deletion", label: "Weak Syllable Deletion (e.g., 'nana' for 'banana')" },
    { value: "Reduplication", label: "Reduplication (e.g., 'wawa' for 'water')" },
    { value: "Backing", label: "Backing (e.g., 'gog' for 'dog')" },
    { value: "Phoneme Collapse of /t/ for /k, s, ch, sh/", label: "Phoneme Collapse (t/k, s, ch, sh)" },
    { value: "custom", label: "Custom Phoneme Substitution..." },
];

const phonemes = [
    { value: "/p/", label: "p" },
    { value: "/b/", label: "b" },
    { value: "/m/", label: "m" },
    { value: "/w/", label: "w" },
    { value: "/f/", label: "f" },
    { value: "/v/", label: "v" },
    { value: "/θ/", label: "th (voiceless)" },
    { value: "/ð/", label: "th (voiced)" },
    { value: "/t/", label: "t" },
    { value: "/d/", label: "d" },
    { value: "/s/", label: "s" },
    { value: "/z/", label: "z" },
    { value: "/n/", label: "n" },
    { value: "/l/", label: "l" },
    { value: "/ʃ/", label: "sh" },
    { value: "/ʒ/", label: "zh" },
    { value: "/tʃ/", label: "ch" },
    { value: "/dʒ/", label: "j" },
    { value: "/j/", label: "y" },
    { value: "/r/", label: "r" },
    { value: "/k/", label: "k" },
    { value: "/g/", label: "g" },
    { value: "/ŋ/", label: "ng" },
    { value: "/h/", label: "h" },
];

const syllableOptions = [
    { value: "any", label: "Any" },
    { value: "one syllable", label: "One Syllable" },
    { value: "two syllables", label: "Two Syllables" },
    { value: "multi-syllable", label: "Multi-syllable" },
];

const positionOptions = [
    { value: "any", label: "Any Position" },
    { value: "initial", label: "Initial" },
    { value: "medial", label: "Medial" },
    { value: "final", label: "Final" },
];

const cycleStages = [
    { value: "primary", label: "Primary Patterns" },
    { value: "secondary", label: "Secondary Patterns" },
    { value: "advanced", label: "Advanced Patterns" },
];


const formSchema = z.object({
  phonologicalError: z.string({
    required_error: "Please select a phonological error.",
  }),
  generationType: z.enum(["minimal", "maximal", "multiple", "cycles", "complexity"], {
    required_error: "You need to select a generation type.",
  }),
  cycleStage: z.string().optional(),
  syllableLength: z.string().optional(),
  phonemePosition: z.string().optional(),
  targetPhoneme: z.string().optional(),
  errorPhoneme: z.string().optional(),
  stimulableSounds: z.array(z.string()).optional(),
  phoneticInventory: z.array(z.string()).optional(),
})
.refine(
  (data) => {
    if (data.phonologicalError === "custom") {
      return !!data.targetPhoneme;
    }
    return true;
  },
  {
    message: "Target phoneme is required.",
    path: ["targetPhoneme"],
  }
)
.refine(
  (data) => {
    if (data.phonologicalError === "custom") {
      return !!data.errorPhoneme;
    }
    return true;
  },
  {
    message: "Error phoneme is required.",
    path: ["errorPhoneme"],
  }
)
.refine(
    (data) => {
        if (data.phonologicalError === "custom" && data.targetPhoneme && data.errorPhoneme) {
            return data.targetPhoneme !== data.errorPhoneme;
        }
        return true;
    },
    {
        message: "Target and error phonemes cannot be the same.",
        path: ["errorPhoneme"],
    }
);


type FormValues = z.infer<typeof formSchema>;

export function SpeechTool() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phonologicalError: "",
      generationType: "minimal",
      syllableLength: "any",
      phonemePosition: "any",
      cycleStage: "primary",
      targetPhoneme: "",
      errorPhoneme: "",
      phoneticInventory: [],
      stimulableSounds: [],
    },
  });

  const selectedErrorType = form.watch("phonologicalError");
  const selectedGenerationType = form.watch("generationType");

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Target Generator</CardTitle>
            <CardDescription>
              Select a phonological error to generate therapy targets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="phonologicalError"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phonological Error or Process</FormLabel>
                      <Select
                        onValueChange={(value) => {
                            field.onChange(value)
                            form.setValue("targetPhoneme", "");
                            form.setValue("errorPhoneme", "");
                            form.clearErrors(["targetPhoneme", "errorPhoneme"]);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an error or process" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {phonologicalErrors.map((error) => (
                            <SelectItem key={error.value} value={error.value}>
                              {error.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedErrorType === 'custom' && (
                    <div className="space-y-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                        <FormField
                            control={form.control}
                            name="targetPhoneme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Phoneme (Correct Sound)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select target phoneme" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {phonemes.map((p) => (
                                                <SelectItem key={p.value} value={p.value} disabled={p.value === form.getValues("errorPhoneme")}>
                                                    {p.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="errorPhoneme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Error Phoneme (Substituted Sound)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select error phoneme" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {phonemes.map((p) => (
                                                <SelectItem key={p.value} value={p.value} disabled={p.value === form.getValues("targetPhoneme")}>
                                                    {p.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <FormField
                  control={form.control}
                  name="syllableLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Syllable Length</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select syllable length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {syllableOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phonemePosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phoneme Position</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phoneme position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Therapy Approach</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="minimal" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Minimal Pairs
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="maximal" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Maximal Pairs
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="multiple" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Multiple Oppositions
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cycles" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cycles Approach
                            </FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="complexity" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Complexity Approach
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedGenerationType === 'cycles' && (
                  <FormField
                    control={form.control}
                    name="cycleStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cycle Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cycle stage" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {cycleStages.map((stage) => (
                                    <SelectItem key={stage.value} value={stage.value}>
                                        {stage.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Select the developmental stage of patterns to target.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <span className="text-sm font-medium hover:no-underline">
                        Advanced Options (Optional)
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        <FormField
                          control={form.control}
                          name="phoneticInventory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phonetic Inventory</FormLabel>
                                <PhonemeSelector
                                  options={phonemes}
                                  value={field.value ?? []}
                                  onChange={field.onChange}
                                />
                              <FormDescription>
                                Sounds the child can produce spontaneously.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="stimulableSounds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stimulable Sounds</FormLabel>
                                <PhonemeSelector
                                  options={phonemes}
                                  value={field.value ?? []}
                                  onChange={field.onChange}
                                />
                              <FormDescription>
                                Sounds the child can produce with prompting.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>


                <Button type="submit" disabled className="w-full">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Generate Targets
                </Button>
                <p className="text-sm text-muted-foreground">
                  Target generation is turned off. The generator has been removed, so this form no longer creates target lists.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Generated Targets</CardTitle>
            <CardDescription>
              Target generation is turned off.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-secondary/50 border-2 border-dashed rounded-lg">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Target Generation Is Turned Off</h3>
              <p className="mt-2 text-muted-foreground">
                The target generator has been removed. The form on the left still holds your selections, but no target list will be generated.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
