'use client';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                    Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-emerald-600">
                    {Math.round(percentage)}% Complete
                </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between mt-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${i + 1 < currentStep
                                ? 'bg-emerald-500 text-white'
                                : i + 1 === currentStep
                                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-200'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {i + 1 < currentStep ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            i + 1
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
