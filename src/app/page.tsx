"use client"

import React, { useState } from 'react'
import InventoryCard from "@/components/InventoryCard"
import { motion } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import Link from 'next/link';

interface InventoryItem {
  id: string
  name: string
  quantity: number
  price: number
}

const initialInventoryItems: InventoryItem[] = [
  { id: "1", name: "Laptop", quantity: 15, price: 999.99 },
  { id: "2", name: "Smartphone", quantity: 8, price: 599.99 },
  { id: "3", name: "Headphones", quantity: 20, price: 149.99 },
  { id: "4", name: "Tablet", quantity: 5, price: 399.99 },
]

export default function Home() {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems)

  const handleDelete = (id: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id))
  }

  const handleUpdate = (id: string, updatedItem: Omit<InventoryItem, 'id'>) => {
    setInventoryItems(inventoryItems.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    ))
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventoryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <InventoryCard
                id={item.id}
                name={item.name}
                quantity={item.quantity}
                price={item.price}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

