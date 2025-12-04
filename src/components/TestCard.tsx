'use client'

import { FileText, Power } from 'lucide-react'
import DeleteButton from './DeleteButton'
import { toggleTestActive } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

export default function TestCard({ test }: { test: any }) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleToggle = async () => {
        setIsPending(true);
        try {
            await toggleTestActive(test.id, !test.is_active);
            router.refresh();
            toast.success(test.is_active ? 'Test deactivated' : 'Test activated');
        } catch (error) {
            toast.error('Failed to update test status');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors group ${test.is_active ? 'bg-card border-border' : 'bg-muted/30 border-border opacity-75'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-md border transition-colors ${test.is_active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-background border-border text-muted-foreground'}`}>
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-medium text-foreground">{test.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            {test.duration_minutes} mins
                        </span>
                        <button
                            onClick={handleToggle}
                            disabled={isPending}
                            className={`text-xs px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${test.is_active ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                        >
                            <Power className="w-3 h-3" />
                            {test.is_active ? 'Active' : 'Inactive'}
                        </button>
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
    )
}
