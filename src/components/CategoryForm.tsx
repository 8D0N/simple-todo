"use client";

import { useState } from "react";

type CategoryFormProps = {
    onSubmit: (data: { name: string; color: string }) => Promise<void>;
    initialData?: {
        name: string;
        color: string;
    };
    onCancel?: () => void;
};

export function CategoryForm({ onSubmit, initialData, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [color, setColor] = useState(initialData?.color || "#000000");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({ name, color });
            if (!initialData) {
                setName("");
                setColor("#000000");
            }
        } catch (error) {
            console.error("カテゴリー作成エラー:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    カテゴリー名
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    色
                </label>
                <input
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        キャンセル
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? "保存中..." : initialData ? "更新" : "作成"}
                </button>
            </div>
        </form>
    );
} 