'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireLeaderSession } from './auth'

/**
 * Upload a new test with PDF file
 */
export async function uploadTest(prevState: any, formData: FormData) {
    try {
        await requireLeaderSession()
    } catch {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const duration = parseInt(formData.get('duration') as string)
    const folderId = formData.get('folderId') as string
    const file = formData.get('file') as File

    if (!title || !file || !duration) {
        return { error: 'All fields are required' }
    }

    // 1. Upload PDF
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const { error: uploadError } = await supabaseAdmin.storage
        .from('pdfs')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Upload error:', uploadError)
        return { error: 'Failed to upload PDF' }
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('pdfs')
        .getPublicUrl(fileName)

    // 2. Insert into DB
    const { error: dbError } = await supabaseAdmin
        .from('tests')
        .insert({
            title,
            duration_minutes: duration,
            pdf_url: publicUrl,
            is_active: true,
            folder_id: folderId && folderId !== 'null' ? folderId : null
        })

    if (dbError) {
        console.error('DB error:', dbError)
        return { error: 'Failed to save test details' }
    }

    return { success: true }
}

/**
 * Delete a test by ID
 */
export async function deleteTest(id: string) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('tests')
        .delete()
        .eq('id', id)

    if (error) throw error
}

/**
 * Toggle test active/inactive status
 */
export async function toggleTestActive(id: string, isActive: boolean) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('tests')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) throw error
}

/**
 * Toggle test published status (visible in public library)
 */
export async function toggleTestPublished(id: string, isPublished: boolean) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('tests')
        .update({ is_published: isPublished })
        .eq('id', id)

    if (error) throw error
}
