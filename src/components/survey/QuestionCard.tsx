'use client';

import { ReactNode } from 'react';

interface QuestionCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function QuestionCard({ title, subtitle, children }: QuestionCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl mx-auto animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-gray-500 text-base md:text-lg">
                        {subtitle}
                    </p>
                )}
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
