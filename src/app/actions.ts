'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { supabase } from '@/lib/supabase'

export async function loginLeader(prevState: any, formData: FormData) {
    const password = formData.get('password')
    const correctPassword = process.env.LEADER_PASSWORD || 'admin123' // Fallback for dev

    if (password === correctPassword) {
        (await cookies()).set('leader_session', 'true', { httpOnly: true, secure: true })
        redirect('/admin')
    } else {
        return { error: 'Incorrect password' }
    }
}

export async function logoutLeader() {
    (await cookies()).delete('leader_session')
    redirect('/')
}

export async function checkLeaderSession() {
    const session = (await cookies()).get('leader_session')
    return session?.value === 'true'
}

export async function startStudentSession(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    if (!name || name.trim().length === 0) {
        return { error: 'Name is required' };
    }

    // Check if session is active
    const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'session_active')
        .single();

    if (settings?.value !== 'true') {
        return { error: 'Testing session is currently closed.' };
    }

    // Store in cookie
    (await cookies()).set('student_name', name, { httpOnly: true });
    redirect('/select');
}

export async function uploadTest(prevState: any, formData: FormData) {
    const isLeader = await checkLeaderSession();
    if (!isLeader) {
        return { error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const duration = parseInt(formData.get('duration') as string);
    const file = formData.get('file') as File;

    if (!title || !file || !duration) {
        return { error: 'All fields are required' };
    }

    // 1. Upload PDF
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file);

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return { error: 'Failed to upload PDF' };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

    // 2. Insert into DB
    const { error: dbError } = await supabase
        .from('tests')
        .insert({
            title,
            duration_minutes: duration,
            pdf_url: publicUrl,
            is_active: true
        });

    if (dbError) {
        console.error('DB error:', dbError);
        return { error: 'Failed to save test details' };
    }

    return { success: true };
}

export async function toggleSession(isActive: boolean) {
    const isLeader = await checkLeaderSession();
    if (!isLeader) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('settings')
        .upsert({ key: 'session_active', value: String(isActive) });

    if (error) throw error;
}

export async function deleteTest(id: string) {
    const isLeader = await checkLeaderSession();
    if (!isLeader) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function handleTestStart(testId: string, testTitle: string) {
    // Check if session is active
    const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'session_active')
        .single();

    if (settings?.value !== 'true') {
        redirect('/');
    }

    const cookieStore = await cookies();
    const studentName = cookieStore.get('student_name')?.value;

    if (studentName) {
        // Create a new session
        const { data, error } = await supabase.from('student_sessions').insert({
            student_name: studentName,
            test_id: testId,
            test_title: testTitle,
            status: 'in_progress',
            started_at: new Date().toISOString()
        }).select().single();

        if (data) {
            cookieStore.set('current_session_id', data.id, { httpOnly: true });
        }
    }

    redirect(`/test/${testId}`);
}

export async function finishTest() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('current_session_id')?.value;

    if (sessionId) {
        await supabase.from('student_sessions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', sessionId);

        cookieStore.delete('current_session_id');
    }

    redirect('/select');
}
