import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DynamicSkillSelect from "@/components/form/DynamicSkillSelect";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Search, X } from "lucide-react";
import { toast } from "sonner";
import { industryOptions } from "@/data/formOptions";

interface MatchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MatchFilterModal: React.FC<MatchFilterModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [distance, setDistance] = useState(25);
  const [useLocation, setUseLocation] = useState(false);
  const [relationshipGoal, setRelationshipGoal] = useState("networking");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    showErrorToasts: true,
  });

  useEffect(() => {
    if (isOpen) {
      setIndustry("");
      setSkills([]);
      setDistance(25);
      setUseLocation(false);
      setRelationshipGoal("networking");
      setExperienceLevel("");
    }
  }, [isOpen]);

  const handleLocationToggle = (checked: boolean) => {
    setUseLocation(checked);
    
    if (checked && geolocation.error) {
      toast.error("Unable to access your location", {
        description: "Please enable location access in your browser to find nearby matches.",
      });
    }
  };

  const handleSkillChange = (selectedSkills: string[]) => {
    setSkills(selectedSkills);
  };

  const handleFindMatch = async () => {
    if (!industry) {
      toast.warning("Please select an industry");
      return;
    }

    if (skills.length === 0) {
      toast.warning("Please select at least one skill");
      return;
    }
    
    if (useLocation && geolocation.error) {
      toast.error("Location access is required", {
        description: "Please enable location permissions to find nearby matches.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        industry,
        skills: skills.join(','),
        distance: distance.toString(),
        relationshipGoal,
      });
      
      if (experienceLevel && experienceLevel !== "select-level") {
        params.append('experienceLevel', experienceLevel);
      }
      
      if (useLocation && geolocation.latitude && geolocation.longitude) {
        params.append('lat', geolocation.latitude.toString());
        params.append('lng', geolocation.longitude.toString());
      }

      onClose();
      setTimeout(() => {
        navigate(`/matches?${params.toString()}`);
        setIsLoading(false);
        toast.success("Finding professionals that match your criteria");
      }, 100);
      
    } catch (error) {
      console.error("Error finding matches:", error);
      toast.error("Failed to find matches", {
        description: "Please try again later."
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Find Professionals</DialogTitle>
          <p className="text-gray-600 mt-2">
            Set your preferences to find the perfect professional match
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
            <Select 
              value={industry || "select-industry"} 
              onValueChange={(value) => {
                if (value === "select-industry") return;
                setIndustry(value);
              }}
            >
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-industry">Select your industry</SelectItem>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Skills</Label>
            <DynamicSkillSelect
              industry={industry}
              value={skills}
              onChange={handleSkillChange}
              placeholder="Select skills related to your industry"
              maxSelections={5}
            />
            <p className="text-xs text-gray-500 mt-1">Select up to 5 skills for better matches</p>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Use My Location</Label>
                <p className="text-xs text-gray-500">Find matches near you</p>
              </div>
              <Switch
                checked={useLocation}
                onCheckedChange={handleLocationToggle}
              />
            </div>
            
            {useLocation && (
              <div className="space-y-3">
                {geolocation.loading ? (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-blue-600"></div>
                    Acquiring your location...
                  </div>
                ) : geolocation.error ? (
                  <div className="flex items-center text-sm text-red-500">
                    <X className="mr-1 h-4 w-4" />
                    {geolocation.error}
                  </div>
                ) : geolocation.latitude && geolocation.longitude ? (
                  <div className="flex items-center text-sm text-green-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    Location access granted
                  </div>
                ) : null}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium">Match Distance: {distance} km</Label>
                  </div>
                  <Slider
                    value={[distance]}
                    min={5}
                    max={100}
                    step={5}
                    onValueChange={(values) => setDistance(values[0])}
                    disabled={!useLocation || !!geolocation.error}
                    className={!useLocation || !!geolocation.error ? "opacity-50" : ""}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5 km</span>
                    <span>50 km</span>
                    <span>100 km</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Purpose</Label>
            <Select 
              value={relationshipGoal} 
              onValueChange={setRelationshipGoal}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="networking">🤝 Networking</SelectItem>
                <SelectItem value="collaboration">🎯 Collaboration</SelectItem>
                <SelectItem value="job">💼 Job Opportunity</SelectItem>
                <SelectItem value="mentorship">👨‍🏫 Mentorship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Experience Level</Label>
            <Select 
              value={experienceLevel || "select-level"} 
              onValueChange={(value) => {
                if (value === "select-level") return;
                setExperienceLevel(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-level">Select experience level</SelectItem>
                <SelectItem value="beginner">🔹 Beginner</SelectItem>
                <SelectItem value="intermediate">🏆 Mid-Level</SelectItem>
                <SelectItem value="expert">👑 Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={handleFindMatch} 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchFilterModal;
