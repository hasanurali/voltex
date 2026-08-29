import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import AppProviders from './AppProviders.tsx';
import { ErrorBoundary } from "./ErrorBoundary.tsx";

const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;