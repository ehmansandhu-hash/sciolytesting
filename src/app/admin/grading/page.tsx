import { checkLeaderSession, updateScore } from '@/app/actions'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ExportButton from '@/components/ExportButton'
import ScoreInput from '@/components/ScoreInput'

export const dynamic = 'force-dynamic';

export default async function GradingPage() {
    const isLeader = await checkLeaderSession()
    if (!isLeader) {
        redirect('/login')
    }

    // Fetch Completed Sessions
    const { data: sessions } = await supabase
        .from('student_sessions')
        .select('*')
        .eq('status', 'completed')
        .order('test_title', { ascending: true })
        .order('score', { ascending: false }); // High scores first

    // Group by Test Title
    const groupedSessions: Record<string, any[]> = {};
    sessions?.forEach(session => {
        if (!groupedSessions[session.test_title]) {
            groupedSessions[session.test_title] = [];
        }
        groupedSessions[session.test_title].push(session);
    });

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-border pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Grading & Results</h1>
                            <p className="text-muted-foreground mt-1">Enter scores for completed tests</p>
                        </div>
                    </div>
                    <ExportButton sessions={sessions || []} />
                </header>

                <div className="space-y-8">
                    {Object.keys(groupedSessions).length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No completed tests to grade yet.
                        </div>
                    )}

                    {Object.entries(groupedSessions).map(([testTitle, testSessions]) => (
                        <div key={testTitle} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-muted/30 border-b border-border flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-foreground">{testTitle}</h2>
                                <span className="text-sm text-muted-foreground">{testSessions.length} submissions</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Student Name</th>
                                            <th className="px-6 py-3 font-medium">Date Taken</th>
                                            <th className="px-6 py-3 font-medium">Duration</th>
                                            <th className="px-6 py-3 font-medium text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {testSessions.map((session) => {
                                            const start = new Date(session.started_at).getTime();
                                            const end = new Date(session.completed_at).getTime();
                                            const durationMinutes = Math.round((end - start) / 1000 / 60);

                                            return (
                                                <tr key={session.id} className="bg-card hover:bg-muted/20 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-foreground">{session.student_name}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {new Date(session.completed_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {durationMinutes} mins
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ScoreInput sessionId={session.id} initialScore={session.score} />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
