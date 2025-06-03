import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { clearStationaryData, resetStationaryData, loadStationaryData, saveStationaryData } from "@/lib/localStorage";
import { 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  Info, 
  RefreshCw, 
  Database, 
  FileDown, 
  FileUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StationaryItem, StationaryIssue, Employee } from "@/lib/types";

interface SystemSettingsProps {
  onDataReset: () => void;
}

export function SystemSettings({ onDataReset }: SystemSettingsProps) {
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importSuccess, setImportSuccess] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [systemInfo, setSystemInfo] = React.useState({
    lastUpdated: new Date().toLocaleString(),
    totalItems: 0,
    totalIssues: 0,
    totalEmployees: 0
  });

  // Update system info when component mounts
  React.useEffect(() => {
    updateSystemInfo();
  }, []);

  const updateSystemInfo = () => {
    const { inventory, issues, employees } = loadStationaryData();
    setSystemInfo({
      lastUpdated: new Date().toLocaleString(),
      totalItems: inventory.length,
      totalIssues: issues.length,
      totalEmployees: employees.length
    });
  };

  const handleClearAllData = () => {
    // Clear data from localStorage
    clearStationaryData();
    setShowClearDialog(false);
    
    // Trigger parent component data refresh
    onDataReset();
    
    // Update local system info
    updateSystemInfo();
    
    // Force a page reload to ensure all components are refreshed
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleResetData = () => {
    resetStationaryData();
    setShowResetDialog(false);
    // Call callback to refresh parent state
    onDataReset();
    updateSystemInfo();
  };

  const handleExportData = () => {
    try {
      console.log('Starting data export...');
      const data = loadStationaryData();
      
      // Add metadata to the export
      const exportData = {
        ...data,
        exportMetadata: {
          version: "1.0.0",
          exportDate: new Date().toISOString(),
          totalItems: data.inventory.length,
          totalIssues: data.issues.length,
          totalEmployees: data.employees.length,
          totalCategories: data.categories.length
        }
      };
      
      console.log('Export data structure:', {
        inventory: exportData.inventory.length,
        issues: exportData.issues.length,
        employees: exportData.employees.length,
        categories: exportData.categories.length
      });
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `stationary-data-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      console.log('Export completed successfully');
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);
    setShowImportDialog(true);
  };

  const validateImportData = (data: any): { isValid: boolean; message?: string } => {
    console.log('Validating import data:', data);
    
    // Check if the data exists and is an object
    if (!data || typeof data !== 'object') {
      return { isValid: false, message: "Invalid file format - not a valid JSON object" };
    }
    
    // Check if required properties exist
    const requiredProperties = ['inventory', 'issues', 'employees', 'categories'];
    for (const prop of requiredProperties) {
      if (!(prop in data)) {
        return { isValid: false, message: `Missing required property: ${prop}` };
      }
    }
    
    // Check if the arrays are valid
    if (!Array.isArray(data.inventory)) {
      return { isValid: false, message: "Inventory data is not a valid array" };
    }
    if (!Array.isArray(data.issues)) {
      return { isValid: false, message: "Issues data is not a valid array" };
    }
    if (!Array.isArray(data.employees)) {
      return { isValid: false, message: "Employees data is not a valid array" };
    }
    if (!Array.isArray(data.categories)) {
      return { isValid: false, message: "Categories data is not a valid array" };
    }
    
    // Basic validation of data structure
    if (data.inventory.length > 0) {
      const sampleInventoryItem = data.inventory[0];
      const requiredInventoryFields = ['id', 'name', 'category', 'stockQuantity', 'unit', 'threshold'];
      for (const field of requiredInventoryFields) {
        if (!(field in sampleInventoryItem)) {
          return { isValid: false, message: `Invalid inventory structure - missing field: ${field}` };
        }
      }
    }
    
    if (data.employees.length > 0) {
      const sampleEmployee = data.employees[0];
      const requiredEmployeeFields = ['id', 'name', 'department'];
      for (const field of requiredEmployeeFields) {
        if (!(field in sampleEmployee)) {
          return { isValid: false, message: `Invalid employee structure - missing field: ${field}` };
        }
      }
    }
    
    if (data.issues.length > 0) {
      const sampleIssue = data.issues[0];
      const requiredIssueFields = ['id', 'employeeId', 'employeeName', 'department', 'items', 'issueDate', 'status'];
      for (const field of requiredIssueFields) {
        if (!(field in sampleIssue)) {
          return { isValid: false, message: `Invalid issue structure - missing field: ${field}` };
        }
      }
    }
    
    console.log('Data validation passed');
    return { isValid: true };
  };

  const handleImportData = () => {
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) return;

      console.log('Starting import process for file:', file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result !== 'string') {
            setImportError("Could not read the file contents");
            return;
          }
          
          console.log('File read successfully, parsing JSON...');
          const importedData = JSON.parse(result);
          
          // Validate the data structure
          const validation = validateImportData(importedData);
          if (!validation.isValid) {
            setImportError(validation.message || "Invalid data format");
            return;
          }
          
          console.log('Data validation passed, importing data...');
          console.log('Import data summary:', {
            inventory: importedData.inventory.length,
            issues: importedData.issues.length,
            employees: importedData.employees.length,
            categories: importedData.categories.length
          });
          
          // Clear existing data first to ensure clean import
          console.log('Clearing existing data...');
          clearStationaryData();
          
          // Import the data using the localStorage function
          console.log('Saving new data to localStorage...');
          saveStationaryData(
            importedData.inventory, 
            importedData.issues, 
            importedData.employees, 
            importedData.categories
          );
          
          // Force browser to refresh localStorage cache
          setTimeout(() => {
            // Verify the data was saved correctly
            const verificationData = loadStationaryData();
            console.log('Verification after import:', {
              inventory: verificationData.inventory.length,
              issues: verificationData.issues.length,
              employees: verificationData.employees.length,
              categories: verificationData.categories.length
            });
            
            // Close the dialog and refresh
            setShowImportDialog(false);
            
            // Clear the file input
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            
            // Show success message
            setImportSuccess(`Successfully imported ${importedData.inventory.length} inventory items, ${importedData.issues.length} issues, ${importedData.employees.length} employees, and ${importedData.categories.length} categories.`);
            
            // Clear success message after 5 seconds
            setTimeout(() => {
              setImportSuccess(null);
            }, 5000);
            
            // Force a complete page reload to ensure all components are refreshed
            console.log('Reloading page to refresh all components...');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            
            console.log('Import completed successfully');
          }, 100);
          
        } catch (error) {
          console.error("Error parsing import file:", error);
          setImportError("Could not parse the imported file. Please ensure it's a valid JSON file exported from this system.");
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file");
        setImportError("Error reading the file. Please try again.");
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      setImportError("An error occurred while importing the data. Please try again.");
    }
  };

  const refreshSystemInfo = () => {
    updateSystemInfo();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">System Settings</h3>
      
      {/* Success message */}
      {importSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{importSuccess}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">System Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={refreshSystemInfo}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Current system status and information
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Data Last Updated</span>
                <span className="text-sm font-medium">{systemInfo.lastUpdated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Inventory Items</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {systemInfo.totalItems}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Issues</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {systemInfo.totalIssues}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Employees</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {systemInfo.totalEmployees}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              All data is stored in your browser's local storage
            </div>
          </CardFooter>
        </Card>

        {/* Backup and Restore Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Backup & Restore</CardTitle>
            <CardDescription>
              Export your data for backup or import existing data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileDown className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Export Data</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Download all your system data as a JSON file for backup purposes
              </p>
              <Button 
                variant="outline" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleExportData}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileUp className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Import Data</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Import previously exported data file to restore your system
              </p>
              <div className="hidden">
                <Input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
                onClick={triggerFileInput}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Data File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
            <CardDescription>
              Reset or clear all system data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-yellow-600" />
                <h4 className="font-medium">Reset to Default</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Reset all data to the default sample data. Current data will be lost.
              </p>
              <Button 
                variant="outline" 
                className="w-full text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                onClick={() => setShowResetDialog(true)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h4 className="font-medium">Clear All Data</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Remove all data from the system, including inventory, issues, employees, and categories.
              </p>
              <Button 
                variant="outline" 
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setShowClearDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Information</CardTitle>
          <CardDescription>
            Details about your local storage usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-muted-foreground">Storage Type</div>
                <div className="font-medium mt-1">Browser Local Storage</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-muted-foreground">Persistence</div>
                <div className="font-medium mt-1">Until Cache Cleared</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-muted-foreground">Limitations</div>
                <div className="font-medium mt-1">~5MB per Domain</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-muted-foreground">Backup Recommended</div>
                <div className="font-medium mt-1">Yes, regularly</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Important: To prevent data loss, export your data regularly using the backup function above.
            Local storage can be cleared by your browser during maintenance or when clearing browsing data.
          </p>
        </CardFooter>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove all data from the system, including inventory, issues, employees, and categories. This action cannot be undone.
              If you'd like to back up your data first, please cancel and use the export function.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all data to the default sample data. Any current data will be lost. 
              This action cannot be undone. If you'd like to back up your data first, please cancel 
              and use the export function.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetData}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Reset to Default
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all current data with the imported data. 
              Current data will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            {importError && (
              <div className="text-sm font-medium text-destructive mb-4 bg-destructive/10 p-3 rounded-md border border-destructive/20">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {importError}
              </div>
            )}
            <div className="text-sm">
              <strong>File selected:</strong> {fileInputRef.current?.files?.[0]?.name || "No file selected"}
            </div>
            {fileInputRef.current?.files?.[0] && (
              <div className="text-xs text-muted-foreground mt-1">
                Size: {(fileInputRef.current.files[0].size / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setImportError(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleImportData}
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={!fileInputRef.current?.files?.[0]}
            >
              Import Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}