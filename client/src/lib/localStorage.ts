import { StationaryItem, StationaryIssue, Employee } from "./types";
import { initialInventory, initialIssues, employees, categories } from "./data";

// Keys for storing different data in local storage
const STORAGE_KEYS = {
  INVENTORY: "stationaryInventory",
  ISSUES: "stationaryIssues",
  EMPLOYEES: "stationaryEmployees",
  CATEGORIES: "stationaryCategories",
  USERS: "stationaryRegisteredUsers",
  CURRENT_USER: "stationaryCurrentUser"
};

// Save data to local storage
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to local storage for key ${key}:`, error);
  }
}

// Load data from local storage with fallback to default values
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from local storage for key ${key}:`, error);
    return defaultValue;
  }
}

// Save all stationary management data to local storage
export function saveStationaryData(
  inventory: StationaryItem[],
  issues: StationaryIssue[],
  employees: Employee[],
  categories: string[]
): void {
  saveToLocalStorage(STORAGE_KEYS.INVENTORY, inventory);
  saveToLocalStorage(STORAGE_KEYS.ISSUES, issues);
  saveToLocalStorage(STORAGE_KEYS.EMPLOYEES, employees);
  saveToLocalStorage(STORAGE_KEYS.CATEGORIES, categories);
}

// Load all stationary management data from local storage
export function loadStationaryData() {
  return {
    inventory: loadFromLocalStorage(STORAGE_KEYS.INVENTORY, initialInventory),
    issues: loadFromLocalStorage(STORAGE_KEYS.ISSUES, initialIssues),
    employees: loadFromLocalStorage(STORAGE_KEYS.EMPLOYEES, employees),
    categories: loadFromLocalStorage(STORAGE_KEYS.CATEGORIES, categories),
  };
}

// Clear all stationary management data from local storage (including employees and categories)
export function clearStationaryData(): void {
  try {
    // Clear all stationary data including employees and categories
    // Don't remove users data when clearing other data
    const preserveKeys = [STORAGE_KEYS.USERS, STORAGE_KEYS.CURRENT_USER];
    
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!preserveKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Set empty arrays for all data types to ensure clean state
    saveToLocalStorage(STORAGE_KEYS.INVENTORY, []);
    saveToLocalStorage(STORAGE_KEYS.ISSUES, []);
    saveToLocalStorage(STORAGE_KEYS.EMPLOYEES, []);
    saveToLocalStorage(STORAGE_KEYS.CATEGORIES, []);
  } catch (error) {
    console.error("Error clearing data from local storage:", error);
  }
}

// Reset stationary management data to default values
export function resetStationaryData(): void {
  saveToLocalStorage(STORAGE_KEYS.INVENTORY, initialInventory);
  saveToLocalStorage(STORAGE_KEYS.ISSUES, initialIssues);
  saveToLocalStorage(STORAGE_KEYS.EMPLOYEES, employees);
  saveToLocalStorage(STORAGE_KEYS.CATEGORIES, categories);
}

// Force clear all existing data to ensure fresh start
export function forceResetToEmpty(): void {
  try {
    // Remove all existing data
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.ISSUES);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    
    // Set explicitly empty arrays
    saveToLocalStorage(STORAGE_KEYS.INVENTORY, []);
    saveToLocalStorage(STORAGE_KEYS.ISSUES, []);
    saveToLocalStorage(STORAGE_KEYS.EMPLOYEES, []);
    saveToLocalStorage(STORAGE_KEYS.CATEGORIES, []);
  } catch (error) {
    console.error("Error force clearing data:", error);
  }
}
