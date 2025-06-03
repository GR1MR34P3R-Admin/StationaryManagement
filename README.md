# Stationary Management System

A comprehensive web-based system for managing office supplies inventory, issue tracking, and employee equipment assignments.

## Features

- **Inventory Management**: Track and manage office supplies inventory
- **Issue Management**: Record and monitor item issues to employees
- **Signature Capture**: Digital signature system for item receipt confirmation
- **Dashboard**: Overview of inventory levels, issues, and system statistics
- **User Management**: Control who has access to the system with role-based permissions
- **Data Import/Export**: Backup and restore system data

## Tech Stack

- React with TypeScript
- Tailwind CSS
- ShadcnUI Components
- Vite for build system
- Local storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/stationary-management-system.git
cd stationary-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Default Login Credentials

- **Employee ID**: admin
- **Password**: Admin123

## Deployment

This project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
```

This will build the project and push it to the gh-pages branch.

## Data Storage

All data is stored in the browser's local storage. For production use, you may want to implement a backend server with proper database storage.

## License

This project is open source and available under the MIT License.
