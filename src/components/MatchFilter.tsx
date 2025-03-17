
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Filter } from "lucide-react";
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

export type FilterOptions = {
  userType: string;
  industry: string[];
  skills: string[];
  experienceLevel: string;
  relationshipGoal: string;
  location: string;
};

interface MatchFilterProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

const MatchFilter: React.FC<MatchFilterProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    userType: "",
    industry: [],
    skills: [],
    experienceLevel: "",
    relationshipGoal: "networking",
    location: "",
  });

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

  const skills = [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "marketing", label: "Digital Marketing" },
    { value: "sales", label: "Sales" },
    { value: "uiux", label: "UI/UX Design" },
    { value: "fundraising", label: "Fundraising" },
    { value: "projectManagement", label: "Project Management" },
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
  ];

  const locations = [
    { value: "global", label: "Global (Remote)" },
    { value: "New York", label: "New York" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "London", label: "London" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Tokyo", label: "Tokyo" },
    { value: "Sydney", label: "Sydney" },
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

              {/* Skills Dropdown */}
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
                    <DropdownMenuLabel>Skills</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {skills.map(skill => (
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
                      const skillLabel = skills.find(s => s.value === skill)?.label || skill;
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

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Preference:</label>
                <Select 
                  value={filters.location} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Locations</SelectLabel>
                      {locations.map(location => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
