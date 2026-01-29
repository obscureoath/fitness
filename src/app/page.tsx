'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [hasSavedPlan, setHasSavedPlan] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('fitness-plan');
    setHasSavedPlan(!!savedPlan);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Science-based • Personalized • Free
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Personal
              <span className="block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                Fitness Blueprint
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Answer a few questions and get a science-backed nutrition plan +
              workout program tailored to your goals. Export as PDF.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/survey"
                className="group relative px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-pulse-glow"
              >
                <span className="flex items-center gap-2">
                  Start Survey
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              {hasSavedPlan && (
                <Link
                  href="/results"
                  className="px-8 py-4 bg-emerald-700/50 backdrop-blur text-white font-semibold text-lg rounded-2xl border-2 border-white/30 hover:bg-emerald-700/70 transition-all duration-300"
                >
                  View My Plan
                </Link>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-emerald-100/80 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No login required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Data stays on your device
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Takes 2-3 minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          What You&apos;ll Get
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          A complete, science-based program designed specifically for your body and goals.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Personalized Nutrition</h3>
            <p className="text-gray-500">
              Custom calorie and macro targets calculated using the Mifflin-St Jeor equation.
              Meal structure based on your preferences.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Workout Plan</h3>
            <p className="text-gray-500">
              Training split adapted to your experience, schedule, and equipment.
              Complete with sets, reps, rest times, and progression rules.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Export to PDF</h3>
            <p className="text-gray-500">
              Download your complete plan as a beautifully formatted PDF.
              Print it, share it, or keep it on your phone.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-200 hidden md:block" />

              {/* Steps */}
              {[
                { step: 1, title: 'Tell Us About You', desc: 'Age, weight, height, and fitness goals' },
                { step: 2, title: 'Share Your Lifestyle', desc: 'Activity level, training experience, equipment access' },
                { step: 3, title: 'Set Your Preferences', desc: 'Diet style, meal frequency, cooking time' },
                { step: 4, title: 'Get Your Plan', desc: 'Receive personalized nutrition and workout programs' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 mb-8 last:mb-0">
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Fitness Plan Generator • Science-based recommendations •
            For informational purposes only. Consult a professional before starting any fitness program.
          </p>
        </div>
      </footer>
    </main>
  );
}
