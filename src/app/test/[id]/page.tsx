'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { finishTest } from '@/app/actions'
import Timer from '@/components/Timer'
import { FileText, Clock, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Test } from '@/lib/types'

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [test, setTest] = useState<Test | null>(null)
    const [isTimeUp, setIsTimeUp] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTest = async () => {
            const { data, error } = await supabase
                .from('tests')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching test:', error)
                setError('Test not found or not accessible.')
            } else if (data) {
                setTest(data)
            }
            setLoading(false)
        }

        fetchTest()
    }, [id])

    const handleTimeUp = () => {
        setIsTimeUp(true)
    }

    // Loading state with spinner
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading test...</p>
            </div>
        )
    }

    // Error / not found state
    if (error || !test) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Test Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    {error || 'This test may have been removed or is not currently active.'}
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    Return Home
                </button>
            </div>
        )
    }

    // Time's up state
    if (isTimeUp) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">Time&apos;s Up!</h1>
                <p className="text-lg text-muted-foreground max-w-md">
                    The testing session has ended. Please put down your pencil and submit your paper to the proctor.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    Return Home
                </button>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="flex-none h-16 border-b border-border flex items-center justify-between px-6 bg-card z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-lg font-semibold text-foreground">{test.title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Timer durationMinutes={test.duration_minutes} onTimeUp={handleTimeUp} />
                    <form action={finishTest}>
                        <button
                            type="submit"
                            onClick={(e) => {
                                if (!confirm('Are you sure you are finished?')) {
                                    e.preventDefault()
                                }
                            }}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                        >
                            I&apos;m Finished
                        </button>
                    </form>
                </div>
            </header>

            {/* PDF Viewer */}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden">
                <iframe
                    src={`${test.pdf_url}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-none"
                    title="Test PDF"
                />

                {/* Overlay to prevent simple right-click save (not foolproof but helps) */}
                <div className="absolute inset-0 pointer-events-none shadow-inner" />
            </div>
        </div>
    )
}
