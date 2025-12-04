import { checkLeaderSession } from '../../actions'
import { redirect } from 'next/navigation'
import { FileText, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import CreateFolderForm from '@/components/CreateFolderForm'
import Link from 'next/link'
import FolderView from '@/components/FolderView'
import TestCard from '@/components/TestCard'

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
    const isLeader = await checkLeaderSession()
    if (!isLeader) {
        redirect('/login')
    }

    // Fetch Tests
    const { data: tests } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch Folders
    const { data: folders } = await supabase
        .from('folders')
        .select('*')
        .order('name');

    // Group Tests by Folder
    const uncategorizedTests = tests?.filter(t => !t.folder_id) || [];
    const testsByFolder: Record<string, any[]> = {};
    folders?.forEach(f => {
        testsByFolder[f.id] = tests?.filter(t => t.folder_id === f.id) || [];
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
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Library</h1>
                            <p className="text-muted-foreground mt-1">Organize and manage your test files</p>
                        </div>
                    </div>
                    <CreateFolderForm />
                </header>

                <div className="space-y-6">
                    {/* Folders */}
                    {folders?.map((folder) => (
                        <FolderView
                            key={folder.id}
                            folder={folder}
                            tests={testsByFolder[folder.id] || []}
                        />
                    ))}

                    {/* Uncategorized Tests */}
                    {uncategorizedTests.length > 0 && (
                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Uncategorized Files
                            </h3>
                            {uncategorizedTests.map((test) => (
                                <TestCard key={test.id} test={test} />
                            ))}
                        </div>
                    )}

                    {(!tests || tests.length === 0) && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">No tests uploaded yet.</p>
                            <p className="text-sm text-muted-foreground mt-1">Go to the Dashboard to upload tests.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
