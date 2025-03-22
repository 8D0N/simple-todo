"use client";

import { useState, useRef } from "react";
import { Category } from "@/types/task";
import { createTask } from "@/lib/api/tasks";

export default function TaskForm({
    categories,
    onTaskCreated
}: {
    categories: Category[];
    onTaskCreated: () => Promise<void>;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            priority: formData.get("priority") as "HIGH" | "MEDIUM" | "LOW" | null,
            dueDate: formData.get("dueDate") as string,
            categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : undefined,
        };

        try {
            await createTask(data);
            formRef.current?.reset();
            await onTaskCreated();
        } catch (error) {
            setError(error instanceof Error ? error.message : "タスクの作成に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="label">
                    タイトル
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="input"
                    placeholder="タスクのタイトルを入力"
                />
            </div>

            <div>
                <label htmlFor="description" className="label">
                    説明
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="input"
                    placeholder="タスクの説明を入力（任意）"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="priority" className="label">
                        優先度
                    </label>
                    <select id="priority" name="priority" className="input">
                        <option value="">選択してください</option>
                        <option value="HIGH">高</option>
                        <option value="MEDIUM">中</option>
                        <option value="LOW">低</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="categoryId" className="label">
                        カテゴリー
                    </label>
                    <select id="categoryId" name="categoryId" className="input">
                        <option value="">選択してください</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="dueDate" className="label">
                        期限
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="input"
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary"
                >
                    {isSubmitting ? "作成中..." : "タスクを作成"}
                </button>
            </div>
        </form>
    );
} 