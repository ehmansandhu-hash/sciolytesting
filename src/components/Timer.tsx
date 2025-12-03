'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimerProps {
    durationMinutes: number
    onTimeUp: () => void
}

export default function Timer({ durationMinutes, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp()
            return
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft, onTimeUp])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const isUrgent = timeLeft < 60 // Less than 1 minute

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold transition-colors ${isUrgent ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-primary/10 text-primary'}`}>
            <Clock className="w-5 h-5" />
            <span>
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    )
}
