export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: Priority | null;
    dueDate: string | null;
    categoryId: number | null;
    completed: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    name: string;
    color: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
} 