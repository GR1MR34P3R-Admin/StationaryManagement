import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Package,
  Info
} from "lucide-react";
import { StationaryItem } from "@/lib/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface InventoryTableProps {
  inventory: StationaryItem[];
  onUpdate: (item: StationaryItem) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  categories: string[];
}

export function InventoryTable({ 
  inventory, 
  onUpdate, 
  onDelete, 
  canEdit,
  categories 
}: InventoryTableProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editFormData, setEditFormData] = React.useState<StationaryItem | null>(null);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const handleEdit = (item: StationaryItem) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === "stockQuantity" || name === "threshold") {
      setEditFormData({
        ...editFormData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      category: value,
    });
  };

  const handleUnitChange = (value: string) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      unit: value,
    });
  };

  const handleSave = () => {
    if (editFormData) {
      onUpdate(editFormData);
      setEditingId(null);
      setEditFormData(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Package className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-medium">No inventory items found</p>
                  <p className="text-sm mt-1">Add some items to get started</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow 
                key={item.id} 
                className={item.stockQuantity <= item.threshold ? "bg-red-50/40" : ""}
              >
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      name="name"
                      value={editFormData?.name}
                      onChange={handleEditChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="font-medium">{item.name}</div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Select 
                      value={editFormData?.category || ""} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {item.category}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      name="stockQuantity"
                      type="number"
                      min="0"
                      value={editFormData?.stockQuantity}
                      onChange={handleEditChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="font-medium">{item.stockQuantity}</div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Select 
                      value={editFormData?.unit || "pcs"} 
                      onValueChange={handleUnitChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                        <SelectItem value="packs">Packs</SelectItem>
                        <SelectItem value="reams">Reams</SelectItem>
                        <SelectItem value="pads">Pads</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm">{item.unit}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      name="threshold"
                      type="number"
                      min="0"
                      value={editFormData?.threshold}
                      onChange={handleEditChange}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm">{item.threshold}</span>
                  )}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {item.stockQuantity <= item.threshold ? (
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-destructive mr-1.5" />
                            <span className="text-destructive font-medium">Low stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-1.5" />
                            <span className="text-green-600 font-medium">In stock</span>
                          </div>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {item.stockQuantity <= item.threshold ? (
                          <p className="text-xs">
                            Current quantity ({item.stockQuantity}) is below threshold ({item.threshold})
                          </p>
                        ) : (
                          <p className="text-xs">
                            Quantity: {item.stockQuantity} | Threshold: {item.threshold}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right">
                  {editingId === item.id ? (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      {canEdit && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(item.id)}
                            className="h-8 w-8 p-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <div className="space-y-1 text-xs">
                              <p><strong>ID:</strong> {item.id}</p>
                              <p><strong>Name:</strong> {item.name}</p>
                              <p><strong>Category:</strong> {item.category}</p>
                              <p><strong>Stock:</strong> {item.stockQuantity} {item.unit}</p>
                              <p><strong>Status:</strong> {item.stockQuantity <= item.threshold ? '⚠️ Low Stock' : '✅ In Stock'}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
