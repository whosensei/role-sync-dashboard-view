
import React, { createContext, useContext, useState, useEffect } from "react";
import { LoanApplication, LoanStatus, LoanPurpose, DashboardStats } from "@/types";
import { useAuth } from "./auth-context";
import { toast } from "sonner";
import { format } from "date-fns";

// Generate mock loan data
const generateMockLoans = (): LoanApplication[] => {
  const loanPurposes = Object.values(LoanPurpose);
  const statuses = [LoanStatus.PENDING, LoanStatus.VERIFIED, LoanStatus.APPROVED, LoanStatus.REJECTED];
  
  return Array.from({ length: 24 }, (_, i) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `loan-${i}`,
      userId: "1",
      officerName: "John Okoh",
      officerImage: "https://randomuser.me/api/portraits/men/1.jpg",
      amount: Math.round(Math.random() * 90000 + 10000),
      purpose: loanPurposes[Math.floor(Math.random() * loanPurposes.length)],
      createdAt: createdDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      updatedAt: new Date(),
      notes: i % 3 === 0 ? "Net Debt Set" : i % 5 === 0 ? "Loan Fully Repaid" : undefined,
    };
  });
};

// Generate mock statistics
const generateMockStats = (loans: LoanApplication[]): DashboardStats => {
  const totalLoans = loans.length;
  const totalBorrowers = 100; // Mock data
  const cashDisbursed = loans
    .filter(loan => loan.status === LoanStatus.APPROVED)
    .reduce((sum, loan) => sum + loan.amount, 0);
  
  // Monthly data (12 months)
  const loansReleased = Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000));
  const outstandingLoans = Array.from({ length: 12 }, () => Math.floor(Math.random() * 800));
  const repaymentsCollected = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  
  return {
    totalLoans: 50,
    totalBorrowers: 100,
    cashDisbursed: 550000,
    savings: 450000,
    repaidLoans: 30,
    cashReceived: 1000000,
    loansReleased,
    outstandingLoans,
    repaymentsCollected,
  };
};

interface LoanContextType {
  loans: LoanApplication[];
  stats: DashboardStats;
  isLoading: boolean;
  applyForLoan: (data: Omit<LoanApplication, "id" | "status" | "createdAt" | "updatedAt" | "userId" | "officerName" | "officerImage">) => Promise<void>;
  verifyLoan: (id: string, notes?: string) => Promise<void>;
  rejectLoan: (id: string, notes?: string) => Promise<void>;
  approveLoan: (id: string, notes?: string) => Promise<void>;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    totalBorrowers: 0,
    cashDisbursed: 0,
    savings: 0,
    repaidLoans: 0,
    cashReceived: 0,
    loansReleased: [],
    outstandingLoans: [],
    repaymentsCollected: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockLoans = generateMockLoans();
    setLoans(mockLoans);
    setStats(generateMockStats(mockLoans));
    setIsLoading(false);
  }, []);

  const applyForLoan = async (data: Omit<LoanApplication, "id" | "status" | "createdAt" | "updatedAt" | "userId" | "officerName" | "officerImage">) => {
    if (!user) {
      toast.error("You must be logged in to apply for a loan");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newLoan: LoanApplication = {
        ...data,
        id: `loan-${Date.now()}`,
        userId: user.id,
        officerName: user.name,
        officerImage: user.image,
        status: LoanStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setLoans(prev => [newLoan, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalLoans: prev.totalLoans + 1,
      }));
      
      toast.success("Loan application submitted successfully");
    } catch (error) {
      console.error("Error applying for loan:", error);
      toast.error("Failed to submit loan application");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoan = async (id: string, notes?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoans(prev => 
        prev.map(loan => 
          loan.id === id
            ? {
                ...loan,
                status: LoanStatus.VERIFIED,
                verifiedBy: user.id,
                notes: notes || loan.notes,
                updatedAt: new Date(),
              }
            : loan
        )
      );
      
      toast.success("Loan verified successfully");
    } catch (error) {
      toast.error("Failed to verify loan");
    } finally {
      setIsLoading(false);
    }
  };

  const rejectLoan = async (id: string, notes?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoans(prev => 
        prev.map(loan => 
          loan.id === id
            ? {
                ...loan,
                status: LoanStatus.REJECTED,
                notes: notes || loan.notes,
                updatedAt: new Date(),
              }
            : loan
        )
      );
      
      toast.success("Loan rejected");
    } catch (error) {
      toast.error("Failed to reject loan");
    } finally {
      setIsLoading(false);
    }
  };

  const approveLoan = async (id: string, notes?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoans(prev => 
        prev.map(loan => 
          loan.id === id
            ? {
                ...loan,
                status: LoanStatus.APPROVED,
                approvedBy: user.id,
                notes: notes || loan.notes,
                updatedAt: new Date(),
              }
            : loan
        )
      );
      
      toast.success("Loan approved successfully");
    } catch (error) {
      toast.error("Failed to approve loan");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    loans,
    stats,
    isLoading,
    applyForLoan,
    verifyLoan,
    rejectLoan,
    approveLoan,
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error("useLoan must be used within a LoanProvider");
  }
  return context;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy");
};

export const formatTime = (date: Date): string => {
  return format(date, "h:mm a");
};
