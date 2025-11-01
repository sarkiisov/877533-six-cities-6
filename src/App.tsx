import { StoreProvider } from './providers/store';
import { RouterProvider } from './providers/router';

export const App = () => (
  <StoreProvider>
    <RouterProvider />
  </StoreProvider>
);
