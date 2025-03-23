
import React, { useState, useEffect } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { indianStates, citiesByState } from "@/data/formOptions";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface LocationSelectorProps {
  stateValue: string;
  cityValue: string;
  useLocationValue: boolean;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onUseLocationChange: (value: boolean) => void;
  className?: string;
}

const LocationSelector = ({
  stateValue,
  cityValue,
  useLocationValue,
  onStateChange,
  onCityChange,
  onUseLocationChange,
  className,
}: LocationSelectorProps) => {
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const geolocation = useGeolocation({ watch: false });

  useEffect(() => {
    // Update available cities when state changes
    if (stateValue && citiesByState[stateValue]) {
      setCities(citiesByState[stateValue]);
      
      // Reset city selection if current selection is not available in new state
      const cityExists = citiesByState[stateValue].some(city => city.value === cityValue);
      if (!cityExists && citiesByState[stateValue].length > 0) {
        onCityChange(citiesByState[stateValue][0].value);
        toast.info(`Selected ${citiesByState[stateValue][0].label} as your city`);
      }
    } else {
      setCities([]);
      if (cityValue) {
        onCityChange(""); // Reset city when no state is selected
      }
    }
  }, [stateValue, cityValue, onCityChange]);

  const handleLocationToggle = (checked: boolean) => {
    onUseLocationChange(checked);
    if (checked) {
      if (geolocation.error) {
        toast.error("Unable to access location. Please enable location services.");
      } else if (!geolocation.isLoading) {
        toast.success("Using your current location for better matching");
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
        <div className="flex items-center space-x-2 pt-0.5">
          <FormControl>
            <Switch
              checked={useLocationValue}
              onCheckedChange={handleLocationToggle}
            />
          </FormControl>
        </div>
        <div className="space-y-1 leading-none">
          <FormLabel>Use my current location</FormLabel>
          <p className="text-sm text-muted-foreground">
            Enable precise location-based matching
          </p>
          {useLocationValue && geolocation.error && (
            <p className="text-sm text-destructive">
              {geolocation.error || "Unable to access location. Please enable location services."}
            </p>
          )}
          {useLocationValue && geolocation.latitude && geolocation.longitude && (
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" /> Location access granted
            </div>
          )}
        </div>
      </FormItem>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>State</FormLabel>
          <Select
            value={stateValue || "select-state"}
            onValueChange={(value) => {
              if (value === "select-state") return;
              onStateChange(value);
              const stateName = indianStates.find(state => state.value === value)?.label || value;
              toast.info(`Selected ${stateName} as your state`);
            }}
            disabled={useLocationValue}
          >
            <FormControl>
              <SelectTrigger className={useLocationValue ? "opacity-60" : ""}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="select-state">Select state</SelectItem>
              {indianStates.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>City</FormLabel>
          <Select
            value={cityValue || "select-city"}
            onValueChange={(value) => {
              if (value === "select-city") return;
              onCityChange(value);
              const cityName = cities.find(city => city.value === value)?.label || value;
              toast.info(`Selected ${cityName} as your city`);
            }}
            disabled={useLocationValue || !stateValue || cities.length === 0}
          >
            <FormControl>
              <SelectTrigger className={useLocationValue ? "opacity-60" : ""}>
                <SelectValue placeholder={stateValue ? "Select city" : "Select state first"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="select-city">Select city</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </div>
    </div>
  );
};

export default LocationSelector;
