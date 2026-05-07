import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import Spinner from './components/ui/feedback/Spinner.jsx';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function AuthBootstrap({ children }) {
  const { isBootstrapping } = useAuth();
  if (isBootstrapping) {
    return (
      <div className="auth-bootstrap">
        <Spinner size="lg" label="Chargement de la session…" />
      </div>
    );
  }
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthBootstrap>
          <AppRoutes />
        </AuthBootstrap>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
