'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireLeaderSession } from './auth'

/**
 * Create a new folder
 */
export async function createFolder(prevState: any, formData: FormData) {
    try {
        await requireLeaderSession()
    } catch {
        return { error: 'Unauthorized' }
    }

    const name = formData.get('name') as string
    if (!name) return { error: 'Name is required' }

    const { error } = await supabaseAdmin
        .from('folders')
        .insert({ name })

    if (error) {
        if (error.code === '23505') return { error: 'Folder already exists' }
        return { error: 'Failed to create folder' }
    }

    return { success: true }
}

/**
 * Delete a folder by ID
 */
export async function deleteFolder(id: string) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('folders')
        .delete()
        .eq('id', id)

    if (error) throw error
}

/**
 * Toggle all tests in a folder active/inactive
 */
export async function toggleFolderActive(folderId: string, isActive: boolean) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('tests')
        .update({ is_active: isActive })
        .eq('folder_id', folderId)

    if (error) throw error
}
