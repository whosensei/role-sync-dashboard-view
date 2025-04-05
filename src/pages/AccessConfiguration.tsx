
import React from "react";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import UserManagement from "@/components/auth/UserManagement";
import { UserRole } from "@/types";

const AccessConfiguration: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Only admins can access this page
    if (user && user.role !== UserRole.ADMIN) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Access Configuration</h1>
        </div>
        
        <UserManagement />
      </div>
    </MainLayout>
  );
};

export default AccessConfiguration;
