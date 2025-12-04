'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function SessionStatusListener() {
    const router = useRouter()

    useEffect(() => {
        const channel = supabase
            .channel('settings_channel')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'settings',
                    filter: 'key=eq.session_active'
                },
                (payload) => {
                    if (payload.new.value === 'false') {
                        toast.error('Session has been closed by the leader.')
                        router.push('/')
                        router.refresh()
                    } else {
                        toast.success('Session is now open!')
                        router.refresh()
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [router])

    return null
}
