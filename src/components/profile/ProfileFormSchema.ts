
import * as z from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  userType: z.string().min(1, "User type is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  university: z.string().optional(),
  courseYear: z.string().optional(),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  projectInterests: z.array(z.string()).min(1, "Please select at least one project interest"),
  state: z.string().min(1, "Please select your state"),
  city: z.string().optional(),
  useCurrentLocation: z.boolean().default(false),
  userTag: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const calculateCompletenessScore = (values: ProfileFormValues): number => {
  let completenessScore = 0;
  if (values.fullName) completenessScore += 10;
  if (values.location) completenessScore += 10;
  if (values.bio) completenessScore += 10;
  if (values.industry) completenessScore += 10;
  if (values.userType) completenessScore += 10;
  if (values.experienceLevel) completenessScore += 10;
  if (values.skills.length > 0) completenessScore += 10;
  if (values.interests.length > 0) completenessScore += 10;
  if (values.university) completenessScore += 5;
  if (values.courseYear) completenessScore += 5;
  if (values.userTag) completenessScore += 10;
  return completenessScore;
};
