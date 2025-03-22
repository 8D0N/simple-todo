import { useState } from "react";
import { Task, Category } from "@/types/task";
import { updateTask } from "@/lib/api/tasks";

type TaskEditModalProps = {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onTaskUpdated: () => Promise<void>;
};

export function TaskEditModal({ task, categories, onClose, onTaskUpdated }: TaskEditModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState(task.priority || "");
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    const [categoryId, setCategoryId] = useState(task.categoryId?.toString() || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : undefined;

            await updateTask(task.id, {
                title,
                description: description || undefined,
                priority: priority as "HIGH" | "MEDIUM" | "LOW" | undefined,
                dueDate: formattedDueDate,
                categoryId: categoryId ? Number(categoryId) : undefined,
            });
            await onTaskUpdated();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : "タスクの更新に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">タスクを編集</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="label">タイトル</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="label">説明</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="priority" className="label">優先度</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as "HIGH" | "MEDIUM" | "LOW" | "")}
                                className="input"
                            >
                                <option value="">なし</option>
                                <option value="HIGH">高</option>
                                <option value="MEDIUM">中</option>
                                <option value="LOW">低</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="label">カテゴリー</label>
                            <select
                                id="categoryId"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="input"
                            >
                                <option value="">なし</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="dueDate" className="label">期限</label>
                            <input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-outline"
                            disabled={isSubmitting}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "更新中..." : "更新"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 