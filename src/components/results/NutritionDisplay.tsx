'use client';

import { NutritionPlan, FoodItem } from '@/types/survey';
import { useState } from 'react';

interface NutritionDisplayProps {
    plan: NutritionPlan;
    dietStyle: string;
}

export function NutritionDisplay({ plan, dietStyle }: NutritionDisplayProps) {
    const [activeCategory, setActiveCategory] = useState<'proteins' | 'carbs' | 'fats' | 'fiberVeg'>('proteins');

    const categories = [
        { key: 'proteins', label: 'Proteins', color: 'bg-red-500' },
        { key: 'carbs', label: 'Carbs', color: 'bg-yellow-500' },
        { key: 'fats', label: 'Fats', color: 'bg-blue-500' },
        { key: 'fiberVeg', label: 'Vegetables', color: 'bg-green-500' },
    ] as const;

    return (
        <div className="space-y-8">
            {/* Calories & Macros Overview */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-6">Daily Targets</h3>

                <div className="text-center mb-6">
                    <div className="text-5xl font-bold">{plan.dailyCalories}</div>
                    <div className="text-emerald-100">calories / day</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur">
                        <div className="text-2xl font-bold">{plan.macros.protein}g</div>
                        <div className="text-sm text-emerald-100">Protein</div>
                        <div className="text-xs mt-1 opacity-75">{plan.macroPercentages.protein}%</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur">
                        <div className="text-2xl font-bold">{plan.macros.carbs}g</div>
                        <div className="text-sm text-emerald-100">Carbs</div>
                        <div className="text-xs mt-1 opacity-75">{plan.macroPercentages.carbs}%</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur">
                        <div className="text-2xl font-bold">{plan.macros.fats}g</div>
                        <div className="text-sm text-emerald-100">Fats</div>
                        <div className="text-xs mt-1 opacity-75">{plan.macroPercentages.fats}%</div>
                    </div>
                </div>
            </div>

            {/* Meal Structure */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Meal Structure</h3>
                <div className="space-y-3">
                    {plan.meals.map((meal, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <div className="font-semibold text-gray-800">{meal.name}</div>
                                <div className="text-sm text-gray-500">
                                    P: {meal.targetMacros.protein}g | C: {meal.targetMacros.carbs}g | F: {meal.targetMacros.fats}g
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-emerald-600">{meal.targetCalories}</div>
                                <div className="text-xs text-gray-500">kcal</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Food Bank */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Food Bank</h3>
                <p className="text-gray-500 mb-4">
                    Mix and match these foods to hit your daily targets. Each serving is pre-calculated.
                </p>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === cat.key
                                    ? `${cat.color} text-white`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Food List */}
                <div className="grid gap-3">
                    {plan.foodBank[activeCategory].map((food, index) => (
                        <FoodItemCard key={index} food={food} />
                    ))}
                </div>
            </div>

            {/* Why This Plan */}
            <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Why This Plan?</h3>
                <div className="space-y-4 text-gray-600">
                    <div>
                        <h4 className="font-semibold text-gray-800">Calorie Calculation</h4>
                        <p className="text-sm">{plan.explanation.calorieReasoning}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Protein Prescription</h4>
                        <p className="text-sm">{plan.explanation.proteinReasoning}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Rate of Change</h4>
                        <p className="text-sm">{plan.explanation.changeRateReasoning}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FoodItemCard({ food }: { food: FoodItem }) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div>
                <div className="font-medium text-gray-800">{food.name}</div>
                <div className="text-xs text-gray-500">{food.servingSize}</div>
            </div>
            <div className="text-right text-sm">
                <div className="font-semibold text-gray-800">{food.calories} kcal</div>
                <div className="text-xs text-gray-500">
                    P:{food.protein}g C:{food.carbs}g F:{food.fats}g
                </div>
            </div>
        </div>
    );
}
