
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface SkillsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (industry: string, skills: string[]) => void;
}

// Industries data
const popularIndustries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Engineering",
  "Sales",
  "Manufacturing",
  "Media",
  "Real Estate",
  "Consulting"
];

// Skills data (categorized)
const skillsByCategory = {
  "Technology": [
    "JavaScript", "Python", "React", "Node.js", "Machine Learning",
    "Data Science", "DevOps", "Cloud Computing", "UI/UX", "Mobile Development"
  ],
  "Business": [
    "Project Management", "Marketing", "Sales", "Business Strategy", "Operations",
    "Customer Success", "Product Management", "Business Development", "Leadership", "Finance"
  ],
  "Design": [
    "Graphic Design", "UI Design", "UX Design", "Web Design", "Product Design",
    "Visual Design", "Illustration", "Typography", "Branding", "Motion Design"
  ],
  "Soft Skills": [
    "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management",
    "Adaptability", "Creativity", "Emotional Intelligence", "Leadership", "Negotiation"
  ]
};

const SkillsSelector: React.FC<SkillsSelectorProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("industries");
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch real industries from database if available
    const fetchIndustries = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('industry')
          .not('industry', 'is', null);
          
        if (error) {
          console.error("Error fetching industries:", error);
          return;
        }
        
        // Extract unique industries
        const industries = new Set<string>();
        data?.forEach(profile => {
          if (profile.industry) industries.add(profile.industry);
        });
        
        if (industries.size > 0) {
          setAvailableIndustries([...industries]);
        } else {
          setAvailableIndustries(popularIndustries);
        }
      } catch (error) {
        console.error("Error in fetchIndustries:", error);
        setAvailableIndustries(popularIndustries);
      }
    };
    
    if (isOpen) {
      fetchIndustries();
    } else {
      // Reset state when dialog closes
      setSelectedIndustry("");
      setSelectedSkills([]);
      setSearchTerm("");
      setActiveTab("industries");
    }
  }, [isOpen]);
  
  useEffect(() => {
    // When an industry is selected, move to the skills tab
    if (selectedIndustry) {
      setActiveTab("skills");
      
      // Fetch skills related to the selected industry
      const fetchSkills = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('skills')
            .eq('industry', selectedIndustry)
            .not('skills', 'is', null);
            
          if (error) {
            console.error("Error fetching skills:", error);
            return;
          }
          
          // Extract unique skills
          const skills = new Set<string>();
          data?.forEach(profile => {
            profile.skills?.forEach(skill => skills.add(skill));
          });
          
          if (skills.size > 0) {
            setSuggestedSkills([...skills]);
          } else {
            // Fallback to predefined skills based on category
            const industryCategory = Object.keys(skillsByCategory).find(category => 
              selectedIndustry.toLowerCase().includes(category.toLowerCase())
            );
            
            setSuggestedSkills(industryCategory 
              ? skillsByCategory[industryCategory as keyof typeof skillsByCategory]
              : skillsByCategory["Soft Skills"]
            );
          }
        } catch (error) {
          console.error("Error in fetchSkills:", error);
          setSuggestedSkills(skillsByCategory["Soft Skills"]);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSkills();
    }
  }, [selectedIndustry]);

  const filteredIndustries = availableIndustries.filter(industry =>
    industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = suggestedSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustry(industry);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = () => {
    onSubmit(selectedIndustry, selectedSkills);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Find Matches by Skills</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search industries or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {selectedIndustry && (
          <div className="flex items-center mb-4">
            <Label className="mr-2">Selected Industry:</Label>
            <Badge className="bg-primary">{selectedIndustry}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 ml-1"
              onClick={() => setSelectedIndustry("")}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Label className="mr-1 flex items-center">Selected Skills:</Label>
            {selectedSkills.map(skill => (
              <Badge key={skill} className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="industries">
              {selectedIndustry ? "Change Industry" : "Select Industry"}
            </TabsTrigger>
            <TabsTrigger value="skills" disabled={!selectedIndustry}>
              Select Skills
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="industries" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 gap-2 p-1">
                {filteredIndustries.map(industry => (
                  <Button
                    key={industry}
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    className="justify-start font-normal h-auto py-2"
                    onClick={() => handleIndustrySelect(industry)}
                  >
                    {industry}
                  </Button>
                ))}
                {filteredIndustries.length === 0 && searchTerm && (
                  <div className="col-span-2 py-4 text-center text-muted-foreground">
                    No industries found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="skills" className="flex-1 overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-2 p-1">
                  {filteredSkills.map(skill => (
                    <Button
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className="justify-start font-normal h-auto py-2"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Button>
                  ))}
                  {filteredSkills.length === 0 && searchTerm && (
                    <div className="col-span-2 py-4 text-center text-muted-foreground">
                      No skills found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedIndustry && selectedSkills.length === 0}
          >
            Find Matches
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsSelector;
