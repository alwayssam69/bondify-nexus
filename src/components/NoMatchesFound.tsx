
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";

interface NoMatchesFoundProps {
  onUpdateFilters: () => void;
  onExpandSearch: () => void;
}

const NoMatchesFound: React.FC<NoMatchesFoundProps> = ({ 
  onUpdateFilters, 
  onExpandSearch 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Found</h3>
      
      <p className="text-gray-600 max-w-md mb-8">
        Currently there are no professionals matching your criteria. Try adjusting your filters or expanding your search radius.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={onUpdateFilters} 
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Update Filters
        </Button>
        
        <Button 
          onClick={onExpandSearch} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Expand Search Radius
        </Button>
      </div>
    </div>
  );
};

export default NoMatchesFound;
