
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import LoanApplicationForm from "@/components/loan/LoanApplicationForm";

const ApplyLoan: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <LoanApplicationForm />
      </div>
    </MainLayout>
  );
};

export default ApplyLoan;
