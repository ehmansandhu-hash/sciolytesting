'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateScore } from '@/app/actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ScoreInput({ sessionId, initialScore }: { sessionId: string, initialScore: number | null }) {
    const router = useRouter()
    const [score, setScore] = useState<string>(initialScore?.toString() || '')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        const numScore = parseFloat(score)
        if (isNaN(numScore) && score !== '') return // Invalid input

        if (score === '' && initialScore === null) return; // No change
        if (numScore === initialScore) return; // No change

        setIsSaving(true)
        try {
            await updateScore(sessionId, score === '' ? 0 : numScore) // Default to 0 if cleared, or handle null better if needed
            toast.success('Score saved')
            router.refresh()
        } catch (error) {
            toast.error('Failed to save score')
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="relative flex items-center justify-end">
            <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.currentTarget.blur()
                    }
                }}
                placeholder="-"
                className="w-20 px-2 py-1 text-right bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {isSaving && (
                <div className="absolute right-24">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    )
}
