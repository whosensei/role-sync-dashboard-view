
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { toast } from "sonner";

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "John Okoh",
    email: "john@example.com",
    role: UserRole.USER,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: UserRole.VERIFIER,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Find user with matching email
      const foundUser = users.find((u) => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // In a real app, you would verify password here
      // For this demo, any password works
      
      // Set user in state and localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const addUser = async (userData: Omit<User, "id">) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error("Email already in use");
      }
      
      const newUser = {
        ...userData,
        id: `user-${Date.now()}`,
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success(`User ${newUser.name} added successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
      throw error;
    }
  };

  const removeUser = async (id: string) => {
    try {
      // Don't allow removing yourself
      if (user?.id === id) {
        throw new Error("You cannot remove your own account");
      }
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User removed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove user");
      throw error;
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setUsers(prev => 
        prev.map(u => u.id === id ? { ...u, ...data } : u)
      );
      
      // If updating current user, update in state and localStorage
      if (user?.id === id) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    }
  };

  const value = {
    user,
    users,
    isLoading,
    login,
    logout,
    addUser,
    removeUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
