'use client'

import { useActionState, useEffect, useState } from 'react'
import { createFolder } from '@/app/actions'
import { Plus, Loader2, FolderPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const initialState = {
    error: '',
    success: false
}

export default function CreateFolderForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const result = await createFolder(prev, formData);
        return result;
    }, initialState)

    useEffect(() => {
        if (state?.success) {
            toast.success('Folder created');
            setIsOpen(false);
            router.refresh();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
                <FolderPlus className="w-4 h-4" />
                New Folder
            </button>
        )
    }

    return (
        <form action={formAction} className="flex items-center gap-2 mt-2">
            <input
                name="name"
                type="text"
                required
                placeholder="Folder Name"
                autoFocus
                className="px-2 py-1 text-sm rounded-md border border-input bg-background w-40"
            />
            <button
                type="submit"
                disabled={isPending}
                className="p-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
            <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
            >
                Cancel
            </button>
        </form>
    )
}
