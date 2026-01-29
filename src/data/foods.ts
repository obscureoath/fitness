import { FoodItem, DietStyle } from '@/types/survey';

const allDiets: DietStyle[] = ['no_preference', 'vegetarian', 'other'];
const vegetarianDiets: DietStyle[] = ['no_preference', 'vegetarian', 'other'];
const meatDiets: DietStyle[] = ['no_preference', 'other'];

export const proteins: FoodItem[] = [
    { name: 'Chicken Breast', servingSize: '150g', protein: 46, carbs: 0, fats: 5, calories: 231, category: 'protein', dietCompatibility: meatDiets },
    { name: 'Salmon', servingSize: '150g', protein: 34, carbs: 0, fats: 18, calories: 298, category: 'protein', dietCompatibility: meatDiets },
    { name: 'Lean Beef', servingSize: '150g', protein: 38, carbs: 0, fats: 12, calories: 264, category: 'protein', dietCompatibility: meatDiets },
    { name: 'Turkey Breast', servingSize: '150g', protein: 44, carbs: 0, fats: 3, calories: 203, category: 'protein', dietCompatibility: meatDiets },
    { name: 'Eggs (3 large)', servingSize: '3 eggs', protein: 19, carbs: 1, fats: 15, calories: 215, category: 'protein', dietCompatibility: allDiets },
    { name: 'Egg Whites (6)', servingSize: '6 whites', protein: 22, carbs: 1, fats: 0, calories: 92, category: 'protein', dietCompatibility: allDiets },
    { name: 'Greek Yogurt', servingSize: '200g', protein: 20, carbs: 8, fats: 0, calories: 112, category: 'protein', dietCompatibility: vegetarianDiets },
    { name: 'Cottage Cheese', servingSize: '200g', protein: 22, carbs: 6, fats: 2, calories: 130, category: 'protein', dietCompatibility: vegetarianDiets },
    { name: 'Tofu', servingSize: '200g', protein: 20, carbs: 4, fats: 12, calories: 200, category: 'protein', dietCompatibility: allDiets },
    { name: 'Tempeh', servingSize: '150g', protein: 30, carbs: 14, fats: 14, calories: 298, category: 'protein', dietCompatibility: allDiets },
    { name: 'Lentils (cooked)', servingSize: '200g', protein: 18, carbs: 40, fats: 1, calories: 241, category: 'protein', dietCompatibility: allDiets },
    { name: 'Chickpeas (cooked)', servingSize: '200g', protein: 15, carbs: 45, fats: 4, calories: 276, category: 'protein', dietCompatibility: allDiets },
    { name: 'Tuna (canned)', servingSize: '150g', protein: 40, carbs: 0, fats: 1, calories: 169, category: 'protein', dietCompatibility: allDiets },
    { name: 'Shrimp', servingSize: '150g', protein: 28, carbs: 1, fats: 2, calories: 134, category: 'protein', dietCompatibility: ['no_preference', 'other'] },
    { name: 'Whey Protein', servingSize: '1 scoop (30g)', protein: 24, carbs: 3, fats: 1, calories: 117, category: 'protein', dietCompatibility: vegetarianDiets },
];

export const carbs: FoodItem[] = [
    { name: 'White Rice (cooked)', servingSize: '200g', protein: 4, carbs: 56, fats: 0, calories: 240, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Brown Rice (cooked)', servingSize: '200g', protein: 5, carbs: 46, fats: 2, calories: 222, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Oatmeal (dry)', servingSize: '80g', protein: 11, carbs: 54, fats: 6, calories: 314, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Sweet Potato', servingSize: '200g', protein: 4, carbs: 41, fats: 0, calories: 180, category: 'carbs', dietCompatibility: allDiets },
    { name: 'White Potato', servingSize: '200g', protein: 4, carbs: 36, fats: 0, calories: 160, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Whole Wheat Bread', servingSize: '2 slices (70g)', protein: 8, carbs: 34, fats: 3, calories: 195, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Whole Wheat Pasta (cooked)', servingSize: '200g', protein: 10, carbs: 50, fats: 2, calories: 258, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Quinoa (cooked)', servingSize: '200g', protein: 9, carbs: 40, fats: 4, calories: 232, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Banana', servingSize: '1 large (136g)', protein: 2, carbs: 31, fats: 0, calories: 132, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Apple', servingSize: '1 medium (180g)', protein: 0, carbs: 25, fats: 0, calories: 100, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Berries', servingSize: '150g', protein: 1, carbs: 18, fats: 0, calories: 76, category: 'carbs', dietCompatibility: allDiets },
    { name: 'Couscous (cooked)', servingSize: '200g', protein: 6, carbs: 46, fats: 0, calories: 208, category: 'carbs', dietCompatibility: allDiets },
];

export const fats: FoodItem[] = [
    { name: 'Avocado', servingSize: '1/2 medium', protein: 2, carbs: 6, fats: 15, calories: 167, category: 'fats', dietCompatibility: allDiets },
    { name: 'Olive Oil', servingSize: '1 tbsp (15ml)', protein: 0, carbs: 0, fats: 14, calories: 126, category: 'fats', dietCompatibility: allDiets },
    { name: 'Almonds', servingSize: '30g', protein: 6, carbs: 6, fats: 15, calories: 179, category: 'fats', dietCompatibility: allDiets },
    { name: 'Walnuts', servingSize: '30g', protein: 4, carbs: 4, fats: 18, calories: 194, category: 'fats', dietCompatibility: allDiets },
    { name: 'Peanut Butter', servingSize: '2 tbsp (32g)', protein: 7, carbs: 6, fats: 16, calories: 192, category: 'fats', dietCompatibility: allDiets },
    { name: 'Chia Seeds', servingSize: '2 tbsp (28g)', protein: 5, carbs: 12, fats: 9, calories: 145, category: 'fats', dietCompatibility: allDiets },
    { name: 'Flax Seeds', servingSize: '2 tbsp (20g)', protein: 4, carbs: 6, fats: 8, calories: 112, category: 'fats', dietCompatibility: allDiets },
    { name: 'Dark Chocolate (85%)', servingSize: '30g', protein: 3, carbs: 8, fats: 14, calories: 170, category: 'fats', dietCompatibility: allDiets },
    { name: 'Coconut Oil', servingSize: '1 tbsp (15ml)', protein: 0, carbs: 0, fats: 14, calories: 126, category: 'fats', dietCompatibility: allDiets },
    { name: 'Cashews', servingSize: '30g', protein: 5, carbs: 9, fats: 13, calories: 173, category: 'fats', dietCompatibility: allDiets },
];

export const fiberVeg: FoodItem[] = [
    { name: 'Broccoli', servingSize: '150g', protein: 4, carbs: 10, fats: 0, calories: 56, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Spinach', servingSize: '100g', protein: 3, carbs: 4, fats: 0, calories: 28, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Kale', servingSize: '100g', protein: 4, carbs: 9, fats: 1, calories: 61, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Bell Peppers', servingSize: '150g', protein: 1, carbs: 9, fats: 0, calories: 40, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Zucchini', servingSize: '200g', protein: 2, carbs: 7, fats: 0, calories: 36, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Cauliflower', servingSize: '150g', protein: 3, carbs: 8, fats: 0, calories: 44, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Green Beans', servingSize: '150g', protein: 3, carbs: 10, fats: 0, calories: 52, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Carrots', servingSize: '150g', protein: 1, carbs: 14, fats: 0, calories: 60, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Cucumber', servingSize: '150g', protein: 1, carbs: 5, fats: 0, calories: 24, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Tomatoes', servingSize: '150g', protein: 1, carbs: 6, fats: 0, calories: 28, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Asparagus', servingSize: '150g', protein: 3, carbs: 6, fats: 0, calories: 36, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Brussels Sprouts', servingSize: '150g', protein: 5, carbs: 13, fats: 0, calories: 72, category: 'fiber_veg', dietCompatibility: allDiets },
    { name: 'Mixed Salad Greens', servingSize: '100g', protein: 2, carbs: 3, fats: 0, calories: 20, category: 'fiber_veg', dietCompatibility: allDiets },
];

export const foodBank = {
    proteins,
    carbs,
    fats,
    fiberVeg,
};

export function filterFoodsByDiet(foods: FoodItem[], dietStyle: DietStyle): FoodItem[] {
    return foods.filter(food => food.dietCompatibility.includes(dietStyle));
}

export function getAllFoods(): FoodItem[] {
    return [...proteins, ...carbs, ...fats, ...fiberVeg];
}
