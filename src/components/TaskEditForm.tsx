"use client";

import { useState } from "react";

type Category = {
    id: number;
    name: string;
    color: string;
};

type Task = {
    id: number;
    title: string;
    description: string | null;
    priority: "HIGH" | "MEDIUM" | "LOW" | null;
    dueDate: string | null;
    category: {
        id: number;
        name: string;
        color: string;
    } | null;
};

type TaskEditFormProps = {
    task: Task;
    onSubmit: (data: {
        title: string;
        description?: string;
        priority?: "HIGH" | "MEDIUM" | "LOW";
        dueDate?: string;
        categoryId?: number;
    }) => Promise<void>;
    onCancel: () => void;
    categories: Category[];
};

export function TaskEditForm({ task, onSubmit, onCancel, categories }: TaskEditFormProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW" | "">(task.priority || "");
    const [dueDate, setDueDate] = useState(task.dueDate || "");
    const [categoryId, setCategoryId] = useState<number | "">(task.category?.id || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                title,
                description: description || undefined,
                priority: priority || undefined,
                dueDate: dueDate || undefined,
                categoryId: categoryId || undefined,
            });
        } catch (error) {
            console.error("タスク更新エラー:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    タイトル
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    説明
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    優先度
                </label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "HIGH" | "MEDIUM" | "LOW" | "")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">選択してください</option>
                    <option value="HIGH">高</option>
                    <option value="MEDIUM">中</option>
                    <option value="LOW">低</option>
                </select>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    カテゴリー
                </label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : "")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">選択してください</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    期限
                </label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? "更新中..." : "更新"}
                </button>
            </div>
        </form>
    );
} 