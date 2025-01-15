import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';
import { useInventoryStore } from '../store/useInventoryStore';
import { StoreApi, UseBoundStore } from 'zustand';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('../store/useInventoryStore');
jest.mock('../store/useUserStore', () => ({
    useUserStore: () => ({
        user: null
    })
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

jest.mock('../components/updateModal/UpdateModal', () => ({
    __esModule: true,
    default: () => null
}));

// Improved framer-motion mock
jest.mock('framer-motion', () => ({
    motion: {
        h1: ({ children, className, }: any) => (
            <h1 className={className}>{children}</h1>
        ),
        div: ({ children, className, }: any) => (
            <div className={className}>{children}</div>
        ),
        button: ({ children, className, }: any) => (
            <button className={className}>{children}</button>
        ),
        span: ({ children, className}: any) => (
            <span className={className}>{children}</span>
        )
    },
    AnimatePresence: ({ children }: any) => children,
}));

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

const mockInventoryItems: InventoryItem[] = [
    { id: '1', name: 'Item 1', quantity: 10, price: 100 },
    { id: '2', name: 'Item 2', quantity: 20, price: 200 },
];

describe('Home Component', () => {
    const mockFetchItems = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Set default mock implementation
        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: mockInventoryItems,
                fetchItems: mockFetchItems,
                isLoading: false,
                error: null
            };
            return selector(state);
        });
    });

    it('renders the heading and add button', () => {
        render(<Home />);
        expect(screen.getByText('Inventory Management')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
    });

    it('renders add item button with correct link', () => {
        render(<Home />);
        const addButton = screen.getByRole('button', { name: /add item/i });
        const linkElement = addButton.closest('a');
        expect(linkElement).toHaveAttribute('href', '/add-inventory');
    });

    it('calls fetchItems on mount', async () => {
        render(<Home />);
        await waitFor(() => {
            expect(mockFetchItems).toHaveBeenCalledTimes(1);
        });
    });

    it('displays loading spinner when isLoading is true', () => {
        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: [],
                fetchItems: mockFetchItems,
                isLoading: true,
                error: null
            };
            return selector(state);
        });

        render(<Home />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders inventory items with correct data', async () => {
        render(<Home />);
        
        for (const item of mockInventoryItems) {
            expect(await screen.findByTestId(`item-name-${item.id}`)).toHaveTextContent(item.name);
            expect(await screen.findByTestId(`item-quantity-${item.id}`)).toHaveTextContent(item.quantity.toString());
            expect(await screen.findByTestId(`item-price-${item.id}`)).toHaveTextContent(item.price.toString());
        }
    });

    it('renders empty state when no items exist', async () => {
        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: [],
                fetchItems: mockFetchItems,
                isLoading: false,
                error: null
            };
            return selector(state);
        });

        render(<Home />);
        await waitFor(() => {
            expect(screen.getByText('No inventory items found')).toBeInTheDocument();
        });
    });

    it('handles error state gracefully', async () => {
        const mockError = new Error('Failed to fetch');
        mockFetchItems.mockRejectedValueOnce(mockError);

        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: [],
                fetchItems: mockFetchItems,
                isLoading: false,
                error: mockError.message
            };
            return selector(state);
        });

        render(<Home />);

        await waitFor(() => {
            expect(mockFetchItems).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to load inventory items');
        }, { timeout: 3000 });
    });
});
