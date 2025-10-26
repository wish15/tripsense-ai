"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";

const LOADING_MESSAGES = [
  "Analyzing your preferences...",
  "Finding the best activities...",
  "Optimizing your itinerary...",
  "Calculating budgets...",
  "Adding insider tips...",
  "Almost ready!",
];

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessage((prev) => {
        const currentIndex = LOADING_MESSAGES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
        return LOADING_MESSAGES[nextIndex];
      });
    }, 2000);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    // Generate itinerary
    const generateItinerary = async () => {
      try {
        const preferencesStr = localStorage.getItem('travelPreferences');
        if (!preferencesStr) {
          throw new Error('No travel preferences found');
        }

        const preferences = JSON.parse(preferencesStr);

        const response = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate itinerary');
        }

        const data = await response.json();

        // Save itinerary to localStorage
        localStorage.setItem('currentItinerary', JSON.stringify(data.itinerary));
        localStorage.setItem('vibeScore', data.vibeScore.toString());

        setProgress(100);
        clearInterval(messageInterval);
        clearInterval(progressInterval);

        // Wait a bit before redirecting
        setTimeout(() => {
          router.push('/itinerary');
        }, 1000);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      }
    };

    generateItinerary();

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😞</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              {progress < 100 ? (
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              ) : (
                <CheckCircle className="h-12 w-12 text-white" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2">
            {progress < 100 ? 'Creating Your Perfect Trip' : 'Your Itinerary is Ready!'}
          </h2>

          {/* Loading Message */}
          <p className="text-gray-600 mb-6 h-6">
            {loadingMessage}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{Math.round(progress)}%</p>

          {/* Fun Facts */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 text-left">
                <strong>Did you know?</strong> Our AI analyzes over 100 factors to create your personalized itinerary!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
