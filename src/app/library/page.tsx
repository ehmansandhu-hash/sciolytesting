import { supabase } from '@/lib/supabase'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PublicFolderView from '@/components/PublicFolderView'
import { Test } from '@/lib/types'

export const dynamic = 'force-dynamic';

export default async function StudentLibraryPage() {
    // Fetch Published Tests
    const { data: tests } = await supabase
        .from('tests')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    // Fetch Folders
    const { data: folders } = await supabase
        .from('folders')
        .select('*')
        .order('name');

    // Group Tests by Folder
    const uncategorizedTests = tests?.filter(t => !t.folder_id) || [];
    const testsByFolder: Record<string, Test[]> = {};
    folders?.forEach(f => {
        testsByFolder[f.id] = tests?.filter(t => t.folder_id === f.id) || [];
    });

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Past Test Library</h1>
                        <p className="text-muted-foreground mt-1">Access study materials and past exams</p>
                    </div>
                </header>

                <div className="space-y-6">
                    {/* Folders */}
                    {folders?.map((folder) => (
                        <PublicFolderView
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
                                <PublicTestCard key={test.id} test={test} />
                            ))}
                        </div>
                    )}

                    {(!tests || tests.length === 0) && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">No published tests available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function PublicTestCard({ test }: { test: Test }) {
    return (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors group">
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
                    </div>
                </div>
            </div>
            <a href={test.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                View PDF
            </a>
        </div>
    )
}
