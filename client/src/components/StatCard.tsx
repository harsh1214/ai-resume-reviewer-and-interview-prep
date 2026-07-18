interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    color: string
}

export default function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <div className="bg-card-bg rounded-xl shadow-md p-6 card-hover border border-border hover:border-orange-500/50">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400">{label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div
                    className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-2xl`}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}