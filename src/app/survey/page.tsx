'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SurveyData, GeneratedPlan } from '@/types/survey';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { validateStep } from '@/utils/validation';
import { generateNutritionPlan } from '@/utils/nutritionGenerator';
import { generateWorkoutPlan } from '@/utils/workoutGenerator';
import { ProgressBar } from '@/components/survey/ProgressBar';
import { NavigationButtons } from '@/components/survey/NavigationButtons';
import {
    StepBasicInfo,
    StepGoal,
    StepLifestyle,
    StepTraining,
    StepNutrition,
    StepRecovery,
    StepSummary,
} from '@/components/survey/steps';

const TOTAL_STEPS = 7; // 6 input steps + 1 summary

const initialSurveyData: Partial<SurveyData> = {
    basicInfo: undefined,
    goalInfo: undefined,
    lifestyleInfo: undefined,
    trainingInfo: undefined,
    nutritionPreferences: undefined,
    recoveryInfo: {},
};

export default function SurveyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [surveyData, setSurveyData, clearSurveyData] = useLocalStorage<Partial<SurveyData>>('fitness-survey', initialSurveyData);
    const [, setPlan] = useLocalStorage<GeneratedPlan | null>('fitness-plan', null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    // Convert validation errors to a simple object
    const getFieldErrors = (validationErrors: { field: string; message: string }[]): Record<string, string> => {
        return validationErrors.reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
        }, {} as Record<string, string>);
    };

    const handleNext = () => {
        // Validate current step
        const validation = validateStep(currentStep, surveyData);
        if (!validation.isValid) {
            setErrors(getFieldErrors(validation.errors));
            return;
        }
        setErrors({});
        setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    };

    const handleBack = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            // Simulate a brief delay for UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Generate plans
            const nutritionPlan = generateNutritionPlan(surveyData as SurveyData);
            const workoutPlan = generateWorkoutPlan(surveyData as SurveyData);

            // Create the complete plan
            const plan: GeneratedPlan = {
                surveyData: surveyData as SurveyData,
                nutritionPlan,
                workoutPlan,
                generatedAt: new Date().toISOString(),
            };

            // Save to localStorage
            setPlan(plan);

            // Navigate to results
            router.push('/results');
        } catch (error) {
            console.error('Error generating plan:', error);
            setIsGenerating(false);
        }
    };

    const updateBasicInfo = (data: Partial<SurveyData['basicInfo']>) => {
        setSurveyData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } as SurveyData['basicInfo'] }));
    };

    const updateGoalInfo = (data: Partial<SurveyData['goalInfo']>) => {
        setSurveyData(prev => ({ ...prev, goalInfo: { ...prev.goalInfo, ...data } as SurveyData['goalInfo'] }));
    };

    const updateLifestyleInfo = (data: Partial<SurveyData['lifestyleInfo']>) => {
        setSurveyData(prev => ({ ...prev, lifestyleInfo: { ...prev.lifestyleInfo, ...data } as SurveyData['lifestyleInfo'] }));
    };

    const updateTrainingInfo = (data: Partial<SurveyData['trainingInfo']>) => {
        setSurveyData(prev => ({ ...prev, trainingInfo: { ...prev.trainingInfo, ...data } as SurveyData['trainingInfo'] }));
    };

    const updateNutritionPreferences = (data: Partial<SurveyData['nutritionPreferences']>) => {
        setSurveyData(prev => ({ ...prev, nutritionPreferences: { ...prev.nutritionPreferences, ...data } as SurveyData['nutritionPreferences'] }));
    };

    const updateRecoveryInfo = (data: Partial<SurveyData['recoveryInfo']>) => {
        setSurveyData(prev => ({ ...prev, recoveryInfo: { ...prev.recoveryInfo, ...data } as SurveyData['recoveryInfo'] }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepBasicInfo
                        data={surveyData.basicInfo || {}}
                        onChange={updateBasicInfo}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <StepGoal
                        data={surveyData.goalInfo || {}}
                        onChange={updateGoalInfo}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <StepLifestyle
                        data={surveyData.lifestyleInfo || {}}
                        onChange={updateLifestyleInfo}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <StepTraining
                        data={surveyData.trainingInfo || {}}
                        onChange={updateTrainingInfo}
                        errors={errors}
                    />
                );
            case 5:
                return (
                    <StepNutrition
                        data={surveyData.nutritionPreferences || {}}
                        onChange={updateNutritionPreferences}
                        errors={errors}
                    />
                );
            case 6:
                return (
                    <StepRecovery
                        data={surveyData.recoveryInfo || {}}
                        onChange={updateRecoveryInfo}
                        errors={errors}
                    />
                );
            case 7:
                return <StepSummary data={surveyData} />;
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-emerald-600">
                        Fitness
                    </Link>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to reset the survey? All your answers will be lost.')) {
                                clearSurveyData();
                                setCurrentStep(1);
                                setErrors({});
                            }
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Reset Survey
                    </button>
                </div>
            </header>

            {/* Survey Content */}
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

                <div className="animate-fadeIn">
                    {renderStep()}
                </div>

                <NavigationButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    onGenerate={handleGenerate}
                    showBack={currentStep > 1}
                    isLastStep={currentStep === TOTAL_STEPS}
                    isLoading={isGenerating}
                />
            </div>
        </main>
    );
}
