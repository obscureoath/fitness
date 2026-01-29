import { SurveyData } from '@/types/survey';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

// Step 1: Basic Info validation
export function validateBasicInfo(data: Partial<SurveyData['basicInfo']>): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data.age || data.age < 16 || data.age > 100) {
        errors.push({ field: 'age', message: 'Age must be between 16 and 100 years' });
    }

    if (!data.sex) {
        errors.push({ field: 'sex', message: 'Please select your sex' });
    }

    if (!data.height || data.height < 100 || data.height > 250) {
        errors.push({ field: 'height', message: 'Height must be between 100 and 250 cm' });
    }

    if (!data.weight || data.weight < 30 || data.weight > 300) {
        errors.push({ field: 'weight', message: 'Weight must be between 30 and 300 kg' });
    }

    return { isValid: errors.length === 0, errors };
}

// Step 2: Goal validation
export function validateGoalInfo(data: Partial<SurveyData['goalInfo']>): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data.goal) {
        errors.push({ field: 'goal', message: 'Please select your primary goal' });
    }

    if (data.goal === 'fat_loss' && !data.fatLossRate) {
        errors.push({ field: 'fatLossRate', message: 'Please select your preferred rate of fat loss' });
    }

    if (data.goal === 'muscle_gain' && !data.muscleGainRate) {
        errors.push({ field: 'muscleGainRate', message: 'Please select your preferred rate of muscle gain' });
    }

    return { isValid: errors.length === 0, errors };
}

// Step 3: Lifestyle validation
export function validateLifestyleInfo(data: Partial<SurveyData['lifestyleInfo']>): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data.activityLevel) {
        errors.push({ field: 'activityLevel', message: 'Please select your activity level' });
    }

    if (data.dailySteps !== undefined && (data.dailySteps < 0 || data.dailySteps > 50000)) {
        errors.push({ field: 'dailySteps', message: 'Daily steps must be between 0 and 50,000' });
    }

    return { isValid: errors.length === 0, errors };
}

// Step 4: Training validation
export function validateTrainingInfo(data: Partial<SurveyData['trainingInfo']>): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data.experience) {
        errors.push({ field: 'experience', message: 'Please select your experience level' });
    }

    if (!data.daysPerWeek || data.daysPerWeek < 2 || data.daysPerWeek > 6) {
        errors.push({ field: 'daysPerWeek', message: 'Training days must be between 2 and 6' });
    }

    if (!data.equipment) {
        errors.push({ field: 'equipment', message: 'Please select your available equipment' });
    }

    return { isValid: errors.length === 0, errors };
}

// Step 5: Nutrition validation
export function validateNutritionPreferences(data: Partial<SurveyData['nutritionPreferences']>): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data.dietStyle) {
        errors.push({ field: 'dietStyle', message: 'Please select your diet style' });
    }

    if (!data.mealsPerDay || data.mealsPerDay < 2 || data.mealsPerDay > 5) {
        errors.push({ field: 'mealsPerDay', message: 'Meals per day must be between 2 and 5' });
    }

    if (!data.cookingTime) {
        errors.push({ field: 'cookingTime', message: 'Please select your available cooking time' });
    }

    return { isValid: errors.length === 0, errors };
}

// Step 6: Recovery validation (optional fields)
export function validateRecoveryInfo(data: Partial<SurveyData['recoveryInfo']>): ValidationResult {
    const errors: ValidationError[] = [];

    if (data.sleepHours !== undefined && (data.sleepHours < 3 || data.sleepHours > 12)) {
        errors.push({ field: 'sleepHours', message: 'Sleep hours must be between 3 and 12' });
    }

    if (data.stressLevel !== undefined && (data.stressLevel < 1 || data.stressLevel > 5)) {
        errors.push({ field: 'stressLevel', message: 'Stress level must be between 1 and 5' });
    }

    // Recovery info is optional, so it's always valid if no errors
    return { isValid: errors.length === 0, errors };
}

// Validate a specific step
export function validateStep(step: number, data: Partial<SurveyData>): ValidationResult {
    switch (step) {
        case 1:
            return validateBasicInfo(data.basicInfo || {});
        case 2:
            return validateGoalInfo(data.goalInfo || {});
        case 3:
            return validateLifestyleInfo(data.lifestyleInfo || {});
        case 4:
            return validateTrainingInfo(data.trainingInfo || {});
        case 5:
            return validateNutritionPreferences(data.nutritionPreferences || {});
        case 6:
            return validateRecoveryInfo(data.recoveryInfo || {});
        default:
            return { isValid: true, errors: [] };
    }
}

// Validate entire survey
export function validateSurvey(data: Partial<SurveyData>): ValidationResult {
    const allErrors: ValidationError[] = [];

    for (let step = 1; step <= 6; step++) {
        const result = validateStep(step, data);
        allErrors.push(...result.errors);
    }

    return { isValid: allErrors.length === 0, errors: allErrors };
}
