import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const params = await context.params;

        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const body = await request.json();
        const { name, color } = body;

        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(params.id),
                userId: parseInt(session.user.id),
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "カテゴリーが見つかりません" },
                { status: 404 }
            );
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                name,
                color,
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("カテゴリー更新エラー:", error);
        return NextResponse.json(
            { error: "カテゴリーの更新に失敗しました" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const params = await context.params;

        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(params.id),
                userId: parseInt(session.user.id),
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "カテゴリーが見つかりません" },
                { status: 404 }
            );
        }

        await prisma.category.delete({
            where: {
                id: parseInt(params.id),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("カテゴリー削除エラー:", error);
        return NextResponse.json(
            { error: "カテゴリーの削除に失敗しました" },
            { status: 500 }
        );
    }
} 