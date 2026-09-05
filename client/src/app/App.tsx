import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router.tsx';
import AppProviders from './AppProviders.tsx';
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import AuthInitializer from './AuthInitializer.tsx';

const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </AuthInitializer>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;