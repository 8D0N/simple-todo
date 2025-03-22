import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // リクエスト開始時刻を記録
    const start = Date.now();

    // APIリクエストのみを計測対象とする
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const response = NextResponse.next();

        // レスポンスタイムの計測
        const end = Date.now();
        const responseTime = end - start;

        // Server-Timing ヘッダーの追加
        response.headers.set('Server-Timing', `total;dur=${responseTime}`);

        // 性能要件（1秒）を超えた場合はログを記録
        if (responseTime > 1000) {
            console.warn(`Performance warning: ${request.nextUrl.pathname} took ${responseTime}ms`);
        }

        return response;
    }

    return NextResponse.next();
}

// APIルートのみを対象とする
export const config = {
    matcher: '/api/:path*',
}; 