"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUserStore } from '../../store/useUserStore'
import { HiMenu, HiX } from 'react-icons/hi'

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
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
                                <span className="text-xl md:text-2xl font-bold text-blue-600">Easy Inventory</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            aria-label="menu"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-blue-600 p-2"
                        >
                            {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span data-testid="welcome-message-desktop" className="text-gray-600">
                                    Welcome, {user.name}!
                                </span>
                                <button
                                    type='button'
                                    data-testid='logout-button'
                                    onClick={clearUser}
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        data-testid={`${item.label.toLowerCase().replace(' ', '-')}-desktop`}
                                    >
                                        <motion.span
                                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                                pathname === item.href
                                                    ? 'text-blue-600 bg-blue-100'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div data-testid="mobile-menu" className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {user ? (
                        <div className="flex flex-col space-y-2">
                            <span data-testid="welcome-message-mobile" className="text-gray-600 px-3 py-2">
                                Welcome, {user.name}!
                            </span>
                            <button
                                title='logout'
                                type='button'
                                onClick={clearUser}
                                className="text-gray-600 hover:text-blue-600 px-3 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        navItems.map((item) => (
                            <Link
                                key={item.href} href={item.href}
                                data-testid={item.label.toLowerCase()}
                            >
                                <span
                                    className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                                        ? 'text-blue-600 bg-blue-100'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar