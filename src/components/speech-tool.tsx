
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  generateMinimalPairTargets,
  type MinimalPairOutput
} from "@/ai/flows/generate-minimal-pairs";
import {
  generateMaximalPairTargets,
  type GenerateMaximalPairTargetsOutput
} from "@/ai/flows/generate-maximal-pairs";
import {
  generateMultipleOppositions,
  type GenerateMultipleOppositionsOutput
} from "@/ai/flows/generate-multiple-oppositions";
import {
  generateCyclesTargets,
  type GenerateCyclesTargetsOutput,
} from "@/ai/flows/generate-cycles-targets";
import {
  generateComplexityTargets,
  type GenerateComplexityTargetsOutput
} from "@/ai/flows/generate-complexity-targets";
import {
    calculateSonorityDifference,
    type CalculateSonorityDifferenceOutput
} from "@/ai/flows/calculate-sonority-difference";
import {
    transcribeToIpa
} from "@/ai/flows/transcribe-to-ipa";


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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Copy, Save, Plus, Minus, Info } from "lucide-react";
import { PhonemeSelector } from "./phoneme-selector";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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
type ResultType = "minimal" | "maximal" | "multiple" | "cycles" | "complexity" | null;
type ResultData = MinimalPairOutput | GenerateMaximalPairTargetsOutput | GenerateMultipleOppositionsOutput | GenerateCyclesTargetsOutput | GenerateComplexityTargetsOutput;

type ResultItem = {
    text: string;
    rationale: string;
    sonority?: CalculateSonorityDifferenceOutput;
    ipa?: string;
}

export function SpeechTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [resultType, setResultType] = useState<ResultType>(null);
  const [resultItems, setResultItems] = useState<ResultItem[]>([]);
  const [trialCounts, setTrialCounts] = useState<{ [key: string]: number }>({});
  const [showIpa, setShowIpa] = useState(false);
  const [ipaCache, setIpaCache] = useState<Record<string, string>>({});
  const { toast } = useToast();

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

  const initializeTrialCounts = (targets: ResultItem[]) => {
    const initialCounts = targets.reduce((acc, target) => {
        acc[target.text] = 0;
        return acc;
    }, {} as { [key: string]: number });
    setTrialCounts(initialCounts);
  };

  const handleTrialCountChange = (target: string, delta: number) => {
    setTrialCounts(prevCounts => ({
        ...prevCounts,
        [target]: Math.max(0, (prevCounts[target] || 0) + delta)
    }));
  };

  const getRawResultItems = (data: ResultData, type: ResultType): Omit<ResultItem, 'sonority'>[] => {
    if (!data) return [];
    
    switch (type) {
        case "minimal":
            return (data as MinimalPairOutput).minimalPairTargets.map(t => ({ text: t.pair, rationale: t.rationale }));
        case "maximal":
            return (data as GenerateMaximalPairTargetsOutput).maximalPairs.map(t => ({ text: t.pair, rationale: t.rationale }));
        case "multiple":
            return (data as GenerateMultipleOppositionsOutput).multipleOppositions.map(t => ({ text: t.set, rationale: t.rationale }));
        case "cycles":
            return (data as GenerateCyclesTargetsOutput).targetWords.map(t => ({ text: t.word, rationale: t.rationale }));
        case "complexity":
            return (data as GenerateComplexityTargetsOutput).complexityPairs.map(t => ({ text: t.pair, rationale: t.rationale }));
        default:
            return [];
    }
  };

  const getIpaForText = async (text: string) => {
    if (ipaCache[text]) {
        return ipaCache[text];
    }
    const words = text.split(/ - | /).map(w => w.trim().replace(/[^a-zA-Z]/g, ''));
    const ipaPromises = words.map(word => transcribeToIpa(word));
    try {
      const ipaResults = await Promise.all(ipaPromises);
      const ipaString = text.split(' - ').map((_, i) => ipaResults[i] || words[i]).join(' - ');
      setIpaCache(prev => ({...prev, [text]: ipaString}));
      return ipaString;
    } catch(e) {
      console.error("Could not transcribe", text, e);
      return text;
    }
  };


  const processResults = async (data: ResultData, type: ResultType) => {
    const rawItems = getRawResultItems(data, type);
    initializeTrialCounts(rawItems);
    
    const itemsWithDetails = await Promise.all(
        rawItems.map(async (item) => {
            const newItem: ResultItem = {...item};
            if (type !== 'cycles' && type !== 'multiple' && item.text.includes('-')) {
                const [word1, word2] = item.text.split('-').map(w => w.trim());
                try {
                    newItem.sonority = await calculateSonorityDifference({ word1, word2 });
                } catch (e) {
                    console.error("Could not calculate sonority for", item.text, e);
                }
            }
            try {
                newItem.ipa = await getIpaForText(item.text);
            } catch (e) {
                console.error("Could not get IPA for", item.text, e);
            }
            return newItem;
        })
    );
    setResultItems(itemsWithDetails);
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    setResultItems([]);
    const currentGenerationType = data.generationType;
    setResultType(currentGenerationType);
    setTrialCounts({});
    setShowIpa(false);

    const submissionData: any = {
        phonologicalError: data.phonologicalError,
        stimulableSounds: data.stimulableSounds,
        phoneticInventory: data.phoneticInventory,
        syllableLength: data.syllableLength === 'any' ? undefined : data.syllableLength,
        phonemePosition: data.phonemePosition === 'any' ? undefined : data.phonemePosition,
    };

    if (data.phonologicalError === 'custom' && data.targetPhoneme && data.errorPhoneme) {
        submissionData.phonologicalError = `Substitution of ${data.errorPhoneme} for ${data.targetPhoneme}`;
    }

    if (currentGenerationType === 'cycles') {
        submissionData.cycleStage = data.cycleStage;
    }

    try {
      let response: ResultData | null = null;
      if (currentGenerationType === "minimal") {
        response = await generateMinimalPairTargets(submissionData);
      } else if (currentGenerationType === "maximal") {
        response = await generateMaximalPairTargets(submissionData);
      } else if (currentGenerationType === "multiple") {
        response = await generateMultipleOppositions(submissionData);
      } else if (currentGenerationType === "cycles") {
        response = await generateCyclesTargets(submissionData);
      } else if (currentGenerationType === "complexity") {
        response = await generateComplexityTargets(submissionData);
      }
      setResult(response);
      if (response) {
        await processResults(response, currentGenerationType);
      }
    } catch (error) {
      console.error("Error generating targets:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          "There was an error generating the targets. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    let textToCopy = "";
    if (resultType === 'cycles' && result) {
        const cyclesResult = result as GenerateCyclesTargetsOutput;
        const wordsText = (resultItems).map(w => `${w.text} ${showIpa && w.ipa ? `(${w.ipa})` : ''} - Rationale: ${w.rationale}`).join("\n");
        textToCopy = `Cycles Approach Target List\n\nTarget Pattern: ${cyclesResult.primaryProcess}\nTarget Phoneme/Structure: ${cyclesResult.targetPhoneme}\n\nTarget Words:\n${wordsText}`;
    } else {
        textToCopy = resultItems.map(item => `${item.text} ${showIpa && item.ipa ? `(${item.ipa})` : ''} - Rationale: ${item.rationale}`).join("\n");
    }
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to Clipboard",
      description: "The target list has been copied.",
    });
  }

  const getResultTitle = () => {
    if (!resultType) return "Generated Targets";
    switch (resultType) {
      case "minimal":
        return "Minimal Pair Targets";
      case "maximal":
        return "Maximal Pair Targets";
      case "multiple":
        return "Multiple Opposition Sets";
      case "cycles":
        return "Cycles Approach Targets";
      case "complexity":
        return "Complexity Approach Targets";
      default:
        return "Generated Targets";
    }
  };

  const getResultDescription = () => {
    if (isLoading || !result) return "Your generated targets will appear here.";
    if (resultItems.length > 0) {
        const resultTypeName = resultType === 'multiple' ? 'opposition sets' : resultType === 'cycles' ? 'words' : 'pairs';
        return `Generated ${resultItems.length} ${resultTypeName}.`;
    }
    return "Your generated targets will appear here.";
}

const renderResultItem = (item: ResultItem, index: number) => (
    <div key={index} className="flex flex-col gap-2 p-3 bg-secondary rounded-lg">
        <div className="flex items-start justify-between">
            <div className="flex-grow space-y-1">
                <div className="text-center font-medium text-secondary-foreground text-lg">
                    {showIpa ? (item.ipa || item.text) : item.text}
                </div>
                {item.sonority && item.sonority.difference !== null && (
                    <div className="text-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Badge variant="outline" className="cursor-help">
                                    Sonority Diff: {item.sonority.difference}
                                </Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Sonority Calculation</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.sonority.rationale}
                                        </p>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 flex-shrink-0">
                        <Info className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Rationale</h4>
                            <p className="text-sm text-muted-foreground">
                                {item.rationale}
                            </p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleTrialCountChange(item.text, -1)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold w-8 text-center">{trialCounts[item.text] || 0}</span>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleTrialCountChange(item.text, 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );


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
                onSubmit={form.handleSubmit(onSubmit)}
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


                <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full">
                  {isLoading ? (
                    "Generating..."
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      Generate Targets
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex-grow">
              <CardTitle>{getResultTitle()}</CardTitle>
              <CardDescription>
                {getResultDescription()}
              </CardDescription>
            </div>
            {result && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="ipa-mode" checked={showIpa} onCheckedChange={setShowIpa} />
                        <Label htmlFor="ipa-mode">Show IPA</Label>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <Copy className="mr-2 h-4 w-4"/>
                            Copy
                        </Button>
                        <Button variant="default" size="sm" disabled>
                            <Save className="mr-2 h-4 w-4"/>
                            Save List
                        </Button>
                    </div>
                </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {!isLoading && result && resultType !== 'cycles' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resultItems.map(renderResultItem)}
              </div>
            )}
            {!isLoading && resultType === 'cycles' && result && (
              <div className="space-y-6">
                  <div>
                      <h4 className="font-semibold text-lg">Target Pattern</h4>
                      <p className="text-muted-foreground">{(result as GenerateCyclesTargetsOutput).primaryProcess}</p>
                  </div>
                  <div>
                      <h4 className="font-semibold text-lg">Target Phoneme/Structure</h4>
                      <p className="text-muted-foreground">{(result as GenerateCyclesTargetsOutput).targetPhoneme}</p>
                  </div>
                  <div>
                      <h4 className="font-semibold text-lg">Target Words</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {resultItems.map(renderResultItem)}
                      </div>
                  </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-secondary/50 border-2 border-dashed rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Your Targets Await</h3>
                <p className="mt-2 text-muted-foreground">
                  Select your options on the left and click "Generate Targets" to begin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
