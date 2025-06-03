// Item inventory types
export interface StationaryItem {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  unit: string;
  threshold: number;
}

// Issue types
export interface Employee {
  id: string;
  name: string;
  department: string;
}

export interface StationaryIssue {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  items: IssuedItem[];
  issueDate: string;
  status: "pending" | "issued" | "returned";
  signatureData?: string;
  signedDate?: string;
  createdBy?: {
    role: UserRole;
    name: string;
    employeeId: string;
  };
}

export interface IssuedItem {
  itemId: string;
  itemName: string;
  quantity: number;
  returned?: number;
}

// User types
export type UserRole = "Admin" | "Admin Assistant" | "Guest";

export interface UserPermissions {
  canView: boolean;
  canIssue: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

export interface User {
  role: UserRole;
  name: string;
  employeeId: string;
  permissions: UserPermissions;
  password?: string; // Optional for user management
}
