
export enum UserRole {
  USER = "user",
  VERIFIER = "verifier",
  ADMIN = "admin"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

export enum LoanStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum LoanPurpose {
  DEBT = "Debt Consolidation",
  BUSINESS = "Business",
  PERSONAL = "Personal",
  EDUCATION = "Education",
  HOME = "Home Improvement",
  AUTO = "Auto",
  MEDICAL = "Medical",
  OTHER = "Other"
}

export interface LoanApplication {
  id: string;
  userId: string;
  officerName: string;
  officerImage?: string;
  amount: number;
  purpose: LoanPurpose;
  createdAt: Date;
  status: LoanStatus;
  updatedAt: Date;
  verifiedBy?: string;
  approvedBy?: string;
  notes?: string;
}

export interface DashboardStats {
  totalLoans: number;
  totalBorrowers: number;
  cashDisbursed: number;
  savings: number;
  repaidLoans: number;
  cashReceived: number;
  loansReleased: number[];
  outstandingLoans: number[];
  repaymentsCollected: number[];
}
