'use client';

import { SurveyData } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';

interface StepSummaryProps {
    data: Partial<SurveyData>;
}

export function StepSummary({ data }: StepSummaryProps) {
    const formatGoal = (goal?: string) => {
        const goals: Record<string, string> = {
            fat_loss: 'Fat Loss',
            muscle_gain: 'Muscle Gain',
            recomposition: 'Body Recomposition',
            strength: 'Strength Building',
        };
        return goal ? goals[goal] || goal : 'Not specified';
    };

    const formatActivity = (level?: string) => {
        const levels: Record<string, string> = {
            sedentary: 'Sedentary',
            lightly_active: 'Lightly Active',
            moderately_active: 'Moderately Active',
            very_active: 'Very Active',
        };
        return level ? levels[level] || level : 'Not specified';
    };

    const formatEquipment = (eq?: string) => {
        const equipment: Record<string, string> = {
            bodyweight: 'Bodyweight Only',
            dumbbells: 'Dumbbells',
            full_gym: 'Full Gym',
        };
        return eq ? equipment[eq] || eq : 'Not specified';
    };

    const SummaryRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value || '-'}</span>
        </div>
    );

    return (
        <QuestionCard
            title="Review your information"
            subtitle="Make sure everything looks correct before we generate your plan."
        >
            <div className="space-y-6">
                {/* Basic Info Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">1</span>
                        Basic Information
                    </h3>
                    <SummaryRow label="Age" value={data.basicInfo?.age ? `${data.basicInfo.age} years` : undefined} />
                    <SummaryRow label="Sex" value={data.basicInfo?.sex?.charAt(0).toUpperCase() + (data.basicInfo?.sex?.slice(1) || '')} />
                    <SummaryRow label="Height" value={data.basicInfo?.height ? `${data.basicInfo.height} cm` : undefined} />
                    <SummaryRow label="Weight" value={data.basicInfo?.weight ? `${data.basicInfo.weight} kg` : undefined} />
                </div>

                {/* Goal Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">2</span>
                        Goal
                    </h3>
                    <SummaryRow label="Primary Goal" value={formatGoal(data.goalInfo?.goal)} />
                    {data.goalInfo?.fatLossRate && (
                        <SummaryRow label="Rate" value={data.goalInfo.fatLossRate.charAt(0).toUpperCase() + data.goalInfo.fatLossRate.slice(1)} />
                    )}
                    {data.goalInfo?.muscleGainRate && (
                        <SummaryRow label="Approach" value={data.goalInfo.muscleGainRate === 'lean' ? 'Lean Gains' : 'Moderate Surplus'} />
                    )}
                </div>

                {/* Lifestyle Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">3</span>
                        Lifestyle
                    </h3>
                    <SummaryRow label="Activity Level" value={formatActivity(data.lifestyleInfo?.activityLevel)} />
                    {data.lifestyleInfo?.dailySteps && (
                        <SummaryRow label="Daily Steps" value={data.lifestyleInfo.dailySteps.toLocaleString()} />
                    )}
                </div>

                {/* Training Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">4</span>
                        Training
                    </h3>
                    <SummaryRow label="Experience" value={data.trainingInfo?.experience?.charAt(0).toUpperCase() + (data.trainingInfo?.experience?.slice(1) || '')} />
                    <SummaryRow label="Days per Week" value={data.trainingInfo?.daysPerWeek} />
                    <SummaryRow label="Equipment" value={formatEquipment(data.trainingInfo?.equipment)} />
                    {data.trainingInfo?.limitations && (
                        <div className="py-2">
                            <span className="text-gray-600">Limitations:</span>
                            <p className="text-amber-600 text-sm mt-1">{data.trainingInfo.limitations}</p>
                        </div>
                    )}
                </div>

                {/* Nutrition Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">5</span>
                        Nutrition
                    </h3>
                    <SummaryRow label="Diet Style" value={data.nutritionPreferences?.dietStyle?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                    <SummaryRow label="Meals per Day" value={data.nutritionPreferences?.mealsPerDay} />
                    <SummaryRow label="Cooking Time" value={data.nutritionPreferences?.cookingTime?.charAt(0).toUpperCase() + (data.nutritionPreferences?.cookingTime?.slice(1) || '')} />
                    {data.nutritionPreferences?.allergies && (
                        <div className="py-2">
                            <span className="text-gray-600">Allergies:</span>
                            <p className="text-red-600 text-sm mt-1">{data.nutritionPreferences.allergies}</p>
                        </div>
                    )}
                </div>

                {/* Recovery Section */}
                {(data.recoveryInfo?.sleepHours || data.recoveryInfo?.stressLevel) && (
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm">6</span>
                            Recovery
                        </h3>
                        {data.recoveryInfo?.sleepHours && (
                            <SummaryRow label="Sleep" value={`${data.recoveryInfo.sleepHours} hours/night`} />
                        )}
                        {data.recoveryInfo?.stressLevel && (
                            <SummaryRow label="Stress Level" value={`${data.recoveryInfo.stressLevel}/5`} />
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-emerald-700 text-center">
                    ✨ Click &quot;Generate My Plan&quot; below to receive your personalized nutrition and workout program!
                </p>
            </div>
        </QuestionCard>
    );
}
