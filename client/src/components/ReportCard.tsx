import { IconFileText, IconCalendar, IconStar } from '@tabler/icons-react'

interface ReportCardProps {
    title: string
    date: string
    score: string
    status: 'Excellent' | 'Good' | 'Needs Improvement'
}

export default function ReportCard({ title, date, score, status }: ReportCardProps) {
    const statusColors = {
        Excellent: 'bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
        Good: 'bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
        'Needs Improvement': 'bg-linear-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30',
    }

    return (
        <div className="bg-card-bg rounded-xl shadow-md p-6 card-hover border border-border hover:border-orange-500/50">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <IconFileText className="text-orange-400 text-xl mt-1" size={24} />
                    <div>
                        <h4 className="font-semibold text-white">{title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                            <IconCalendar size={14} />
                            <span>{date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <IconStar className="text-yellow-400" size={18} />
                    <span className="font-bold text-white">{score}</span>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <span
                    className={`text-sm px-3 py-1 rounded-full border ${statusColors[status]}`}
                >
                    {status}
                </span>
                <button className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                    View Details →
                </button>
            </div>
        </div>
    )
}