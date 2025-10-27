"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, DollarSign, Users, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { TravelPreferences, VibeProfile } from "@/types";

const VIBE_QUESTIONS = [
  { id: 'adventure', label: 'Adventure & Thrills', emoji: '🎢' },
  { id: 'culture', label: 'Culture & History', emoji: '🏛️' },
  { id: 'relaxation', label: 'Relaxation & Wellness', emoji: '🧘' },
  { id: 'foodie', label: 'Food Experiences', emoji: '🍜' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', emoji: '🎭' },
  { id: 'nature', label: 'Nature & Outdoors', emoji: '🏞️' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Partial<TravelPreferences>>({
    destination: "",
    budget: 1500,
    budgetType: undefined,
    travelers: 2,
    currency: "USD",
    pace: "moderate",
    vibe: {
      adventure: 50,
      culture: 50,
      relaxation: 50,
      foodie: 50,
      nightlife: 50,
      nature: 50,
    },
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save to localStorage and navigate to itinerary generation
      localStorage.setItem('travelPreferences', JSON.stringify(preferences));
      router.push('/generate');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.destination && preferences.destination.length > 0;
      case 2:
        return preferences.startDate && preferences.endDate;
      case 3:
        return preferences.budgetType !== undefined;
      case 4:
        return preferences.travelers && preferences.travelers > 0;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const updateVibe = (key: keyof VibeProfile, value: number) => {
    setPreferences({
      ...preferences,
      vibe: {
        ...preferences.vibe!,
        [key]: value,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: '#334155' }}>
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium" style={{ color: '#334155' }}>
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Step 1: Destination */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>Where do you want to go?</h2>
              </div>
              <p className="text-lg" style={{ color: '#334155' }}>
                Tell us your dream destination and we'll plan the perfect trip
              </p>
              <input
                type="text"
                placeholder="e.g., Paris, Tokyo, Bali..."
                value={preferences.destination}
                onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:outline-none transition-colors"
                autoFocus
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {['Paris', 'Tokyo', 'Bali', 'New York', 'Rome', 'Dubai'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setPreferences({ ...preferences, destination: city })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                    style={{ color: '#0f172a' }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>When are you traveling?</h2>
              </div>
              <p className="text-lg" style={{ color: '#334155' }}>
                Select your travel dates
              </p>
              
              {/* Date Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferences.startDate ? new Date(preferences.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setPreferences({ ...preferences, startDate: new Date(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    min={preferences.startDate ? new Date(new Date(preferences.startDate).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    value={preferences.endDate ? new Date(preferences.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setPreferences({ ...preferences, endDate: new Date(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    value={preferences.arrivalTime || ''}
                    onChange={(e) => setPreferences({ ...preferences, arrivalTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={preferences.departureTime || ''}
                    onChange={(e) => setPreferences({ ...preferences, departureTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
              </div>

              {/* Trip Duration Display */}
              {preferences.startDate && preferences.endDate && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center border-2 border-blue-100">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {Math.ceil((new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#475569' }}>
                    Days of Adventure
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setPreferences({ ...preferences, budget: 1500, budgetType: 'budget-friendly' })}
                  className={`p-10 rounded-3xl border-2 transition-all hover:scale-105 ${
                    preferences.budgetType === 'budget-friendly'
                      ? 'bg-blue-50 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-base font-medium leading-relaxed" style={{ color: preferences.budgetType === 'budget-friendly' ? '#2563eb' : '#94a3b8' }}>
                    Smart spending,<br/>
                    big adventures
                  </p>
                </button>

                <button
                  onClick={() => setPreferences({ ...preferences, budget: 3500, budgetType: 'mid-range' })}
                  className={`p-10 rounded-3xl border-2 transition-all hover:scale-105 ${
                    preferences.budgetType === 'mid-range'
                      ? 'bg-blue-50 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-base font-medium leading-relaxed" style={{ color: preferences.budgetType === 'mid-range' ? '#2563eb' : '#94a3b8' }}>
                    Balanced<br/>
                    comfort<br/>
                    & value
                  </p>
                </button>

                <button
                  onClick={() => setPreferences({ ...preferences, budget: 7000, budgetType: 'luxury' })}
                  className={`p-10 rounded-3xl border-2 transition-all hover:scale-105 ${
                    preferences.budgetType === 'luxury'
                      ? 'bg-blue-50 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-base font-medium leading-relaxed" style={{ color: preferences.budgetType === 'luxury' ? '#2563eb' : '#94a3b8' }}>
                    Premium<br/>
                    experiences<br/>
                    all the way
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Travelers */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>Who's traveling?</h2>
              </div>
              <p className="text-lg" style={{ color: '#64748b' }}>
                Number of travelers and your travel pace
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#1e293b' }}>
                    Number of Travelers
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPreferences({ ...preferences, travelers: Math.max(1, (preferences.travelers || 1) - 1) })}
                      className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center text-2xl font-bold hover:border-purple-600 hover:bg-purple-50 transition-all"
                      style={{ color: '#0f172a' }}
                    >
                      −
                    </button>
                    <div className="text-5xl font-bold text-purple-600 w-24 text-center">
                      {preferences.travelers}
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, travelers: (preferences.travelers || 1) + 1 })}
                      className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center text-2xl font-bold hover:border-purple-600 hover:bg-purple-50 transition-all"
                      style={{ color: '#0f172a' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#1e293b' }}>
                    Travel Pace
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'slow', label: 'Relaxed', desc: '2-3 activities/day' },
                      { value: 'moderate', label: 'Moderate', desc: '4-5 activities/day' },
                      { value: 'fast', label: 'Packed', desc: '6+ activities/day' },
                    ].map((pace) => (
                      <button
                        key={pace.value}
                        onClick={() => setPreferences({ ...preferences, pace: pace.value as any })}
                        className={`p-4 border-2 rounded-xl transition-all text-center hover:scale-105 ${
                          preferences.pace === pace.value
                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <div className="font-bold text-base" style={{ color: preferences.pace === pace.value ? '#7c3aed' : '#0f172a' }}>{pace.label}</div>
                        <div className="text-sm mt-1" style={{ color: preferences.pace === pace.value ? '#6d28d9' : '#64748b' }}>{pace.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Vibe Profile */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>What's your vibe?</h2>
              </div>
              <p className="text-lg" style={{ color: '#334155' }}>
                Help us match activities to your personality
              </p>
              <div className="space-y-6">
                {VIBE_QUESTIONS.map((question) => (
                  <div key={question.id}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1e293b' }}>
                        <span className="text-2xl">{question.emoji}</span>
                        {question.label}
                      </label>
                      <span className="text-lg font-bold text-purple-600">
                        {preferences.vibe![question.id as keyof VibeProfile]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={preferences.vibe![question.id as keyof VibeProfile]}
                      onChange={(e) => updateVibe(question.id as keyof VibeProfile, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Custom Vibe Description */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>Describe your ideal trip vibe in a few words.</h2>
              </div>
              <textarea
                placeholder='e.g., "cozy cafes and long walks" or "epic hikes and bonfires"'
                value={preferences.customVibe || ''}
                onChange={(e) => setPreferences({ ...preferences, customVibe: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:border-purple-600 focus:outline-none transition-colors min-h-[120px] resize-none placeholder:text-gray-400"
                style={{ 
                  color: '#0f172a',
                  backgroundColor: '#ffffff'
                }}
                autoFocus
              />
              <p className="text-sm" style={{ color: '#64748b' }}>
                This helps our AI create a truly personalized experience just for you ✨
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                style={{ color: '#0f172a' }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? 'Generate My Itinerary' : 'Continue'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
