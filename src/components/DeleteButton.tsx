'use client'

import { useState } from 'react'
import { deleteTest } from '@/app/actions'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id, title }: { id: string, title: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setIsDeleting(true);
        try {
            await deleteTest(id);
            toast.success('Test deleted successfully');
            router.refresh();
            setIsDeleting(false); // Reset state since we aren't hard reloading
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete test');
            setIsDeleting(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete Test"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    )
}
