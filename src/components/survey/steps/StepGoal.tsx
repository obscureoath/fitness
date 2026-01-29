'use client';

import { SurveyData, Goal } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';
import { RadioGroup } from '../inputs';

interface StepGoalProps {
    data: Partial<SurveyData['goalInfo']>;
    onChange: (data: Partial<SurveyData['goalInfo']>) => void;
    errors: Record<string, string>;
}

export function StepGoal({ data, onChange, errors }: StepGoalProps) {
    const goalOptions = [
        {
            value: 'fat_loss',
            label: 'Fat Loss',
            description: 'Reduce body fat while preserving muscle',
        },
        {
            value: 'muscle_gain',
            label: 'Muscle Gain',
            description: 'Build muscle mass and strength',
        },
        {
            value: 'recomposition',
            label: 'Recomposition',
            description: 'Lose fat and gain muscle simultaneously',
        },
        {
            value: 'strength',
            label: 'Strength',
            description: 'Maximize strength and performance',
        },
    ];

    const fatLossRateOptions = [
        {
            value: 'conservative',
            label: 'Conservative',
            description: '~0.25-0.5kg/week, easier to sustain',
        },
        {
            value: 'moderate',
            label: 'Moderate',
            description: '~0.5-0.75kg/week, balanced approach',
        },
        {
            value: 'aggressive',
            label: 'Aggressive',
            description: '~0.75-1kg/week, faster but harder',
        },
    ];

    const muscleGainRateOptions = [
        {
            value: 'lean',
            label: 'Lean Gains',
            description: 'Minimal fat gain, slower progress',
        },
        {
            value: 'moderate',
            label: 'Moderate Surplus',
            description: 'Balanced muscle gain pace',
        },
    ];

    return (
        <QuestionCard
            title="What's your primary goal?"
            subtitle="This determines your calorie target and macro ratios."
        >
            <RadioGroup
                label="Goal"
                options={goalOptions}
                value={data.goal}
                onChange={(goal) => onChange({ ...data, goal: goal as Goal })}
                error={errors.goal}
                columns={2}
            />

            {data.goal === 'fat_loss' && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <RadioGroup
                        label="How fast do you want to lose fat?"
                        options={fatLossRateOptions}
                        value={data.fatLossRate}
                        onChange={(rate) => onChange({ ...data, fatLossRate: rate as 'conservative' | 'moderate' | 'aggressive' })}
                        error={errors.fatLossRate}
                        columns={3}
                    />
                </div>
            )}

            {data.goal === 'muscle_gain' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <RadioGroup
                        label="How do you want to approach your surplus?"
                        options={muscleGainRateOptions}
                        value={data.muscleGainRate}
                        onChange={(rate) => onChange({ ...data, muscleGainRate: rate as 'lean' | 'moderate' })}
                        error={errors.muscleGainRate}
                        columns={2}
                    />
                </div>
            )}
        </QuestionCard>
    );
}
