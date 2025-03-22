'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface AccessibilityContextType {
    announceToScreenReader: (message: string) => void;
    isHighContrastMode: boolean;
    toggleHighContrastMode: () => void;
    isFocusVisible: boolean;
    setFocusVisible: (visible: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

interface AccessibilityProviderProps {
    children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
    const [isHighContrastMode, setHighContrastMode] = useState(false);
    const [isFocusVisible, setFocusVisible] = useState(true);
    const [announcement, setAnnouncement] = useState('');

    const announceToScreenReader = useCallback((message: string) => {
        setAnnouncement(message);
        // メッセージをクリアして次の通知を可能にする
        setTimeout(() => setAnnouncement(''), 1000);
    }, []);

    const toggleHighContrastMode = useCallback(() => {
        setHighContrastMode(prev => !prev);
        document.documentElement.classList.toggle('high-contrast');
    }, []);

    useKeyboardShortcuts([
        {
            key: 'h',
            ctrl: true,
            description: 'ハイコントラストモードの切り替え',
            handler: toggleHighContrastMode,
        },
        {
            key: 'f',
            ctrl: true,
            description: 'フォーカスインジケーターの切り替え',
            handler: () => setFocusVisible(prev => !prev),
        },
    ]);

    return (
        <AccessibilityContext.Provider
            value={{
                announceToScreenReader,
                isHighContrastMode,
                toggleHighContrastMode,
                isFocusVisible,
                setFocusVisible,
            }}
        >
            {children}
            <div
                role="status"
                aria-live="polite"
                className="sr-only"
            >
                {announcement}
            </div>
            <style jsx global>{`
                :root {
                    --focus-ring-color: ${isFocusVisible ? '#4f46e5' : 'transparent'};
                }
                
                .high-contrast {
                    --text-primary: #000000;
                    --text-secondary: #1a1a1a;
                    --background-primary: #ffffff;
                    --background-secondary: #f0f0f0;
                    --border-color: #000000;
                }

                *:focus {
                    outline: 2px solid var(--focus-ring-color);
                    outline-offset: 2px;
                }

                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `}</style>
        </AccessibilityContext.Provider>
    );
}; 