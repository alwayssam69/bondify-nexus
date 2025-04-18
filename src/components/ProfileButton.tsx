
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileButtonProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ProfileButton = ({ variant = 'outline', size = 'default' }: ProfileButtonProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleClick = () => {
    if (user) {
      // Navigate to the user's own profile page without an ID
      navigate('/profile');
    } else {
      toast.error("You need to log in first");
      navigate('/login');
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <User className="h-4 w-4" />
      <span>My Profile</span>
    </Button>
  );
};

export default ProfileButton;
