
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

const Repayments: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Repayments</h1>
          <span className="text-gray-500">›</span>
          <span className="text-xl">Tracking</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Repayments Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Track and manage loan repayments in this section. You can view payment history and upcoming payments.
            </p>
            <div className="h-64 flex items-center justify-center border rounded-md mt-4 bg-gray-50">
              <p className="text-gray-400">Repayment schedule will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Repayments;
