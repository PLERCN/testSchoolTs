export interface LessonsQuery {
    date?: string,
    status?: string,
    teacherIds?: string,
    studentsCount?: string,
    page?: number,
    lessonsPerPage?: number
}

export interface LessonResponse {
    id: number;
    date: string;
    title: string;
    status: number;
    visitCount: number;
    students: Array<{ id: number; name: string; visit: boolean }>;
    teachers: Array<{ id: number; name: string }>;
}

import { Student} from "#models/Student.model";

export interface StudentWithVisit extends Student {
    LessonStudent?: {
        visit: boolean;
    };
}
