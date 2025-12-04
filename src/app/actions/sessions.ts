'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireLeaderSession } from './auth'

/**
 * Start a student testing session (from home page)
 */
export async function startStudentSession(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    if (!name || name.trim().length === 0) {
        return { error: 'Name is required' }
    }

    // Check if session is active
    const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'session_active')
        .single()

    if (settings?.value !== 'true') {
        return { error: 'Testing session is currently closed.' }
    }

    // Store in cookie
    (await cookies()).set('student_name', name, { httpOnly: true })
    redirect('/select')
}

/**
 * Handle when a student starts a specific test
 */
export async function handleTestStart(testId: string, testTitle: string) {
    // Check if session is active
    const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'session_active')
        .single()

    if (settings?.value !== 'true') {
        redirect('/')
    }

    const cookieStore = await cookies()
    const studentName = cookieStore.get('student_name')?.value

    if (studentName) {
        // Create a new session record
        const { data, error } = await supabase.from('student_sessions').insert({
            student_name: studentName,
            test_id: testId,
            test_title: testTitle,
            status: 'in_progress',
            started_at: new Date().toISOString()
        }).select().single()

        if (data) {
            cookieStore.set('current_session_id', data.id, { httpOnly: true })
        }
    }

    redirect(`/test/${testId}`)
}

/**
 * Finish the current test session
 */
export async function finishTest() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('current_session_id')?.value

    if (sessionId) {
        await supabase.from('student_sessions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', sessionId)

        cookieStore.delete('current_session_id')
    }

    redirect('/select')
}

/**
 * Update score for a student session (admin only)
 */
export async function updateScore(sessionId: string, score: number) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('student_sessions')
        .update({ score })
        .eq('id', sessionId)

    if (error) throw error
}

/**
 * Toggle the global testing session on/off (admin only)
 */
export async function toggleSession(isActive: boolean) {
    await requireLeaderSession()

    const { error } = await supabaseAdmin
        .from('settings')
        .upsert({ key: 'session_active', value: String(isActive) })

    if (error) throw error
}
