
import { supabase } from '@/integrations/supabase/client';

// Initialize and ensure the avatars bucket exists
export const initializeStorage = async () => {
  // Check if the avatars bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
  
  // Create the bucket if it doesn't exist
  if (!avatarsBucketExists) {
    const { error } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
    });
    
    if (error) {
      console.error('Error creating avatars bucket:', error);
      return false;
    }
    
    console.log('Created avatars bucket');
  }
  
  return true;
};

// Upload an avatar image
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  // Ensure the avatars bucket exists
  await initializeStorage();
  
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return null;
  }
  
  // Get the public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
