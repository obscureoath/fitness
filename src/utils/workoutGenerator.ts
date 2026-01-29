import {
    SurveyData,
    WorkoutPlan,
    WorkoutDay,
    ExercisePrescription,
    Exercise,
    ProgressionRule,
    Equipment,
    Experience,
    MuscleGroup
} from '@/types/survey';
import exerciseData from '@/data/exercises.json';

const exercises: Exercise[] = exerciseData.exercises as Exercise[];

/**
 * Generate a complete workout plan based on survey data
 */
export function generateWorkoutPlan(surveyData: SurveyData): WorkoutPlan {
    const { trainingInfo } = surveyData;
    const { experience, daysPerWeek, equipment, limitations } = trainingInfo;

    // Determine split type
    const splitType = determineSplitType(experience, daysPerWeek);

    // Generate workout schedule
    const schedule = generateSchedule(splitType, daysPerWeek, equipment, experience);

    // Generate progression rules
    const progressionRules = generateProgressionRules();

    // Check for limitations warning
    const limitationsWarning = limitations && limitations.trim().length > 0
        ? `⚠️ You mentioned: "${limitations}". Please consult with a healthcare professional before starting this program. Modify or skip any exercises that aggravate your condition.`
        : undefined;

    return {
        splitType,
        daysPerWeek,
        schedule,
        progressionRules,
        limitationsWarning,
    };
}

/**
 * Determine the best split type based on experience and days
 */
function determineSplitType(experience: Experience, daysPerWeek: number): string {
    if (experience === 'beginner') {
        return daysPerWeek <= 3 ? 'Full Body' : 'Full Body A/B';
    }

    if (experience === 'intermediate') {
        if (daysPerWeek <= 3) return 'Full Body';
        if (daysPerWeek === 4) return 'Upper/Lower';
        return 'Upper/Lower/Full';
    }

    // Advanced
    if (daysPerWeek <= 3) return 'Full Body';
    if (daysPerWeek === 4) return 'Upper/Lower';
    return 'Push/Pull/Legs';
}

/**
 * Generate workout schedule based on split type
 */
function generateSchedule(
    splitType: string,
    daysPerWeek: number,
    equipment: Equipment,
    experience: Experience
): WorkoutDay[] {
    const schedule: WorkoutDay[] = [];

    switch (splitType) {
        case 'Full Body':
        case 'Full Body A/B':
            for (let i = 0; i < daysPerWeek; i++) {
                const isA = i % 2 === 0;
                schedule.push(generateFullBodyDay(isA ? 'A' : 'B', equipment, experience, i + 1));
            }
            break;

        case 'Upper/Lower':
            for (let i = 0; i < daysPerWeek; i++) {
                const isUpper = i % 2 === 0;
                schedule.push(
                    isUpper
                        ? generateUpperDay(equipment, experience, Math.floor(i / 2) + 1)
                        : generateLowerDay(equipment, experience, Math.floor(i / 2) + 1)
                );
            }
            break;

        case 'Upper/Lower/Full':
            schedule.push(generateUpperDay(equipment, experience, 1));
            schedule.push(generateLowerDay(equipment, experience, 1));
            schedule.push(generateFullBodyDay('Light', equipment, experience, 3));
            if (daysPerWeek > 3) {
                schedule.push(generateUpperDay(equipment, experience, 2));
            }
            if (daysPerWeek > 4) {
                schedule.push(generateLowerDay(equipment, experience, 2));
            }
            break;

        case 'Push/Pull/Legs':
            const pplOrder = ['Push', 'Pull', 'Legs'];
            for (let i = 0; i < daysPerWeek; i++) {
                const dayType = pplOrder[i % 3];
                const dayNum = Math.floor(i / 3) + 1;
                switch (dayType) {
                    case 'Push':
                        schedule.push(generatePushDay(equipment, experience, dayNum));
                        break;
                    case 'Pull':
                        schedule.push(generatePullDay(equipment, experience, dayNum));
                        break;
                    case 'Legs':
                        schedule.push(generateLegsDay(equipment, experience, dayNum));
                        break;
                }
            }
            break;
    }

    return schedule;
}

/**
 * Get exercise by ID with equipment substitution
 */
function getExercise(id: string, equipment: Equipment): Exercise | null {
    let exercise = exercises.find(e => e.id === id);

    if (!exercise) return null;

    // Check if equipment is available
    const isAvailable = isExerciseAvailable(exercise, equipment);

    if (!isAvailable && exercise.substitutes) {
        // Find a suitable substitute
        for (const subId of exercise.substitutes) {
            const substitute = exercises.find(e => e.id === subId);
            if (substitute && isExerciseAvailable(substitute, equipment)) {
                return substitute;
            }
        }
    }

    return isAvailable ? exercise : null;
}

/**
 * Check if exercise equipment requirements can be met
 */
function isExerciseAvailable(exercise: Exercise, userEquipment: Equipment): boolean {
    const equipmentHierarchy: Record<Equipment, string[]> = {
        bodyweight: ['bodyweight'],
        dumbbells: ['bodyweight', 'dumbbells'],
        full_gym: ['bodyweight', 'dumbbells', 'barbell', 'cable', 'machine'],
    };

    const availableEquipment = equipmentHierarchy[userEquipment];
    return exercise.equipmentRequired.some(eq => availableEquipment.includes(eq));
}

/**
 * Create exercise prescription
 */
function createPrescription(
    exercise: Exercise,
    experience: Experience,
    overrideSets?: number,
    overrideReps?: { min: number; max: number }
): ExercisePrescription {
    // Default sets based on experience
    const baseSets = experience === 'beginner' ? 3 : experience === 'intermediate' ? 3 : 4;

    // Rep ranges based on exercise type
    let repsMin = 6, repsMax = 12;
    if (!exercise.isCompound) {
        repsMin = 10;
        repsMax = 15;
    }

    // RIR based on exercise type
    const rirTarget = exercise.isCompound ? 2 : 1;

    // Rest time based on exercise type and reps
    const restSeconds = exercise.isCompound ? 180 : 90;

    return {
        exercise,
        sets: overrideSets || baseSets,
        repsMin: overrideReps?.min || repsMin,
        repsMax: overrideReps?.max || repsMax,
        restSeconds,
        rirTarget,
    };
}

/**
 * Generate Full Body day
 */
function generateFullBodyDay(variant: string, equipment: Equipment, experience: Experience, dayNum: number): WorkoutDay {
    const exerciseList: ExercisePrescription[] = [];

    if (variant === 'A' || variant === 'Light') {
        // Squat pattern + Horizontal push + Horizontal pull + Accessories
        const squat = getExercise(equipment === 'full_gym' ? 'barbell_squat' : 'goblet_squat', equipment);
        const push = getExercise(equipment === 'full_gym' ? 'bench_press' : 'dumbbell_bench_press', equipment);
        const pull = getExercise(equipment === 'full_gym' ? 'barbell_row' : 'dumbbell_row', equipment);
        const shoulder = getExercise('lateral_raise', equipment);
        const core = getExercise('plank', equipment);

        if (squat) exerciseList.push(createPrescription(squat, experience));
        if (push) exerciseList.push(createPrescription(push, experience));
        if (pull) exerciseList.push(createPrescription(pull, experience));
        if (shoulder) exerciseList.push(createPrescription(shoulder, experience, 3, { min: 12, max: 15 }));
        if (core) exerciseList.push(createPrescription(core, experience, 3, { min: 30, max: 60 })); // seconds for plank
    } else {
        // Hinge pattern + Vertical push + Vertical pull + Accessories
        const hinge = getExercise(equipment === 'full_gym' ? 'romanian_deadlift' : 'dumbbell_rdl', equipment);
        const push = getExercise(equipment === 'full_gym' ? 'overhead_press' : 'dumbbell_shoulder_press', equipment);
        const pull = getExercise(equipment === 'full_gym' ? 'lat_pulldown' : 'pull_ups', equipment);
        const lunge = getExercise(equipment !== 'bodyweight' ? 'dumbbell_lunges' : 'lunges', equipment);
        const curl = getExercise('dumbbell_curl', equipment);

        if (hinge) exerciseList.push(createPrescription(hinge, experience));
        if (push) exerciseList.push(createPrescription(push, experience));
        if (pull) exerciseList.push(createPrescription(pull, experience));
        if (lunge) exerciseList.push(createPrescription(lunge, experience, 3, { min: 8, max: 12 }));
        if (curl) exerciseList.push(createPrescription(curl, experience, 3, { min: 10, max: 15 }));
    }

    return {
        name: `Day ${dayNum}: Full Body ${variant}`,
        focus: 'Full Body',
        exercises: exerciseList,
    };
}

/**
 * Generate Upper Body day
 */
function generateUpperDay(equipment: Equipment, experience: Experience, dayNum: number): WorkoutDay {
    const exerciseList: ExercisePrescription[] = [];

    const horizontalPush = getExercise(equipment === 'full_gym' ? 'bench_press' : 'dumbbell_bench_press', equipment);
    const horizontalPull = getExercise(equipment === 'full_gym' ? 'barbell_row' : 'dumbbell_row', equipment);
    const verticalPush = getExercise(equipment === 'full_gym' ? 'overhead_press' : 'dumbbell_shoulder_press', equipment);
    const verticalPull = getExercise(equipment === 'full_gym' ? 'lat_pulldown' : 'pull_ups', equipment);
    const lateralRaise = getExercise('lateral_raise', equipment);
    const triceps = getExercise(equipment === 'full_gym' ? 'tricep_pushdown' : 'overhead_tricep_extension', equipment);
    const biceps = getExercise('dumbbell_curl', equipment);

    if (horizontalPush) exerciseList.push(createPrescription(horizontalPush, experience));
    if (horizontalPull) exerciseList.push(createPrescription(horizontalPull, experience));
    if (verticalPush) exerciseList.push(createPrescription(verticalPush, experience));
    if (verticalPull) exerciseList.push(createPrescription(verticalPull, experience));
    if (lateralRaise) exerciseList.push(createPrescription(lateralRaise, experience, 3, { min: 12, max: 15 }));
    if (triceps) exerciseList.push(createPrescription(triceps, experience, 3, { min: 10, max: 15 }));
    if (biceps) exerciseList.push(createPrescription(biceps, experience, 3, { min: 10, max: 15 }));

    return {
        name: `Day ${dayNum * 2 - 1}: Upper Body`,
        focus: 'Upper Body (Chest, Back, Shoulders, Arms)',
        exercises: exerciseList,
    };
}

/**
 * Generate Lower Body day
 */
function generateLowerDay(equipment: Equipment, experience: Experience, dayNum: number): WorkoutDay {
    const exerciseList: ExercisePrescription[] = [];

    const squat = getExercise(equipment === 'full_gym' ? 'barbell_squat' : 'goblet_squat', equipment);
    const hinge = getExercise(equipment === 'full_gym' ? 'romanian_deadlift' : 'dumbbell_rdl', equipment);
    const legPress = getExercise(equipment === 'full_gym' ? 'leg_press' : 'dumbbell_lunges', equipment);
    const legCurl = getExercise(equipment === 'full_gym' ? 'leg_curl' : 'nordic_curl', equipment);
    const calfRaise = getExercise('calf_raise', equipment);
    const core = getExercise('hanging_leg_raise', equipment);

    if (squat) exerciseList.push(createPrescription(squat, experience));
    if (hinge) exerciseList.push(createPrescription(hinge, experience));
    if (legPress) exerciseList.push(createPrescription(legPress, experience));
    if (legCurl) exerciseList.push(createPrescription(legCurl, experience, 3, { min: 10, max: 15 }));
    if (calfRaise) exerciseList.push(createPrescription(calfRaise, experience, 4, { min: 12, max: 20 }));
    if (core) exerciseList.push(createPrescription(core, experience, 3, { min: 10, max: 15 }));

    return {
        name: `Day ${dayNum * 2}: Lower Body`,
        focus: 'Lower Body (Quads, Hamstrings, Glutes, Calves)',
        exercises: exerciseList,
    };
}

/**
 * Generate Push day
 */
function generatePushDay(equipment: Equipment, experience: Experience, dayNum: number): WorkoutDay {
    const exerciseList: ExercisePrescription[] = [];

    const benchPress = getExercise(equipment === 'full_gym' ? 'bench_press' : 'dumbbell_bench_press', equipment);
    const inclinePress = getExercise(equipment === 'full_gym' ? 'incline_bench_press' : 'incline_dumbbell_press', equipment);
    const ohp = getExercise(equipment === 'full_gym' ? 'overhead_press' : 'dumbbell_shoulder_press', equipment);
    const fly = getExercise(equipment === 'full_gym' ? 'cable_fly' : 'dumbbell_fly', equipment);
    const lateralRaise = getExercise('lateral_raise', equipment);
    const triceps = getExercise(equipment === 'full_gym' ? 'tricep_pushdown' : 'overhead_tricep_extension', equipment);

    if (benchPress) exerciseList.push(createPrescription(benchPress, experience));
    if (inclinePress) exerciseList.push(createPrescription(inclinePress, experience));
    if (ohp) exerciseList.push(createPrescription(ohp, experience));
    if (fly) exerciseList.push(createPrescription(fly, experience, 3, { min: 10, max: 15 }));
    if (lateralRaise) exerciseList.push(createPrescription(lateralRaise, experience, 4, { min: 12, max: 15 }));
    if (triceps) exerciseList.push(createPrescription(triceps, experience, 3, { min: 10, max: 15 }));

    return {
        name: `Day ${(dayNum - 1) * 3 + 1}: Push`,
        focus: 'Push (Chest, Shoulders, Triceps)',
        exercises: exerciseList,
    };
}

/**
 * Generate Pull day
 */
function generatePullDay(equipment: Equipment, experience: Experience, dayNum: number): WorkoutDay {
    const exerciseList: ExercisePrescription[] = [];

    const row = getExercise(equipment === 'full_gym' ? 'barbell_row' : 'dumbbell_row', equipment);
    const pulldown = getExercise(equipment === 'full_gym' ? 'lat_pulldown' : 'pull_ups', equipment);
    const cableRow = getExercise(equipment === 'full_gym' ? 'cable_row' : 'dumbbell_row', equipment);
    const facePull = getExercise(equipment === 'full_gym' ? 'face_pull' : 'rear_delt_fly', equipment);
    const bicepCurl = getExercise(equipment === 'full_gym' ? 'barbell_curl' : 'dumbbell_curl', equipment);
    const hammerCurl = getExercise('hammer_curl', equipment);

    if (row) exerciseList.push(createPrescription(row, experience));
    if (pulldown) exerciseList.push(createPrescription(pulldown, experience));
    if (cableRow && cableRow.id !== row?.id) exerciseList.push(createPrescription(cableRow, experience));
    if (facePull) exerciseList.push(createPrescription(facePull, experience, 3, { min: 12, max: 15 }));
    if (bicepCurl) exerciseList.push(createPrescription(bicepCurl, experience, 3, { min: 8, max: 12 }));
    if (hammerCurl) exerciseList.push(createPrescription(hammerCurl, experience, 3, { min: 10, max: 15 }));

    return {
        name: `Day ${(dayNum - 1) * 3 + 2}: Pull`,
        focus: 'Pull (Back, Rear Delts, Biceps)',
        exercises: exerciseList,
    };
}

/**
 * Generate Legs day
 */
function generateLegsDay(equipment: Equipment, experience: Experience, dayNum: number): WorkoutDay {
    const exerciseList: ExercisePrescription[] = [];

    const squat = getExercise(equipment === 'full_gym' ? 'barbell_squat' : 'goblet_squat', equipment);
    const rdl = getExercise(equipment === 'full_gym' ? 'romanian_deadlift' : 'dumbbell_rdl', equipment);
    const legPress = getExercise(equipment === 'full_gym' ? 'leg_press' : 'dumbbell_lunges', equipment);
    const legCurl = getExercise(equipment === 'full_gym' ? 'leg_curl' : 'nordic_curl', equipment);
    const legExt = getExercise(equipment === 'full_gym' ? 'leg_extension' : 'sissy_squat', equipment);
    const calfRaise = getExercise('calf_raise', equipment);

    if (squat) exerciseList.push(createPrescription(squat, experience));
    if (rdl) exerciseList.push(createPrescription(rdl, experience));
    if (legPress) exerciseList.push(createPrescription(legPress, experience));
    if (legCurl) exerciseList.push(createPrescription(legCurl, experience, 3, { min: 10, max: 15 }));
    if (legExt) exerciseList.push(createPrescription(legExt, experience, 3, { min: 10, max: 15 }));
    if (calfRaise) exerciseList.push(createPrescription(calfRaise, experience, 4, { min: 12, max: 20 }));

    return {
        name: `Day ${(dayNum - 1) * 3 + 3}: Legs`,
        focus: 'Legs (Quads, Hamstrings, Glutes, Calves)',
        exercises: exerciseList,
    };
}

/**
 * Generate progression rules
 */
function generateProgressionRules(): ProgressionRule[] {
    return [
        {
            title: 'Double Progression Method',
            description: 'Each exercise has a rep range (e.g., 3×6-10). Start at the lower end. When you can complete all sets at the top of the range with good form, increase the weight by the smallest increment available (typically 2.5kg/5lbs) and start again at the lower rep range.',
        },
        {
            title: 'Rep Target Example',
            description: 'If your target is 3×8-12 and you get 12, 11, 10 reps, keep the same weight until you hit 12, 12, 12. Then increase weight and aim for 8+ reps again.',
        },
        {
            title: 'Stall Protocol',
            description: 'If you fail to progress for 2 consecutive weeks on an exercise, reduce the weight by 10% and work back up. This provides a mini-deload and often breaks plateaus.',
        },
        {
            title: 'Deload Weeks',
            description: 'Every 4-6 weeks, take a deload week: reduce volume by 50% (half the sets) or intensity by 40% (lighter weights). This promotes recovery and long-term progress.',
        },
        {
            title: 'RIR Guidelines',
            description: 'RIR (Reps in Reserve) indicates how many reps you should have left "in the tank". Compounds at RIR 2 means stopping 2 reps before failure. Isolations at RIR 0-1 can be taken closer to failure.',
        },
    ];
}
