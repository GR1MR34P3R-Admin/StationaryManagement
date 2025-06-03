import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "@/components/stationary/inventory/InventoryManagement";
import { IssueManagement } from "@/components/stationary/issues/IssueManagement";
import { SigningManagement } from "@/components/stationary/signing/SigningManagement";
import { AdminManagement } from "@/components/stationary/admin/AdminManagement";
import { Dashboard } from "@/components/stationary/dashboard/Dashboard";
import { StationaryIssue, StationaryItem, Employee, User } from "@/lib/types";
import { hasPermission } from "@/lib/auth";
import {
  loadStationaryData,
  saveStationaryData
} from "@/lib/localStorage";
import { 
  LayoutDashboard, 
  Box, 
  ClipboardList, 
  FileSignature, 
  Settings,
  AlertTriangle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StationaryManagementProps {
  currentUser: User;
}

export function StationaryManagement({ currentUser }: StationaryManagementProps) {
  // Load data from local storage on component mount
  const { inventory: initialInventoryData, issues: initialIssuesData, 
          employees: initialEmployeesData, categories: initialCategoriesData } = loadStationaryData();

  const [issues, setIssues] = React.useState<StationaryIssue[]>(initialIssuesData);
  const [inventory, setInventory] = React.useState<StationaryItem[]>(initialInventoryData);
  const [employeesList, setEmployeesList] = React.useState<Employee[]>(initialEmployeesData);
  const [categoriesList, setCategoriesList] = React.useState<string[]>(initialCategoriesData);
  const [activeTab, setActiveTab] = React.useState<string>("dashboard");
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);

  // Save data to local storage whenever it changes
  React.useEffect(() => {
    saveStationaryData(inventory, issues, employeesList, categoriesList);
    // Show save confirmation briefly
    setSaveSuccess(true);
    const timer = setTimeout(() => setSaveSuccess(false), 2000);
    
    return () => clearTimeout(timer);
  }, [inventory, issues, employeesList, categoriesList]);

  // Function to update issues from any component
  const updateIssues = (updatedIssues: StationaryIssue[]) => {
    setIssues(updatedIssues);
  };

  // Function to update inventory from any component
  const updateInventory = (updatedInventory: StationaryItem[]) => {
    setInventory(updatedInventory);
  };

  // Function to update employees list
  const updateEmployees = (updatedEmployees: Employee[]) => {
    setEmployeesList(updatedEmployees);
  };

  // Function to update categories list
  const updateCategories = (updatedCategories: string[]) => {
    setCategoriesList(updatedCategories);
  };

  // Navigation functions
  const navigateToInventory = () => setActiveTab("inventory");
  const navigateToIssues = () => setActiveTab("issues");

  // Check if user has admin permissions
  const canAccessAdmin = hasPermission(currentUser, "canManageUsers");
  
  // Check for low stock items
  const lowStockCount = inventory.filter(item => item.stockQuantity <= item.threshold).length;
  const pendingIssuesCount = issues.filter(issue => issue.status === "pending").length;

  return (
    <div>
      {/* Show save confirmation */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          Changes saved successfully
        </div>
      )}
      
      {/* Low stock warning */}
      {lowStockCount > 0 && (
        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-800" />
          <AlertDescription className="flex justify-between items-center">
            <span>There are {lowStockCount} items with low stock that need attention.</span>
            <button 
              className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-md transition-colors"
              onClick={navigateToInventory}
            >
              View Low Stock Items
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Pending issues alert */}
      {pendingIssuesCount > 0 && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <FileSignature className="h-4 w-4 text-blue-800" />
          <AlertDescription className="flex justify-between items-center">
            <span>There are {pendingIssuesCount} pending issues that require signatures.</span>
            <button 
              className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors"
              onClick={() => setActiveTab("signing")}
            >
              Go to Signing
            </button>
          </AlertDescription>
        </Alert>
      )}
  
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${canAccessAdmin ? 'grid-cols-5' : 'grid-cols-4'} mb-8 relative`}>
          <TabsTrigger value="dashboard" className="flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1.5">
            <Box className="h-4 w-4" />
            <span>Inventory</span>
            {lowStockCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {lowStockCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4" />
            <span>Issues</span>
          </TabsTrigger>
          <TabsTrigger value="signing" className="flex items-center gap-1.5">
            <FileSignature className="h-4 w-4" />
            <span>Signing</span>
            {pendingIssuesCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {pendingIssuesCount}
              </span>
            )}
          </TabsTrigger>
          {canAccessAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              <span>Administration</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="dashboard" className="focus-visible:outline-none focus-visible:ring-0">
          <Dashboard 
            inventory={inventory}
            issues={issues}
            employees={employeesList}
            onNavigateToInventory={navigateToInventory}
            onNavigateToIssues={navigateToIssues}
          />
        </TabsContent>
        
        <TabsContent value="inventory" className="focus-visible:outline-none focus-visible:ring-0">
          <InventoryManagement 
            inventory={inventory}
            updateInventory={updateInventory}
            categories={categoriesList}
            currentUser={currentUser}
          />
        </TabsContent>
        
        <TabsContent value="issues" className="focus-visible:outline-none focus-visible:ring-0">
          <IssueManagement 
            issues={issues}
            updateIssues={updateIssues}
            inventory={inventory}
            updateInventory={updateInventory}
            employees={employeesList}
            currentUser={currentUser}
          />
        </TabsContent>
        
        <TabsContent value="signing" className="focus-visible:outline-none focus-visible:ring-0">
          <SigningManagement 
            issues={issues}
            updateIssues={updateIssues}
            inventory={inventory}
            updateInventory={updateInventory}
          />
        </TabsContent>
        
        {canAccessAdmin && (
          <TabsContent value="admin" className="focus-visible:outline-none focus-visible:ring-0">
            <AdminManagement 
              employees={employeesList}
              updateEmployees={updateEmployees}
              categories={categoriesList}
              updateCategories={updateCategories}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
