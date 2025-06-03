import * as React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/lib/types";
import { loginUser, getAllUsers } from "@/lib/auth";
import { LogIn, ShieldAlert, Key, User, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [employeeId, setEmployeeId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showCredentials, setShowCredentials] = React.useState(false);
  const [credentialPassword, setCredentialPassword] = React.useState("");
  const [showCredentialPassword, setShowCredentialPassword] = React.useState(false);
  
  // Reference to focus on the input after error
  const employeeIdRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (!employeeId) {
      setError("Employee ID is required");
      setIsLoading(false);
      employeeIdRef.current?.focus();
      return;
    }
    
    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      passwordRef.current?.focus();
      return;
    }
    
    // Get the registered users to check if any exist
    const registeredUsers = getAllUsers();
    
    // Login user
    const user = loginUser("" as UserRole, "", employeeId, password);
    
    if (user) {
      onLoginSuccess();
    } else {
      setError("Invalid employee ID or password");
      setIsLoading(false);
      // Focus back on the employee ID field
      employeeIdRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleCredentialPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCredentialPassword(value);
    
    // Check if the password matches
    if (value === "GR1MR34P3R#8008") {
      setShowCredentials(true);
    } else {
      setShowCredentials(false);
    }
  };

  const toggleCredentialPasswordVisibility = () => {
    setShowCredentialPassword(!showCredentialPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-blue-100">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Stationary Management System</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId" className="flex items-center text-sm font-medium">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              Employee ID
            </Label>
            <div className="relative">
              <Input
                id="employeeId"
                ref={employeeIdRef}
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyPress}
                placeholder="Enter your employee ID"
                autoComplete="username"
                className="pl-10 bg-muted/20"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-muted-foreground/70" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center text-sm font-medium">
              <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyPress}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="pl-10 bg-muted/20"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground/70" />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center border border-destructive/20">
              <ShieldAlert className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Signing in</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col bg-blue-50/50 border-t border-blue-100 rounded-b-xl py-4">
        <div className="text-center text-blue-700 w-full">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="credentialPassword" className="text-sm font-medium text-blue-700">
                Enter password to view credentials:
              </Label>
              <div className="relative">
                <Input
                  id="credentialPassword"
                  type={showCredentialPassword ? "text" : "password"}
                  value={credentialPassword}
                  onChange={handleCredentialPasswordChange}
                  placeholder="Enter access password"
                  className="bg-white border-blue-200 text-center pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={toggleCredentialPasswordVisibility}
                >
                  {showCredentialPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            {showCredentials && (
              <div className="animate-in fade-in-50 duration-300">
                <p className="font-medium">Default admin credentials:</p>
                <div className="mt-2 bg-white p-2 rounded-md border border-blue-100 shadow-sm">
                  <p>
                    <span className="font-medium">Employee ID:</span> <code className="bg-blue-50 px-2 py-0.5 rounded">admin</code>
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Password:</span> <code className="bg-blue-50 px-2 py-0.5 rounded">Admin123</code>
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center mt-3">
            <div className="text-xs font-medium text-blue-700 border-t border-blue-100 pt-2 mt-2">
              Copyright &copy; {new Date().getFullYear()} Keanen Clarke-Halkett
            </div>
            <div className="text-xs text-blue-600">All Rights Reserved</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}