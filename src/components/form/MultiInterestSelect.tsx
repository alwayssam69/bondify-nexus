
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { interestOptions } from "@/data/formOptions";

interface MultiInterestSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  maxSelections?: number;
}

const MultiInterestSelect: React.FC<MultiInterestSelectProps> = ({
  value = [],
  onChange,
  placeholder = "Select interests",
  label,
  error = false,
  maxSelections,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Group interests by category - in this case, all in one category since
  // the current data structure doesn't have categories
  const groupedInterests = {
    "General": interestOptions
  };

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      // If already selected, remove it
      onChange(value.filter((item) => item !== selectedValue));
    } else if (maxSelections && value.length >= maxSelections) {
      // If max selections reached, don't add
      return;
    } else {
      // Add the value
      onChange([...value, selectedValue]);
    }
  };

  const removeItem = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Get display labels for selected values
  const getSelectedLabels = () => {
    return value.map((val) => {
      const option = interestOptions.find((opt) => opt.value === val);
      return option ? option.label : val;
    });
  };

  const selectedLabels = getSelectedLabels();

  const filteredGroups = Object.entries(groupedInterests).map(([category, options]) => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { category, options: filteredOptions };
  }).filter(group => group.options.length > 0);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-10 text-left",
              error ? "border-red-500" : "",
              value.length > 0 ? "pl-3 pt-2 pb-1" : "px-3 py-2"
            )}
            onClick={() => setOpen(!open)}
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedLabels.map((label, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="mr-1 mb-1 hover:bg-secondary"
                  >
                    {label}
                    <button
                      className="ml-1 rounded-full outline-none focus:ring-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(value[index]);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0 z-[200]" 
          style={{ width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : "300px" }}
        >
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Search interests..." 
                className="h-9 flex-1 border-0 outline-none focus:ring-0"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandList>
              <CommandEmpty>No interests found.</CommandEmpty>
              <ScrollArea className="max-h-[300px]">
                {filteredGroups.map(({ category, options }) => (
                  <CommandGroup key={category} heading={category}>
                    {maxSelections && value.length >= maxSelections && (
                      <div className="p-2 text-xs text-amber-600 text-center">
                        Maximum of {maxSelections} interests can be selected
                      </div>
                    )}
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        disabled={maxSelections ? value.length >= maxSelections && !value.includes(option.value) : false}
                        className={cn(
                          maxSelections && value.length >= maxSelections && !value.includes(option.value) ? "opacity-50 cursor-not-allowed" : ""
                        )}
                      >
                        <div className="flex items-center w-full">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span>{option.label}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {maxSelections && (
        <p className="text-xs text-gray-500 mt-1">
          Select up to {maxSelections} interests
        </p>
      )}
    </div>
  );
};

export default MultiInterestSelect;
