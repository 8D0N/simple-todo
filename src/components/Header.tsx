'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

export function Header() {
    const pathname = usePathname();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <div className="flex space-x-6">
                        <Link
                            href="/"
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            タスク一覧
                        </Link>
                        <Link
                            href="/categories"
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                pathname === '/categories' ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            カテゴリ管理
                        </Link>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        ログアウト
                    </button>
                </nav>
            </div>
        </header>
    );
} 