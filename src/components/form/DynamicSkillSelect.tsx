
import React, { useEffect, useState } from "react";
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
import { industrySkills } from "@/data/formOptions";

interface DynamicSkillSelectProps {
  industry: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const DynamicSkillSelect = ({
  industry,
  label,
  value,
  onChange,
  placeholder = "Select skills",
  className,
}: DynamicSkillSelectProps) => {
  const [open, setOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<{ value: string; label: string; }[]>([]);

  useEffect(() => {
    // Set available skills based on selected industry
    if (industry && industrySkills[industry]) {
      setAvailableSkills(industrySkills[industry]);
    } else {
      // Fallback to empty array if industry not found
      setAvailableSkills([]);
    }
  }, [industry]);

  const handleSelect = (skillValue: string) => {
    if (value.includes(skillValue)) {
      onChange(value.filter(v => v !== skillValue));
    } else {
      onChange([...value, skillValue]);
    }
  };

  const removeSkill = (skillValue: string) => {
    onChange(value.filter(v => v !== skillValue));
  };

  const getSkillLabel = (skillValue: string) => {
    const skill = availableSkills.find(s => s.value === skillValue);
    return skill ? skill.label : skillValue;
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
                  value.map(skill => (
                    <Badge key={skill} variant="secondary" className="mr-1 mb-1">
                      {getSkillLabel(skill)}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(skill);
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
              <CommandInput placeholder="Search skills..." className="h-9" />
              <CommandEmpty>No skills found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {availableSkills.map((skill) => (
                  <CommandItem
                    key={skill.value}
                    onSelect={() => handleSelect(skill.value)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value.includes(skill.value) ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}>
                      {value.includes(skill.value) && <Check className="h-3 w-3" />}
                    </div>
                    <span>{skill.label}</span>
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

export default DynamicSkillSelect;
