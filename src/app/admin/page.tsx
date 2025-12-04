import { checkLeaderSession } from '../actions'
import { redirect } from 'next/navigation'
import { FileText, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import SessionToggle from '@/components/SessionToggle'
import DeleteButton from '@/components/DeleteButton'
import RecentActivity from '@/components/RecentActivity'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const isLeader = await checkLeaderSession()
    if (!isLeader) {
        redirect('/login')
    }

    // Fetch Tests
    const { data: tests } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch Sessions
    const { data: sessions } = await supabase
        .from('student_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

    // Fetch Session Status
    const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'session_active')
        .single();

    const isSessionActive = settings?.value === 'true';

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Leader Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage tests and view student activity</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <SessionToggle isActive={isSessionActive} />

                        <form action="/api/auth/logout" method="POST">
                            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Logout
                            </button>
                        </form>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content - Tests */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Uploaded Tests
                                </h2>
                                <Link href="/admin/grading" className="text-sm font-medium text-primary hover:underline">
                                    Grading & Results &rarr;
                                </Link>
                            </div>

                            <div className="space-y-4 mb-8">
                                {tests?.map((test) => (
                                    <div key={test.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-background rounded-md border border-border group-hover:border-primary/50 transition-colors">
                                                <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-foreground">{test.title}</h3>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        {test.duration_minutes} mins
                                                    </span>
                                                    {test.is_active && (
                                                        <span className="text-green-500 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">Active</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a href={test.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mr-2">
                                                View PDF
                                            </a>
                                            <DeleteButton id={test.id} title={test.title} />
                                        </div>
                                    </div>
                                ))}

                                {(!tests || tests.length === 0) && (
                                    <p className="text-muted-foreground text-center py-4">No tests uploaded yet.</p>
                                )}
                            </div>

                            <div className="border-t border-border pt-6">
                                <h3 className="text-lg font-medium mb-4">Upload New Test</h3>
                                <UploadForm />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Logs */}
                    <div className="space-y-6">
                        <RecentActivity initialLogs={sessions || []} tests={tests || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
