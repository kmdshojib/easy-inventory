"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../../store/useUserStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner/Spinner";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = useUserStore((state) => state.signIn);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await signIn(email, password);
            if (response) {
                toast.success("Sign-in successful!");
                router.push("/");
            } else {
                toast.error("Sign-in failed. Please try again.");
            }
        } catch (err) {
            console.error("Sign-in error:", err);
            toast.error("Sign-in failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-xl shadow-md"
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                        Sign In
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@example.com"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <motion.button
                                whileHover={!isLoading ? { scale: 1.05 } : undefined}
                                whileTap={!isLoading ? { scale: 0.95 } : undefined}
                                disabled={isLoading}
                                type="submit"
                                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    "Sign In"
                                )}
                            </motion.button>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
