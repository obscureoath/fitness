'use client';

import { SurveyData } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';
import { NumberInput, SliderInput } from '../inputs';

interface StepRecoveryProps {
    data: Partial<SurveyData['recoveryInfo']>;
    onChange: (data: Partial<SurveyData['recoveryInfo']>) => void;
    errors: Record<string, string>;
}

export function StepRecovery({ data, onChange, errors }: StepRecoveryProps) {
    return (
        <QuestionCard
            title="Recovery & wellbeing"
            subtitle="These factors affect your recovery capacity (optional but helpful)."
        >
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-sm text-indigo-700 mb-4">
                    💡 Recovery is key to progress. Poor sleep and high stress can limit your results
                    regardless of how perfect your training and nutrition are.
                </p>

                <div className="space-y-6">
                    <NumberInput
                        label="Average Sleep Hours per Night"
                        value={data.sleepHours}
                        onChange={(hours) => onChange({ ...data, sleepHours: hours })}
                        min={3}
                        max={12}
                        step={0.5}
                        placeholder="e.g., 7"
                        hint="Aim for 7-9 hours for optimal recovery"
                        error={errors.sleepHours}
                    />

                    <SliderInput
                        label="Current Stress Level"
                        value={data.stressLevel}
                        onChange={(level) => onChange({ ...data, stressLevel: level })}
                        min={1}
                        max={5}
                        labels={['1 - Very Low', '2', '3 - Moderate', '4', '5 - Very High']}
                        hint="Consider work, relationships, and life circumstances"
                    />
                </div>
            </div>

            <div className="mt-6 text-center text-gray-500">
                <p>These fields are optional – skip if you prefer.</p>
            </div>
        </QuestionCard>
    );
}
