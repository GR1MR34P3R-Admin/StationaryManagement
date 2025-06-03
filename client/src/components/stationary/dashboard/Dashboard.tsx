import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StationaryIssue, StationaryItem, Employee, User } from "@/lib/types";
import { 
  BarChart3, BoxIcon, Package, Users, AlertTriangle, ChevronRight, 
  FileCheck, ArrowDown, ArrowUp, Clock, Layers, CheckCircle2
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { getCurrentUser } from "@/lib/auth";

interface DashboardProps {
  inventory: StationaryItem[];
  issues: StationaryIssue[];
  employees: Employee[];
  onNavigateToInventory: () => void;
  onNavigateToIssues: () => void;
}

export function Dashboard({ 
  inventory, 
  issues, 
  employees,
  onNavigateToInventory,
  onNavigateToIssues
}: DashboardProps) {
  // Get current time for greeting message
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const currentUser = getCurrentUser();
  
  // Calculate statistics
  const totalInventoryCount = inventory.length;
  const lowStockCount = inventory.filter(item => item.stockQuantity <= item.threshold).length;
  const totalItemsQuantity = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);
  
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(issue => issue.status === "pending").length;
  const issuedItems = issues.filter(issue => issue.status === "issued").length;
  const returnedItems = issues.filter(issue => issue.status === "returned").length;
  
  // Calculate total items issued and returned
  const totalItemsIssued = issues.reduce((sum, issue) => {
    return sum + issue.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  
  const totalItemsReturned = issues.filter(issue => issue.status === "returned")
    .reduce((sum, issue) => {
      return sum + issue.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
  
  // Calculate recent activity - last 5 issues
  const recentActivity = [...issues]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  // Calculate today's date for dashboard
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">{greeting}, {currentUser?.name || "User"}</h2>
              <p className="text-blue-700 mt-1">Welcome to your Stationary Management Dashboard</p>
              <p className="text-sm text-blue-600 mt-1">{today}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white" onClick={onNavigateToInventory}>
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
              <Button variant="outline" size="sm" className="bg-white" onClick={onNavigateToIssues}>
                <FileCheck className="mr-2 h-4 w-4" />
                View Issues
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Statistics */}
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <Layers className="mr-2 h-5 w-5 text-muted-foreground" />
        Summary Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <StatsCard
            title="Total Inventory"
            value={`${totalInventoryCount} items`}
            description={`Total quantity: ${totalItemsQuantity}`}
            icon={Package}
          />
          <div className="mt-2">
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal text-xs"
              onClick={onNavigateToInventory}
            >
              View inventory <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <div>
          <StatsCard
            title="Low Stock Items"
            value={lowStockCount}
            description={`${Math.round((lowStockCount / Math.max(totalInventoryCount, 1)) * 100)}% of inventory`}
            icon={AlertTriangle}
            iconColor="text-destructive"
            trend={lowStockCount > 0 ? {
              value: lowStockCount,
              label: "items need reordering",
              isPositive: false
            } : undefined}
          />
          <div className="mt-2">
            <Progress 
              value={(lowStockCount / Math.max(totalInventoryCount, 1)) * 100} 
              className={lowStockCount > 0 ? "bg-destructive/20" : ""}
            />
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal text-xs mt-2"
              onClick={onNavigateToInventory}
            >
              View low stock <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues Status</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues} total</div>
            
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Pending</span>
                  <span>{pendingIssues}</span>
                </div>
                <Progress value={(pendingIssues / Math.max(totalIssues, 1)) * 100} className="bg-blue-100" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Issued</span>
                  <span>{issuedItems}</span>
                </div>
                <Progress value={(issuedItems / Math.max(totalIssues, 1)) * 100} className="bg-primary/20" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Returned</span>
                  <span>{returnedItems}</span>
                </div>
                <Progress value={(returnedItems / Math.max(totalIssues, 1)) * 100} className="bg-green-100" />
              </div>
            </div>
            
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal text-xs mt-3"
              onClick={onNavigateToIssues}
            >
              Manage issues <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        <div>
          <StatsCard
            title="Items Movement"
            value={totalItemsIssued - totalItemsReturned}
            description={`${totalItemsIssued} issued, ${totalItemsReturned} returned`}
            icon={BoxIcon}
            iconColor="text-blue-500"
          />
          <div className="mt-2 text-xs text-center">
            <span className="inline-block w-3 h-3 bg-primary/20 rounded-full mr-1"></span>
            <span className="text-muted-foreground mr-3">Issued</span>
            <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-1"></span>
            <span className="text-muted-foreground">Returned</span>
          </div>
        </div>
      </div>
      
      {/* Tasks & Activity */}
      <div className="flex items-center space-x-2 mt-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold">Recent Activity & Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activity</CardTitle>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                Last {Math.min(5, recentActivity.length)} activities
              </div>
            </div>
            <CardDescription>Latest stationary issues and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((issue) => (
                  <div key={issue.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full 
                      ${issue.status === 'pending' ? 'bg-blue-50' : 
                        issue.status === 'issued' ? 'bg-primary/10' : 
                        'bg-green-50'}`}>
                      {issue.status === 'pending' ? (
                        <FileCheck className="h-4 w-4 text-blue-600" />
                      ) : issue.status === 'issued' ? (
                        <ArrowDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none flex justify-between">
                        <span>{issue.employeeName}</span>
                        <span className="text-xs text-muted-foreground">{issue.issueDate}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {issue.department} • {issue.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                      <div className="flex items-center pt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full 
                          ${issue.status === 'pending' ? 'bg-blue-50 text-blue-600' : 
                            issue.status === 'issued' ? 'bg-primary/10 text-primary' : 
                            'bg-green-50 text-green-600'}`}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <FileCheck className="h-10 w-10 mb-2 opacity-20" />
                <p>No recent activity</p>
                <p className="text-xs mt-1">Issue history will appear here</p>
              </div>
            )}
          </CardContent>
          {recentActivity.length > 0 && (
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={onNavigateToIssues}>
                View all activity
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Inventory by Category</CardTitle>
              <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                {Array.from(new Set(inventory.map(item => item.category))).length} categories
              </div>
            </div>
            <CardDescription>Distribution and stock levels analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {inventory.length > 0 ? (
              <div className="space-y-4">
                {Array.from(new Set(inventory.map(item => item.category))).map((category) => {
                  const items = inventory.filter(item => item.category === category);
                  const totalQuantity = items.reduce((sum, item) => sum + item.stockQuantity, 0);
                  const lowStockItems = items.filter(item => item.stockQuantity <= item.threshold);
                  const lowStockPercentage = Math.round((lowStockItems.length / Math.max(items.length, 1)) * 100);
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{category}</div>
                        <div className="text-sm flex items-center gap-2">
                          <span className="text-muted-foreground">{items.length} items</span>
                          {lowStockItems.length > 0 ? (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                              {lowStockPercentage}% low
                            </span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-medium flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Good
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${lowStockItems.length > 0 ? 'bg-amber-400' : 'bg-primary'}`}
                          style={{ width: `${(totalQuantity / totalItemsQuantity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{totalQuantity} units</span>
                        <span className="text-muted-foreground">{Math.round((totalQuantity / totalItemsQuantity) * 100)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mb-2 opacity-20" />
                <p>No inventory data available</p>
                <p className="text-xs mt-1">Add items to see category analysis</p>
              </div>
            )}
          </CardContent>
          {inventory.length > 0 && (
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={onNavigateToInventory}>
                Manage inventory
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {/* Employee Stats */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-muted-foreground" />
              Employee Information
            </CardTitle>
            <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
              {employees.length} employees
            </div>
          </div>
          <CardDescription>Statistics by department and employee activity</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Departments</h4>
                <div className="text-2xl font-bold">
                  {Array.from(new Set(employees.map(e => e.department))).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across organization
                </p>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Most Active Department</h4>
                {issues.length > 0 ? (
                  <>
                    <div className="text-sm font-bold">
                      {Object.entries(
                        issues.reduce((acc, issue) => {
                          acc[issue.department] = (acc[issue.department] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort((a, b) => b[1] - a[1])[0][0]}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on issue count
                    </p>
                  </>
                ) : (
                  <div className="text-sm">No data available</div>
                )}
              </div>
              
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Average Items per Employee</h4>
                <div className="text-2xl font-bold">
                  {employees.length > 0 && totalIssues > 0
                    ? (totalItemsIssued / employees.length).toFixed(1)
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Items issued per employee
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
              <p>No employee data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
