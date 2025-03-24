
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DynamicSkillSelect from "@/components/form/DynamicSkillSelect";
import { industryOptions } from "@/data/formOptions";
import { Briefcase, X } from "lucide-react";

interface SkillsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (industry: string, skills: string[]) => void;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [industry, setIndustry] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIndustry("");
      setSkills([]);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setIsLoading(true);
    
    try {
      onSubmit(industry, skills);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Skills</DialogTitle>
          <DialogDescription>
            Choose your industry and relevant skills to find better matches
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Industry</label>
            <Select
              value={industry}
              onValueChange={setIndustry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {industry && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <DynamicSkillSelect
                industry={industry}
                value={skills}
                onChange={setSkills}
                placeholder="Select skills relevant to your industry"
                maxSelections={5}
              />
              
              <div className="mt-2 flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="mr-1 mb-1">
                    {skill.replace(/-/g, ' ')}
                    <button
                      className="ml-1"
                      onClick={() => setSkills(skills.filter(s => s !== skill))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !industry || skills.length === 0}
          >
            {isLoading ? "Finding Matches..." : "Find Matches"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsSelector;
