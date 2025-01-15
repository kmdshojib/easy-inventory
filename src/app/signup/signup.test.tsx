import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './page';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('@/store/useUserStore', () => ({
    useUserStore: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}));

describe('SignUp', () => {
    const mockRouter = { push: jest.fn() };
    const mockSignUp = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useUserStore as unknown as jest.Mock).mockImplementation((selector) => {
            const state = { signUp: mockSignUp };
            return selector ? selector(state) : state;
        });
    });

    it('renders signup form', () => {
        render(<SignUp />);
        expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<SignUp />);
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('handles successful signup', async () => {
        mockSignUp.mockResolvedValueOnce({ id: '1', name: 'John Doe' });
        render(<SignUp />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
            expect(toast.success).toHaveBeenCalledWith('User created successfully!');
            expect(mockRouter.push).toHaveBeenCalledWith('/signin');
        });
    });

    it('handles signup failure', async () => {
        mockSignUp.mockResolvedValueOnce(null);
        render(<SignUp />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Sign-up failed. Please try again.');
        });
    });
});