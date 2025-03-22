'use client';

import { useEffect } from 'react';

type ShortcutHandler = () => void;

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    handler: ShortcutHandler;
    description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // フォーム要素でのショートカットを無視
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            const matchingShortcut = shortcuts.find(
                shortcut =>
                    shortcut.key.toLowerCase() === event.key.toLowerCase() &&
                    !!shortcut.ctrl === (event.ctrlKey || event.metaKey) &&
                    !!shortcut.alt === event.altKey &&
                    !!shortcut.shift === event.shiftKey
            );

            if (matchingShortcut) {
                event.preventDefault();
                matchingShortcut.handler();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);

    // ショートカットのヘルプテキストを生成
    const getShortcutHelpText = () => {
        return shortcuts.map(shortcut => {
            const modifiers = [
                shortcut.ctrl && (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'),
                shortcut.alt && 'Alt',
                shortcut.shift && 'Shift',
            ].filter(Boolean);

            const key = shortcut.key.length === 1
                ? shortcut.key.toUpperCase()
                : shortcut.key;

            const keyCombo = [...modifiers, key].join(' + ');
            return `${keyCombo}: ${shortcut.description}`;
        });
    };

    return {
        getShortcutHelpText,
    };
}; 