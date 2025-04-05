
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useLoan } from "@/context/loan-context";
import { LoanStatus, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, AlertTriangle, Loader2, Shield, UserCheck } from "lucide-react";

const Loans: React.FC = () => {
  const { user } = useAuth();
  const { loans, verifyLoan, rejectLoan, approveLoan } = useLoan();
  const [selectedLoan, setSelectedLoan] = React.useState<string | null>(null);
  const [actionType, setActionType] = React.useState<"verify" | "approve" | "reject" | null>(null);
  const [notes, setNotes] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;
  const isVerifier = user.role === UserRole.VERIFIER || isAdmin;

  const handleAction = (loanId: string, action: "verify" | "approve" | "reject") => {
    setSelectedLoan(loanId);
    setActionType(action);
    setNotes("");
    setIsDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedLoan || !actionType) return;

    setIsSubmitting(true);
    try {
      switch (actionType) {
        case "verify":
          await verifyLoan(selectedLoan, notes);
          break;
        case "approve":
          await approveLoan(selectedLoan, notes);
          break;
        case "reject":
          await rejectLoan(selectedLoan, notes);
          break;
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error performing loan action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                        {(isVerifier || isAdmin) && (
                          <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
                        )}
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
                          {(isVerifier || isAdmin) && (
                            <td className="p-3 text-sm space-x-2">
                              {isVerifier && loan.status === LoanStatus.PENDING && (
                                <>
                                  <Button 
                                    onClick={() => handleAction(loan.id, "verify")} 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <UserCheck className="w-4 h-4 mr-1" />
                                    Verify
                                  </Button>
                                  <Button 
                                    onClick={() => handleAction(loan.id, "reject")} 
                                    size="sm" 
                                    variant="destructive"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {isAdmin && loan.status === LoanStatus.VERIFIED && (
                                <>
                                  <Button 
                                    onClick={() => handleAction(loan.id, "approve")} 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    onClick={() => handleAction(loan.id, "reject")} 
                                    size="sm" 
                                    variant="destructive"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </td>
                          )}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "verify"
                ? "Verify Loan Application"
                : actionType === "approve"
                ? "Approve Loan Application"
                : "Reject Loan Application"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "verify"
                ? "This will mark the loan as verified, allowing administrators to review it."
                : actionType === "approve"
                ? "This will approve the loan and initiate disbursement process."
                : "This will reject the loan application. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <Textarea
                placeholder="Add your notes or reasons for this action..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {actionType === "reject" && (
              <div className="flex items-start p-3 bg-red-50 text-red-800 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Warning: Rejecting this application cannot be undone. The applicant will be notified.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isSubmitting}
              variant={actionType === "reject" ? "destructive" : "default"}
              className={
                actionType === "verify"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : actionType === "verify" ? (
                "Verify Loan"
              ) : actionType === "approve" ? (
                "Approve Loan"
              ) : (
                "Reject Loan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Loans;
