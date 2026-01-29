'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedPlan } from '@/types/survey';

/**
 * Export the results page to PDF
 */
export async function exportToPDF(elementId: string, filename: string = 'fitness-plan.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Element not found for PDF export');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    // Calculate dimensions for A4
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the ratio to fit width
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    // Add pages as needed
    let heightLeft = scaledHeight;
    let position = 0;
    const pageHeight = pdfHeight;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
    heightLeft -= pageHeight;

    // Add more pages if content is longer
    while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pageHeight;
    }

    pdf.save(filename);
}

/**
 * Generate PDF content directly (alternative method)
 */
export function generatePDFDirect(plan: GeneratedPlan): jsPDF {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const colors = {
        primary: [16, 185, 129],
        primaryDark: [13, 148, 136],
        slate: [15, 23, 42],
        muted: [100, 116, 139],
        card: [248, 250, 252],
        border: [226, 232, 240],
    };

    // Helper functions
    const addTitle = (text: string, size: number = 20) => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, y);
        y += size * 0.5;
    };

    const addText = (text: string, indent: number = 0, size: number = 10, color: number[] = colors.slate) => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, contentWidth - indent);
        pdf.text(lines, margin + indent, y);
        y += lines.length * 5;
        pdf.setTextColor(...colors.slate);
    };

    const addSectionHeader = (text: string) => {
        checkPageBreak(20);
        pdf.setFillColor(...colors.primary);
        pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(text, margin + 4, y + 7);
        pdf.setTextColor(...colors.slate);
        y += 14;
    };

    const addCard = (title: string, rows: Array<[string, string]>) => {
        const cardHeight = 8 + rows.length * 6 + 6;
        checkPageBreak(cardHeight + 4);
        pdf.setFillColor(...colors.card);
        pdf.setDrawColor(...colors.border);
        pdf.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(title, margin + 4, y + 7);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        rows.forEach(([label, value], index) => {
            const rowY = y + 13 + index * 6;
            pdf.setTextColor(...colors.muted);
            pdf.text(label, margin + 4, rowY);
            pdf.setTextColor(...colors.slate);
            pdf.text(value, margin + 55, rowY);
        });
        y += cardHeight + 6;
    };

    const addDivider = () => {
        pdf.setDrawColor(...colors.border);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 6;
    };

    const checkPageBreak = (neededSpace: number = 30) => {
        if (y > pageHeight - neededSpace) {
            pdf.addPage();
            y = margin;
        }
    };

    // Title Banner
    pdf.setFillColor(...colors.primaryDark);
    pdf.rect(0, 0, pageWidth, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Your Personalized Fitness Plan', margin, 18);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Generated on ${new Date(plan.generatedAt).toLocaleDateString()}`, margin, 24);
    pdf.setTextColor(...colors.slate);
    y = 36;

    // User Summary
    const { surveyData } = plan;
    addSectionHeader('Profile Summary');
    addCard('Overview', [
        ['Age', `${surveyData.basicInfo.age} years`],
        ['Sex', surveyData.basicInfo.sex],
        ['Height', `${surveyData.basicInfo.height} cm`],
        ['Weight', `${surveyData.basicInfo.weight} kg`],
        ['Goal', surveyData.goalInfo.goal.replace('_', ' ')],
        ['Activity', surveyData.lifestyleInfo.activityLevel.replace('_', ' ')],
        ['Training', `${surveyData.trainingInfo.daysPerWeek} days/week, ${surveyData.trainingInfo.experience}`],
    ]);

    // BMI Summary
    const heightM = surveyData.basicInfo.height / 100;
    const bmi = surveyData.basicInfo.weight / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;
    const minHealthyWeight = 18.5 * heightM * heightM;
    const maxHealthyWeight = 24.9 * heightM * heightM;
    addSectionHeader('BMI Summary');
    addText(`BMI: ${bmiRounded} (${bmiRounded < 18.5 ? 'Underweight' : bmiRounded < 24.9 ? 'Normal' : bmiRounded < 29.9 ? 'Overweight' : 'Obese'})`, 0, 11);
    addText(`Healthy weight range for your height: ${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)} kg`, 0, 10, colors.muted);
    y += 2;
    const bmiBarWidth = contentWidth;
    const bmiBarHeight = 4;
    const bmiBarX = margin;
    const bmiSegments = [
        { width: 18.5, color: [56, 189, 248] },
        { width: 6.4, color: [16, 185, 129] },
        { width: 5, color: [251, 191, 36] },
        { width: 10.1, color: [244, 63, 94] },
    ];
    const bmiMinDisplay = 0;
    const bmiMaxDisplay = 40;
    const bmiScale = bmiBarWidth / (bmiMaxDisplay - bmiMinDisplay);
    let barCursor = bmiBarX;
    bmiSegments.forEach((segment) => {
        const segmentWidth = segment.width * bmiScale;
        pdf.setFillColor(...segment.color);
        pdf.rect(barCursor, y, segmentWidth, bmiBarHeight, 'F');
        barCursor += segmentWidth;
    });
    const bmiMarkerX = bmiBarX + (Math.min(Math.max(bmiRounded, bmiMinDisplay), bmiMaxDisplay) - bmiMinDisplay) * bmiScale;
    pdf.setDrawColor(...colors.slate);
    pdf.line(bmiMarkerX, y - 2, bmiMarkerX, y + bmiBarHeight + 2);
    y += 8;
    const weightMinDisplay = minHealthyWeight * 0.8;
    const weightMaxDisplay = maxHealthyWeight * 1.2;
    const weightScale = contentWidth / (weightMaxDisplay - weightMinDisplay);
    pdf.setFillColor(226, 232, 240);
    pdf.roundedRect(margin, y, contentWidth, 4, 2, 2, 'F');
    const healthyStart = margin + (minHealthyWeight - weightMinDisplay) * weightScale;
    const healthyWidth = (maxHealthyWeight - minHealthyWeight) * weightScale;
    pdf.setFillColor(...colors.primary);
    pdf.roundedRect(healthyStart, y, healthyWidth, 4, 2, 2, 'F');
    const weightMarkerX = margin + (Math.min(Math.max(surveyData.basicInfo.weight, weightMinDisplay), weightMaxDisplay) - weightMinDisplay) * weightScale;
    pdf.setDrawColor(...colors.slate);
    pdf.line(weightMarkerX, y - 2, weightMarkerX, y + 6);
    y += 12;

    // Nutrition Plan
    addSectionHeader('Nutrition Plan');
    addCard('Daily Targets', [
        ['Calories', `${plan.nutritionPlan.dailyCalories} kcal`],
        ['Protein', `${plan.nutritionPlan.macros.protein} g (${plan.nutritionPlan.macroPercentages.protein}%)`],
        ['Carbs', `${plan.nutritionPlan.macros.carbs} g (${plan.nutritionPlan.macroPercentages.carbs}%)`],
        ['Fats', `${plan.nutritionPlan.macros.fats} g (${plan.nutritionPlan.macroPercentages.fats}%)`],
    ]);

    // Meal Structure
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Meal Structure', margin, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    plan.nutritionPlan.meals.forEach(meal => {
        addText(`• ${meal.name}: ${meal.targetCalories} kcal (P: ${meal.targetMacros.protein}g, C: ${meal.targetMacros.carbs}g, F: ${meal.targetMacros.fats}g)`, 4);
    });
    addDivider();

    // Workout Plan
    addSectionHeader(`Workout Plan: ${plan.workoutPlan.splitType}`);

    plan.workoutPlan.schedule.forEach(day => {
        checkPageBreak(40);
        pdf.setFillColor(243, 244, 246);
        pdf.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(day.name, margin + 3, y + 6);
        y += 12;

        day.exercises.forEach(ex => {
            addText(`• ${ex.exercise.name}: ${ex.sets}×${ex.repsMin}-${ex.repsMax} | Rest: ${ex.restSeconds}s | RIR: ${ex.rirTarget}`, 4);
        });
        y += 3;
    });

    // Progression Rules
    checkPageBreak(50);
    addSectionHeader('Progression Rules');
    plan.workoutPlan.progressionRules.forEach(rule => {
        checkPageBreak(20);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`• ${rule.title}`, margin, y);
        y += 5;
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(rule.description, contentWidth - 10);
        pdf.text(lines, margin + 5, y);
        y += lines.length * 4 + 3;
    });

    // Limitations Warning
    if (plan.workoutPlan.limitationsWarning) {
        checkPageBreak(30);
        pdf.setFillColor(254, 242, 242);
        pdf.setDrawColor(248, 113, 113);
        const warningLines = pdf.splitTextToSize(plan.workoutPlan.limitationsWarning, contentWidth - 8);
        const warningHeight = 10 + warningLines.length * 4 + 4;
        pdf.roundedRect(margin, y, contentWidth, warningHeight, 2, 2, 'FD');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(185, 28, 28);
        pdf.text('Important Notice', margin + 4, y + 6);
        pdf.setFont('helvetica', 'normal');
        pdf.text(warningLines, margin + 4, y + 11);
        pdf.setTextColor(...colors.slate);
        y += warningHeight + 2;
    }

    // Disclaimer
    checkPageBreak(40);
    addDivider();
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...colors.muted);
    const disclaimer = 'Disclaimer: This plan is generated based on general fitness principles and the information you provided. It is not medical advice. Please consult with a healthcare professional or certified fitness trainer before starting any new exercise or nutrition program, especially if you have pre-existing health conditions.';
    const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth);
    pdf.text(disclaimerLines, margin, y);

    return pdf;
}

/**
 * Download PDF using direct generation method
 */
export function downloadPDFDirect(plan: GeneratedPlan, filename: string = 'fitness-plan.pdf'): void {
    const pdf = generatePDFDirect(plan);
    pdf.save(filename);
}
