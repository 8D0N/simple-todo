"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskEditModal } from "@/components/TaskEditModal";
import { getCategories } from "@/lib/api/categories";
import { getTasks, deleteTask, toggleTaskComplete } from "@/lib/api/tasks";
import { Task, Category } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: "",
    priority: "",
    completed: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchData = async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        getTasks(),
        getCategories()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskCreated = async () => {
    await fetchData();
  };

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        <section className="card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">新しいタスクを作成</h2>
          <TaskForm categories={categories} onTaskCreated={handleTaskCreated} />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">タスク一覧</h2>
            <TaskFilters categories={categories} filters={filters} onFilterChange={setFilters} />
          </div>

          <TaskList
            tasks={tasks}
            categories={categories}
            onTaskUpdated={handleTaskCreated}
          />
        </section>
      </div>
    </main>
  );
}

function TaskList({
  tasks,
  categories,
  onTaskUpdated
}: {
  tasks: Task[];
  categories: Category[];
  onTaskUpdated: () => Promise<void>;
}) {
  if (tasks.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 text-lg">タスクがありません</p>
        <p className="text-slate-500 mt-2">新しいタスクを作成してみましょう！</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} categories={categories} onTaskUpdated={onTaskUpdated} />
      ))}
    </div>
  );
}

function TaskItem({
  task,
  categories,
  onTaskUpdated
}: {
  task: Task;
  categories: Category[];
  onTaskUpdated: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const category = categories.find((c) => c.id === task.categoryId);
  const priorityClass = task.completed
    ? "completed"
    : task.priority === "HIGH"
      ? "high-priority"
      : task.priority === "MEDIUM"
        ? "medium-priority"
        : "low-priority";

  const handleToggleComplete = async () => {
    try {
      setIsUpdating(true);
      await toggleTaskComplete(task.id);
      await onTaskUpdated();
    } catch (error) {
      console.error("タスク状態更新エラー:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このタスクを削除してもよろしいですか？")) return;
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      await onTaskUpdated();
    } catch (error) {
      console.error("タスク削除エラー:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`task-item ${priorityClass}`}>
        <input
          type="checkbox"
          checked={task.completed}
          className="checkbox"
          disabled={isUpdating}
          onChange={handleToggleComplete}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-slate-900 truncate">{task.title}</h3>
            {category && (
              <span className="badge-primary">{category.name}</span>
            )}
            <span className={`badge ${task.priority === "HIGH"
              ? "badge-error"
              : task.priority === "MEDIUM"
                ? "badge-secondary"
                : "badge-primary"
              }`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-slate-600 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span>作成: {task.createdAt.split('T')[0]}</span>
            {task.dueDate && (
              <span>期限: {task.dueDate.split('T')[0]}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn-outline"
            disabled={isDeleting || isUpdating}
            onClick={() => setIsEditing(true)}
          >
            編集
          </button>
          <button
            className="btn-outline text-red-600 hover:text-red-700"
            disabled={isDeleting || isUpdating}
            onClick={handleDelete}
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      </div>

      {isEditing && (
        <TaskEditModal
          task={task}
          categories={categories}
          onClose={() => setIsEditing(false)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
}

function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="task-item animate-pulse">
          <div className="w-5 h-5 bg-slate-200 rounded" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-slate-200 rounded" />
            <div className="w-16 h-8 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
