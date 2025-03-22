import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "test@example.com";
    const password = "password123";
    const name = "テストユーザー";

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // ユーザーの作成
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        console.log("テストユーザーを作成しました:", user);
    } catch (error) {
        console.error("エラーが発生しました:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 