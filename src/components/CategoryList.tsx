"use client";

import { useState } from "react";

type Category = {
    id: number;
    name: string;
    color: string;
};

type CategoryListProps = {
    categories: Category[];
    onUpdate: () => void;
};

export function CategoryList({ categories, onUpdate }: CategoryListProps) {
    const [newCategory, setNewCategory] = useState({ name: "", color: "#000000" });
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCategory),
            });

            if (!response.ok) throw new Error("カテゴリーの作成に失敗しました");

            setNewCategory({ name: "", color: "#000000" });
            onUpdate();
        } catch (error) {
            console.error("カテゴリー作成エラー:", error);
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        try {
            const response = await fetch(`/api/categories/${editingCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingCategory),
            });

            if (!response.ok) throw new Error("カテゴリーの更新に失敗しました");

            setEditingCategory(null);
            onUpdate();
        } catch (error) {
            console.error("カテゴリー更新エラー:", error);
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (!confirm("このカテゴリーを削除してもよろしいですか？")) return;

        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("カテゴリーの削除に失敗しました");

            onUpdate();
        } catch (error) {
            console.error("カテゴリー削除エラー:", error);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">カテゴリー管理</h2>

            <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        新規カテゴリー名
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                        カラー
                    </label>
                    <input
                        type="color"
                        id="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        required
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    カテゴリーを作成
                </button>
            </form>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">カテゴリー一覧</h3>
                {categories.length === 0 ? (
                    <p className="text-gray-500">カテゴリーがありません</p>
                ) : (
                    <ul className="space-y-4">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                {editingCategory?.id === category.id ? (
                                    <form onSubmit={handleUpdateCategory} className="w-full space-y-4">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                value={editingCategory.name}
                                                onChange={(e) =>
                                                    setEditingCategory({ ...editingCategory, name: e.target.value })
                                                }
                                                required
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                            <input
                                                type="color"
                                                value={editingCategory.color}
                                                onChange={(e) =>
                                                    setEditingCategory({ ...editingCategory, color: e.target.value })
                                                }
                                                required
                                                className="h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingCategory(null)}
                                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                キャンセル
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                            >
                                                更新
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingCategory(category)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 