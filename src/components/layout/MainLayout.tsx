
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Bell, MessageCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "./Navigation";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { UserRole } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between w-full h-16 px-4 bg-white border-b">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-credit-green-800">CREDIT APP</h1>
          </div>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-credit-red rounded-full"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Notifications
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Messages
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="relative group">
              <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-credit-green-500 flex items-center justify-center text-white">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex items-center">
                  <span className="font-medium">{user.role === UserRole.ADMIN ? "Admin" : user.role === UserRole.VERIFIER ? "Verifier" : "User"}</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="absolute right-0 z-10 hidden w-48 py-2 mt-2 bg-white rounded-md shadow-lg group-hover:block">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
