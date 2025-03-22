'use client';

import { useState, useEffect } from 'react';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('カテゴリの取得に失敗しました');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'カテゴリの取得に失敗しました');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });
            if (!response.ok) throw new Error('カテゴリの作成に失敗しました');
            await fetchCategories();
            setNewCategory({ name: '', color: '#3B82F6' });
            toast.success('カテゴリを作成しました');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'カテゴリの作成に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('このカテゴリを削除してもよろしいですか？')) return;
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('カテゴリの削除に失敗しました');
            await fetchCategories();
            toast.success('カテゴリを削除しました');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'カテゴリの削除に失敗しました');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8">カテゴリ管理</h1>

            <Card className="p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">カテゴリ名</Label>
                        <Input
                            id="name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="color">カラー</Label>
                        <Input
                            id="color"
                            type="color"
                            value={newCategory.color}
                            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? '作成中...' : 'カテゴリを作成'}
                    </Button>
                </form>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span>{category.name}</span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                            >
                                削除
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 