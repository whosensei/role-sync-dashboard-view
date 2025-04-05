
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Users,
  Banknote,
  RepeatIcon,
  Settings,
  ClipboardList,
  LogOut,
  AreaChart,
  Landmark,
  FileCheck,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const isAdmin = user.role === UserRole.ADMIN;
  const isVerifier = user.role === UserRole.VERIFIER || isAdmin;
  
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      visible: true,
    },
    {
      name: "Borrowers",
      path: "/borrowers",
      icon: <Users className="w-5 h-5" />,
      visible: true,
    },
    {
      name: "Loans",
      path: "/loans",
      icon: <Banknote className="w-5 h-5" />,
      visible: true,
    },
    {
      name: "Repayments",
      path: "/repayments",
      icon: <RepeatIcon className="w-5 h-5" />,
      visible: true,
    },
    {
      name: "Loan Parameters",
      path: "/loan-parameters",
      icon: <ClipboardList className="w-5 h-5" />,
      visible: isAdmin,
    },
    {
      name: "Accounting",
      path: "/accounting",
      icon: <Landmark className="w-5 h-5" />,
      visible: isAdmin,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <AreaChart className="w-5 h-5" />,
      visible: isVerifier,
    },
    {
      name: "Collateral",
      path: "/collateral",
      icon: <FileCheck className="w-5 h-5" />,
      visible: isVerifier,
    },
    {
      name: "Access Configuration",
      path: "/access-config",
      icon: <UserCog className="w-5 h-5" />,
      visible: isAdmin,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
      visible: true,
    },
  ];

  return (
    <div className="w-64 bg-credit-green-800 text-white flex flex-col h-full">
      <div className="p-4 flex items-center">
        {user.image ? (
          <img 
            src={user.image} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover mr-3" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-credit-green-500 flex items-center justify-center text-white mr-3">
            {user.name.charAt(0)}
          </div>
        )}
        <div className="overflow-hidden">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-xs text-gray-300 truncate capitalize">{user.role}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems
            .filter((item) => item.visible)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  location.pathname.startsWith(item.path)
                    ? "bg-credit-green-700 text-white"
                    : "text-gray-300 hover:bg-credit-green-700 hover:text-white"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
        </nav>
      </div>
      <div className="p-4 border-t border-credit-green-700">
        <button
          onClick={() => logout()}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-credit-green-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
