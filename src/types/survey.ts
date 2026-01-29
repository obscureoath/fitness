// Survey Data Types

export type Sex = 'male' | 'female';
export type Goal = 'fat_loss' | 'muscle_gain' | 'recomposition' | 'strength';
export type FatLossRate = 'conservative' | 'moderate' | 'aggressive';
export type MuscleGainRate = 'lean' | 'moderate';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'bodyweight' | 'dumbbells' | 'full_gym';
export type DietStyle = 'no_preference' | 'vegetarian' | 'other';
export type CookingTime = 'low' | 'medium' | 'high';

export interface BasicInfo {
  age: number;
  sex: Sex;
  height: number; // cm
  weight: number; // kg
}

export interface GoalInfo {
  goal: Goal;
  fatLossRate?: FatLossRate;
  muscleGainRate?: MuscleGainRate;
}

export interface LifestyleInfo {
  activityLevel: ActivityLevel;
  dailySteps?: number;
}

export interface TrainingInfo {
  experience: Experience;
  daysPerWeek: number;
  equipment: Equipment;
  limitations?: string;
}

export interface NutritionPreferences {
  dietStyle: DietStyle;
  allergies?: string;
  mealsPerDay: number;
  cookingTime: CookingTime;
}

export interface RecoveryInfo {
  sleepHours?: number;
  stressLevel?: number; // 1-5
}

export interface SurveyData {
  basicInfo: BasicInfo;
  goalInfo: GoalInfo;
  lifestyleInfo: LifestyleInfo;
  trainingInfo: TrainingInfo;
  nutritionPreferences: NutritionPreferences;
  recoveryInfo: RecoveryInfo;
}

// Nutrition Plan Types

export interface Macros {
  protein: number; // grams
  carbs: number;   // grams
  fats: number;    // grams
}

export interface FoodItem {
  name: string;
  servingSize: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  category: 'protein' | 'carbs' | 'fats' | 'fiber_veg';
  dietCompatibility: DietStyle[];
}

export interface Meal {
  name: string;
  targetCalories: number;
  targetMacros: Macros;
  suggestedFoods: FoodItem[];
}

export interface NutritionPlan {
  dailyCalories: number;
  bmr: number;
  tdee: number;
  macros: Macros;
  macroPercentages: { protein: number; carbs: number; fats: number };
  meals: Meal[];
  foodBank: {
    proteins: FoodItem[];
    carbs: FoodItem[];
    fats: FoodItem[];
    fiberVeg: FoodItem[];
  };
  explanation: {
    calorieReasoning: string;
    proteinReasoning: string;
    changeRateReasoning: string;
  };
}

// Workout Plan Types

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core';
export type MovementPattern = 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'isolation';
export type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbell' | 'cable' | 'machine';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  movementPattern: MovementPattern;
  equipmentRequired: EquipmentType[];
  isCompound: boolean;
  substitutes?: string[]; // exercise IDs
}

export interface ExercisePrescription {
  exercise: Exercise;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  rirTarget: number; // Reps in Reserve
}

export interface WorkoutDay {
  name: string;
  focus: string;
  exercises: ExercisePrescription[];
}

export interface ProgressionRule {
  title: string;
  description: string;
}

export interface WorkoutPlan {
  splitType: string;
  daysPerWeek: number;
  schedule: WorkoutDay[];
  progressionRules: ProgressionRule[];
  limitationsWarning?: string;
}

// Generated Plan

export interface GeneratedPlan {
  surveyData: SurveyData;
  nutritionPlan: NutritionPlan;
  workoutPlan: WorkoutPlan;
  generatedAt: string;
}
