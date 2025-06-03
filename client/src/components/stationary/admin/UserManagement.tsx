import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Save, X, Lock, UserPlus, UserCog, ShieldAlert } from "lucide-react";
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
import { User, UserRole } from "@/lib/types";
import { getAllUsers, addUser, updateUser, deleteUser, rolePermissions } from "@/lib/auth";

export function UserManagement() {
  const [users, setUsers] = React.useState<User[]>(getAllUsers());
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editFormData, setEditFormData] = React.useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);
  
  const [newUser, setNewUser] = React.useState<{
    role: UserRole | "";
    name: string;
    employeeId: string;
    password: string;
  }>({
    role: "",
    name: "",
    employeeId: "",
    password: ""
  });

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleRoleChange = (value: string) => {
    setNewUser({
      ...newUser,
      role: value as UserRole
    });
  };

  const handleEditRoleChange = (value: string) => {
    if (!editFormData) return;
    
    setEditFormData({
      ...editFormData,
      role: value as UserRole,
      permissions: rolePermissions[value as UserRole]
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.role || !newUser.name || !newUser.employeeId || !newUser.password) {
      alert("All fields are required");
      return;
    }
    
    // Check if employee ID already exists
    if (users.some(user => user.employeeId === newUser.employeeId)) {
      alert("An user with this employee ID already exists");
      return;
    }
    
    // Add the new user
    const added = addUser(newUser.role as UserRole, newUser.name, newUser.employeeId, newUser.password);
    if (added) {
      setUsers(getAllUsers());
      setNewUser({
        role: "",
        name: "",
        employeeId: "",
        password: ""
      });
      setShowAddForm(false);
    } else {
      alert("Failed to add user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.employeeId);
    setEditFormData({ ...user });
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    
    // Validate fields
    if (!editFormData.role || !editFormData.name || !editFormData.employeeId) {
      alert("Name, Role and Employee ID are required");
      return;
    }
    
    // Check if employee ID already exists on another user
    const duplicateId = users.some(
      user => user.employeeId === editFormData.employeeId && user.employeeId !== editingId
    );
    
    if (duplicateId) {
      alert("An user with this employee ID already exists");
      return;
    }
    
    // Update the user
    const updated = updateUser(editFormData);
    if (updated) {
      setUsers(getAllUsers());
      setEditingId(null);
      setEditFormData(null);
    } else {
      alert("Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const confirmDelete = (employeeId: string) => {
    setUserToDelete(employeeId);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    
    const deleted = deleteUser(userToDelete);
    if (deleted) {
      setUsers(getAllUsers());
    } else {
      alert("Failed to delete user");
    }
    
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">User Management</h3>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Add New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleAddInputChange}
                    placeholder="Enter user's full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    value={newUser.employeeId}
                    onChange={handleAddInputChange}
                    placeholder="Enter unique employee ID"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Admin Assistant">Admin Assistant</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleAddInputChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="mr-2 h-5 w-5" />
            Registered Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ShieldAlert className="h-10 w-10 mb-3 text-muted-foreground/40" />
              <p>No registered users found.</p>
              <p className="text-sm mt-1">Add users to allow them to login to the system.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.employeeId}>
                      <TableCell>
                        {editingId === user.employeeId ? (
                          <Input
                            name="employeeId"
                            value={editFormData?.employeeId}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          <span className="font-medium">{user.employeeId}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === user.employeeId ? (
                          <Input
                            name="name"
                            value={editFormData?.name}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === user.employeeId ? (
                          <Select value={editFormData?.role} onValueChange={handleEditRoleChange}>
                            <SelectTrigger id="edit-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Admin Assistant">Admin Assistant</SelectItem>
                              <SelectItem value="Guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center">
                            {user.role === "Admin" && (
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                {user.role}
                              </span>
                            )}
                            {user.role === "Admin Assistant" && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                {user.role}
                              </span>
                            )}
                            {user.role === "Guest" && (
                              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                {user.role}
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === user.employeeId ? (
                          <Input
                            name="password"
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={editFormData?.password || ""}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          <span className="flex items-center text-muted-foreground text-sm">
                            <Lock className="h-3 w-3 mr-1" />
                            ••••••••
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === user.employeeId ? (
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSaveEdit}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(user.employeeId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
