
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user && !hasShownMessage) {
      toast.error("Please sign in to access this page");
      setHasShownMessage(true);
    }
  }, [isLoading, user, hasShownMessage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
