'use client'

import { Download } from 'lucide-react'

export default function ExportButton({ sessions }: { sessions: any[] }) {
    const handleExport = () => {
        if (!sessions || sessions.length === 0) return;

        // Define CSV headers
        const headers = ['Student Name', 'Test Title', 'Score', 'Date Taken', 'Duration (Minutes)'];

        // Map session data to rows
        const rows = sessions.map(session => {
            const start = new Date(session.started_at).getTime();
            const end = new Date(session.completed_at).getTime();
            const durationMinutes = Math.round((end - start) / 1000 / 60);

            return [
                `"${session.student_name}"`,
                `"${session.test_title}"`,
                session.score ?? '',
                `"${new Date(session.completed_at).toLocaleDateString()}"`,
                durationMinutes
            ].join(',');
        });

        // Combine headers and rows
        const csvContent = [headers.join(','), ...rows].join('\n');

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `grading_results_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <button
            onClick={handleExport}
            disabled={!sessions || sessions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className="w-4 h-4" />
            Export CSV
        </button>
    )
}
