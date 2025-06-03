import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeManagement } from "./EmployeeManagement";
import { CategoryManagement } from "./CategoryManagement";
import { SystemSettings } from "./SystemSettings";
import { UserManagement } from "./UserManagement";
import { Employee } from "@/lib/types";
import { loadStationaryData } from "@/lib/localStorage";
import { UserCog } from "lucide-react";

interface AdminManagementProps {
  employees: Employee[];
  updateEmployees: (employees: Employee[]) => void;
  categories: string[];
  updateCategories: (categories: string[]) => void;
}

export function AdminManagement({ 
  employees, 
  updateEmployees, 
  categories, 
  updateCategories 
}: AdminManagementProps) {
  // Function to handle data reset
  const handleDataReset = () => {
    const { employees: resetEmployees, categories: resetCategories } = loadStationaryData();
    updateEmployees(resetEmployees);
    updateCategories(resetCategories);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Administration</h2>
      
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">
            <span className="flex items-center">
              <UserCog className="mr-1.5 h-4 w-4" />
              Users
            </span>
          </TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <EmployeeManagement 
            employees={employees} 
            updateEmployees={updateEmployees} 
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryManagement 
            categories={categories} 
            updateCategories={updateCategories} 
          />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings onDataReset={handleDataReset} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
