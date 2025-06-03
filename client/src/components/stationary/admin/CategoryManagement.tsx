import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface CategoryManagementProps {
  categories: string[];
  updateCategories: (categories: string[]) => void;
}

export function CategoryManagement({ categories, updateCategories }: CategoryManagementProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      return;
    }
    
    // Check if category already exists (case insensitive)
    if (categories.some(cat => cat.toLowerCase() === newCategory.toLowerCase())) {
      alert("This category already exists");
      return;
    }
    
    updateCategories([...categories, newCategory]);
    setNewCategory("");
    setShowAddForm(false);
  };

  const handleEdit = (category: string, index: number) => {
    setEditingIndex(index);
    setEditValue(category);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    
    // Check if category already exists and it's not the one being edited
    if (categories.some((cat, idx) => 
      idx !== editingIndex && cat.toLowerCase() === editValue.toLowerCase())
    ) {
      alert("This category already exists");
      return;
    }
    
    const updatedCategories = [...categories];
    updatedCategories[editingIndex] = editValue;
    updateCategories(updatedCategories);
    
    setEditingIndex(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleDelete = (index: number) => {
    const updatedCategories = categories.filter((_, idx) => idx !== index);
    updateCategories(updatedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Category Management</h3>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  value={newCategory}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No categories found. Add categories to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editValue}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          category
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingIndex === index ? (
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
                              onClick={() => handleEdit(category, index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(index)}
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
