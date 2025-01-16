"use client"

import React, { useState } from 'react';
import { HiCube, HiCurrencyDollar, HiPencil, HiTag, HiTrash } from 'react-icons/hi';
import { motion } from 'framer-motion';
import UpdateModal from './updateModal/UpdateModal';
import { useInventoryStore } from '../store/useInventoryStore';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'react-toastify';
import Link from 'next/link';

// interface InventoryItemProps {
//     id: string;
//     name: string;
//     quantity: number;
//     price: number;
// }

const InventoryCard: React.FC<any> = ({ id, name, quantity, price }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useUserStore(state => state.user);
    const updateItem = useInventoryStore((state: any) => state.updateItem);
    const deleteItem = useInventoryStore((state: any) => state.deleteItem);

    const handleDelete = async () => {
        try {
            await deleteItem(id);
            toast.success("Item deleted successfully!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = () => {
        if (!user) {
            toast.error("You must be logged in to update an item. Please log in or sign up.");
            return;
        }
        setIsModalOpen(true);
    };

    const maxQuantity = 20;
    const stockPercentage = Math.min((quantity / maxQuantity) * 100, 100);

    return (
        <motion.div
            data-testid={`inventory-card-${id}`}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
        >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <Link href={`/inventory/${id}`}>
                    <h2 className="text-xl font-bold text-white cursor-pointer hover:underline hover:text-blue-200">{name}</h2>
                </Link>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                        <HiTag className="w-5 h-5 mr-3 text-blue-500" />
                        <span className="font-medium mr-2">Name:</span>
                        <span data-testid={`item-name-${id}`} className="text-gray-900">{name}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <HiCube className="w-5 h-5 mr-3 text-blue-500" />
                        <span className="font-medium mr-2">Quantity:</span>
                        <span data-testid={`item-quantity-${id}`} className="text-gray-900">{quantity}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <HiCurrencyDollar className="w-5 h-5 mr-3 text-blue-500" />
                        <span className="font-medium mr-2">Price:</span>
                        <span data-testid={`item-price-${id}`} className="text-gray-900">${price}</span>
                    </div>
                </div>

                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-blue-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${stockPercentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
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
                <div className='flex justify-evenly'>
                    <button type="button" onClick={handleDelete} className="mt-4 text-red-500 hover:text-red-700">
                        <HiTrash className="inline-block mr-1" /> Delete
                    </button>
                    <button
                        type='button'
                        onClick={handleUpdate}
                        className="text-blue-500 hover:text-blue-700 transition-colors mt-4"
                    >
                        <HiPencil className="inline-block mr-1" /> Update
                    </button>
                </div>
            </div>
            <UpdateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={(updatedItem: any) => {
                    updateItem(id, updatedItem);
                    setIsModalOpen(false);
                }}
                item={{ id, name, quantity, price }}
            />
        </motion.div>
    );
}

export default InventoryCard; 