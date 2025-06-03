import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { StationaryIssue, StationaryItem, IssuedItem, Employee } from "@/lib/types";
import { X, Plus } from "lucide-react";

interface CreateIssueFormProps {
  inventory: StationaryItem[];
  employees: Employee[];
  onSubmit: (issue: StationaryIssue) => void;
  onCancel: () => void;
}

export function CreateIssueForm({ inventory, employees, onSubmit, onCancel }: CreateIssueFormProps) {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<IssuedItem[]>([]);
  const [currentItem, setCurrentItem] = React.useState<{
    itemId: string;
    quantity: number;
  }>({ itemId: "", quantity: 1 });

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee || null);
  };

  const handleItemSelect = (itemId: string) => {
    setCurrentItem({
      ...currentItem,
      itemId,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItem({
      ...currentItem,
      quantity: parseInt(e.target.value) || 1,
    });
  };

  const addItemToSelection = () => {
    if (!currentItem.itemId || currentItem.quantity <= 0) return;
    
    const inventoryItem = inventory.find(item => item.id === currentItem.itemId);
    if (!inventoryItem) return;
    
    // Check if there's enough stock
    if (inventoryItem.stockQuantity < currentItem.quantity) {
      alert(`Not enough stock. Only ${inventoryItem.stockQuantity} available.`);
      return;
    }
    
    // Check if item already exists in selection
    const existingItemIndex = selectedItems.findIndex(
      item => item.itemId === currentItem.itemId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      const newItems = [...selectedItems];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + currentItem.quantity,
      };
      setSelectedItems(newItems);
    } else {
      // Add new item to selection
      setSelectedItems([
        ...selectedItems,
        {
          itemId: currentItem.itemId,
          itemName: inventoryItem.name,
          quantity: currentItem.quantity,
        },
      ]);
    }
    
    // Reset current item
    setCurrentItem({ itemId: "", quantity: 1 });
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }
    
    if (selectedItems.length === 0) {
      alert("Please add at least one item");
      return;
    }
    
    const newIssue: StationaryIssue = {
      id: "", // This will be generated in the parent component
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      items: selectedItems,
      issueDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    
    onSubmit(newIssue);
  };

  // Filter out items with zero stock
  const availableInventory = inventory.filter(item => item.stockQuantity > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employee">Employee</Label>
          <Select onValueChange={handleEmployeeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Add Items</Label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Select onValueChange={handleItemSelect} value={currentItem.itemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {availableInventory.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.stockQuantity} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Input
                type="number"
                min="1"
                value={currentItem.quantity}
                onChange={handleQuantityChange}
                placeholder="Qty"
              />
            </div>
            <Button type="button" onClick={addItemToSelection} disabled={!currentItem.itemId}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium mb-2">Selected Items</h3>
              <ul className="space-y-2">
                {selectedItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-sm py-1 border-b">
                    <span>{item.itemName}</span>
                    <div className="flex items-center space-x-2">
                      <span>Qty: {item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!selectedEmployee || selectedItems.length === 0}
        >
          Create Issue
        </Button>
      </div>
    </form>
  );
}
