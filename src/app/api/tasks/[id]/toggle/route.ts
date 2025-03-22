import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const task = await prisma.task.findFirst({
            where: {
                id: parseInt(params.id),
                userId: parseInt(session.user.id),
            },
        });

        if (!task) {
            return NextResponse.json(
                { error: "タスクが見つかりません" },
                { status: 404 }
            );
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                completed: !task.completed,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("タスク完了状態更新エラー:", error);
        return NextResponse.json(
            { error: "タスクの完了状態の更新に失敗しました" },
            { status: 500 }
        );
    }
} 