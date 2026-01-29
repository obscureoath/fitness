'use client';

import { SurveyData, DietStyle, CookingTime } from '@/types/survey';
import { QuestionCard } from '../QuestionCard';
import { RadioGroup, TextArea } from '../inputs';

interface StepNutritionProps {
    data: Partial<SurveyData['nutritionPreferences']>;
    onChange: (data: Partial<SurveyData['nutritionPreferences']>) => void;
    errors: Record<string, string>;
}

export function StepNutrition({ data, onChange, errors }: StepNutritionProps) {
    const dietOptions = [
        { value: 'no_preference', label: 'No Preference', description: 'All foods allowed' },
        { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
        { value: 'other', label: 'Other', description: 'Other dietary restrictions' },
    ];

    const mealsOptions = [
        { value: '2', label: '2 Meals', description: 'Intermittent fasting style' },
        { value: '3', label: '3 Meals', description: 'Traditional structure' },
        { value: '4', label: '4 Meals', description: 'With one snack' },
        { value: '5', label: '5 Meals', description: 'Multiple snacks' },
    ];

    const cookingOptions = [
        { value: 'low', label: 'Minimal', description: '< 20 min, simple meals' },
        { value: 'medium', label: 'Moderate', description: '20-40 min per meal' },
        { value: 'high', label: 'Extensive', description: 'Enjoy cooking, meal prep' },
    ];

    return (
        <QuestionCard
            title="Nutrition preferences"
            subtitle="Tell us how you like to eat so we can personalize your meal suggestions."
        >
            <RadioGroup
                label="Diet Style"
                options={dietOptions}
                value={data.dietStyle}
                onChange={(style) => onChange({ ...data, dietStyle: style as DietStyle })}
                error={errors.dietStyle}
                columns={2}
            />

            <div className="p-4 bg-gray-50 rounded-xl">
                <TextArea
                    label="Allergies or Foods to Avoid (Optional)"
                    value={data.allergies}
                    onChange={(allergies) => onChange({ ...data, allergies })}
                    placeholder="e.g., Nuts, shellfish, dairy..."
                    hint="We'll exclude these from your suggestions"
                />
            </div>

            <RadioGroup
                label="Preferred Meals per Day"
                options={mealsOptions}
                value={data.mealsPerDay?.toString()}
                onChange={(meals) => onChange({ ...data, mealsPerDay: parseInt(meals) })}
                error={errors.mealsPerDay}
                columns={4}
            />

            <RadioGroup
                label="Available Cooking Time"
                options={cookingOptions}
                value={data.cookingTime}
                onChange={(time) => onChange({ ...data, cookingTime: time as CookingTime })}
                error={errors.cookingTime}
                columns={3}
            />
        </QuestionCard>
    );
}
