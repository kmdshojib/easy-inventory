"use client"

import React, { useState } from 'react'
import { HiCube, HiCurrencyDollar, HiTag, HiTrash, HiPencil } from 'react-icons/hi'
import { motion } from 'framer-motion'
import UpdateModal from '../updateModal/UpdateModal'

interface InventoryItemProps {
    id: string
    name: string
    quantity: number
    price: number
    onDelete: (id: string) => void
    onUpdate: (id: string, updatedItem: { name: string; quantity: number; price: number }) => void
}

const InventoryCard: React.FC<InventoryItemProps> = ({ id, name, quantity, price, onDelete, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const maxQuantity = 20
    // const stockPercentage = Math.min((quantity / maxQuantity) * 100, 100)

    const getStockColor = () => {
        if (quantity <= 5) return 'bg-red-500'
        if (quantity <= 15) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStockPercentage = () => {
        return Math.min((quantity / maxQuantity) * 100, 100)
    }

    return (
        <>
            <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{name}</h2>
                    <div className="flex space-x-2">
                        <button
                            title='modal'
                            type='button'
                            onClick={() => setIsModalOpen(true)}
                            className="text-white hover:text-blue-200 transition-colors"
                        >
                            <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                            title='delete-btn'
                            type='button'
                            onClick={() => onDelete(id)}
                            className="text-white hover:text-rose-500 transition-colors"
                        >
                            <HiTrash className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {[
                            { Icon: HiTag, label: "Name", value: name },
                            { Icon: HiCube, label: "Quantity", value: quantity },
                            { Icon: HiCurrencyDollar, label: "Price", value: `$${price.toFixed(2)}` },
                        ].map(({ Icon, label, value }, index) => (
                            <motion.div
                                key={label}
                                className="flex items-center text-gray-700"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <Icon className="w-5 h-5 mr-3 text-blue-500" />
                                <span className="font-medium mr-2">{label}:</span>
                                <span className="text-gray-900">{value}</span>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                                data-testid="stock-bar"
                                role="progressbar"
                                aria-valuenow={getStockPercentage()}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className={`h-2 rounded-full ${getStockColor()}`}
                                style={{ width: `${getStockPercentage()}%` }}
                            />
                        </div>
                        <p className="text-sm mt-2 font-medium text-gray-600">
                            Stock Level:
                            <span className={`ml-1 ${quantity <= 5 ? 'text-red-500' :
                                quantity <= 15 ? 'text-yellow-500' :
                                    'text-green-500'
                                }`}>
                                {quantity <= 5 ? 'Low' : quantity <= 15 ? 'Medium' : 'High'}
                            </span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
            <UpdateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={(updatedItem: any) => {
                    onUpdate(id, updatedItem)
                    setIsModalOpen(false)
                }}
                item={{ id, name, quantity, price }}
            />
        </>
    )
}

export default InventoryCard
