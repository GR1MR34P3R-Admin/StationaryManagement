import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import { IssuesTable } from "./IssuesTable";
import { CreateIssueForm } from "./CreateIssueForm";
import { Input } from "@/components/ui/input";
import { StationaryIssue, StationaryItem, Employee, User } from "@/lib/types";
import { hasPermission } from "@/lib/auth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IssueManagementProps {
  issues: StationaryIssue[];
  updateIssues: (issues: StationaryIssue[]) => void;
  inventory: StationaryItem[];
  updateInventory: (inventory: StationaryItem[]) => void;
  employees: Employee[];
  currentUser: User;
}

export function IssueManagement({ 
  issues, 
  updateIssues, 
  inventory, 
  updateInventory,
  employees,
  currentUser
}: IssueManagementProps) {
  const canEdit = hasPermission(currentUser, "canEdit");
  const canDelete = hasPermission(currentUser, "canDelete");
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedIssues, setSelectedIssues] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredIssues, setFilteredIssues] = React.useState<StationaryIssue[]>(issues);

  const createIssue = (issue: StationaryIssue) => {
    // Generate a unique ID for the issue using timestamp + employeeID for traceability
    const timestamp = Date.now();
    const uniqueId = `${timestamp}-${issue.employeeId}`;
    
    // Add new issue to the list with pending status and creator information
    const newIssue = { 
      ...issue, 
      id: uniqueId, // Use unique ID for each issue
      status: "pending", // All new issues start as pending and require signature
      createdBy: {
        role: currentUser.role,
        name: currentUser.name,
        employeeId: currentUser.employeeId
      }
    };
    
    // Always add as a new issue to maintain history
    const updatedIssues = [...issues, newIssue];
    updateIssues(updatedIssues);
    
    // Update inventory quantities
    const updatedInventory = [...inventory];
    
    issue.items.forEach(issuedItem => {
      const inventoryItemIndex = updatedInventory.findIndex(
        item => item.id === issuedItem.itemId
      );
      
      if (inventoryItemIndex !== -1) {
        updatedInventory[inventoryItemIndex] = {
          ...updatedInventory[inventoryItemIndex],
          stockQuantity: updatedInventory[inventoryItemIndex].stockQuantity - issuedItem.quantity
        };
      }
    });
    
    updateInventory(updatedInventory);
    setShowCreateForm(false);
  };

  const updateIssueStatus = (issueId: string, status: "pending" | "issued" | "returned") => {
    const issueToUpdate = issues.find(issue => issue.id === issueId);
    
    if (!issueToUpdate) return;
    
    // Get current inventory
    const updatedInventory = [...inventory];
    
    // If status is being changed to returned, add items back to inventory
    if (status === "returned" && issueToUpdate.status !== "returned") {
      // For each item in the issue, increase inventory by the returned quantity
      issueToUpdate.items.forEach(issuedItem => {
        const inventoryItemIndex = updatedInventory.findIndex(item => item.id === issuedItem.itemId);
        
        if (inventoryItemIndex !== -1) {
          // Add back all items
          updatedInventory[inventoryItemIndex] = {
            ...updatedInventory[inventoryItemIndex],
            stockQuantity: updatedInventory[inventoryItemIndex].stockQuantity + issuedItem.quantity
          };
        }
      });
      
      // Update the inventory
      updateInventory(updatedInventory);
    }
    // If status is being changed from returned to issued, subtract items from inventory
    else if (status === "issued" && issueToUpdate.status === "returned") {
      // For each item in the issue, decrease inventory by the issued quantity
      issueToUpdate.items.forEach(issuedItem => {
        const inventoryItemIndex = updatedInventory.findIndex(item => item.id === issuedItem.itemId);
        
        if (inventoryItemIndex !== -1) {
          // Subtract all items
          updatedInventory[inventoryItemIndex] = {
            ...updatedInventory[inventoryItemIndex],
            stockQuantity: Math.max(0, updatedInventory[inventoryItemIndex].stockQuantity - issuedItem.quantity)
          };
        }
      });
      
      // Update the inventory
      updateInventory(updatedInventory);
    }
    
    // Update the issue status
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status } 
        : issue
    );
    
    updateIssues(updatedIssues);
  };

  const handleIssueSelection = (issueId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedIssues([...selectedIssues, issueId]);
    } else {
      setSelectedIssues(selectedIssues.filter(id => id !== issueId));
    }
  };

  const clearSelectedIssues = () => {
    if (selectedIssues.length > 0) {
      const updatedIssues = issues.filter(issue => !selectedIssues.includes(issue.id));
      updateIssues(updatedIssues);
      setSelectedIssues([]);
    }
    setShowDeleteDialog(false);
  };

  const clearAllIssues = () => {
    updateIssues([]);
    setSelectedIssues([]);
    setShowDeleteDialog(false);
  };
  
  // Filter issues when search query or issues change
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredIssues(issues);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = issues.filter(issue => 
      issue.id.toLowerCase().includes(query) || 
      issue.employeeName.toLowerCase().includes(query) || 
      issue.department.toLowerCase().includes(query) ||
      issue.status.toLowerCase().includes(query) ||
      // Search within issued items
      issue.items.some(item => item.itemName.toLowerCase().includes(query))
    );
    setFilteredIssues(filtered);
  }, [searchQuery, issues]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Issue Management</h2>
        <div className="flex space-x-2">
          {canDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          )}
          <Button size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateIssueForm
              inventory={inventory}
              employees={employees}
              onSubmit={createIssue}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Issue History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee, department, status or item name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-muted-foreground">
                Showing {filteredIssues.length} of {issues.length} issues
              </div>
            )}
          </div>
          <IssuesTable 
            issues={filteredIssues} 
            onUpdateStatus={updateIssueStatus}
            selectedIssues={selectedIssues}
            onIssueSelect={handleIssueSelection}
            canEdit={canEdit}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Issues History</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIssues.length > 0 
                ? `Are you sure you want to delete ${selectedIssues.length} selected issue(s)? This action cannot be undone.`
                : "Do you want to clear all issues history or only select specific issues to delete?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {selectedIssues.length > 0 ? (
              <AlertDialogAction 
                onClick={clearSelectedIssues}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Selected
              </AlertDialogAction>
            ) : (
              <AlertDialogAction 
                onClick={clearAllIssues}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear All History
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}