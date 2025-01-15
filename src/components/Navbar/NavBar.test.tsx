import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './NavBar';
import { useUserStore } from '../../store/useUserStore';
import { StoreApi, UseBoundStore } from 'zustand';
import { UserState } from '../../store/useUserStore';

// Mock the store and next/navigation
jest.mock('../../store/useUserStore');
jest.mock('next/navigation', () => ({
    usePathname: () => '/'
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        div: ({ children, className}: any) => (
            <div className={className}>{children}</div>
        ),
        button: ({ children, className}: any) => (
            <button className={className}>{children}</button>
        ),
        span: ({ children, className}: any) => (
            <span className={className}>{children}</span>
        ),
    },
}));

describe('Navbar', () => {
    const mockStore = {
        user: null,
        clearUser: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        ((useUserStore as unknown) as jest.Mock<UseBoundStore<StoreApi<UserState>>>).mockImplementation((selector) => 
            selector ? selector(mockStore) : mockStore
        );
    });

    it('renders logo', () => {
        render(<Navbar />);
        expect(screen.getByText('Easy Inventory')).toBeInTheDocument();
    });

    it('shows login/signup links when user is not authenticated', () => {
        render(<Navbar />);
        expect(screen.getByTestId('sign-in-desktop')).toBeInTheDocument();
        expect(screen.getByTestId('sign-up-desktop')).toBeInTheDocument();
    });

    it('shows user name and logout button when authenticated', () => {
        ((useUserStore as unknown) as jest.Mock<UseBoundStore<StoreApi<any>>>).mockImplementation((selector) => {
            const state = {
                user: { name: 'Test User', email: 'test@test.com', id: '1' },
                clearUser: jest.fn()
            };
            return selector(state);
        });

        render(<Navbar />);
        expect(screen.getByTestId('welcome-message-desktop')).toHaveTextContent('Welcome, Test User!');
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('calls clearUser when logout is clicked', () => {
        const authenticatedStore = {
            ...mockStore,
            user: { name: 'Test User', email: 'test@test.com', id: '1' }
        };
        ((useUserStore as unknown) as jest.Mock<UseBoundStore<StoreApi<UserState>>>).mockImplementation((selector) => 
            selector ? selector(authenticatedStore) : authenticatedStore
        );

        render(<Navbar />);
        fireEvent.click(screen.getByTitle('logout'));
        expect(mockStore.clearUser).toHaveBeenCalled();
    });

    it('toggles mobile menu when menu button is clicked', () => {
        render(<Navbar />);
        const menuButton = screen.getByRole('button', { name: /menu/i });
        const mobileMenu = screen.getByTestId('mobile-menu');
        
        fireEvent.click(menuButton);
        expect(mobileMenu).toHaveClass('block');
        
        fireEvent.click(menuButton);
        expect(mobileMenu).toHaveClass('hidden');
    });
});