
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useLoan } from "@/context/loan-context";
import { LoanStatus } from "@/types";

const Loans: React.FC = () => {
  const { user } = useAuth();
  const { loans } = useLoan();
  
  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Loans</h1>
          <span className="text-gray-500">›</span>
          <span className="text-xl">Management</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loans Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Manage all loans in this section. You can view, approve, verify, or reject loan applications.
            </p>
            <div className="mt-4">
              {loans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-medium text-gray-500">ID</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Amount</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Purpose</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map(loan => (
                        <tr key={loan.id} className="border-t">
                          <td className="p-3 text-sm">{loan.id}</td>
                          <td className="p-3 text-sm">${loan.amount.toLocaleString()}</td>
                          <td className="p-3 text-sm">{loan.purpose}</td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              loan.status === LoanStatus.APPROVED ? 'bg-green-100 text-green-800' :
                              loan.status === LoanStatus.REJECTED ? 'bg-red-100 text-red-800' :
                              loan.status === LoanStatus.VERIFIED ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{loan.createdAt.toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50">
                  <p className="text-gray-400">No loans available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Loans;
