"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiCube, HiCurrencyDollar, HiTag, HiPencil } from 'react-icons/hi';
import { useInventoryStore } from '@/store/useInventoryStore';
import Spinner from '@/components/spinner/Spinner';
import Link from 'next/link';
import { toast } from 'react-toastify';
import UpdateModal from '@/components/updateModal/UpdateModal';
import { useUserStore } from '@/store/useUserStore';

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export default function InventoryItemPage() {
    const params = useParams();
    const id = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState<InventoryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useUserStore(state => state.user);
    const router = useRouter();
    const updateItem = useInventoryStore((state) => state.updateItem);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`/api/get-inventory/${id}`);
                if (!response.ok) throw new Error('Failed to fetch item');
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error('Failed to fetch item:', error);
                toast.error('Failed to load item details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Item not found</h1>
                <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Return to inventory
                </Link>
            </div>
        );
    }

    const maxQuantity = 20;
    const stockPercentage = Math.min((item.quantity / maxQuantity) * 100, 100);

    const handleUpdate = () => {
        if (!user) {
            toast.error("You must be logged in to update an item. Please log in or sign up.");
            router.push('/signin');
            return;
        }
        setIsModalOpen(true);
    };

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
                            <h1 className="text-3xl font-bold text-white">{item.name}</h1>
                            <div className="space-x-4">

                                <button
                                    onClick={handleUpdate}
                                    className="text-white hover:text-blue-100 transition-colors"
                                >
                                    <HiPencil className="w-6 h-6" />
                                </button>

                                <Link
                                    href="/"
                                    className="text-white hover:text-blue-100 transition-colors"
                                >
                                    Back to inventory
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            <DetailRow icon={HiTag} label="Name" value={item.name} />
                            <DetailRow icon={HiCube} label="Quantity" value={item.quantity.toString()} />
                            <DetailRow icon={HiCurrencyDollar} label="Price" value={`$${item.price}`} />

                            <StockLevelIndicator quantity={item.quantity} percentage={stockPercentage} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {user && (
                <UpdateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={(updatedItem: any) => {
                        updateItem(id, updatedItem);
                        setIsModalOpen(false);
                    }}
                    item={{ id, name: item.name, quantity: item.quantity, price: item.price }}
                />
            )}
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <motion.div
            className="flex items-center text-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Icon className="w-6 h-6 mr-4 text-blue-500" />
            <span className="font-medium mr-2">{label}:</span>
            <span className="text-gray-900 text-lg">{value}</span>
        </motion.div>
    );
}

function StockLevelIndicator({ quantity, percentage }: { quantity: number; percentage: number }) {
    return (
        <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <h3 className="text-lg font-medium mb-2">Stock Level</h3>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                    className="bg-blue-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
            <p className="text-sm mt-2 font-medium text-gray-600">
                Status:
                <span className={`ml-2 ${quantity <= 5 ? 'text-red-500' :
                    quantity <= 15 ? 'text-yellow-500' :
                        'text-green-500'
                    }`}>
                    {quantity <= 5 ? 'Low' :
                        quantity <= 15 ? 'Medium' :
                            'High'}
                </span>
            </p>
        </motion.div>
    );
} 