'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GeneratedPlan } from '@/types/survey';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { downloadPDFDirect } from '@/utils/pdfExport';
import { NutritionDisplay } from '@/components/results/NutritionDisplay';
import { WorkoutDisplay } from '@/components/results/WorkoutDisplay';
import { BmiSummary } from '@/components/results/BmiSummary';

export default function ResultsPage() {
    const router = useRouter();
    const [plan, , clearPlan] = useLocalStorage<GeneratedPlan | null>('fitness-plan', null);
    const [, , clearSurvey] = useLocalStorage('fitness-survey', {});
    const [activeTab, setActiveTab] = useState<'nutrition' | 'workout'>('nutrition');
    const [isPDFLoading, setIsPDFLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Redirect if no plan exists
    useEffect(() => {
        if (isClient && !plan) {
            router.push('/survey');
        }
    }, [isClient, plan, router]);

    const handleExportPDF = async () => {
        if (!plan) return;

        setIsPDFLoading(true);
        try {
            downloadPDFDirect(plan, `fitness-plan-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsPDFLoading(false);
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset? This will delete your current plan and survey answers.')) {
            clearPlan();
            clearSurvey();
            router.push('/');
        }
    };

    if (!isClient || !plan) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 no-print">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-emerald-600">
                        Fitness
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExportPDF}
                            disabled={isPDFLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isPDFLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export to PDF
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-8 animate-fadeIn">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Your Plan is Ready!</h1>
                            <p className="text-emerald-100">
                                Generated on {new Date(plan.generatedAt).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Your Profile Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-gray-500">Age</div>
                            <div className="font-semibold text-gray-800">{plan.surveyData.basicInfo.age} years</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-gray-500">Weight</div>
                            <div className="font-semibold text-gray-800">{plan.surveyData.basicInfo.weight} kg</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-gray-500">Goal</div>
                            <div className="font-semibold text-gray-800 capitalize">{plan.surveyData.goalInfo.goal.replace('_', ' ')}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-gray-500">Training</div>
                            <div className="font-semibold text-gray-800">{plan.surveyData.trainingInfo.daysPerWeek} days/week</div>
                        </div>
                    </div>
                </div>

                <BmiSummary
                    heightCm={plan.surveyData.basicInfo.height}
                    weightKg={plan.surveyData.basicInfo.weight}
                />

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 no-print">
                    <button
                        onClick={() => setActiveTab('nutrition')}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${activeTab === 'nutrition'
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        🍽️ Nutrition Plan
                    </button>
                    <button
                        onClick={() => setActiveTab('workout')}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${activeTab === 'workout'
                                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        💪 Workout Plan
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                    {activeTab === 'nutrition' ? (
                        <NutritionDisplay
                            plan={plan.nutritionPlan}
                            dietStyle={plan.surveyData.nutritionPreferences.dietStyle}
                        />
                    ) : (
                        <WorkoutDisplay plan={plan.workoutPlan} />
                    )}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-gray-100 rounded-xl text-sm text-gray-500">
                    <strong>Disclaimer:</strong> This plan is generated based on general fitness principles and the
                    information you provided. It is not medical advice. Please consult with a healthcare professional
                    or certified fitness trainer before starting any new exercise or nutrition program, especially if
                    you have pre-existing health conditions.
                </div>
            </div>
        </main>
    );
}
