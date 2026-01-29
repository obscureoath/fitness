import {
    SurveyData,
    NutritionPlan,
    Meal,
    FoodItem,
    Macros
} from '@/types/survey';
import {
    calculateBMR,
    calculateTDEE,
    calculateTargetCalories,
    calculateMacros,
    calculateMacroPercentages,
    generateNutritionExplanation
} from './calculations';
import { proteins, carbs, fats, fiberVeg, filterFoodsByDiet } from '@/data/foods';

/**
 * Generate a complete nutrition plan based on survey data
 */
export function generateNutritionPlan(surveyData: SurveyData): NutritionPlan {
    const { basicInfo, goalInfo, lifestyleInfo, nutritionPreferences } = surveyData;

    // Calculate calories
    const bmr = calculateBMR(
        basicInfo.weight,
        basicInfo.height,
        basicInfo.age,
        basicInfo.sex
    );

    const tdee = calculateTDEE(bmr, lifestyleInfo.activityLevel);

    const dailyCalories = calculateTargetCalories(
        tdee,
        goalInfo.goal,
        goalInfo.fatLossRate,
        goalInfo.muscleGainRate
    );

    // Calculate macros
    const macros = calculateMacros(dailyCalories, basicInfo.weight, goalInfo.goal);
    const macroPercentages = calculateMacroPercentages(macros, dailyCalories);

    // Generate meals based on preference
    const meals = generateMealStructure(dailyCalories, macros, nutritionPreferences.mealsPerDay);

    // Filter food bank by diet preference
    const dietStyle = nutritionPreferences.dietStyle;
    const filteredFoodBank = {
        proteins: filterFoodsByDiet(proteins, dietStyle),
        carbs: filterFoodsByDiet(carbs, dietStyle),
        fats: filterFoodsByDiet(fats, dietStyle),
        fiberVeg: filterFoodsByDiet(fiberVeg, dietStyle),
    };

    // Generate explanation
    const explanation = generateNutritionExplanation(surveyData, bmr, tdee, dailyCalories);

    return {
        dailyCalories,
        bmr: Math.round(bmr),
        tdee,
        macros,
        macroPercentages,
        meals,
        foodBank: filteredFoodBank,
        explanation,
    };
}

/**
 * Generate meal structure based on meals per day
 */
function generateMealStructure(
    dailyCalories: number,
    dailyMacros: Macros,
    mealsPerDay: number
): Meal[] {
    const mealDistributions: Record<number, { name: string; percentage: number }[]> = {
        2: [
            { name: 'Meal 1 (Late Breakfast/Early Lunch)', percentage: 0.50 },
            { name: 'Meal 2 (Dinner)', percentage: 0.50 },
        ],
        3: [
            { name: 'Breakfast', percentage: 0.30 },
            { name: 'Lunch', percentage: 0.40 },
            { name: 'Dinner', percentage: 0.30 },
        ],
        4: [
            { name: 'Breakfast', percentage: 0.25 },
            { name: 'Lunch', percentage: 0.30 },
            { name: 'Snack', percentage: 0.15 },
            { name: 'Dinner', percentage: 0.30 },
        ],
        5: [
            { name: 'Breakfast', percentage: 0.20 },
            { name: 'Mid-Morning Snack', percentage: 0.10 },
            { name: 'Lunch', percentage: 0.30 },
            { name: 'Afternoon Snack', percentage: 0.10 },
            { name: 'Dinner', percentage: 0.30 },
        ],
    };

    const distribution = mealDistributions[mealsPerDay] || mealDistributions[3];

    return distribution.map(({ name, percentage }) => ({
        name,
        targetCalories: Math.round(dailyCalories * percentage),
        targetMacros: {
            protein: Math.round(dailyMacros.protein * percentage),
            carbs: Math.round(dailyMacros.carbs * percentage),
            fats: Math.round(dailyMacros.fats * percentage),
        },
        suggestedFoods: [], // Will be populated by UI or meal suggestions
    }));
}

/**
 * Get suggested foods for a meal based on target macros
 */
export function getSuggestedFoodsForMeal(
    targetMacros: Macros,
    dietStyle: string
): { proteins: FoodItem[]; carbs: FoodItem[]; fats: FoodItem[]; vegetables: FoodItem[] } {
    const diet = dietStyle as 'no_preference' | 'vegetarian' | 'other';

    return {
        proteins: filterFoodsByDiet(proteins, diet).slice(0, 5),
        carbs: filterFoodsByDiet(carbs, diet).slice(0, 5),
        fats: filterFoodsByDiet(fats, diet).slice(0, 5),
        vegetables: filterFoodsByDiet(fiberVeg, diet).slice(0, 5),
    };
}

/**
 * Find a swap for a food item with roughly similar macros
 */
export function findFoodSwap(
    currentFood: FoodItem,
    dietStyle: string
): FoodItem[] {
    const diet = dietStyle as 'no_preference' | 'vegetarian' | 'other';

    let foodList: FoodItem[];
    switch (currentFood.category) {
        case 'protein':
            foodList = filterFoodsByDiet(proteins, diet);
            break;
        case 'carbs':
            foodList = filterFoodsByDiet(carbs, diet);
            break;
        case 'fats':
            foodList = filterFoodsByDiet(fats, diet);
            break;
        case 'fiber_veg':
            foodList = filterFoodsByDiet(fiberVeg, diet);
            break;
        default:
            return [];
    }

    // Filter out the current food and return alternatives
    return foodList.filter(food => food.name !== currentFood.name);
}
