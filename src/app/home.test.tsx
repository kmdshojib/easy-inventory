import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';
import { useInventoryStore } from '../store/useInventoryStore';
import { StoreApi, UseBoundStore } from 'zustand';

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

jest.mock('framer-motion', () => ({
    motion: {
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
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
        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: mockInventoryItems,
                fetchItems: mockFetchItems,
                isLoading: false,
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

    it('calls fetchItems on mount', () => {
        render(<Home />);
        expect(mockFetchItems).toHaveBeenCalledTimes(1);
    });

    it('displays loading spinner when isLoading is true', () => {
        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: [],
                fetchItems: mockFetchItems,
                isLoading: true,
            };
            return selector(state);
        });

        render(<Home />);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders inventory items with correct data', async () => {
        render(<Home />);
        
        await waitFor(() => {
            mockInventoryItems.forEach((item) => {
                const card = screen.getByTestId(`inventory-card-${item.id}`);
                expect(card).toBeInTheDocument();
                expect(card).toHaveTextContent(item.name);
                expect(card).toHaveTextContent(item.quantity.toString());
                expect(card).toHaveTextContent(item.price.toString());
            });
        });
    });

    it('renders empty state when no items exist', async () => {
        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: [],
                fetchItems: mockFetchItems,
                isLoading: false,
            };
            return selector(state);
        });

        render(<Home />);
        await waitFor(() => {
            expect(screen.queryByRole('article')).not.toBeInTheDocument();
        });
    });

    it('handles error state gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const mockError = new Error('Failed to fetch');
        const mockFetchWithError = jest.fn().mockRejectedValueOnce(mockError);

        ((useInventoryStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                inventoryItems: [],
                fetchItems: mockFetchWithError,
                isLoading: false,
                error: mockError.message
            };
            return selector(state);
        });

        render(<Home />);
        
        await waitFor(() => {
            expect(mockFetchWithError).toHaveBeenCalled();
            // Wait for the error to be logged
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching items:', mockError);
        }, { timeout: 3000 });

        consoleSpy.mockRestore();
    });
});
