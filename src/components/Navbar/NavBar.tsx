"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUserStore } from '../../store/useUserStore'

const Navbar: React.FC = () => {
    const pathname = usePathname()
    const user = useUserStore((state) => state.user)
    const clearUser = useUserStore((state) => state.clearUser)

    const navItems = [
        { href: '/signin', label: 'Sign In' },
        { href: '/signup', label: 'Sign Up' },
    ]

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <span className="text-2xl font-bold text-blue-600">Easy Inventory</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center">
                                <span className="mr-4 text-gray-600">Welcome, {user.name}!</span>
                                <button
                                    onClick={() => {
                                        clearUser()
                                    }}
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            navItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <motion.span
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${pathname === item.href
                                            ? 'text-blue-600 bg-blue-100'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

