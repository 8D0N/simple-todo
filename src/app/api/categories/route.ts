import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const categories = await prisma.category.findMany({
            where: {
                userId: parseInt(session.user.id),
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("カテゴリー取得エラー:", error);
        return NextResponse.json(
            { error: "カテゴリーの取得に失敗しました" },
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
        const category = await prisma.category.create({
            data: {
                name: data.name,
                color: data.color || "#000000", // デフォルトの色を設定
                userId: parseInt(session.user.id),
            },
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error("カテゴリー作成エラー:", error);
        return NextResponse.json(
            { error: "カテゴリーの作成に失敗しました" },
            { status: 500 }
        );
    }
} 