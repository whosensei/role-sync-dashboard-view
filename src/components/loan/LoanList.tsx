
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLoan, formatCurrency, formatDate, formatTime } from "@/context/loan-context";
import { LoanStatus, UserRole } from "@/types";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Check, Loader2, X, MoreVertical, Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LoanList: React.FC = () => {
  const { loans, verifyLoan, rejectLoan, approveLoan } = useLoan();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"verify" | "reject" | "approve" | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;
  const isVerifier = user.role === UserRole.VERIFIER || isAdmin;

  const filteredLoans = loans.filter((loan) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      loan.officerName.toLowerCase().includes(searchTerms) ||
      loan.purpose.toLowerCase().includes(searchTerms) ||
      loan.amount.toString().includes(searchTerms) ||
      loan.status.toLowerCase().includes(searchTerms)
    );
  });

  const handleAction = (loanId: string, action: "verify" | "reject" | "approve") => {
    setSelectedLoanId(loanId);
    setActionType(action);
    setNotes("");
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedLoanId || !actionType) return;

    setIsSubmitting(true);
    try {
      switch (actionType) {
        case "verify":
          await verifyLoan(selectedLoanId, notes);
          break;
        case "reject":
          await rejectLoan(selectedLoanId, notes);
          break;
        case "approve":
          await approveLoan(selectedLoanId, notes);
          break;
      }
      setActionDialogOpen(false);
    } catch (error) {
      console.error("Error performing loan action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.PENDING:
        return (
          <span className="bg-credit-yellow text-white py-1 px-3 rounded-full text-xs font-medium">
            PENDING
          </span>
        );
      case LoanStatus.VERIFIED:
        <span className="bg-credit-green-500 text-white py-1 px-3 rounded-full text-xs font-medium">
          VERIFIED
        </span>;
      case LoanStatus.APPROVED:
        return (
          <span className="bg-blue-600 text-white py-1 px-3 rounded-full text-xs font-medium">
            APPROVED
          </span>
        );
      case LoanStatus.REJECTED:
        return (
          <span className="bg-credit-red text-white py-1 px-3 rounded-full text-xs font-medium">
            REJECTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">Applied Loans</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for loans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium">Loan Officer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Date Applied</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No loan applications found
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center">
                      {loan.officerImage ? (
                        <img
                          src={loan.officerImage}
                          alt={loan.officerName}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-credit-green-500 flex items-center justify-center text-white mr-3">
                          {loan.officerName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p>{loan.officerName}</p>
                        <p className="text-xs text-gray-500">Created 1 day ago</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p>${formatCurrency(loan.amount)}</p>
                        <p className="text-xs text-gray-500">{loan.notes || loan.purpose}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{formatDate(loan.createdAt)}</p>
                        <p className="text-xs text-gray-500">{formatTime(loan.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(loan.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/loans/${loan.id}`}>View Details</Link>
                          </DropdownMenuItem>

                          {isVerifier && loan.status === LoanStatus.PENDING && (
                            <DropdownMenuItem
                              onClick={() => handleAction(loan.id, "verify")}
                              className="text-credit-green-700"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Verify
                            </DropdownMenuItem>
                          )}

                          {isAdmin && loan.status === LoanStatus.VERIFIED && (
                            <DropdownMenuItem
                              onClick={() => handleAction(loan.id, "approve")}
                              className="text-blue-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}

                          {(isVerifier || isAdmin) && 
                           (loan.status === LoanStatus.PENDING || loan.status === LoanStatus.VERIFIED) && (
                            <DropdownMenuItem
                              onClick={() => handleAction(loan.id, "reject")}
                              className="text-credit-red"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{Math.min(10, filteredLoans.length)}</span> of{" "}
            <span className="font-medium">{filteredLoans.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
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
                ? "This will mark the loan as verified, allowing administrators to approve it."
                : actionType === "approve"
                ? "This will approve the loan application and trigger the disbursement process."
                : "This will reject the loan application. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes or reasons for this action..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {actionType === "reject" && (
              <div className="flex items-start p-3 bg-red-50 text-red-800 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Warning: Rejecting this application cannot be undone. The applicant will be notified immediately.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isSubmitting}
              variant={actionType === "reject" ? "destructive" : "default"}
              className={
                actionType === "verify"
                  ? "bg-credit-green-700 hover:bg-credit-green-800"
                  : actionType === "approve"
                  ? "bg-blue-600 hover:bg-blue-700"
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
    </>
  );
};

export default LoanList;
