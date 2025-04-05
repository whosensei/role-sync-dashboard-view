
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/context/auth-context";
import { LoanProvider } from "@/context/loan-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ApplyLoan from "./pages/ApplyLoan";
import AccessConfiguration from "./pages/AccessConfiguration";
import Borrowers from "./pages/Borrowers";
import Loans from "./pages/Loans";
import Repayments from "./pages/Repayments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LoanProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/apply-loan" 
                element={
                  <ProtectedRoute>
                    <ApplyLoan />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/borrowers" 
                element={
                  <ProtectedRoute>
                    <Borrowers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/loans" 
                element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/repayments" 
                element={
                  <ProtectedRoute>
                    <Repayments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/access-config" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AccessConfiguration />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LoanProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
