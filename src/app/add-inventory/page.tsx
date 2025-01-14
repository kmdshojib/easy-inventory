"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiArrowLeft } from 'react-icons/hi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useInventoryStore } from '../../store/useInventoryStore'
import { useUserStore } from '@/store/useUserStore'
import { toast } from 'react-toastify'

interface FormData {
    name: string
    quantity: number | string
    price: number | string
}

export default function AddInventory() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        quantity: '',
        price: '',
    })
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const router = useRouter()
    const addItem = useInventoryStore((state) => state.addItem)
    const user = useUserStore((state) => state.user)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'name') {
            setFormData(prev => ({ ...prev, [name]: value }))
        } else {
            const numValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0)
            setFormData(prev => ({ ...prev, [name]: numValue }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {}
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }
        
        const quantityNum = typeof formData.quantity === 'string' ? 
            parseFloat(formData.quantity) : formData.quantity;
        if (formData.quantity === '' || isNaN(quantityNum) || quantityNum < 0) {
            newErrors.quantity = 'Quantity must be 0 or greater'
        }
        
        const priceNum = typeof formData.price === 'string' ? 
            parseFloat(formData.price) : formData.price;
        if (formData.price === '' || isNaN(priceNum) || priceNum < 0) {
            newErrors.price = 'Price must be 0 or greater'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!user) {
            toast.error("You must be logged in to add items")
            router.push('/signin')
            return
        }

        if (validateForm()) {
            try {
                const submitData = {
                    name: formData.name,
                    quantity: typeof formData.quantity === 'string' ? 0 : formData.quantity,
                    price: typeof formData.price === 'string' ? 0 : formData.price,
                }
                await addItem(submitData)
                toast.success('Item added successfully!')
                router.push('/')
            } catch (error) {
                console.error('Failed to add item:', error)
                toast.error('Failed to add item. Please try again.')
            }
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-white">Add Inventory Item</h1>
                            <Link href="/" className="text-white hover:text-blue-200 transition-colors">
                                <HiArrowLeft className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                placeholder="Enter quantity"
                                min="0"
                            />
                            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                placeholder="Enter price"
                                min="0"
                                step="0.01"
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>
                        <div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <HiPlus className="w-5 h-5 mr-2" /> Add Item
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

