'use client';

import { WorkoutPlan } from '@/types/survey';

interface WorkoutDisplayProps {
    plan: WorkoutPlan;
}

export function WorkoutDisplay({ plan }: WorkoutDisplayProps) {
    return (
        <div className="space-y-8">
            {/* Split Overview */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Your Training Split</h3>
                <div className="text-3xl font-bold mb-2">{plan.splitType}</div>
                <div className="text-violet-200">{plan.daysPerWeek} training days per week</div>
            </div>

            {/* Limitations Warning */}
            {plan.limitationsWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="text-amber-800">{plan.limitationsWarning}</div>
                </div>
            )}

            {/* Weekly Schedule */}
            <div className="space-y-6">
                {plan.schedule.map((day, dayIndex) => (
                    <div key={dayIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gray-800 text-white px-6 py-4">
                            <h4 className="text-lg font-bold">{day.name}</h4>
                            <p className="text-gray-300 text-sm">{day.focus}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Exercise</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Sets</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Reps</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Rest</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">RIR</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {day.exercises.map((ex, exIndex) => (
                                        <tr key={exIndex} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{ex.exercise.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {ex.exercise.muscleGroup.charAt(0).toUpperCase() + ex.exercise.muscleGroup.slice(1)}
                                                    {ex.exercise.isCompound && ' • Compound'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-800">{ex.sets}</td>
                                            <td className="px-4 py-3 text-center text-gray-800">{ex.repsMin}-{ex.repsMax}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{ex.restSeconds}s</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ex.rirTarget <= 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {ex.rirTarget}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progression Rules */}
            <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Progression Rules</h3>
                <div className="space-y-4">
                    {plan.progressionRules.map((rule, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-1">{rule.title}</h4>
                            <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
