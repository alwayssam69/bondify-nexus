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
import { industrySkills } from "@/data/formOptions";

interface DynamicSkillSelectProps {
  industry: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  maxSelections?: number;
}

const DynamicSkillSelect: React.FC<DynamicSkillSelectProps> = ({
  industry,
  value = [],
  onChange,
  placeholder = "Select skills",
  label,
  error = false,
  maxSelections,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Get skills for the selected industry
  const availableSkills = industry ? industrySkills[industry] || [] : [];

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      // If already selected, remove it
      onChange(value.filter((item) => item !== selectedValue));
    } else if (maxSelections && value.length >= maxSelections) {
      // If max selections reached, don't add
      return;
    } else {
      // Otherwise add it
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
    const allSkills = availableSkills.map(skill => ({
      value: skill.value,
      label: skill.label
    }));
    
    return value.map((val) => {
      const option = allSkills.find((opt) => opt.value === val);
      return option ? option.label : val;
    });
  };

  const selectedLabels = getSelectedLabels();

  // Filter skills based on search query
  const filteredSkills = availableSkills.filter((skill) =>
    skill.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                placeholder="Search skills..." 
                className="h-9 flex-1 border-0 outline-none focus:ring-0"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandList>
              {!industry && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Please select an industry first
                </div>
              )}
              {industry && filteredSkills.length === 0 && (
                <CommandEmpty>No skills found.</CommandEmpty>
              )}
              {industry && filteredSkills.length > 0 && (
                <ScrollArea className="max-h-[300px]">
                  <CommandGroup>
                    {maxSelections && value.length >= maxSelections && (
                      <div className="p-2 text-xs text-amber-600 text-center">
                        Maximum of {maxSelections} skills can be selected
                      </div>
                    )}
                    {filteredSkills.map((skill) => (
                      <CommandItem
                        key={skill.value}
                        value={skill.value}
                        onSelect={() => handleSelect(skill.value)}
                        disabled={maxSelections ? value.length >= maxSelections && !value.includes(skill.value) : false}
                        className={cn(
                          maxSelections && value.length >= maxSelections && !value.includes(skill.value) ? "opacity-50 cursor-not-allowed" : ""
                        )}
                      >
                        <div className="flex items-center w-full">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value.includes(skill.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span>{skill.label}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {maxSelections && (
        <p className="text-xs text-gray-500 mt-1">
          Select up to {maxSelections} skills
        </p>
      )}
    </div>
  );
};

export default DynamicSkillSelect;
