'use client';

import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label: string;
    hint?: string;
    error?: string;
    value: string | undefined;
    onChange: (value: string) => void;
}

export function TextArea({
    label,
    hint,
    error,
    value,
    onChange,
    ...props
}: TextAreaProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>
            <textarea
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 resize-none ${error
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                {...props}
            />
            {hint && !error && (
                <p className="text-sm text-gray-500">{hint}</p>
            )}
            {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
