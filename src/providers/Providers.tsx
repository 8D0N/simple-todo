'use client';

import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthProvider>
            <AccessibilityProvider>
                {children}
            </AccessibilityProvider>
        </NextAuthProvider>
    );
} 