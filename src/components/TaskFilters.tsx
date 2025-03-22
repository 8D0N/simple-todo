"use client";

type Category = {
    id: number;
    name: string;
    color: string;
};

type TaskFiltersProps = {
    filters: {
        categoryId: string;
        priority: string;
        completed: string;
        search: string;
        sortBy: string;
        sortOrder: string;
    };
    onFilterChange: (filters: {
        categoryId: string;
        priority: string;
        completed: string;
        search: string;
        sortBy: string;
        sortOrder: string;
    }) => void;
    categories: Category[];
};

export function TaskFilters({ filters, onFilterChange, categories }: TaskFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        カテゴリー
                    </label>
                    <select
                        id="category"
                        value={filters.categoryId}
                        onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">すべて</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        優先度
                    </label>
                    <select
                        id="priority"
                        value={filters.priority}
                        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">すべて</option>
                        <option value="HIGH">高</option>
                        <option value="MEDIUM">中</option>
                        <option value="LOW">低</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="completed" className="block text-sm font-medium text-gray-700">
                        状態
                    </label>
                    <select
                        id="completed"
                        value={filters.completed}
                        onChange={(e) => onFilterChange({ ...filters, completed: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">すべて</option>
                        <option value="true">完了</option>
                        <option value="false">未完了</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        検索
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        placeholder="タイトルで検索..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
                    並び替え:
                </label>
                <select
                    id="sortBy"
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="createdAt">作成日</option>
                    <option value="dueDate">期限日</option>
                    <option value="priority">優先度</option>
                </select>
                <select
                    value={filters.sortOrder}
                    onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="desc">降順</option>
                    <option value="asc">昇順</option>
                </select>
            </div>
        </div>
    );
} 