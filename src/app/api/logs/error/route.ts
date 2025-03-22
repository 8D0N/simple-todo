import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ErrorLog } from '@/utils/error';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const errorLog: ErrorLog = await request.json();

        // エラーログをデータベースに保存
        await prisma.errorLog.create({
            data: {
                code: errorLog.code,
                message: errorLog.message,
                stack: errorLog.stack,
                requestId: errorLog.requestId,
                userId: session?.user?.id || errorLog.userId,
                details: errorLog.details ? JSON.stringify(errorLog.details) : null,
                timestamp: new Date(errorLog.timestamp),
            },
        });

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Failed to save error log:', error);
        return NextResponse.json(
            { error: 'Failed to save error log' },
            { status: 500 }
        );
    }
} 