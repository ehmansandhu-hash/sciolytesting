'use client'

import { useActionState } from 'react'
import { uploadTest } from '@/app/actions'
import { Upload, Loader2 } from 'lucide-react'

const initialState = {
    error: '',
    success: false
}

export default function UploadForm() {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const result = await uploadTest(prev, formData);
        if (result?.success) {
            // Reset form manually or reload page
            window.location.reload();
            return { success: true };
        }
        return result;
    }, initialState)

    return (
        <form action={formAction} className="space-y-4 mt-4">
            <div>
                <label className="block text-sm font-medium mb-1">Test Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Anatomy & Physiology"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                    name="duration"
                    type="number"
                    required
                    defaultValue={50}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <input
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
            </div>

            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isPending ? 'Uploading...' : 'Upload Test'}
            </button>
        </form>
    )
}
