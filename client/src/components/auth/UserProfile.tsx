import * as React from "react";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User as UserIcon, 
  Shield, 
  ChevronDown 
} from "lucide-react";
import { logoutUser } from "@/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  // Generate user initials for avatar
  const initials = user.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Get role color based on role type
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Admin Assistant":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-xs text-primary">{initials}</span>
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium line-clamp-1">{user.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-1 border-b pb-3">
              <p className="text-sm font-medium">{user.name}</p>
              <div className="flex items-center gap-1">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">ID: {user.employeeId}</p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Role: {user.role}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground">Permissions</h3>
              <ul className="text-xs space-y-1">
                {Object.entries(user.permissions)
                  .filter(([_, value]) => value === true)
                  .map(([key]) => (
                    <li key={key} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{key.replace(/^can/, 'Can ')}</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLogout}
              className="mt-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
