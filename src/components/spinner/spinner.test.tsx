import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from './Spinner';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('Spinner Component', () => {
  it('renders spinner with default size (md)', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('renders spinner with small size', () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('w-5', 'h-5');
  });

  it('renders spinner with large size', () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('has correct base styling', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('border-t-4', 'border-blue-500', 'border-solid', 'rounded-full');
  });

  it('has correct accessibility attributes', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});