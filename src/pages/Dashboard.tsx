
import React from "react";
import { useAuth } from "@/context/auth-context";
import DashboardStats from "@/components/dashboard/DashboardStats";
import LoanList from "@/components/loan/LoanList";
import MainLayout from "@/components/layout/MainLayout";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <span className="text-gray-500">›</span>
          <span className="text-xl">Loans</span>
        </div>

        <DashboardStats />
        
        <div className="mt-8">
          <LoanList />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
