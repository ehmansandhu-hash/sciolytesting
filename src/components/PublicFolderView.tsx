'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react'
import { Folder as FolderType, Test } from '@/lib/types'

export default function PublicFolderView({ folder, tests }: { folder: FolderType, tests: Test[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 cursor-pointer transition-colors select-none"
            >
                <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <Folder className="w-5 h-5 text-primary" />
                    <span className="font-medium">{folder.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {tests.length}
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 bg-muted/10 border-t border-border space-y-3">
                    {tests.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic pl-8">Empty folder</p>
                    ) : (
                        tests.map((test) => (
                            <PublicTestCard key={test.id} test={test} />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

function PublicTestCard({ test }: { test: Test }) {
    return (
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-muted/30 rounded-md border border-border group-hover:border-primary/50 transition-colors">
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                    <h3 className="font-medium text-foreground text-sm">{test.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{test.duration_minutes} mins</span>
                    </div>
                </div>
            </div>
            <a href={test.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                View PDF
            </a>
        </div>
    )
}
