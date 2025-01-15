"use client"

import React, { useEffect } from 'react'
import InventoryCard from "@/components/InventoryCard"
import { motion } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import Link from 'next/link'
import { useInventoryStore } from '../store/useInventoryStore'
import Spinner from '@/components/spinner/Spinner'

export default function Home() {
  const inventoryItems = useInventoryStore((state) => state.inventoryItems)
  const fetchItems = useInventoryStore((state) => state.fetchItems)
  const isLoading = useInventoryStore((state) => state.isLoading)

  useEffect(() => {
    const fetchData = async () => {
        try {
            await fetchItems();
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };
    fetchData();
  }, [fetchItems])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Inventory Management
          </motion.h1>
          <Link href="/add-inventory">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm flex items-center"
            >
              <HiPlus className="w-5 h-5 mr-2" /> Add Item
            </motion.button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventoryItems.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <InventoryCard
                  id={item.id}
                  name={item.name}
                  quantity={item.quantity}
                  price={item.price}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}