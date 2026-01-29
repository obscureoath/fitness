'use client';

import { InputHTMLAttributes } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    hint?: string;
    error?: string;
    unit?: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
}

export function NumberInput({
    label,
    hint,
    error,
    unit,
    value,
    onChange,
    ...props
}: NumberInputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={value ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val ? parseFloat(val) : undefined);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:outline-none focus:ring-0 focus:shadow-emerald-100/60 ${error
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-emerald-500'
                        } ${unit ? 'pr-14' : ''}`}
                    {...props}
                />
                {unit && (
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                        {unit}
                    </span>
                )}
            </div>
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
