import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from 'zod';

// タスクのバリデーションスキーマ
const taskSchema = z.object({
    title: z.string().min(1, "タイトルは必須です").max(255, "タイトルは255文字以内で入力してください"),
    description: z.string().optional().nullable(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    categoryId: z.number().optional().nullable(),
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const tasks = await prisma.task.findMany({
            where: {
                userId: parseInt(session.user.id),
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("タスク取得エラー:", error);
        return NextResponse.json(
            { error: "タスクの取得に失敗しました" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const data = await request.json();

        // 空の値をnullに変換
        const processedData = {
            ...data,
            description: data.description || null,
            priority: data.priority === "" ? null : data.priority,
            dueDate: data.dueDate === "" ? null : data.dueDate,
            categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        };

        // バリデーション
        const validatedData = taskSchema.parse(processedData);

        const task = await prisma.task.create({
            data: {
                ...validatedData,
                userId: parseInt(session.user.id),
                completed: false,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error("タスク作成エラー:", error);

        if (error instanceof z.ZodError) {
            const details = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return NextResponse.json(
                {
                    error: "入力データが不正です",
                    details: details
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "タスクの作成に失敗しました" },
            { status: 500 }
        );
    }
} 