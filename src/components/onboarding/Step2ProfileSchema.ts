
import { z } from "zod";

export interface ProfileData {
  fullName: string;
  profession: string;
  industry: string;
  location: string;
  university?: string;
  skills: string[];
  bio: string;
  experienceLevel: string;
  interests: string[];
  state: string;
  city: string;
  useCurrentLocation: boolean;
}

export const step2FormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  profession: z.string().min(2, "Please enter your profession"),
  industry: z.string().min(1, "Please select your industry"),
  state: z.string().min(1, "Please select your state"),
  city: z.string().optional(),
  location: z.string().min(2, "Please enter your location"),
  university: z.string().optional(),
  bio: z.string().min(10, "Please tell us a bit about yourself"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  useCurrentLocation: z.boolean().default(false),
});

export type Step2FormValues = z.infer<typeof step2FormSchema>;
