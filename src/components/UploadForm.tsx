'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { uploadTest } from '@/app/actions'
import { Upload, Loader2, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Folder } from '@/lib/types'

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const initialState = {
    error: '',
    success: false
}

export default function UploadForm({ folders }: { folders: Folder[] }) {
    const router = useRouter()
    const [formKey, setFormKey] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        // Validate file before submission
        const file = formData.get('file') as File
        if (file && file.size > MAX_FILE_SIZE_BYTES) {
            return { error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` }
        }
        if (file && !file.name.toLowerCase().endsWith('.pdf')) {
            return { error: 'Only PDF files are allowed.' }
        }
        return await uploadTest(prev, formData)
    }, initialState)

    useEffect(() => {
        if (state && 'success' in state && state.success) {
            toast.success('Test uploaded successfully')
            router.refresh()
            setFormKey(prev => prev + 1)
            setSelectedFile(null)
            setFileError(null)
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, router])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFileError(null)

        if (!file) {
            setSelectedFile(null)
            return
        }

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            setFileError('Only PDF files are allowed.')
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setFileError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${MAX_FILE_SIZE_MB}MB.`)
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setSelectedFile(file)
    }

    return (
        <form key={formKey} action={formAction} className="space-y-4 mt-4">
            <div>
                <label className="block text-sm font-medium mb-1">Test Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Anatomy & Physiology"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Folder (Optional)</label>
                <select
                    name="folderId"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                    <option value="null">Uncategorized</option>
                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                    name="duration"
                    type="number"
                    required
                    min={1}
                    max={180}
                    defaultValue={50}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${fileError ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : selectedFile ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}`}>
                    <input
                        ref={fileInputRef}
                        name="file"
                        type="file"
                        accept=".pdf,application/pdf"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center gap-3 text-sm">
                        {fileError ? (
                            <>
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="text-red-600 dark:text-red-400">{fileError}</span>
                            </>
                        ) : selectedFile ? (
                            <>
                                <FileText className="w-5 h-5 text-primary" />
                                <span className="text-foreground font-medium">{selectedFile.name}</span>
                                <span className="text-muted-foreground">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 text-muted-foreground" />
                                <span className="text-muted-foreground">Click to select PDF (max {MAX_FILE_SIZE_MB}MB)</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-2 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{state.error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending || !!fileError || !selectedFile}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isPending ? 'Uploading...' : 'Upload Test'}
            </button>
        </form>
    )
}
