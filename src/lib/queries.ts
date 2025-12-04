import { supabaseAdmin } from './supabase-admin'
import { supabase } from './supabase'
import type { Test, Folder, StudentSession, Settings } from './types'

/**
 * Centralized database queries
 * Use these instead of duplicating Supabase calls across pages
 */

// ============ FOLDERS ============

export async function getFolders(): Promise<Folder[]> {
    const { data, error } = await supabaseAdmin
        .from('folders')
        .select('*')
        .order('name')

    if (error) throw error
    return data || []
}

// ============ TESTS ============

interface GetTestsOptions {
    activeOnly?: boolean
    publishedOnly?: boolean
    folderId?: string
}

export async function getTests(options: GetTestsOptions = {}): Promise<Test[]> {
    let query = supabaseAdmin
        .from('tests')
        .select('*')

    if (options.activeOnly) {
        query = query.eq('is_active', true)
    }
    if (options.publishedOnly) {
        query = query.eq('is_published', true)
    }
    if (options.folderId) {
        query = query.eq('folder_id', options.folderId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function getTestById(id: string): Promise<Test | null> {
    const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return null
    return data
}

// ============ SESSIONS ============

interface GetSessionsOptions {
    status?: 'in_progress' | 'completed'
    limit?: number
}

export async function getSessions(options: GetSessionsOptions = {}): Promise<StudentSession[]> {
    let query = supabaseAdmin
        .from('student_sessions')
        .select('*')

    if (options.status) {
        query = query.eq('status', options.status)
    }

    query = query.order('started_at', { ascending: false })

    if (options.limit) {
        query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
}

// ============ SETTINGS ============

export async function getSetting(key: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

    if (error) return null
    return data?.value || null
}

export async function isSessionActive(): Promise<boolean> {
    const value = await getSetting('session_active')
    return value === 'true'
}
