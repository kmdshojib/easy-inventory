import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryCard from './InventoryCard';

const mockProps = {
  id: '1',
  name: 'Test Item',
  quantity: 20,
  price: 100,
  onDelete: jest.fn(),
  onUpdate: jest.fn(),
};

describe('InventoryCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic card information', () => {
    render(<InventoryCard {...mockProps} />);

    expect(screen.getByRole('heading', { name: /test item/i })).toBeInTheDocument();
    // expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('calculates and displays correct stock percentage', () => {
    render(<InventoryCard {...mockProps} quantity={15} />);
    const stockBar = screen.getByRole('progressbar');
    expect(stockBar).toHaveStyle({ width: '75%' });
  });

  it('caps stock percentage at 100%', () => {
    render(<InventoryCard {...mockProps} quantity={25} />);
    const stockBar = screen.getByRole('progressbar');
    
    expect(stockBar).toHaveStyle({ width: '100%' });
    expect(stockBar).toHaveAttribute('aria-valuenow', '100');
});

  it('shows low stock warning for quantities below 25%', () => {
    render(<InventoryCard {...mockProps} quantity={4} />);
    expect(screen.getByText(/low/i)).toHaveClass('text-red-500');
  });

  it('shows medium stock warning for quantities between 25% and 75%', () => {
    render(<InventoryCard {...mockProps} quantity={10} />);
    expect(screen.getByText(/medium/i)).toHaveClass('text-yellow-500');
  });

  it('shows high stock warning for quantities above 75%', () => {
    render(<InventoryCard {...mockProps} quantity={18} />);
    expect(screen.getByText(/high/i)).toHaveClass('text-green-500');
  });

  it('handles update button click', () => {
    render(<InventoryCard {...mockProps} />);
    const updateButton = screen.getByTitle('modal');
    fireEvent.click(updateButton);
    expect(mockProps.onUpdate).not.toHaveBeenCalled(); // Modal opens, no direct update call
  });

  it('handles delete button click', () => {
    render(<InventoryCard {...mockProps} />);
    const deleteButton = screen.getByTitle('delete-btn');
    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });
});
