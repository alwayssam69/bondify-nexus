
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
import { toast } from "sonner";

interface MultiInterestSelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
  error?: boolean;
}

const MultiInterestSelect = ({
  label,
  value,
  onChange,
  placeholder = "Select interests",
  className,
  maxSelections = 10,
  error,
}: MultiInterestSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (interestValue: string) => {
    if (value.includes(interestValue)) {
      onChange(value.filter(v => v !== interestValue));
    } else {
      if (value.length >= maxSelections) {
        toast.warning(`You can select a maximum of ${maxSelections} interests`);
        return;
      }
      onChange([...value, interestValue]);
    }
  };

  const removeInterest = (interestValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== interestValue));
  };

  const getInterestLabel = (interestValue: string) => {
    const interest = interestOptions.find(i => i.value === interestValue);
    return interest ? interest.label : interestValue;
  };

  const filteredOptions = searchQuery 
    ? interestOptions.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : interestOptions;

  // Group interests by category for better organization
  const groupedInterests = filteredOptions.reduce<Record<string, typeof filteredOptions>>(
    (groups, interest) => {
      const category = interest.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(interest);
      return groups;
    },
    {}
  );

  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between h-auto min-h-10",
                error && "border-red-500"
              )}
              onClick={() => setOpen(true)}
            >
              <div className="flex flex-wrap gap-1 py-1">
                {value.length > 0 ? (
                  value.map(interest => (
                    <Badge key={interest} variant="secondary" className="mr-1 mb-1">
                      {getInterestLabel(interest)}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={(e) => removeInterest(interest, e)}
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
          <PopoverContent className="w-full p-0 bg-white z-50">
            <Command>
              <CommandInput 
                placeholder="Search interests..." 
                className="h-9" 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>No interests found. Try a different search.</CommandEmpty>
              <div className="max-h-[300px] overflow-auto">
                {Object.entries(groupedInterests).map(([category, interests]) => (
                  <CommandGroup key={category} heading={category}>
                    {interests.map((interest) => (
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
                ))}
              </div>
              {value.length > 0 && (
                <div className="flex items-center justify-between p-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {value.length} of {maxSelections} selected
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      onChange([]);
                      setOpen(false);
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default MultiInterestSelect;
