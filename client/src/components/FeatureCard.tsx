'use client'

import { motion } from 'framer-motion'

interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
    color: string
    index: number
}

export default function FeatureCard({ icon, title, description, color, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-card-bg rounded-2xl shadow-lg p-6 card-hover border border-border hover:border-orange-500/50"
        >
            <div
                className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-3xl mb-4`}
            >
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </motion.div>
    )
}