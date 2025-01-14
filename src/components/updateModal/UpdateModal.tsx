"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'

interface UpdateModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedItem: { name: string; quantity: number; price: number }) => void
    item: { id: string; name: string; quantity: number; price: number }
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onUpdate, item }) => {
    const [name, setName] = useState(item.name)
    const [quantity, setQuantity] = useState<number | string>(item.quantity)
    const [price, setPrice] = useState<number | string>(item.price)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate and convert values
        const quantityNum = typeof quantity === 'string' ? parseFloat(quantity) : quantity
        const priceNum = typeof price === 'string' ? parseFloat(price) : price

        if (!name.trim() || isNaN(quantityNum) || isNaN(priceNum) || quantityNum < 0 || priceNum < 0) {
            toast.error('Please enter valid values')
            return
        }

        onUpdate({
            name,
            quantity: quantityNum,
            price: priceNum
        })
        toast.success('Item updated successfully!')
    }

    const handleNumberChange = (value: string, setter: (value: number | string) => void) => {
        if (value === '') {
            setter('')
        } else {
            const num = Math.max(0, parseFloat(value) || 0)
            setter(num)
        }
    }

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Update Item</h2>
                                <button
                                    type='button'
                                    title='close modal'
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <HiX className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => handleNumberChange(e.target.value, setQuantity)}
                                        placeholder='Please enter new Quantity!'
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={price}
                                        onChange={(e) => handleNumberChange(e.target.value, setPrice)}
                                        placeholder='please enter new Price!'
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )

    if (!mounted) return null

    return createPortal(modalContent, document.body)
}

export default UpdateModal

