'use client'

// import { motion } from 'framer-motion'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    return (
        <div className="flex justify-center items-center">
            <div 
                role="status"
                data-testid="spinner"
                aria-label="Loading"
                className={`border-t-4 border-blue-500 border-solid rounded-full ${sizeClasses[size]}`}
            />
        </div>
    )
}

