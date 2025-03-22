import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || "カテゴリーの取得に失敗しました");
        }
        return response.json();
    } catch (error) {
        console.error("カテゴリー取得エラー:", error);
        throw error;
    }
}

export async function createCategory(data: { name: string; color: string }): Promise<Category> {
    try {
        const response = await fetch("/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || "カテゴリーの作成に失敗しました");
        }
        return response.json();
    } catch (error) {
        console.error("カテゴリー作成エラー:", error);
        throw error;
    }
}

export async function updateCategory(
    categoryId: number,
    data: {
        name?: string;
        color?: string;
    }
) {
    try {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data,
        });
        return category;
    } catch (error) {
        console.error("カテゴリー更新エラー:", error);
        throw new Error("カテゴリーの更新に失敗しました");
    }
}

export async function deleteCategory(categoryId: number) {
    try {
        await prisma.category.delete({
            where: { id: categoryId },
        });
    } catch (error) {
        console.error("カテゴリー削除エラー:", error);
        throw new Error("カテゴリーの削除に失敗しました");
    }
} 