
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import LocationSelector from "@/components/form/LocationSelector";
import { ProfileFormValues } from "./ProfileFormSchema";

interface LocationSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const LocationSection: React.FC<LocationSectionProps> = ({ form }) => {
  const useCurrentLocation = form.watch("useCurrentLocation");

  return (
    <>
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
                        // If using current location, store the location in the location field
                        form.setValue("location", "Current Location");
                      } else if (form.getValues("location") === "Current Location") {
                        // Clear the location field if it was set to "Current Location"
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
              <Input 
                placeholder={useCurrentLocation ? "Using current location" : "e.g., Area, Landmark"} 
                {...field} 
                disabled={useCurrentLocation}
                value={useCurrentLocation ? "Current Location" : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default LocationSection;
