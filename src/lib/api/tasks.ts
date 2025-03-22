import { Task } from "@/types/task";

interface ValidationError {
    message: string;
}

export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || "タスクの取得に失敗しました");
        }
        return response.json();
    } catch (error) {
        console.error("タスク取得エラー:", error);
        throw error;
    }
}

export async function createTask(data: {
    title: string;
    description?: string;
    priority?: "HIGH" | "MEDIUM" | "LOW" | null;
    dueDate?: string;
    categoryId?: number;
}): Promise<Task> {
    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (responseData.error) {
                throw new Error(responseData.error);
            }
            if (responseData.details) {
                throw new Error(responseData.details.map((d: ValidationError) => d.message).join(", "));
            }
            throw new Error("タスクの作成に失敗しました");
        }

        return responseData;
    } catch (error) {
        console.error("タスク作成エラー:", error);
        throw error;
    }
}

export async function updateTask(
    taskId: number,
    data: {
        title: string;
        description?: string;
        priority?: "HIGH" | "MEDIUM" | "LOW";
        dueDate?: string;
        categoryId?: number;
    }
): Promise<Task> {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (responseData.error) {
                throw new Error(responseData.error);
            }
            throw new Error("タスクの更新に失敗しました");
        }

        return responseData;
    } catch (error) {
        console.error("タスク更新エラー:", error);
        throw error;
    }
}

export async function deleteTask(taskId: number): Promise<void> {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "タスクの削除に失敗しました");
        }
    } catch (error) {
        console.error("タスク削除エラー:", error);
        throw error;
    }
}

export async function toggleTaskComplete(taskId: number): Promise<Task> {
    try {
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: "POST",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "タスクの状態更新に失敗しました");
        }

        return response.json();
    } catch (error) {
        console.error("タスク状態更新エラー:", error);
        throw error;
    }
} 