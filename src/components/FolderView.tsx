'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, Trash2, Power } from 'lucide-react'
import TestCard from './TestCard'
import { deleteFolder, toggleFolderActive } from '@/app/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function FolderView({ folder, tests }: { folder: any, tests: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const activeCount = tests.filter(t => t.is_active).length;
    const allActive = tests.length > 0 && activeCount === tests.length;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Delete folder "${folder.name}"? Tests inside will become uncategorized.`)) return;

        try {
            await deleteFolder(folder.id);
            toast.success('Folder deleted');
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete folder');
        }
    }

    const handleToggleAll = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPending(true);
        const newState = !allActive; // If not all are active, turn all ON. If all are active, turn all OFF.

        try {
            await toggleFolderActive(folder.id, newState);
            toast.success(newState ? 'All tests activated' : 'All tests deactivated');
            router.refresh();
        } catch (error) {
            toast.error('Failed to update folder status');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 cursor-pointer transition-colors select-none"
            >
                <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <Folder className={`w-5 h-5 ${activeCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-medium">{folder.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {tests.length}
                        </span>
                        {tests.length > 0 && (
                            <button
                                onClick={handleToggleAll}
                                disabled={isPending}
                                className={`text-xs px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${allActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                title={allActive ? 'Deactivate all' : 'Activate all'}
                            >
                                <Power className="w-3 h-3" />
                                {activeCount}/{tests.length} Active
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete Folder"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {isOpen && (
                <div className="p-4 bg-muted/10 border-t border-border space-y-3">
                    {tests.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic pl-8">Empty folder</p>
                    ) : (
                        tests.map((test) => (
                            <TestCard key={test.id} test={test} />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
