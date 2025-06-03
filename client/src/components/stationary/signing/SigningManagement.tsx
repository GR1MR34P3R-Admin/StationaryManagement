import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { StationaryIssue, StationaryItem } from "@/lib/types";
import { PendingIssuesList } from "./PendingIssuesList";
import { SignatureForm } from "./SignatureForm";
import { ClipboardSignature, CheckCircle2, FileSignature } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SigningManagementProps {
  issues: StationaryIssue[];
  updateIssues: (issues: StationaryIssue[]) => void;
  inventory: StationaryItem[];
  updateInventory: (inventory: StationaryItem[]) => void;
}

export function SigningManagement({ 
  issues, 
  updateIssues, 
  inventory, 
  updateInventory 
}: SigningManagementProps) {
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  
  const pendingIssues = issues.filter(issue => issue.status === "pending");
  const selectedIssue = issues.find(issue => issue.id === selectedIssueId);
  
  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  const handleIssueSelect = (issueId: string) => {
    setSelectedIssueId(issueId);
    setSuccessMessage(null);
  };
  
  const handleSignatureComplete = (issueId: string, signatureData: string) => {
    const issueToUpdate = issues.find(issue => issue.id === issueId);
    if (!issueToUpdate) return;
    
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            status: "issued", 
            signatureData,
            signedDate: new Date().toISOString().split("T")[0]
          } 
        : issue
    );
    
    // Update issues
    updateIssues(updatedIssues);
    
    // Set success message with employee name
    setSuccessMessage(`Successfully signed by ${issueToUpdate.employeeName}. Issue status updated to "Issued".`);
    
    // Reset selected issue
    setSelectedIssueId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="rounded-full bg-primary/10 p-2">
          <FileSignature className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Issue Signing</h2>
          <p className="text-muted-foreground">Have employees sign here to complete the issue process.</p>
        </div>
      </div>
      
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <ClipboardSignature className="h-5 w-5 mr-2 text-primary" />
                Pending Issues
              </CardTitle>
              <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                {pendingIssues.length} pending
              </div>
            </div>
            <CardDescription>
              Select an issue for employee signature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PendingIssuesList 
              pendingIssues={pendingIssues} 
              selectedIssueId={selectedIssueId}
              onIssueSelect={handleIssueSelect}
            />
          </CardContent>
          <CardFooter className="bg-muted/5 text-xs text-muted-foreground border-t pt-4">
            All pending issues require signatures before items can be marked as issued.
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
              Signature Confirmation
            </CardTitle>
            <CardDescription>
              {selectedIssue 
                ? `${selectedIssue.employeeName} to sign below to confirm receipt of items` 
                : "Select an issue from the list to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedIssue ? (
              <SignatureForm 
                issue={selectedIssue}
                onSignatureComplete={handleSignatureComplete}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] bg-muted/5 rounded-md border border-dashed">
                <ClipboardSignature className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No issue selected</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Select an issue from the list to proceed with signing
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
