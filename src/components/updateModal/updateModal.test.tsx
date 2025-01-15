import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import UpdateModal from './UpdateModal'
import { toast } from 'react-toastify'

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}))

const mockItem = {
  id: '1',
  name: 'Test Item',
  quantity: 10,
  price: 100
}

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onUpdate: jest.fn(),
  item: mockItem
}

const setup = (props = defaultProps) => {
  return render(<UpdateModal {...props} />)
}

describe('UpdateModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the modal with correct initial values', () => {
    setup()
    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Item')
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(10)
    expect(screen.getByLabelText(/price/i)).toHaveValue(100)
  })

  it('updates input values when changed', () => {
    setup()
    const nameInput = screen.getByLabelText(/name/i)
    const quantityInput = screen.getByLabelText(/quantity/i)
    const priceInput = screen.getByLabelText(/price/i)

    fireEvent.change(nameInput, { target: { value: 'Updated Item' } })
    fireEvent.change(quantityInput, { target: { value: '20' } })
    fireEvent.change(priceInput, { target: { value: '200' } })

    expect(nameInput).toHaveValue('Updated Item')
    expect(quantityInput).toHaveValue(20)
    expect(priceInput).toHaveValue(200)
  })

  it('submits the form with valid data', async () => {
    setup()
    const nameInput = screen.getByLabelText(/name/i)
    const quantityInput = screen.getByLabelText(/quantity/i)
    const priceInput = screen.getByLabelText(/price/i)
    const submitButton = screen.getByRole('button', { name: /submit update/i })

    fireEvent.change(nameInput, { target: { value: 'Updated Item' } })
    fireEvent.change(quantityInput, { target: { value: '20' } })
    fireEvent.change(priceInput, { target: { value: '200' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        name: 'Updated Item',
        quantity: 20,
        price: 200
      })
      expect(toast.success).toHaveBeenCalledWith('Item updated successfully!')
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

//   it('shows error toast for invalid form submission', async () => {
//     setup()
//     const nameInput = screen.getByLabelText(/name/i)
//     const submitButton = screen.getByRole('button', { name: /submit update/i })

//     fireEvent.change(nameInput, { target: { value: '' } })
//     fireEvent.click(submitButton)

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith('Please enter valid values')
//       expect(defaultProps.onUpdate).not.toHaveBeenCalled()
//     })
//   })

  it('closes modal when cancel button is clicked', () => {
    setup()
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('closes modal when close icon is clicked', () => {
    setup()
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('handles negative numbers correctly', () => {
    setup()
    const quantityInput = screen.getByLabelText(/quantity/i)
    const priceInput = screen.getByLabelText(/price/i)

    fireEvent.change(quantityInput, { target: { value: '-5' } })
    fireEvent.change(priceInput, { target: { value: '-10' } })

    expect(quantityInput).toHaveValue(0)
    expect(priceInput).toHaveValue(0)
  })

  it('allows empty input for quantity and price', () => {
    setup()
    const quantityInput = screen.getByLabelText(/quantity/i)
    const priceInput = screen.getByLabelText(/price/i)

    fireEvent.change(quantityInput, { target: { value: '' } })
    fireEvent.change(priceInput, { target: { value: '' } })

    expect(quantityInput).toHaveValue(null)
    expect(priceInput).toHaveValue(null)
  })

  it('does not render when isOpen is false', () => {
    render(<UpdateModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Update Item')).not.toBeInTheDocument()
  })
})

