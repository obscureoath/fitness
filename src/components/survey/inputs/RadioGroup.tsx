'use client';

interface RadioOption {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface RadioGroupProps {
    label: string;
    options: RadioOption[];
    value: string | undefined;
    onChange: (value: string) => void;
    error?: string;
    columns?: 1 | 2 | 3 | 4;
}

export function RadioGroup({
    label,
    options,
    value,
    onChange,
    error,
    columns = 2
}: RadioGroupProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-4',
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>
            <div className={`grid ${gridCols[columns]} gap-3`}>
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${value === option.value
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {value === option.value && (
                            <div className="absolute top-3 right-3">
                                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        {option.icon && (
                            <div className="mb-2 text-2xl">{option.icon}</div>
                        )}
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        {option.description && (
                            <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                        )}
                    </button>
                ))}
            </div>
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
