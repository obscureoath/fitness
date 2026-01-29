'use client';

interface NavigationButtonsProps {
    onBack?: () => void;
    onNext?: () => void;
    onGenerate?: () => void;
    showBack?: boolean;
    isLastStep?: boolean;
    isLoading?: boolean;
    nextLabel?: string;
}

export function NavigationButtons({
    onBack,
    onNext,
    onGenerate,
    showBack = true,
    isLastStep = false,
    isLoading = false,
    nextLabel,
}: NavigationButtonsProps) {
    return (
        <div className="flex justify-between items-center mt-10">
            {showBack && onBack ? (
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-xl hover:bg-gray-100"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            ) : (
                <div />
            )}

            {isLastStep ? (
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate My Plan
                        </>
                    )}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    {nextLabel || 'Next'}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
