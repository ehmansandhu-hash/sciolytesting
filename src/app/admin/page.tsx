import { checkLeaderSession } from '../actions'
import { redirect } from 'next/navigation'
import { FileText, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import SessionToggle from '@/components/SessionToggle'
import RecentActivity from '@/components/RecentActivity'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const isLeader = await checkLeaderSession()
    if (!isLeader) {
        redirect('/login')
    }

    // Fetch Folders (for UploadForm)
    const { data: folders } = await supabase
        .from('folders')
        .select('*')
        .order('name');

    // Fetch Tests (for RecentActivity timer)
    const { data: tests } = await supabase
        .from('tests')
        .select('*');

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
                        <p className="text-muted-foreground mt-1">Command Center</p>
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
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Navigation Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/library" className="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Test Library</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Manage folders and organize test files.</p>
                            </Link>

                            <Link href="/admin/grading" className="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Grading</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Grade completed tests and view results.</p>
                            </Link>
                        </div>

                        {/* Upload Section */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                                <FileText className="w-5 h-5 text-primary" />
                                Upload New Test
                            </h2>
                            <UploadForm folders={folders || []} />
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
