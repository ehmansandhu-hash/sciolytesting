export interface Test {
    id: string;
    created_at: string;
    title: string;
    duration_minutes: number;
    pdf_url: string;
    is_active: boolean;
    is_published: boolean;
    folder_id?: string | null;
}

export interface Folder {
    id: string;
    created_at: string;
    name: string;
}

export interface StudentSession {
    id: string;
    created_at: string;
    student_name: string;
    test_id: string;
    test_title: string;
    started_at: string;
    completed_at: string;
    status: 'completed' | 'in_progress'; // Assuming status values based on usage
    score?: number | null;
}

export interface Settings {
    key: string;
    value: string;
    updated_at: string;
}
