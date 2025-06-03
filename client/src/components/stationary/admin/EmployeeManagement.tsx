import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Employee } from "@/lib/types";

interface EmployeeManagementProps {
  employees: Employee[];
  updateEmployees: (employees: Employee[]) => void;
}

export function EmployeeManagement({ employees, updateEmployees }: EmployeeManagementProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newEmployee, setNewEmployee] = React.useState<Employee>({
    id: "",
    name: "",
    department: ""
  });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editFormData, setEditFormData] = React.useState<Employee | null>(null);

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
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

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.id || !newEmployee.name || !newEmployee.department) {
      return;
    }
    
    // Check if ID already exists
    if (employees.some(emp => emp.id === newEmployee.id)) {
      alert("Employee ID already exists. Please use a unique ID.");
      return;
    }
    
    updateEmployees([...employees, newEmployee]);
    setNewEmployee({ id: "", name: "", department: "" });
    setShowAddForm(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setEditFormData({ ...employee });
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    
    // Check if ID is empty
    if (!editFormData.id.trim()) {
      alert("Employee ID cannot be empty");
      return;
    }
    
    // Check if the ID already exists on another employee
    const duplicateId = employees.some(
      emp => emp.id === editFormData.id && emp.id !== editingId
    );
    
    if (duplicateId) {
      alert("This Employee ID is already in use. Please use a unique ID.");
      return;
    }
    
    updateEmployees(
      employees.map(employee => 
        employee.id === editingId ? editFormData : employee
      )
    );
    
    setEditingId(null);
    setEditFormData(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleDelete = (id: string) => {
    updateEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Employee Management</h3>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Employee ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={newEmployee.id}
                    onChange={handleAddInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Employee Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleAddInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={newEmployee.department}
                    onChange={handleAddInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No employees found. Add employees to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
        {editingId === employee.id ? (
          <Input
            name="id"
            value={editFormData?.id}
            onChange={handleEditInputChange}
          />
        ) : (
          <span className="font-medium">{employee.id}</span>
        )}
      </TableCell>
                      <TableCell>
                        {editingId === employee.id ? (
                          <Input
                            name="name"
                            value={editFormData?.name}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          employee.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === employee.id ? (
                          <Input
                            name="department"
                            value={editFormData?.department}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          employee.department
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === employee.id ? (
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
                              onClick={() => handleEdit(employee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
