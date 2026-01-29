'use client';

interface SliderInputProps {
    label: string;
    hint?: string;
    value: number | undefined;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    labels?: string[];
}

export function SliderInput({
    label,
    hint,
    value,
    onChange,
    min,
    max,
    step = 1,
    labels
}: SliderInputProps) {
    const currentValue = value ?? Math.floor((min + max) / 2);

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                </label>
                <span className="text-lg font-bold text-emerald-600">
                    {currentValue}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            {labels && (
                <div className="flex justify-between text-xs text-gray-500">
                    {labels.map((label, i) => (
                        <span key={i}>{label}</span>
                    ))}
                </div>
            )}
            {hint && (
                <p className="text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
}
