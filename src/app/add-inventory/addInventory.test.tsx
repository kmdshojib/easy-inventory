import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import AddInventory from './page';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useUserStore } from '@/store/useUserStore';

// Mock implementations
jest.mock('@/store/useInventoryStore', () => ({
  useInventoryStore: jest.fn()
}));

jest.mock('@/store/useUserStore', () => ({
  useUserStore: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() }
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('AddInventory', () => {
  const mockRouter = { push: jest.fn() };
  const mockAddItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useInventoryStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { addItem: mockAddItem };
      return selector ? selector(state) : state;
    });
  });

  it('redirects to signin when user is not logged in', async () => {
    // Setup user store to return null user
    (useUserStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { user: null };
      return selector ? selector(state) : state;
    });

    render(<AddInventory />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '10.50' } });

    // Submit form
    await fireEvent.click(screen.getByRole('button', { name: /add item/i }));

    // Assert
    expect(toast.error).toHaveBeenCalledWith('You must be logged in to add items');
    expect(mockRouter.push).toHaveBeenCalledWith('/signin');
  });
});