
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Step2FormValues } from "../Step2ProfileSchema";
import LocationSelector from "@/components/form/LocationSelector";
import { MapPin } from "lucide-react";

interface LocationSectionProps {
  form: UseFormReturn<Step2FormValues>;
}

const LocationSection: React.FC<LocationSectionProps> = ({ form }) => {
  const useCurrentLocation = form.watch("useCurrentLocation");
  const selectedState = form.watch("state");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="useCurrentLocation"
          render={({ field }) => (
            <FormField
              control={form.control}
              name="state"
              render={({ field: stateField }) => (
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field: cityField }) => (
                    <LocationSelector
                      stateValue={stateField.value}
                      cityValue={cityField.value}
                      useLocationValue={field.value}
                      onStateChange={stateField.onChange}
                      onCityChange={cityField.onChange}
                      onUseLocationChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue("location", "Current Location");
                        } else if (form.getValues("location") === "Current Location") {
                          form.setValue("location", "");
                        }
                      }}
                    />
                  )}
                />
              )}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={useCurrentLocation ? "Using current location" : "e.g., Area, Landmark"} 
                    className="pl-10" 
                    {...field} 
                    disabled={useCurrentLocation}
                    value={useCurrentLocation ? "Current Location" : field.value}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LocationSection;
