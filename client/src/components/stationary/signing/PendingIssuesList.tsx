import * as React from "react";
import { StationaryIssue } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Users, ClipboardList, PenTool, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PendingIssuesListProps {
  pendingIssues: StationaryIssue[];
  selectedIssueId: string | null;
  onIssueSelect: (issueId: string) => void;
}

export function PendingIssuesList({ 
  pendingIssues, 
  selectedIssueId, 
  onIssueSelect 
}: PendingIssuesListProps) {
  
  if (pendingIssues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-muted/5 rounded-md border border-dashed">
        <ClipboardList className="h-10 w-10 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground font-medium">All caught up!</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          No pending issues requiring signatures
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[450px] pr-3">
      <div className="space-y-3">
        {pendingIssues.map((issue) => (
          <div 
            key={issue.id}
            className={`p-4 border rounded-md transition-all ${
              selectedIssueId === issue.id 
                ? 'bg-primary/5 border-primary shadow-sm' 
                : 'hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-1.5 text-primary/70" />
                {issue.employeeName}
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                Pending
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                {issue.issueDate}
              </div>
              <div className="flex items-center text-muted-foreground justify-end">
                {issue.department}
              </div>
            </div>
            
            <div className="mb-4 bg-muted/30 p-2 rounded-sm">
              <div className="flex items-center mb-1">
                <Box className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <h4 className="text-xs font-medium">Items to be signed for:</h4>
              </div>
              <ul className="text-sm space-y-1">
                {issue.items.map((item, index) => (
                  <li key={index} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.itemName}</span>
                    <span className="font-medium">{item.quantity} {item.quantity > 1 ? 'units' : 'unit'}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button
              variant={selectedIssueId === issue.id ? "default" : "outline"}
              className="w-full"
              onClick={() => onIssueSelect(issue.id)}
              size="sm"
            >
              {selectedIssueId === issue.id ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Selected for Signing
                </>
              ) : (
                <>
                  <PenTool className="mr-2 h-4 w-4" />
                  Select for Signature
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
