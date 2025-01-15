import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SignIn from './page'
import { useUserStore } from '../../store/useUserStore'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

jest.mock('../../store/useUserStore', () => ({
    useUserStore: jest.fn()
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>
    }
}))

describe('SignIn Component', () => {
    const mockSignIn = jest.fn()
    const mockRouter = { push: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue(mockRouter)
            ; (useUserStore as unknown as jest.Mock).mockImplementation((selector) => {
                const state = { signIn: mockSignIn }
                return selector ? selector(state) : state
            })
    })

    it('renders the sign-in form', () => {
        render(<SignIn />)
        expect(screen.getByRole('heading', { name: /sign in/i, level: 2 })).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('updates email and password inputs', () => {
        render(<SignIn />)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        expect(emailInput).toHaveValue('test@example.com')
        expect(passwordInput).toHaveValue('password123')
    })

    it('calls signIn function and redirects on successful sign-in', async () => {
        mockSignIn.mockResolvedValueOnce({ success: true })
        render(<SignIn />)

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
            expect(toast.success).toHaveBeenCalledWith('Sign-in successful!')
            expect(mockRouter.push).toHaveBeenCalledWith('/')
        })
    })

    it('shows error toast on failed sign-in', async () => {
        mockSignIn.mockResolvedValueOnce(null)
        render(<SignIn />)

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } })
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword')
            expect(toast.error).toHaveBeenCalledWith('Sign-in failed. Please try again.')
            expect(mockRouter.push).not.toHaveBeenCalled()
        })
    })

    it('renders the sign-up link', () => {
        render(<SignIn />)
        const signUpLink = screen.getByRole('link', { name: /sign up/i })
        expect(signUpLink).toBeInTheDocument()
        expect(signUpLink).toHaveAttribute('href', '/signup')
    })
})