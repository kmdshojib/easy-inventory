"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiArrowLeft } from 'react-icons/hi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FormData {
    name: string
    quantity: number
    price: number
}

export default function AddInventory() {
    const [formData, setFormData] = useState<any>({
        name: '',
        quantity: 0,
        price: 0,
    })
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: name === 'name' ? value : Number(value) }))
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<any> = {}
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (formData.quantity < 0) newErrors.quantity = 'Quantity must be 0 or greater'
        if (formData.price < 0) newErrors.price = 'Price must be 0 or greater'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            // Here you would typically send the data to your backend or state management system
            console.log('Form submitted:', formData)
            // For now, we'll just redirect back to the main page
            router.push('/')
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
                                required
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
                                required
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

