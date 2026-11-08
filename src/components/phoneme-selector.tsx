"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type PhonemeOption = Record<"value" | "label", string>;

interface PhonemeSelectorProps {
  options: PhonemeOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function PhonemeSelector({
  options,
  value,
  onChange,
  className,
}: PhonemeSelectorProps) {
  const handleSelect = (selectedValue: string) => {
    const newSelection = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newSelection);
  };

  return (
    <div className={cn("grid grid-cols-5 gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value.includes(option.value) ? "default" : "outline"}
          onClick={() => handleSelect(option.value)}
          className="aspect-square h-auto w-full p-1 text-center"
          type="button"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.value}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
