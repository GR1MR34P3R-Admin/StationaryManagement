import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { InventoryTable } from "./InventoryTable";
import { AddInventoryForm } from "./AddInventoryForm";
import { Input } from "@/components/ui/input";
import { StationaryItem, User } from "@/lib/types";
import { hasPermission } from "@/lib/auth";

interface InventoryManagementProps {
  inventory: StationaryItem[];
  updateInventory: (inventory: StationaryItem[]) => void;
  categories: string[];
  currentUser: User;
}

export function InventoryManagement({ 
  inventory, 
  updateInventory,
  categories,
  currentUser
}: InventoryManagementProps) {
  const canEdit = hasPermission(currentUser, "canEdit");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredInventory, setFilteredInventory] = React.useState<StationaryItem[]>(inventory);

  // Filter inventory when search query or inventory changes
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInventory(inventory);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = inventory.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
  }, [searchQuery, inventory]);

  const addInventoryItem = (item: StationaryItem) => {
    updateInventory([...inventory, { ...item, id: Date.now().toString() }]);
    setShowAddForm(false);
  };

  const updateInventoryItem = (updatedItem: StationaryItem) => {
    updateInventory(
      inventory.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteInventoryItem = (id: string) => {
    updateInventory(inventory.filter((item) => item.id !== id));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex space-x-2">
          {canEdit && (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Inventory Item</CardTitle>
          </CardHeader>
          <CardContent>
            <AddInventoryForm
              onSubmit={addInventoryItem}
              onCancel={() => setShowAddForm(false)}
              categories={categories}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, category or ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-muted-foreground">
                Showing {filteredInventory.length} of {inventory.length} items
              </div>
            )}
          </div>
          <InventoryTable
            inventory={filteredInventory}
            onUpdate={updateInventoryItem}
            onDelete={deleteInventoryItem}
            canEdit={canEdit}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}