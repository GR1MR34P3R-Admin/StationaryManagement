import { User, UserRole } from "./types";

// Define user roles and their permissions
export const rolePermissions = {
  "Admin": {
    canView: true,
    canIssue: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true
  },
  "Admin Assistant": {
    canView: true,
    canIssue: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: false
  },
  "Guest": {
    canView: true,
    canIssue: true,
    canEdit: false,
    canDelete: false,
    canManageUsers: false
  }
};

// Local storage keys
const USER_STORAGE_KEY = "stationaryCurrentUser";
const REGISTERED_USERS_KEY = "stationaryRegisteredUsers";

// Function to log in a user
export function loginUser(role: UserRole, name: string, employeeId: string, password: string): User | null {
  const registeredUsers = getAllUsers();
  
  // Find the user with matching employeeId
  const foundUser = registeredUsers.find(user => user.employeeId === employeeId);
  
  // Check if user exists and password matches
  if (foundUser && foundUser.password === password) {
    const loggedInUser = {
      role: foundUser.role,
      name: foundUser.name,
      employeeId: foundUser.employeeId,
      permissions: rolePermissions[foundUser.role]
    };
    
    // Save the user to local storage
    saveUserToLocalStorage(loggedInUser);
    
    return loggedInUser;
  }
  
  return null;
}

// Function to log out the current user
export function logoutUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Save user to local storage
function saveUserToLocalStorage(user: User): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to local storage:", error);
  }
}

// Get the current user from local storage
export function getCurrentUser(): User | null {
  try {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error retrieving user from local storage:", error);
    return null;
  }
}

// Check if a user has a specific permission
export function hasPermission(
  user: User | null, 
  permission: keyof typeof rolePermissions.Admin
): boolean {
  if (!user) return false;
  return user.permissions[permission] || false;
}

// Functions for managing registered users

// Get all registered users
export function getAllUsers(): (User & { password: string })[] {
  try {
    const usersString = localStorage.getItem(REGISTERED_USERS_KEY);
    const users = usersString ? JSON.parse(usersString) : [];
    
    // If there are no users, add a default admin user
    if (users.length === 0) {
      const defaultAdmin = {
        role: "Admin" as UserRole,
        name: "System Administrator",
        employeeId: "admin",
        password: "Admin123",
        permissions: rolePermissions["Admin"]
      };
      
      users.push(defaultAdmin);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }
    
    return users;
  } catch (error) {
    console.error("Error retrieving registered users from local storage:", error);
    return [];
  }
}

// Add a new user
export function addUser(
  role: UserRole,
  name: string,
  employeeId: string,
  password: string
): boolean {
  try {
    const users = getAllUsers();
    
    // Check if user with same employeeId already exists
    if (users.some(user => user.employeeId === employeeId)) {
      return false;
    }
    
    // Create the new user
    const newUser = {
      role,
      name,
      employeeId,
      password,
      permissions: rolePermissions[role]
    };
    
    // Add to users array and save
    users.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    
    return true;
  } catch (error) {
    console.error("Error adding user:", error);
    return false;
  }
}

// Update an existing user
export function updateUser(user: User & { password?: string }): boolean {
  try {
    const users = getAllUsers();
    
    // Find the user index
    const userIndex = users.findIndex(u => u.employeeId === user.employeeId);
    
    if (userIndex === -1) {
      return false;
    }
    
    // Update the user, preserving password if not provided
    const updatedUser = {
      ...users[userIndex],
      role: user.role,
      name: user.name,
      employeeId: user.employeeId,
      permissions: rolePermissions[user.role]
    };
    
    // Update password if provided
    if (user.password) {
      updatedUser.password = user.password;
    }
    
    // Update the array and save
    users[userIndex] = updatedUser;
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

// Delete a user
export function deleteUser(employeeId: string): boolean {
  try {
    const users = getAllUsers();
    
    // Don't allow deleting the last admin
    const adminUsers = users.filter(user => user.role === "Admin");
    const userToDelete = users.find(user => user.employeeId === employeeId);
    
    if (adminUsers.length === 1 && userToDelete?.role === "Admin") {
      alert("Cannot delete the last admin user");
      return false;
    }
    
    // Filter out the user to delete
    const filteredUsers = users.filter(user => user.employeeId !== employeeId);
    
    // Save back to storage
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filteredUsers));
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}
