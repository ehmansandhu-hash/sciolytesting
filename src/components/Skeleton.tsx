'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
}

/**
 * Animated skeleton placeholder for loading states
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted',
                className
            )}
        />
    )
}

/**
 * Skeleton for a test card in the library
 */
export function TestCardSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-8 w-20" />
        </div>
    )
}

/**
 * Skeleton for a folder in the library
 */
export function FolderSkeleton() {
    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-card">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <Skeleton className="w-6 h-6" />
            </div>
        </div>
    )
}

/**
 * Skeleton for a session row in grading
 */
export function SessionRowSkeleton() {
    return (
        <tr className="bg-card">
            <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
            <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
            <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
        </tr>
    )
}

/**
 * Skeleton for activity log items
 */
export function ActivitySkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
            </div>
        </div>
    )
}
