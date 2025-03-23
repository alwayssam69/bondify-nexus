
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Filter, Sparkles, Globe, MapPin } from "lucide-react";
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
import { motion } from "framer-motion";

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

// Define industry-specific skills mapping with more skills per industry
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
    { value: "blockchain", label: "Blockchain" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "product-management", label: "Product Management" },
    { value: "technical-writing", label: "Technical Writing" },
    { value: "quality-assurance", label: "Quality Assurance" },
    { value: "system-design", label: "System Design" },
    { value: "microservices", label: "Microservices" },
    { value: "ios", label: "iOS Development" },
    { value: "android", label: "Android Development" }
  ],
  finance: [
    { value: "investment", label: "Investment Strategy" },
    { value: "taxation", label: "Taxation" },
    { value: "financial-analysis", label: "Financial Analysis" },
    { value: "wealth-management", label: "Wealth Management" },
    { value: "banking", label: "Banking" },
    { value: "risk-management", label: "Risk Management" },
    { value: "fintech", label: "FinTech" },
    { value: "crypto", label: "Cryptocurrency" },
    { value: "capital-markets", label: "Capital Markets" },
    { value: "private-equity", label: "Private Equity" },
    { value: "venture-capital", label: "Venture Capital" },
    { value: "insurance", label: "Insurance" },
    { value: "investment-banking", label: "Investment Banking" },
    { value: "personal-finance", label: "Personal Finance" },
    { value: "real-estate-finance", label: "Real Estate Finance" },
    { value: "financial-modeling", label: "Financial Modeling" },
    { value: "fundraising", label: "Fundraising" },
    { value: "auditing", label: "Auditing" }
  ],
  marketing: [
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "social-media", label: "Social Media Marketing" },
    { value: "content-creation", label: "Content Creation" },
    { value: "seo", label: "SEO" },
    { value: "advertising", label: "Advertising" },
    { value: "brand-strategy", label: "Brand Strategy" },
    { value: "market-research", label: "Market Research" },
    { value: "email-marketing", label: "Email Marketing" },
    { value: "ppc", label: "PPC Advertising" },
    { value: "influencer-marketing", label: "Influencer Marketing" },
    { value: "analytics", label: "Marketing Analytics" },
    { value: "copywriting", label: "Copywriting" },
    { value: "public-relations", label: "Public Relations" },
    { value: "event-marketing", label: "Event Marketing" },
    { value: "marketing-automation", label: "Marketing Automation" },
    { value: "conversion-optimization", label: "Conversion Optimization" },
    { value: "growth-hacking", label: "Growth Hacking" }
  ],
  design: [
    { value: "ui-ux", label: "UI/UX Design" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "product-design", label: "Product Design" },
    { value: "web-design", label: "Web Design" },
    { value: "illustration", label: "Illustration" },
    { value: "animation", label: "Animation" },
    { value: "motion-graphics", label: "Motion Graphics" },
    { value: "branding", label: "Branding" },
    { value: "typography", label: "Typography" },
    { value: "interaction-design", label: "Interaction Design" },
    { value: "design-systems", label: "Design Systems" },
    { value: "figma", label: "Figma" },
    { value: "adobe-creative-suite", label: "Adobe Creative Suite" },
    { value: "3d-modeling", label: "3D Modeling" },
    { value: "user-research", label: "User Research" },
    { value: "wireframing", label: "Wireframing" },
    { value: "prototyping", label: "Prototyping" }
  ],
  business: [
    { value: "strategy", label: "Business Strategy" },
    { value: "consulting", label: "Consulting" },
    { value: "operations", label: "Operations" },
    { value: "project-management", label: "Project Management" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "leadership", label: "Leadership" },
    { value: "management", label: "Management" },
    { value: "business-development", label: "Business Development" },
    { value: "sales", label: "Sales" },
    { value: "negotiation", label: "Negotiation" },
    { value: "business-analysis", label: "Business Analysis" },
    { value: "supply-chain", label: "Supply Chain" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "startups", label: "Startups" },
    { value: "change-management", label: "Change Management" },
    { value: "process-improvement", label: "Process Improvement" },
    { value: "strategic-planning", label: "Strategic Planning" }
  ],
  healthcare: [
    { value: "medicine", label: "Medicine" },
    { value: "nursing", label: "Nursing" },
    { value: "research", label: "Medical Research" },
    { value: "public-health", label: "Public Health" },
    { value: "healthcare-tech", label: "Healthcare Technology" },
    { value: "mental-health", label: "Mental Health" },
    { value: "pharmaceuticals", label: "Pharmaceuticals" },
    { value: "health-policy", label: "Health Policy" },
    { value: "clinical-trials", label: "Clinical Trials" },
    { value: "healthcare-management", label: "Healthcare Management" },
    { value: "telemedicine", label: "Telemedicine" },
    { value: "biotech", label: "Biotech" },
    { value: "health-informatics", label: "Health Informatics" },
    { value: "medical-devices", label: "Medical Devices" },
    { value: "patient-care", label: "Patient Care" },
    { value: "health-education", label: "Health Education" }
  ],
  legal: [
    { value: "corporate-law", label: "Corporate Law" },
    { value: "ip-law", label: "Intellectual Property" },
    { value: "litigation", label: "Litigation" },
    { value: "contracts", label: "Contracts" },
    { value: "compliance", label: "Compliance" },
    { value: "international-law", label: "International Law" },
    { value: "tax-law", label: "Tax Law" },
    { value: "employment-law", label: "Employment Law" },
    { value: "legal-tech", label: "Legal Tech" },
    { value: "regulatory-affairs", label: "Regulatory Affairs" },
    { value: "privacy-law", label: "Privacy Law" },
    { value: "real-estate-law", label: "Real Estate Law" },
    { value: "mergers-acquisitions", label: "Mergers & Acquisitions" },
    { value: "immigration-law", label: "Immigration Law" },
    { value: "patent-law", label: "Patent Law" }
  ],
  education: [
    { value: "teaching", label: "Teaching" },
    { value: "curriculum-dev", label: "Curriculum Development" },
    { value: "edtech", label: "Educational Technology" },
    { value: "higher-ed", label: "Higher Education" },
    { value: "research", label: "Research" },
    { value: "e-learning", label: "E-Learning" },
    { value: "instructional-design", label: "Instructional Design" },
    { value: "adult-education", label: "Adult Education" },
    { value: "stem-education", label: "STEM Education" },
    { value: "educational-leadership", label: "Educational Leadership" },
    { value: "special-education", label: "Special Education" },
    { value: "language-teaching", label: "Language Teaching" },
    { value: "educational-psychology", label: "Educational Psychology" },
    { value: "academic-writing", label: "Academic Writing" },
    { value: "classroom-management", label: "Classroom Management" }
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
        { value: "time-management", label: "Time Management" },
        { value: "critical-thinking", label: "Critical Thinking" },
        { value: "adaptability", label: "Adaptability" },
        { value: "creativity", label: "Creativity" },
        { value: "emotional-intelligence", label: "Emotional Intelligence" },
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
    { value: "investor", label: "Investor" },
    { value: "freelancer", label: "Freelancer" },
    { value: "researcher", label: "Researcher" },
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
    { value: "retail", label: "Retail & E-commerce" },
    { value: "manufacturing", label: "Manufacturing & Engineering" },
    { value: "entertainment", label: "Entertainment & Media" },
    { value: "hospitality", label: "Hospitality & Tourism" },
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

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for badges
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="w-full mb-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="bg-background/60 backdrop-blur shadow-md border border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Find Your Ideal Match</h3>
              <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                Professional Networking
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* User Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  I am looking for:
                </label>
                <Select 
                  value={filters.userType || "select-type"} 
                  onValueChange={(value) => {
                    if (value === "select-type") return;
                    setFilters(prev => ({ ...prev, userType: value }));
                  }}
                >
                  <SelectTrigger className="bg-background/80 border-border/50 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur border-border/50">
                    <SelectGroup>
                      <SelectLabel>User Types</SelectLabel>
                      {filters.userType === "" && (
                        <SelectItem value="select-type">Select user type</SelectItem>
                      )}
                      {userTypes.map(type => (
                        <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-accent/50">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Experience Level:
                </label>
                <Select 
                  value={filters.experienceLevel || "select-level"} 
                  onValueChange={(value) => {
                    if (value === "select-level") return;
                    setFilters(prev => ({ ...prev, experienceLevel: value }));
                  }}
                >
                  <SelectTrigger className="bg-background/80 border-border/50 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur border-border/50">
                    <SelectGroup>
                      <SelectLabel>Experience Levels</SelectLabel>
                      {filters.experienceLevel === "" && (
                        <SelectItem value="select-level">Select experience level</SelectItem>
                      )}
                      {experienceLevels.map(level => (
                        <SelectItem key={level.value} value={level.value} className="cursor-pointer hover:bg-accent/50">
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Preference - Enhanced Three-Tier Selection */}
              <div className="space-y-3 col-span-1 md:col-span-2 bg-background/40 p-4 rounded-lg">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-500" />
                  Location Preference:
                </label>
                <RadioGroup 
                  className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
                  value={filters.locationPreference}
                  onValueChange={(value: "local" | "country" | "global") => 
                    setFilters(prev => ({ ...prev, locationPreference: value }))
                  }
                >
                  <div className="flex items-center space-x-2 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-accent/30 hover:border-primary/30 transition-all duration-200">
                    <RadioGroupItem value="local" id="local" className="border-primary" />
                    <Label htmlFor="local" className="flex items-center space-x-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Local</div>
                        <div className="text-xs text-muted-foreground">Within 50km radius</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-accent/30 hover:border-primary/30 transition-all duration-200">
                    <RadioGroupItem value="country" id="country" className="border-primary" />
                    <Label htmlFor="country" className="flex items-center space-x-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Country-wide</div>
                        <div className="text-xs text-muted-foreground">Same country networking</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-accent/30 hover:border-primary/30 transition-all duration-200">
                    <RadioGroupItem value="global" id="global" className="border-primary" />
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
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  Industries:
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-background/80 border-border/50 hover:border-primary/50 transition-colors"
                    >
                      Select Industries
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur border-border/50">
                    <DropdownMenuLabel>Industries</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                      {industries.map(industry => (
                        <DropdownMenuCheckboxItem
                          key={industry.value}
                          checked={filters.industry.includes(industry.value)}
                          onCheckedChange={() => toggleIndustry(industry.value)}
                          className="cursor-pointer"
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
                        <motion.div key={ind} variants={badgeVariants} initial="initial" animate="animate">
                          <Badge 
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => toggleIndustry(ind)}
                          >
                            {industryLabel} ✕
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Skills Dropdown - Updated to show skills based on selected industries */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  Required Skills:
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-background/80 border-border/50 hover:border-primary/50 transition-colors"
                    >
                      Select Skills
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur border-border/50">
                    <DropdownMenuLabel>
                      {filters.industry.length > 0 
                        ? `Skills for ${filters.industry.length > 1 ? 'selected industries' : 'selected industry'}` 
                        : 'General Skills'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                      {availableSkills.map(skill => (
                        <DropdownMenuCheckboxItem
                          key={skill.value}
                          checked={filters.skills.includes(skill.value)}
                          onCheckedChange={() => toggleSkill(skill.value)}
                          className="cursor-pointer"
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
                        <motion.div key={skill} variants={badgeVariants} initial="initial" animate="animate">
                          <Badge 
                            variant="outline"
                            className="border-primary/20 bg-primary/5 text-foreground cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skillLabel} ✕
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button 
              onClick={handleApplyFilters} 
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Filter className="mr-2 h-4 w-4" />
              Start Matching
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchFilter;
