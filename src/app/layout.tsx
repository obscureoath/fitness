import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fitness - Personalized Nutrition & Workout Plans",
  description: "Get your science-based, personalized nutrition and workout plan in minutes. No login required.",
  keywords: ["fitness", "nutrition", "workout", "meal plan", "exercise", "health"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {children}
      </body>
    </html>
  );
}
