import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { App } from './App';

vi.mock('./providers/store', () => ({
  StoreProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="store-provider">{children}</div>
  ),
}));

vi.mock('./providers/router', () => ({
  RouterProvider: () => (
    <div data-testid="router-provider">
      <div data-testid="mock-route-content">Mock Router Content</div>
    </div>
  ),
}));

describe('App component', () => {
  test('should render StoreProvider and RouterProvider', () => {
    render(<App />);

    expect(screen.getByTestId('store-provider')).toBeInTheDocument();
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();

    const storeProvider = screen.getByTestId('store-provider');
    const routerProvider = screen.getByTestId('router-provider');
    expect(storeProvider).toContainElement(routerProvider);
  });
});
