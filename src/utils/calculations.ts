import {
    SurveyData,
    Macros,
    Sex,
    ActivityLevel,
    Goal,
    FatLossRate,
    MuscleGainRate
} from '@/types/survey';

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * Male: BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
 * Female: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
 */
export function calculateBMR(weight: number, height: number, age: number, sex: Sex): number {
    const base = (10 * weight) + (6.25 * height) - (5 * age);
    return sex === 'male' ? base + 5 : base - 161;
}

/**
 * Activity level multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Goal-based calorie adjustments
 */
const CALORIE_ADJUSTMENTS: {
    fat_loss: Record<FatLossRate, number>;
    muscle_gain: Record<MuscleGainRate, number>;
    recomposition: number;
    strength: number;
} = {
    fat_loss: {
        conservative: -0.15,
        moderate: -0.20,
        aggressive: -0.25,
    },
    muscle_gain: {
        lean: 0.05,
        moderate: 0.125,
    },
    recomposition: -0.10,
    strength: 0.05,
};

/**
 * Calculate target calories based on goal
 */
export function calculateTargetCalories(
    tdee: number,
    goal: Goal,
    fatLossRate?: FatLossRate,
    muscleGainRate?: MuscleGainRate
): number {
    let adjustment = 0;

    switch (goal) {
        case 'fat_loss':
            adjustment = CALORIE_ADJUSTMENTS.fat_loss[fatLossRate || 'moderate'];
            break;
        case 'muscle_gain':
            adjustment = CALORIE_ADJUSTMENTS.muscle_gain[muscleGainRate || 'moderate'];
            break;
        case 'recomposition':
            adjustment = CALORIE_ADJUSTMENTS.recomposition;
            break;
        case 'strength':
            adjustment = CALORIE_ADJUSTMENTS.strength;
            break;
    }

    return Math.round(tdee * (1 + adjustment));
}

/**
 * Calculate macros based on target calories and weight
 * Protein: 1.6-2.2 g/kg (higher for fat loss)
 * Fat: 0.6-0.8 g/kg minimum
 * Carbs: remaining calories
 */
export function calculateMacros(
    targetCalories: number,
    weight: number,
    goal: Goal
): Macros {
    // Protein calculation - higher end for fat loss
    let proteinPerKg: number;
    switch (goal) {
        case 'fat_loss':
            proteinPerKg = 2.2;
            break;
        case 'recomposition':
            proteinPerKg = 2.0;
            break;
        case 'muscle_gain':
            proteinPerKg = 1.8;
            break;
        case 'strength':
            proteinPerKg = 1.8;
            break;
        default:
            proteinPerKg = 1.8;
    }

    const protein = Math.round(weight * proteinPerKg);

    // Fat calculation - minimum 0.6-0.8 g/kg
    const fatPerKg = goal === 'fat_loss' ? 0.7 : 0.8;
    const fats = Math.round(weight * fatPerKg);

    // Carbs - remaining calories
    const proteinCalories = protein * 4;
    const fatCalories = fats * 9;
    const remainingCalories = targetCalories - proteinCalories - fatCalories;
    const carbs = Math.max(Math.round(remainingCalories / 4), 50); // Minimum 50g carbs

    return { protein, carbs, fats };
}

/**
 * Calculate macro percentages
 */
export function calculateMacroPercentages(macros: Macros, targetCalories: number): { protein: number; carbs: number; fats: number } {
    const proteinCalories = macros.protein * 4;
    const carbsCalories = macros.carbs * 4;
    const fatsCalories = macros.fats * 9;
    const totalCalories = proteinCalories + carbsCalories + fatsCalories;

    return {
        protein: Math.round((proteinCalories / totalCalories) * 100),
        carbs: Math.round((carbsCalories / totalCalories) * 100),
        fats: Math.round((fatsCalories / totalCalories) * 100),
    };
}

/**
 * Generate explanation for the nutrition plan
 */
export function generateNutritionExplanation(surveyData: SurveyData, bmr: number, tdee: number, targetCalories: number): {
    calorieReasoning: string;
    proteinReasoning: string;
    changeRateReasoning: string;
} {
    const { basicInfo, goalInfo, lifestyleInfo } = surveyData;

    let calorieAdjustmentText = '';
    if (goalInfo.goal === 'fat_loss') {
        const rates = { conservative: '15%', moderate: '20%', aggressive: '25%' };
        calorieAdjustmentText = `a ${rates[goalInfo.fatLossRate || 'moderate']} deficit`;
    } else if (goalInfo.goal === 'muscle_gain') {
        const rates = { lean: '5%', moderate: '10-15%' };
        calorieAdjustmentText = `a ${rates[goalInfo.muscleGainRate || 'moderate']} surplus`;
    } else if (goalInfo.goal === 'recomposition') {
        calorieAdjustmentText = 'a slight 10% deficit';
    } else {
        calorieAdjustmentText = 'a small 5% surplus';
    }

    const activityDescriptions: Record<ActivityLevel, string> = {
        sedentary: 'sedentary (little to no exercise)',
        lightly_active: 'lightly active (light exercise 1-3 days/week)',
        moderately_active: 'moderately active (moderate exercise 3-5 days/week)',
        very_active: 'very active (hard exercise 6-7 days/week)',
    };

    return {
        calorieReasoning: `Your Basal Metabolic Rate (BMR) is ${Math.round(bmr)} calories, calculated using the Mifflin-St Jeor equation based on your weight (${basicInfo.weight}kg), height (${basicInfo.height}cm), age (${basicInfo.age}), and sex (${basicInfo.sex}). Given your ${activityDescriptions[lifestyleInfo.activityLevel]} lifestyle, your Total Daily Energy Expenditure (TDEE) is ${tdee} calories. For your ${goalInfo.goal.replace('_', ' ')} goal, we've applied ${calorieAdjustmentText}, bringing your target to ${targetCalories} calories per day.`,

        proteinReasoning: `Protein is set at ${goalInfo.goal === 'fat_loss' ? '2.2' : goalInfo.goal === 'recomposition' ? '2.0' : '1.8'}g per kg of body weight. ${goalInfo.goal === 'fat_loss' ? 'Higher protein during fat loss helps preserve muscle mass and keeps you feeling fuller.' : goalInfo.goal === 'muscle_gain' ? 'This amount supports optimal muscle protein synthesis for growth.' : 'This supports your training recovery and body composition goals.'}`,

        changeRateReasoning: goalInfo.goal === 'fat_loss'
            ? `A ${goalInfo.fatLossRate || 'moderate'} deficit means you can expect to lose approximately ${goalInfo.fatLossRate === 'conservative' ? '0.25-0.5' : goalInfo.fatLossRate === 'aggressive' ? '0.75-1' : '0.5-0.75'}kg per week. This rate balances progress with muscle retention and adherence.`
            : goalInfo.goal === 'muscle_gain'
                ? `A ${goalInfo.muscleGainRate || 'moderate'} surplus supports muscle gain while minimizing fat accumulation. Expect to gain ${goalInfo.muscleGainRate === 'lean' ? '0.1-0.25' : '0.25-0.5'}kg per week under optimal conditions.`
                : 'Body recomposition is a slower process where you simultaneously lose fat and build muscle. Weight changes may be minimal, but body composition will improve over time.',
    };
}
