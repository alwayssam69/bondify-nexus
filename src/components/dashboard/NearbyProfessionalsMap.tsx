
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface Professional {
  id: string;
  name: string;
  position?: Location;
  userType: string;
  industry: string;
  matchScore: number;
}

interface NearbyProfessionalsMapProps {
  userLocation: Location;
  professionals: Professional[];
  onViewProfile: (id: string) => void;
}

const NearbyProfessionalsMap = ({ 
  userLocation, 
  professionals, 
  onViewProfile 
}: NearbyProfessionalsMapProps) => {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  // In a real implementation, this would use a mapping library like Mapbox or Google Maps
  // For now, we'll create a simplified visualization

  // Calculate relative positions for the professionals on the "map"
  const calculateRelativePosition = (professional: Professional) => {
    if (!professional.position) return { left: '50%', top: '50%' };
    
    // Simple calculation to position items on our fake map
    // In a real map implementation, you would convert lat/lng to x/y coordinates
    const latDiff = professional.position.lat - userLocation.lat;
    const lngDiff = professional.position.lng - userLocation.lng;
    
    // Scale the differences to fit our map view (this is very simplified)
    const scale = 100; // Scale factor to make differences visible
    const left = 50 + (lngDiff * scale);
    const top = 50 - (latDiff * scale); // Negative because lat increases going north
    
    return {
      left: `${Math.min(Math.max(left, 10), 90)}%`, // Keep within 10-90% range
      top: `${Math.min(Math.max(top, 10), 90)}%`    // Keep within 10-90% range
    };
  };

  // Get a color based on match score
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden border border-border/40">
      <div className="absolute inset-0 opacity-30">
        {/* Simplified map grid lines */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '25px 25px'
        }}></div>
      </div>
      
      {/* User's location marker */}
      <div 
        className="absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: '50%', top: '50%' }}
      >
        <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
        <div className="absolute inset-1.5 bg-white rounded-full"></div>
      </div>
      
      {/* Professional markers */}
      {professionals.map(professional => {
        const position = calculateRelativePosition(professional);
        const scoreColor = getMatchScoreColor(professional.matchScore);
        
        return professional.position ? (
          <div 
            key={professional.id}
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125 z-10"
            style={{ 
              left: position.left, 
              top: position.top,
              backgroundColor: scoreColor.replace('bg-', '')
            }}
            onClick={() => setSelectedProfessional(professional)}
          >
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
              {professional.name}
            </div>
          </div>
        ) : null;
      })}
      
      {/* Information card for selected professional */}
      {selectedProfessional && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border/40 z-30">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{selectedProfessional.name}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedProfessional.userType} • {selectedProfessional.industry}
              </p>
            </div>
            <div className={`${getMatchScoreColor(selectedProfessional.matchScore)} text-white text-xs font-medium rounded-full px-2 py-0.5`}>
              {selectedProfessional.matchScore}% Match
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button 
              className="text-xs text-primary font-medium"
              onClick={() => onViewProfile(selectedProfessional.id)}
            >
              View Profile
            </button>
          </div>
        </div>
      )}
      
      {/* Map placeholder message */}
      <div className="absolute bottom-2 right-2 bg-background/80 text-xs text-muted-foreground rounded px-2 py-1">
        Interactive map - simplified visualization
      </div>
    </div>
  );
};

export default NearbyProfessionalsMap;
