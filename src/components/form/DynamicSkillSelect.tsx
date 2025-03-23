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
import { toast } from "sonner";

interface DynamicSkillSelectProps {
  industry: string;
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}

const DynamicSkillSelect = ({
  industry,
  label,
  value,
  onChange,
  placeholder = "Select skills",
  className,
  maxSelections = 15,
}: DynamicSkillSelectProps) => {
  const [open, setOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<{ value: string; label: string; }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (industry && industrySkills[industry]) {
      setAvailableSkills(industrySkills[industry]);
      
      const validSkills = value.filter(skill => 
        industrySkills[industry].some(option => option.value === skill)
      );
      
      if (JSON.stringify(validSkills) !== JSON.stringify(value)) {
        onChange(validSkills);
      }
    } else {
      setAvailableSkills([]);
    }
  }, [industry, value, onChange]);

  const handleSelect = (skillValue: string) => {
    if (value.includes(skillValue)) {
      onChange(value.filter(v => v !== skillValue));
      toast.info(`Removed ${getSkillLabel(skillValue)} from your skills`);
    } else {
      if (value.length >= maxSelections) {
        toast.warning(`You can select a maximum of ${maxSelections} skills`);
        return;
      }
      onChange([...value, skillValue]);
      toast.success(`Added ${getSkillLabel(skillValue)} to your skills`);
    }
  };

  const removeSkill = (skillValue: string) => {
    onChange(value.filter(v => v !== skillValue));
    toast.info(`Removed ${getSkillLabel(skillValue)} from your skills`);
  };

  const getSkillLabel = (skillValue: string) => {
    const skill = availableSkills.find(s => s.value === skillValue);
    return skill ? skill.label : skillValue;
  };

  const filteredSkills = searchQuery
    ? availableSkills.filter(skill =>
        skill.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableSkills;

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
              disabled={!industry || availableSkills.length === 0}
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
                  <span className="text-muted-foreground">
                    {!industry 
                      ? "Select an industry first" 
                      : availableSkills.length === 0 
                        ? "No skills available for this industry" 
                        : placeholder}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white">
            <Command>
              <CommandInput 
                placeholder="Search skills..." 
                className="h-9"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>
                {!industry 
                  ? "Please select an industry first" 
                  : "No skills found. Try a different search."}
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {filteredSkills.map((skill) => (
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
              <div className="flex items-center justify-between p-2 border-t">
                <div className="text-xs text-muted-foreground">
                  {value.length} of {maxSelections} selected
                </div>
                {value.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      onChange([]);
                      toast.info("All skills cleared");
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default DynamicSkillSelect;
