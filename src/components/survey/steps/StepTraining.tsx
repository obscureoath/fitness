'use client';

import { SurveyData, Experience, Equipment } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';
import { RadioGroup, NumberInput, TextArea } from '../inputs';

interface StepTrainingProps {
    data: Partial<SurveyData['trainingInfo']>;
    onChange: (data: Partial<SurveyData['trainingInfo']>) => void;
    errors: Record<string, string>;
}

export function StepTraining({ data, onChange, errors }: StepTrainingProps) {
    const experienceOptions = [
        {
            value: 'beginner',
            label: 'Beginner',
            description: 'Less than 1 year of consistent training',
        },
        {
            value: 'intermediate',
            label: 'Intermediate',
            description: '1-3 years of consistent training',
        },
        {
            value: 'advanced',
            label: 'Advanced',
            description: '3+ years of serious training',
        },
    ];

    const equipmentOptions = [
        {
            value: 'bodyweight',
            label: 'Bodyweight Only',
            description: 'No equipment, home workouts',
        },
        {
            value: 'dumbbells',
            label: 'Dumbbells',
            description: 'Basic home gym setup',
        },
        {
            value: 'full_gym',
            label: 'Full Gym',
            description: 'Access to barbells, cables, machines',
        },
    ];

    const daysOptions = [
        { value: '2', label: '2 days' },
        { value: '3', label: '3 days' },
        { value: '4', label: '4 days' },
        { value: '5', label: '5 days' },
        { value: '6', label: '6 days' },
    ];

    return (
        <QuestionCard
            title="Your training profile"
            subtitle="This helps us design a workout plan that fits your life."
        >
            <RadioGroup
                label="Experience Level"
                options={experienceOptions}
                value={data.experience}
                onChange={(exp) => onChange({ ...data, experience: exp as Experience })}
                error={errors.experience}
                columns={3}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <RadioGroup
                    label="Days per Week Available"
                    options={daysOptions}
                    value={data.daysPerWeek?.toString()}
                    onChange={(days) => onChange({ ...data, daysPerWeek: parseInt(days) })}
                    error={errors.daysPerWeek}
                    columns={3}
                />
            </div>

            <RadioGroup
                label="Available Equipment"
                options={equipmentOptions}
                value={data.equipment}
                onChange={(eq) => onChange({ ...data, equipment: eq as Equipment })}
                error={errors.equipment}
                columns={3}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <TextArea
                    label="Injuries or Limitations (Optional)"
                    value={data.limitations}
                    onChange={(limitations) => onChange({ ...data, limitations })}
                    placeholder="e.g., Lower back issues, shoulder injury..."
                    hint="We'll provide a warning and suggest modifications"
                />
            </div>
        </QuestionCard>
    );
}
