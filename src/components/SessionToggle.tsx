'use client'

import { useState } from 'react'
import { toggleSession } from '@/app/actions'
import { Loader2 } from 'lucide-react'

export default function SessionToggle({ isActive }: { isActive: boolean }) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleSession(!isActive);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to update session status');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isActive
                    ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                }`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            )}
            <span className="text-sm font-medium">
                {isActive ? 'Session Active' : 'Session Closed'}
            </span>
        </button>
    )
}
