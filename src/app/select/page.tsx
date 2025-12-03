import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowRight, Clock, AlertCircle, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { handleTestStart } from '../actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function SelectTestPage() {
    const cookieStore = await cookies()
    const studentName = cookieStore.get('student_name')?.value

    if (!studentName) {
        redirect('/')
    }

    // Fetch Session Status
    const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'session_active')
        .single();

    const isSessionActive = settings?.value === 'true';

    // Fetch Tests
    const { data: tests } = await supabase
        .from('tests')
        .select('*')
        .eq('is_active', true)
        .order('title');

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Select a Test</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome, <span className="font-semibold text-primary">{studentName}</span>. Choose your event below.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {!isSessionActive && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Session Closed</span>
                            </div>
                        )}
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Change Name
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tests?.map((test) => (
                        <div
                            key={test.id}
                            className={`group relative bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-200 ${isSessionActive ? 'hover:border-primary/50 hover:shadow-md' : 'opacity-60'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                {isSessionActive ? (
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                                        Available
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                                        Closed
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-2">{test.title}</h3>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {test.duration_minutes} mins
                                </span>
                                <span>•</span>
                                <span>PDF Format</span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6">
                                Once you start, the timer will begin immediately. Good luck!
                            </p>

                            {isSessionActive ? (
                                <form action={handleTestStart.bind(null, test.id, test.title)}>
                                    <button type="submit" className="flex items-center justify-center w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors group-hover:translate-y-[-2px]">
                                        Start Test <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </form>
                            ) : (
                                <button disabled className="flex items-center justify-center w-full py-2.5 bg-muted text-muted-foreground rounded-lg font-medium cursor-not-allowed">
                                    Waiting for Leader...
                                </button>
                            )}
                        </div>
                    ))}

                    {(!tests || tests.length === 0) && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No active tests available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
