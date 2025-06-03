import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StationaryIssue } from "@/lib/types";
import { ChevronDown, Info, FileText } from "lucide-react";

interface IssuesTableProps {
  issues: StationaryIssue[];
  onUpdateStatus: (issueId: string, status: "pending" | "issued" | "returned") => void;
  selectedIssues?: string[];
  onIssueSelect?: (issueId: string, isSelected: boolean) => void;
  canEdit?: boolean;
}

export function IssuesTable({ 
  issues, 
  onUpdateStatus, 
  selectedIssues = [],
  onIssueSelect,
  canEdit = false
}: IssuesTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {onIssueSelect && <TableHead className="w-[30px]"></TableHead>}
            <TableHead>Issue ID</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onIssueSelect ? 9 : 8} className="text-center py-4">
                No issues found. Create a new issue to get started.
              </TableCell>
            </TableRow>
          ) : (
            issues.map((issue) => (
              <TableRow key={issue.id}>
                {onIssueSelect && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIssues.includes(issue.id)}
                      onCheckedChange={(checked) => 
                        onIssueSelect(issue.id, checked === true)
                      }
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  {issue.id.includes('-') 
                    ? `#${issue.id.split('-')[1]}` // Show only employee ID part for readability
                    : issue.id
                  }
                </TableCell>
                <TableCell>{issue.employeeName}</TableCell>
                <TableCell>{issue.department}</TableCell>
                <TableCell>{issue.issueDate}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        {issue.items.length} items <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Issued Items</h4>
                        <ul className="text-sm space-y-1">
                          {issue.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.itemName}</span>
                              <div className="text-right">
                                <span>
                                  {item.quantity} {item.quantity > 1 ? "units" : "unit"}
                                </span>
                                {item.returned && (
                                  <div className="text-xs text-green-600">
                                    ({item.returned} returned)
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  {issue.status === "pending" && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Pending Signature
                    </Badge>
                  )}
                  {issue.status === "issued" && (
                    <Badge>Issued</Badge>
                  )}
                  {issue.status === "returned" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Returned
                    </Badge>
                  )}
                  {issue.status === "partial-return" && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Partial Return
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {issue.createdBy ? (
                    <span className="text-xs">
                      {issue.createdBy.role} - {issue.createdBy.name}({issue.createdBy.employeeId})
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not recorded</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {issue.signatureData && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="left" className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Signature Record</h4>
                            <div className="space-y-2">
                              <div className="border rounded p-2">
                                <img 
                                  src={issue.signatureData} 
                                  alt="Employee signature" 
                                  className="w-full"
                                />
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Signed on: {issue.signedDate}
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Update Status</h4>
                          <div className="flex flex-col space-y-2">
                            {issue.status !== "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUpdateStatus(issue.id, "issued")}
                                  className={issue.status === "issued" ? "bg-primary/10" : ""}
                                >
                                  Mark as Issued
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUpdateStatus(issue.id, "returned")}
                                  className={issue.status === "returned" ? "bg-primary/10" : ""}
                                >
                                  Mark as Returned
                                </Button>
                                {issue.status === "returned" && (
                                  <div className="text-xs text-green-600 mt-1">
                                    Items have been returned to inventory
                                  </div>
                                )}
                              </>
                            )}
                            {issue.status === "pending" && (
                              <div className="text-sm text-amber-600">
                                Requires employee signature before status can be changed.
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
