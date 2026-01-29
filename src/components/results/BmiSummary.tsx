'use client';

interface BmiSummaryProps {
    heightCm: number;
    weightKg: number;
}

const bmiRanges = [
    { label: 'Underweight', min: 0, max: 18.5, color: 'bg-sky-400', text: 'text-sky-700' },
    { label: 'Normal', min: 18.5, max: 24.9, color: 'bg-emerald-500', text: 'text-emerald-700' },
    { label: 'Overweight', min: 24.9, max: 29.9, color: 'bg-amber-400', text: 'text-amber-700' },
    { label: 'Obese', min: 29.9, max: 40, color: 'bg-rose-500', text: 'text-rose-700' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function BmiSummary({ heightCm, weightKg }: BmiSummaryProps) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;
    const currentRange = bmiRanges.find((range) => bmi >= range.min && bmi < range.max) ?? bmiRanges[bmiRanges.length - 1];

    const minHealthyWeight = 18.5 * heightM * heightM;
    const maxHealthyWeight = 24.9 * heightM * heightM;
    const weightMinDisplay = minHealthyWeight * 0.8;
    const weightMaxDisplay = maxHealthyWeight * 1.2;
    const weightMarker = clamp((weightKg - weightMinDisplay) / (weightMaxDisplay - weightMinDisplay), 0, 1);

    const bmiMinDisplay = 12;
    const bmiMaxDisplay = 40;
    const bmiMarker = clamp((bmiRounded - bmiMinDisplay) / (bmiMaxDisplay - bmiMinDisplay), 0, 1);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">BMI Snapshot</h2>
                        <p className="text-sm text-gray-500">Based on your height and weight</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-gray-900">{bmiRounded}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 ${currentRange.text}`}>
                            {currentRange.label}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>BMI Scale</span>
                        <span>12 - 40+</span>
                    </div>
                    <div className="relative h-3 rounded-full overflow-hidden bg-gray-100 flex">
                        {bmiRanges.map((range) => {
                            const visibleMin = Math.max(range.min, bmiMinDisplay);
                            const visibleMax = Math.min(range.max, bmiMaxDisplay);
                            const width = Math.max(0, visibleMax - visibleMin);
                            return (
                                <div
                                    key={range.label}
                                    className={`${range.color} h-full`}
                                    style={{
                                        width: `${(width / (bmiMaxDisplay - bmiMinDisplay)) * 100}%`,
                                    }}
                                />
                            );
                        })}
                        <div
                            className="absolute -top-2 w-4 h-4 rounded-full bg-gray-900 border-2 border-white shadow"
                            style={{ left: `calc(${bmiMarker * 100}% - 8px)` }}
                        />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                        {bmiRanges.map((range) => (
                            <div key={range.label} className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${range.color}`} />
                                {range.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Healthy weight range for your height</span>
                        <span className="font-semibold text-emerald-700">
                            {minHealthyWeight.toFixed(1)} - {maxHealthyWeight.toFixed(1)} kg
                        </span>
                    </div>
                    <div className="relative mt-3 h-3 rounded-full bg-white overflow-hidden">
                        <div
                            className="absolute inset-y-0 bg-emerald-400/70"
                            style={{
                                left: `${((minHealthyWeight - weightMinDisplay) / (weightMaxDisplay - weightMinDisplay)) * 100}%`,
                                width: `${((maxHealthyWeight - minHealthyWeight) / (weightMaxDisplay - weightMinDisplay)) * 100}%`,
                            }}
                        />
                        <div
                            className="absolute -top-2 w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow"
                            style={{ left: `calc(${weightMarker * 100}% - 8px)` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>{weightMinDisplay.toFixed(0)} kg</span>
                        <span>{weightMaxDisplay.toFixed(0)} kg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
