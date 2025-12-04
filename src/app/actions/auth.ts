'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Login the leader/admin user
 */
export async function loginLeader(prevState: any, formData: FormData) {
    const password = formData.get('password')
    const correctPassword = process.env.LEADER_PASSWORD

    if (!correctPassword) {
        console.error('CRITICAL: LEADER_PASSWORD environment variable is not set!')
        return { error: 'Server configuration error. Contact administrator.' }
    }

    if (password === correctPassword) {
        (await cookies()).set('leader_session', 'true', { httpOnly: true, secure: true })
        redirect('/admin')
    } else {
        return { error: 'Incorrect password' }
    }
}

/**
 * Logout the leader/admin user
 */
export async function logoutLeader() {
    (await cookies()).delete('leader_session')
    redirect('/')
}

/**
 * Check if the current user has a valid leader session
 */
export async function checkLeaderSession() {
    const session = (await cookies()).get('leader_session')
    return session?.value === 'true'
}

/**
 * Require leader session, throwing error if not authenticated
 */
export async function requireLeaderSession() {
    const isLeader = await checkLeaderSession()
    if (!isLeader) {
        throw new Error('Unauthorized')
    }
    return true
}
