'use client';

import { SurveyData, ActivityLevel } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';
import { RadioGroup, NumberInput } from '../inputs';

interface StepLifestyleProps {
    data: Partial<SurveyData['lifestyleInfo']>;
    onChange: (data: Partial<SurveyData['lifestyleInfo']>) => void;
    errors: Record<string, string>;
}

export function StepLifestyle({ data, onChange, errors }: StepLifestyleProps) {
    const activityOptions = [
        {
            value: 'sedentary',
            label: 'Sedentary',
            description: 'Desk job, little to no exercise',
        },
        {
            value: 'lightly_active',
            label: 'Lightly Active',
            description: 'Light exercise 1-3 days/week',
        },
        {
            value: 'moderately_active',
            label: 'Moderately Active',
            description: 'Moderate exercise 3-5 days/week',
        },
        {
            value: 'very_active',
            label: 'Very Active',
            description: 'Hard exercise 6-7 days/week or physical job',
        },
    ];

    return (
        <QuestionCard
            title="Tell us about your lifestyle"
            subtitle="Your daily activity level affects how many calories you burn."
        >
            <RadioGroup
                label="Activity Level"
                options={activityOptions}
                value={data.activityLevel}
                onChange={(level) => onChange({ ...data, activityLevel: level as ActivityLevel })}
                error={errors.activityLevel}
                columns={2}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <NumberInput
                    label="Average Daily Steps (Optional)"
                    value={data.dailySteps}
                    onChange={(steps) => onChange({ ...data, dailySteps: steps })}
                    min={0}
                    max={50000}
                    placeholder="e.g., 8000"
                    hint="Helps fine-tune your activity level estimate"
                    error={errors.dailySteps}
                />
            </div>
        </QuestionCard>
    );
}
