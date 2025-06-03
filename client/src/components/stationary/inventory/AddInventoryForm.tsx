import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StationaryItem } from "@/lib/types";

interface AddInventoryFormProps {
  onSubmit: (item: StationaryItem) => void;
  onCancel: () => void;
  categories: string[];
}

export function AddInventoryForm({ onSubmit, onCancel, categories }: AddInventoryFormProps) {
  const [formData, setFormData] = React.useState<Omit<StationaryItem, "id">>({
    name: "",
    category: "",
    stockQuantity: 0,
    unit: "pcs",
    threshold: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleUnitChange = (value: string) => {
    setFormData({
      ...formData,
      unit: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as StationaryItem);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            onValueChange={handleCategoryChange} 
            defaultValue={formData.category}
          >
            <SelectTrigger>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select 
            onValueChange={handleUnitChange} 
            defaultValue={formData.unit}
          >
            <SelectTrigger>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="threshold">Low Stock Threshold</Label>
          <Input
            id="threshold"
            name="threshold"
            type="number"
            min="0"
            value={formData.threshold}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Item</Button>
      </div>
    </form>
  );
}
