
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Filter, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type FilterOptions = {
  userType: string;
  industry: string[];
  skills: string[];
  experienceLevel: string;
  relationshipGoal: string;
  locationPreference: "local" | "country" | "global";
};

interface MatchFilterProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

// Define industry-specific skills mapping
const industrySkillsMap: Record<string, Array<{ value: string, label: string }>> = {
  technology: [
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "nodejs", label: "Node.js" },
    { value: "aws", label: "AWS" },
    { value: "devops", label: "DevOps" },
    { value: "mobile", label: "Mobile Development" },
    { value: "cloud", label: "Cloud Computing" },
    { value: "ai", label: "AI/Machine Learning" },
  ],
  finance: [
    { value: "investment", label: "Investment Strategy" },
    { value: "taxation", label: "Taxation" },
    { value: "financial-analysis", label: "Financial Analysis" },
    { value: "wealth-management", label: "Wealth Management" },
    { value: "banking", label: "Banking" },
    { value: "risk-management", label: "Risk Management" },
    { value: "fintech", label: "FinTech" },
  ],
  marketing: [
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "social-media", label: "Social Media Marketing" },
    { value: "content-creation", label: "Content Creation" },
    { value: "seo", label: "SEO" },
    { value: "advertising", label: "Advertising" },
    { value: "brand-strategy", label: "Brand Strategy" },
    { value: "market-research", label: "Market Research" },
  ],
  design: [
    { value: "ui-ux", label: "UI/UX Design" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "product-design", label: "Product Design" },
    { value: "web-design", label: "Web Design" },
    { value: "illustration", label: "Illustration" },
    { value: "animation", label: "Animation" },
  ],
  business: [
    { value: "strategy", label: "Business Strategy" },
    { value: "consulting", label: "Consulting" },
    { value: "operations", label: "Operations" },
    { value: "project-management", label: "Project Management" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "leadership", label: "Leadership" },
  ],
  healthcare: [
    { value: "medicine", label: "Medicine" },
    { value: "nursing", label: "Nursing" },
    { value: "research", label: "Medical Research" },
    { value: "public-health", label: "Public Health" },
    { value: "healthcare-tech", label: "Healthcare Technology" },
    { value: "mental-health", label: "Mental Health" },
  ],
  legal: [
    { value: "corporate-law", label: "Corporate Law" },
    { value: "ip-law", label: "Intellectual Property" },
    { value: "litigation", label: "Litigation" },
    { value: "contracts", label: "Contracts" },
    { value: "compliance", label: "Compliance" },
  ],
  education: [
    { value: "teaching", label: "Teaching" },
    { value: "curriculum-dev", label: "Curriculum Development" },
    { value: "edtech", label: "Educational Technology" },
    { value: "higher-ed", label: "Higher Education" },
    { value: "research", label: "Research" },
  ],
};

const MatchFilter: React.FC<MatchFilterProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    userType: "",
    industry: [],
    skills: [],
    experienceLevel: "",
    relationshipGoal: "networking",
    locationPreference: "local",
  });

  const [availableSkills, setAvailableSkills] = useState<Array<{ value: string, label: string }>>([]);

  // Update available skills whenever industry selection changes
  useEffect(() => {
    let allSkills: Array<{ value: string, label: string }> = [];
    
    // Collect skills from all selected industries
    filters.industry.forEach(ind => {
      const industrySkills = industrySkillsMap[ind] || [];
      allSkills = [...allSkills, ...industrySkills];
    });
    
    // If no industry is selected, show a default set of general skills
    if (allSkills.length === 0) {
      allSkills = [
        { value: "communication", label: "Communication" },
        { value: "leadership", label: "Leadership" },
        { value: "problem-solving", label: "Problem Solving" },
        { value: "teamwork", label: "Teamwork" },
        { value: "project-management", label: "Project Management" },
      ];
    }
    
    // Remove duplicates
    const uniqueSkills = allSkills.filter((skill, index, self) => 
      index === self.findIndex(s => s.value === skill.value)
    );
    
    setAvailableSkills(uniqueSkills);
    
    // Filter out any selected skills that are no longer available
    const validSkills = filters.skills.filter(skill => 
      uniqueSkills.some(s => s.value === skill)
    );
    
    if (validSkills.length !== filters.skills.length) {
      setFilters(prev => ({ ...prev, skills: validSkills }));
    }
  }, [filters.industry]);

  // Lists of options
  const userTypes = [
    { value: "founder", label: "Startup Founder" },
    { value: "entrepreneur", label: "Aspiring Entrepreneur" },
    { value: "professional", label: "Working Professional" },
    { value: "student", label: "Student/Recent Graduate" },
    { value: "jobSeeker", label: "Job Seeker" },
    { value: "mentor", label: "Mentor/Expert" },
    { value: "collaborator", label: "Collaborator" },
  ];

  const industries = [
    { value: "technology", label: "Technology & IT" },
    { value: "finance", label: "Finance & Investment" },
    { value: "marketing", label: "Marketing & Sales" },
    { value: "design", label: "Design & Creativity" },
    { value: "business", label: "Business & Consulting" },
    { value: "healthcare", label: "Healthcare & Science" },
    { value: "legal", label: "Legal & Compliance" },
    { value: "education", label: "Education & Research" },
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
  ];

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const toggleIndustry = (value: string) => {
    setFilters(prev => {
      if (prev.industry.includes(value)) {
        return { ...prev, industry: prev.industry.filter(item => item !== value) };
      } else {
        return { ...prev, industry: [...prev.industry, value] };
      }
    });
  };

  const toggleSkill = (value: string) => {
    setFilters(prev => {
      if (prev.skills.includes(value)) {
        return { ...prev, skills: prev.skills.filter(item => item !== value) };
      } else {
        return { ...prev, skills: [...prev.skills, value] };
      }
    });
  };

  return (
    <div className="w-full mb-6">
      <Card className="bg-background/60 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Find Your Ideal Match</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">I am looking for:</label>
                <Select 
                  value={filters.userType} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, userType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Types</SelectLabel>
                      {userTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level:</label>
                <Select 
                  value={filters.experienceLevel} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Experience Levels</SelectLabel>
                      {experienceLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Preference - New Three-Tier Selection */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium">Location Preference:</label>
                <RadioGroup 
                  className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                  value={filters.locationPreference}
                  onValueChange={(value: "local" | "country" | "global") => 
                    setFilters(prev => ({ ...prev, locationPreference: value }))
                  }
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local" className="flex items-center space-x-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Local</div>
                        <div className="text-xs text-muted-foreground">Within 50km radius</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="country" id="country" />
                    <Label htmlFor="country" className="flex items-center space-x-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Country-wide</div>
                        <div className="text-xs text-muted-foreground">Same country networking</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="global" id="global" />
                    <Label htmlFor="global" className="flex items-center space-x-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">Global</div>
                        <div className="text-xs text-muted-foreground">Worldwide connections</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Industry Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Industries:</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      Select Industries
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Industries</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {industries.map(industry => (
                        <DropdownMenuCheckboxItem
                          key={industry.value}
                          checked={filters.industry.includes(industry.value)}
                          onCheckedChange={() => toggleIndustry(industry.value)}
                        >
                          {industry.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Display selected industries as badges */}
                {filters.industry.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.industry.map(ind => {
                      const industryLabel = industries.find(i => i.value === ind)?.label || ind;
                      return (
                        <Badge 
                          key={ind} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleIndustry(ind)}
                        >
                          {industryLabel} ✕
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Skills Dropdown - Updated to show skills based on selected industries */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Required Skills:</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      Select Skills
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      {filters.industry.length > 0 
                        ? `Skills for ${filters.industry.length > 1 ? 'selected industries' : 'selected industry'}` 
                        : 'General Skills'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {availableSkills.map(skill => (
                        <DropdownMenuCheckboxItem
                          key={skill.value}
                          checked={filters.skills.includes(skill.value)}
                          onCheckedChange={() => toggleSkill(skill.value)}
                        >
                          {skill.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Display selected skills as badges */}
                {filters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.skills.map(skill => {
                      const skillObj = availableSkills.find(s => s.value === skill);
                      const skillLabel = skillObj ? skillObj.label : skill;
                      return (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skillLabel} ✕
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button 
              onClick={handleApplyFilters} 
              className="mt-4 w-full"
            >
              <Filter className="mr-2 h-4 w-4" />
              Start Matching
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchFilter;
