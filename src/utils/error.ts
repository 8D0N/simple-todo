import { v4 as uuidv4 } from 'uuid';

export type ErrorDetails = {
    field?: string;
    value?: string | number | boolean;
    constraint?: string;
    [key: string]: unknown;
};

export interface ErrorLog {
    timestamp: string;
    code: number;
    message: string;
    stack?: string;
    requestId: string;
    userId?: string;
    details?: ErrorDetails | ErrorDetails[];
}

export class AppError extends Error {
    code: number;
    details?: ErrorDetails | ErrorDetails[];

    constructor(message: string, code: number = 500, details?: ErrorDetails | ErrorDetails[]) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.details = details;
    }
}

export const errorCodes = {
    VALIDATION_ERROR: 3000,
    RESOURCE_NOT_FOUND: 3001,
    UNAUTHORIZED: 2000,
    FORBIDDEN: 2001,
    INTERNAL_SERVER_ERROR: 1000,
    NETWORK_ERROR: 1001,
    DATABASE_ERROR: 1002,
} as const;

export const logError = async (error: Error | AppError, userId?: string) => {
    const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        code: 'code' in error ? (error as AppError).code : 500,
        message: error.message,
        stack: error.stack,
        requestId: uuidv4(),
        userId,
        details: 'details' in error ? (error as AppError).details : undefined,
    };

    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorLog);
    }

    // 本番環境では適切なロギングサービスに送信
    if (process.env.NODE_ENV === 'production') {
        try {
            const response = await fetch('/api/logs/error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorLog),
            });

            if (!response.ok) {
                console.error('Failed to log error:', await response.text());
            }
        } catch (e) {
            console.error('Error while logging error:', e);
        }
    }

    return errorLog;
};

export class NetworkError extends AppError {
    constructor(message: string = 'Network error occurred', details?: ErrorDetails) {
        super(message, errorCodes.NETWORK_ERROR, details);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation error occurred', details?: ErrorDetails) {
        super(message, errorCodes.VALIDATION_ERROR, details);
        this.name = 'ValidationError';
    }
}

export class DatabaseError extends AppError {
    constructor(message: string = 'Database error occurred', details?: ErrorDetails) {
        super(message, errorCodes.DATABASE_ERROR, details);
        this.name = 'DatabaseError';
    }
}

interface RetryOptions {
    maxRetries: number;
    backoff: boolean;
    initialDelay: number;
}

const defaultRetryOptions: RetryOptions = {
    maxRetries: 3,
    backoff: true,
    initialDelay: 1000,
};

export async function withRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const finalOptions = { ...defaultRetryOptions, ...options };
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < finalOptions.maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            // 特定のエラーは再試行しない
            if (error instanceof ValidationError) {
                throw error;
            }

            // 最後の試行だった場合はエラーを投げる
            if (attempt === finalOptions.maxRetries - 1) {
                throw lastError;
            }

            // バックオフ遅延を計算
            const delay = finalOptions.backoff
                ? finalOptions.initialDelay * Math.pow(2, attempt)
                : finalOptions.initialDelay;

            // 遅延を待つ
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

export const handleApiError = async (error: unknown, userId?: string) => {
    let finalError: AppError;

    if (error instanceof AppError) {
        finalError = error;
    } else if (error instanceof Error) {
        finalError = new AppError(error.message, errorCodes.INTERNAL_SERVER_ERROR);
    } else {
        finalError = new AppError('An unknown error occurred', errorCodes.INTERNAL_SERVER_ERROR);
    }

    // エラーをログに記録
    await logError(finalError, userId);

    // エラー種別に応じた処理
    if (finalError instanceof NetworkError) {
        return {
            code: finalError.code,
            message: 'ネットワークエラーが発生しました。再試行してください。',
            retryable: true,
        };
    } else if (finalError instanceof ValidationError) {
        return {
            code: finalError.code,
            message: '入力内容を確認してください。',
            details: finalError.details,
            retryable: false,
        };
    } else if (finalError instanceof DatabaseError) {
        return {
            code: finalError.code,
            message: 'データベースエラーが発生しました。しばらく待ってから再試行してください。',
            retryable: true,
        };
    }

    return {
        code: finalError.code,
        message: '予期せぬエラーが発生しました。',
        retryable: false,
    };
}; 