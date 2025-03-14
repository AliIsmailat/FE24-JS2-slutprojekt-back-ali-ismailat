
export enum differentRoles{
    FRONTEND = "frontend developer",
    BACKEND = "backend developer",
    UX_UI = "ux/ui"
}

export enum taskStatus{
    TODO = "todo",
    IN_PROGRESS = "in-progress",
    DONE = "done"
}

export interface Employee{
    id: number;
    name: string;
    role: differentRoles; 
}

export interface Tasks{
    id: number;
    title: string;
    description: string;
    category: string;
    status: taskStatus;
    assigned: number;
    timestamp: string;
}

export interface Data{
    employees: Employee[];
    assignments: Tasks[];
}

