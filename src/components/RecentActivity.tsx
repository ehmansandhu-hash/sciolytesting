'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users } from 'lucide-react'

type Session = {
    id: string;
    student_name: string;
    test_id: string;
    test_title: string;
    started_at: string;
    completed_at: string | null;
    status: 'in_progress' | 'completed';
}

function SessionTimer({ startedAt, durationMinutes }: { startedAt: string, durationMinutes: number }) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isOvertime, setIsOvertime] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startedAt).getTime();
            const end = start + (durationMinutes * 60 * 1000);
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('00:00');
                setIsOvertime(true);
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [startedAt, durationMinutes]);

    return (
        <span className={`text-xs font-mono ${isOvertime ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
            {timeLeft}
        </span>
    );
}

export default function RecentActivity({ initialLogs, tests }: { initialLogs: any[], tests: any[] }) {
    const [sessions, setSessions] = useState<Session[]>(initialLogs || []);

    useEffect(() => {
        const channel = supabase
            .channel('sessions_channel')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen for INSERT and UPDATE
                    schema: 'public',
                    table: 'student_sessions'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setSessions((prev) => [payload.new as Session, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setSessions((prev) => prev.map(s =>
                            s.id === payload.new.id ? (payload.new as Session) : s
                        ));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    const getTestDuration = (testId: string) => {
        return tests?.find(t => t.id === testId)?.duration_minutes || 50;
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary" />
                Live Activity
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {sessions?.map((session) => (
                    <div key={session.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${session.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                            <span className="text-xs font-bold">{session.student_name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-foreground">{session.student_name}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${session.status === 'completed'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-blue-500/10 text-blue-500 animate-pulse'
                                    }`}>
                                    {session.status === 'completed' ? 'DONE' : 'LIVE'}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{session.test_title}</p>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-muted-foreground">
                                    Started: {new Date(session.started_at).toLocaleTimeString()}
                                </p>
                                {session.status === 'in_progress' && (
                                    <SessionTimer
                                        startedAt={session.started_at}
                                        durationMinutes={getTestDuration(session.test_id)}
                                    />
                                )}
                                {session.status === 'completed' && session.completed_at && (
                                    <span className="text-xs text-muted-foreground">
                                        Finished: {new Date(session.completed_at).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {(!sessions || sessions.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">No active sessions.</p>
                )}
            </div>
        </div>
    )
}
