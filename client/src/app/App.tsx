import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import AppProviders from './AppProviders.tsx';

const App = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;