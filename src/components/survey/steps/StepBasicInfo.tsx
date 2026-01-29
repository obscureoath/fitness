'use client';

import { SurveyData } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';
import { NumberInput, RadioGroup } from '../inputs';

interface StepBasicInfoProps {
    data: Partial<SurveyData['basicInfo']>;
    onChange: (data: Partial<SurveyData['basicInfo']>) => void;
    errors: Record<string, string>;
}

export function StepBasicInfo({ data, onChange, errors }: StepBasicInfoProps) {
    return (
        <QuestionCard
            title="Let's start with the basics"
            subtitle="This information helps us calculate your energy needs accurately."
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NumberInput
                    label="Age"
                    value={data.age}
                    onChange={(age) => onChange({ ...data, age })}
                    min={16}
                    max={100}
                    placeholder="e.g., 30"
                    hint="Must be 16 or older"
                    error={errors.age}
                />
                <RadioGroup
                    label="Sex"
                    options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                    ]}
                    value={data.sex}
                    onChange={(sex) => onChange({ ...data, sex: sex as 'male' | 'female' })}
                    error={errors.sex}
                    columns={2}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NumberInput
                    label="Height"
                    value={data.height}
                    onChange={(height) => onChange({ ...data, height })}
                    min={100}
                    max={250}
                    unit="cm"
                    placeholder="e.g., 175"
                    hint="Your height in centimeters"
                    error={errors.height}
                />
                <NumberInput
                    label="Weight"
                    value={data.weight}
                    onChange={(weight) => onChange({ ...data, weight })}
                    min={30}
                    max={300}
                    unit="kg"
                    placeholder="e.g., 75"
                    hint="Your current weight in kilograms"
                    error={errors.weight}
                />
            </div>
        </QuestionCard>
    );
}
