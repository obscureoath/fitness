# Fitness - Personalized Nutrition & Workout Plan Generator

A responsive web application that generates science-based, personalized nutrition and workout plans through a step-by-step survey. No login required - all data is stored locally in your browser.

## Features

- **Survey-First UX**: Step-by-step questionnaire with progress tracking
- **Scientific Calculations**: Uses Mifflin-St Jeor equation for accurate BMR/TDEE calculations
- **Personalized Plans**: Nutrition and workout plans adapted to your goals, experience, and equipment
- **PDF Export**: Download your complete plan as a professionally formatted PDF
- **Local Storage**: Your data stays on your device - no account needed

## Tech Stack

- **Next.js 14+** with App Router
- **React 18+** with TypeScript
- **TailwindCSS** for styling
- **jsPDF + html2canvas** for PDF generation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fitness

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── survey/page.tsx   # Multi-step survey
│   ├── results/page.tsx  # Generated plan display
│   └── globals.css       # Global styles
├── components/
│   ├── survey/           # Survey UI components
│   │   ├── ProgressBar.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── NavigationButtons.tsx
│   │   ├── inputs/       # Form inputs
│   │   └── steps/        # Survey step components
│   └── results/          # Results display components
├── data/
│   ├── exercises.json    # Exercise library
│   └── foods.ts          # Food bank data
├── hooks/
│   └── useLocalStorage.ts
├── types/
│   └── survey.ts         # TypeScript interfaces
└── utils/
    ├── calculations.ts   # BMR/TDEE/Macro calculations
    ├── nutritionGenerator.ts
    ├── workoutGenerator.ts
    ├── pdfExport.ts
    └── validation.ts
```

## Survey Sections

1. **Basic Info**: Age, sex, height, weight
2. **Goal**: Fat loss, muscle gain, recomposition, or strength
3. **Lifestyle**: Activity level, daily steps
4. **Training**: Experience, days/week, equipment, limitations
5. **Nutrition**: Diet style, allergies, meals/day, cooking time
6. **Recovery**: Sleep hours, stress level (optional)
7. **Summary**: Review before generating

## Scientific Engine

### BMR Calculation (Mifflin-St Jeor)
- Male: `BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5`
- Female: `BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161`

### Activity Multipliers
| Level | Multiplier |
|-------|------------|
| Sedentary | 1.2 |
| Lightly Active | 1.375 |
| Moderately Active | 1.55 |
| Very Active | 1.725 |

### Calorie Adjustments by Goal
- Fat Loss: -15% (conservative) to -25% (aggressive)
- Muscle Gain: +5% (lean) to +12.5% (moderate)
- Recomposition: -10%
- Strength: +5%

## License

MIT
