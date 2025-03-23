
import React, { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { interestOptions } from "@/data/formOptions";

interface MultiInterestSelectProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiInterestSelect = ({
  label,
  value,
  onChange,
  placeholder = "Select interests",
  className,
}: MultiInterestSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (interestValue: string) => {
    if (value.includes(interestValue)) {
      onChange(value.filter(v => v !== interestValue));
    } else {
      onChange([...value, interestValue]);
    }
  };

  const removeInterest = (interestValue: string) => {
    onChange(value.filter(v => v !== interestValue));
  };

  const getInterestLabel = (interestValue: string) => {
    const interest = interestOptions.find(i => i.value === interestValue);
    return interest ? interest.label : interestValue;
  };

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-10"
            >
              <div className="flex flex-wrap gap-1 py-1">
                {value.length > 0 ? (
                  value.map(interest => (
                    <Badge key={interest} variant="secondary" className="mr-1 mb-1">
                      {getInterestLabel(interest)}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeInterest(interest);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search interests..." className="h-9" />
              <CommandEmpty>No interests found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {interestOptions.map((interest) => (
                  <CommandItem
                    key={interest.value}
                    onSelect={() => handleSelect(interest.value)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value.includes(interest.value) ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}>
                      {value.includes(interest.value) && <Check className="h-3 w-3" />}
                    </div>
                    <span>{interest.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default MultiInterestSelect;
