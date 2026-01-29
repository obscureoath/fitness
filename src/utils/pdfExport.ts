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
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper functions
    const addTitle = (text: string, size: number = 20) => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, y);
        y += size * 0.5;
    };

    const addSubtitle = (text: string) => {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, y);
        y += 8;
    };

    const addText = (text: string, indent: number = 0) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(text, contentWidth - indent);
        pdf.text(lines, margin + indent, y);
        y += lines.length * 5;
    };

    const addLine = () => {
        y += 2;
        pdf.setDrawColor(200);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 5;
    };

    const checkPageBreak = (neededSpace: number = 30) => {
        if (y > pdf.internal.pageSize.getHeight() - neededSpace) {
            pdf.addPage();
            y = margin;
        }
    };

    // Title
    addTitle('Your Personalized Fitness Plan', 24);
    y += 5;
    addText(`Generated on: ${new Date(plan.generatedAt).toLocaleDateString()}`);
    addLine();

    // User Summary
    checkPageBreak();
    addSubtitle('Your Profile');
    const { surveyData } = plan;
    addText(`Age: ${surveyData.basicInfo.age} | Sex: ${surveyData.basicInfo.sex}`);
    addText(`Height: ${surveyData.basicInfo.height}cm | Weight: ${surveyData.basicInfo.weight}kg`);
    addText(`Goal: ${surveyData.goalInfo.goal.replace('_', ' ')}`);
    addText(`Activity Level: ${surveyData.lifestyleInfo.activityLevel.replace('_', ' ')}`);
    addText(`Training: ${surveyData.trainingInfo.daysPerWeek} days/week, ${surveyData.trainingInfo.experience}`);
    addLine();

    // Nutrition Plan
    checkPageBreak();
    addSubtitle('Nutrition Plan');
    y += 3;
    addText(`Daily Calories: ${plan.nutritionPlan.dailyCalories} kcal`);
    addText(`Protein: ${plan.nutritionPlan.macros.protein}g (${plan.nutritionPlan.macroPercentages.protein}%)`);
    addText(`Carbohydrates: ${plan.nutritionPlan.macros.carbs}g (${plan.nutritionPlan.macroPercentages.carbs}%)`);
    addText(`Fats: ${plan.nutritionPlan.macros.fats}g (${plan.nutritionPlan.macroPercentages.fats}%)`);
    y += 5;

    // Meal Structure
    addText('Meal Structure:', 0);
    plan.nutritionPlan.meals.forEach(meal => {
        addText(`• ${meal.name}: ${meal.targetCalories} kcal (P: ${meal.targetMacros.protein}g, C: ${meal.targetMacros.carbs}g, F: ${meal.targetMacros.fats}g)`, 5);
    });
    addLine();

    // Workout Plan
    checkPageBreak(50);
    addSubtitle(`Workout Plan: ${plan.workoutPlan.splitType}`);
    y += 3;

    plan.workoutPlan.schedule.forEach(day => {
        checkPageBreak(40);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(day.name, margin, y);
        y += 6;

        day.exercises.forEach(ex => {
            addText(`• ${ex.exercise.name}: ${ex.sets}×${ex.repsMin}-${ex.repsMax} | Rest: ${ex.restSeconds}s | RIR: ${ex.rirTarget}`, 5);
        });
        y += 3;
    });

    // Progression Rules
    checkPageBreak(50);
    addLine();
    addSubtitle('Progression Rules');
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
        addLine();
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(180, 0, 0);
        pdf.text('Important Notice:', margin, y);
        y += 5;
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(plan.workoutPlan.limitationsWarning, contentWidth);
        pdf.text(lines, margin, y);
        pdf.setTextColor(0);
        y += lines.length * 4 + 5;
    }

    // Disclaimer
    checkPageBreak(40);
    addLine();
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100);
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
