import * as React from 'react';
import { StationaryManagement } from '@/components/stationary/StationaryManagement';
import { LoginForm } from '@/components/auth/LoginForm';
import { UserProfile } from '@/components/auth/UserProfile';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/types';
import { PencilRuler } from 'lucide-react';

function App() {
  const [user, setUser] = React.useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Simulate initial data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setUser(getCurrentUser());
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <PencilRuler className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-blue-900">Stationary Management</h1>
          <p className="text-blue-700 mt-1">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <div className="mx-auto px-4 py-6 max-w-[1600px]">
          <header className="flex justify-between items-center mb-6 px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PencilRuler className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Stationary Management System</h1>
            </div>
            <UserProfile user={user} onLogout={handleLogout} />
          </header>
          <main className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <StationaryManagement currentUser={user} />
          </main>
          <footer className="text-center text-xs text-muted-foreground py-4">
            <p>Stationary Management System &copy; {new Date().getFullYear()}</p>
            <p className="mt-1">All data is stored locally in your browser.</p>
            <div className="flex items-center justify-center mt-2 text-blue-600 font-medium">
              <span className="mr-1">&copy; {new Date().getFullYear()}</span>
              <span>Keanen Clarke-Halkett. All Rights Reserved.</span>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p className="text-blue-600">Stationary Management System &copy; {new Date().getFullYear()}</p>
            <div className="flex items-center justify-center mt-2 text-blue-600 font-medium">
              <span className="mr-1">&copy; {new Date().getFullYear()}</span>
              <span>Keanen Clarke-Halkett. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
