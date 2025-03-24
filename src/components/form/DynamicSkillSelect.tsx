
import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DynamicSkillSelectProps {
  industry?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: boolean;
  maxSelections?: number;
  label?: string; // Add label prop to interface
}

// Industry-specific skills
const skillsByIndustry: Record<string, string[]> = {
  technology: [
    "javascript", "react", "node-js", "typescript", "python", "java", "cloud-computing", 
    "aws", "azure", "gcp", "devops", "machine-learning", "artificial-intelligence", 
    "data-science", "blockchain", "cybersecurity", "ui-ux", "mobile-development", 
    "system-design", "architecture", "agile", "scrum", "product-management", "version-control"
  ],
  finance: [
    "financial-analysis", "investment", "banking", "risk-management", "portfolio-management", 
    "fintech", "accounting", "tax", "insurance", "wealth-management", "trading", 
    "compliance", "regulations", "auditing", "budgeting", "forecasting", "esg"
  ],
  healthcare: [
    "clinical-research", "healthcare-administration", "patient-care", "medical-devices", 
    "biotech", "pharmaceuticals", "public-health", "telemedicine", "healthcare-informatics", 
    "health-policy", "regulatory-compliance", "nursing", "medicine", "mental-health"
  ],
  education: [
    "curriculum-development", "instructional-design", "e-learning", "teaching", 
    "educational-technology", "assessment", "academic-research", "student-services", 
    "academic-advising", "special-education", "higher-education", "k-12"
  ],
  marketing: [
    "digital-marketing", "brand-management", "market-research", "content-marketing", 
    "social-media", "seo", "sem", "analytics", "public-relations", "advertising", 
    "customer-engagement", "email-marketing", "campaign-management", "copywriting"
  ],
  design: [
    "graphic-design", "ui-ux", "product-design", "visual-design", "interaction-design", 
    "illustration", "motion-graphics", "3d-design", "user-research", "wireframing", 
    "prototyping", "branding", "typography", "color-theory", "design-systems"
  ],
  legal: [
    "corporate-law", "litigation", "intellectual-property", "contract-law", "compliance", 
    "regulatory", "risk-management", "legal-research", "legal-writing", "negotiation", 
    "mediation", "legal-tech", "privacy-law", "data-protection"
  ],
  business: [
    "strategy", "operations", "management", "entrepreneurship", "business-development", 
    "sales", "negotiation", "leadership", "consulting", "project-management", 
    "process-improvement", "change-management", "stakeholder-management"
  ],
  engineering: [
    "mechanical-engineering", "electrical-engineering", "civil-engineering", "chemical-engineering", 
    "industrial-engineering", "aerospace-engineering", "robotics", "automation", "cad", 
    "manufacturing", "quality-assurance", "product-development", "sustainability"
  ],
};

const getSkillsForIndustry = (industry?: string): string[] => {
  if (!industry || !skillsByIndustry[industry]) {
    return [];
  }
  
  return skillsByIndustry[industry];
};

const DynamicSkillSelect: React.FC<DynamicSkillSelectProps> = ({
  industry,
  value = [],
  onChange,
  placeholder = "Select skills...",
  error = false,
  maxSelections = 10,
  label // Add label to destructured props
}: DynamicSkillSelectProps) => {
  const [open, setOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (industry) {
      const skills = getSkillsForIndustry(industry);
      if (skills.length > 0) {
        setAvailableSkills(skills);
      } else {
        // If no industry-specific skills, use a default set
        setAvailableSkills([
          "leadership", "communication", "problem-solving", "teamwork", 
          "critical-thinking", "creativity", "adaptability", "time-management", 
          "organization", "project-management", "research", "analytical-skills", 
          "attention-to-detail", "presentation-skills", "negotiation"
        ]);
      }
    } else {
      setAvailableSkills([]);
    }
  }, [industry]);

  // Filter skills based on search term
  const filteredSkills = searchTerm 
    ? availableSkills.filter(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableSkills;

  const toggleSkill = (skill: string) => {
    if (value.includes(skill)) {
      onChange(value.filter(s => s !== skill));
    } else {
      if (value.length < maxSelections) {
        onChange([...value, skill]);
      } else {
        // Display max selections reached
        console.log(`Maximum of ${maxSelections} skills allowed`);
      }
    }
  };

  const removeSkill = (skill: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(s => s !== skill));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-10",
            !value.length && "text-muted-foreground",
            error && "border-red-500 focus:ring-red-500"
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 items-center max-w-full overflow-hidden">
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                {value.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="mr-1 mb-1 text-xs"
                  >
                    {skill.replace(/-/g, ' ')}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => removeSkill(skill, e)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" style={{ width: triggerRef.current?.offsetWidth }}>
        <Command>
          <CommandInput 
            placeholder="Search skills..." 
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No skills found</CommandEmpty>
            {availableSkills.length === 0 && !searchTerm ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {industry ? "Select an industry first to see available skills" : "No skills available"}
              </p>
            ) : (
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {filteredSkills.map((skill) => (
                    <CommandItem
                      key={skill}
                      value={skill}
                      onSelect={() => {
                        toggleSkill(skill);
                        setSearchTerm(""); // Reset search after selection
                      }}
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(skill) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="capitalize">{skill.replace(/-/g, ' ')}</span>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            )}
            
            {value.length >= maxSelections && (
              <div className="py-2 px-3 text-xs text-amber-600 bg-amber-50 border-t">
                Maximum of {maxSelections} skills allowed
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DynamicSkillSelect;
