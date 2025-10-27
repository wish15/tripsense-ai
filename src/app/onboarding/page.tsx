"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, DollarSign, Users, Sparkles, ArrowRight, ArrowLeft, Plane, Home, Compass, Mountain, Palmtree, Building2, UtensilsCrossed, PartyPopper } from "lucide-react";
import { TravelPreferences, VibeProfile } from "@/types";

const VIBE_QUESTIONS = [
  { id: 'adventure', label: 'Adventure & Thrills', emoji: '🎢' },
  { id: 'culture', label: 'Culture & History', emoji: '🏛️' },
  { id: 'relaxation', label: 'Relaxation & Wellness', emoji: '🧘' },
  { id: 'foodie', label: 'Food Experiences', emoji: '🍜' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', emoji: '🎭' },
  { id: 'nature', label: 'Nature & Outdoors', emoji: '🏞️' },
];

const EXPERIENCE_TYPES = [
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', icon: Mountain },
  { id: 'relaxation', label: 'Relaxation', emoji: '🏖️', icon: Palmtree },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️', icon: Building2 },
  { id: 'foodie', label: 'Foodie', emoji: '🍜', icon: UtensilsCrossed },
  { id: 'party', label: 'Party & Nightlife', emoji: '🎉', icon: PartyPopper },
  { id: 'exploration', label: 'Exploration', emoji: '🧭', icon: Compass },
];

const DESTINATION_SUGGESTIONS: Record<string, { foreign: string[], local: string[] }> = {
  adventure: {
    foreign: ['Nepal', 'New Zealand', 'Iceland', 'Switzerland', 'Costa Rica', 'Peru'],
    local: ['Colorado', 'Utah', 'Alaska', 'Montana', 'Oregon', 'Wyoming']
  },
  relaxation: {
    foreign: ['Maldives', 'Bali', 'Santorini', 'Fiji', 'Seychelles', 'Thailand'],
    local: ['Hawaii', 'Florida Keys', 'Sedona', 'Napa Valley', 'Charleston', 'Maui']
  },
  cultural: {
    foreign: ['Japan', 'Italy', 'Egypt', 'Peru', 'India', 'Greece'],
    local: ['New York', 'Boston', 'New Orleans', 'San Francisco', 'Philadelphia', 'Washington DC']
  },
  foodie: {
    foreign: ['Italy', 'Japan', 'France', 'Thailand', 'Spain', 'Mexico'],
    local: ['New York', 'San Francisco', 'New Orleans', 'Chicago', 'Austin', 'Portland']
  },
  party: {
    foreign: ['Ibiza', 'Bangkok', 'Amsterdam', 'Berlin', 'Barcelona', 'Rio de Janeiro'],
    local: ['Las Vegas', 'Miami', 'New Orleans', 'Austin', 'Nashville', 'Los Angeles']
  },
  exploration: {
    foreign: ['Morocco', 'Vietnam', 'Turkey', 'Portugal', 'Indonesia', 'South Africa'],
    local: ['California Coast', 'Route 66', 'Pacific Northwest', 'Great Lakes', 'Appalachia', 'Desert Southwest']
  }
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [experienceType, setExperienceType] = useState<string>('');
  const [tripScope, setTripScope] = useState<'foreign' | 'local' | ''>('');
  const [showManualInput, setShowManualInput] = useState(false);
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

  const totalSteps = 9;

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
        return experienceType !== '';
      case 2:
        return tripScope !== '';
      case 3:
        return preferences.destination && preferences.destination.length > 0;
      case 4:
        return true; // Confirmation step
      case 5:
        return preferences.startDate && preferences.endDate;
      case 6:
        return preferences.budgetType !== undefined;
      case 7:
        return preferences.travelers && preferences.travelers > 0;
      case 8:
        return true;
      case 9:
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
          {/* Step 1: Experience Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>What experience are you looking for?</h2>
              </div>
              <p className="text-lg" style={{ color: '#64748b' }}>
                Tell us what kind of trip you want, and we'll personalize everything for you
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {EXPERIENCE_TYPES.map((exp) => {
                  const Icon = exp.icon;
                  return (
                    <button
                      key={exp.id}
                      onClick={() => setExperienceType(exp.id)}
                      className={`p-6 border-2 rounded-2xl transition-all hover:scale-105 ${
                        experienceType === exp.id
                          ? 'border-purple-600 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Icon className={`h-10 w-10 mx-auto mb-3 ${experienceType === exp.id ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div className="text-3xl mb-2">{exp.emoji}</div>
                      <div className="font-bold" style={{ color: experienceType === exp.id ? '#7c3aed' : '#0f172a' }}>
                        {exp.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Foreign or Local */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>Where would you like to travel?</h2>
              </div>
              <p className="text-lg" style={{ color: '#64748b' }}>
                Choose your travel scope
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <button
                  onClick={() => setTripScope('foreign')}
                  className={`p-10 border-2 rounded-2xl transition-all hover:scale-105 ${
                    tripScope === 'foreign'
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Plane className={`h-16 w-16 mx-auto mb-4 ${tripScope === 'foreign' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="text-2xl font-bold mb-2" style={{ color: tripScope === 'foreign' ? '#2563eb' : '#0f172a' }}>
                    Foreign Trip
                  </h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    Explore international destinations
                  </p>
                </button>

                <button
                  onClick={() => setTripScope('local')}
                  className={`p-10 border-2 rounded-2xl transition-all hover:scale-105 ${
                    tripScope === 'local'
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Home className={`h-16 w-16 mx-auto mb-4 ${tripScope === 'local' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="text-2xl font-bold mb-2" style={{ color: tripScope === 'local' ? '#2563eb' : '#0f172a' }}>
                    Local Trip
                  </h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    Discover amazing places nearby
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Destination Suggestions */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>
                  {showManualInput ? 'Enter your destination' : 'Pick your destination'}
                </h2>
              </div>
              <p className="text-lg" style={{ color: '#64748b' }}>
                {showManualInput 
                  ? 'Type in your dream destination'
                  : `Based on your ${experienceType} preference, here are some ${tripScope} destinations`
                }
              </p>

              {showManualInput ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="e.g., Paris, Tokyo, Bali..."
                    value={preferences.destination}
                    onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:outline-none transition-colors"
                    style={{ color: '#0f172a' }}
                    autoFocus
                  />
                  <button
                    onClick={() => setShowManualInput(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ← Back to suggestions
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                    {tripScope && experienceType && DESTINATION_SUGGESTIONS[experienceType]?.[tripScope]?.map((destination) => (
                      <button
                        key={destination}
                        onClick={() => setPreferences({ ...preferences, destination })}
                        className={`px-4 py-4 border-2 rounded-xl transition-all hover:scale-105 text-sm font-medium ${
                          preferences.destination === destination
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                        }`}
                        style={{ color: preferences.destination === destination ? '#2563eb' : '#0f172a' }}
                      >
                        {destination}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="w-full mt-4 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                    style={{ color: '#64748b' }}
                  >
                    + Enter a different destination
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
                <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>Perfect choice!</h2>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-100">
                <div className="text-center space-y-4">
                  <div className="text-5xl mb-4">✈️</div>
                  <h3 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                    {preferences.destination}
                  </h3>
                  <p className="text-lg" style={{ color: '#64748b' }}>
                    {EXPERIENCE_TYPES.find(e => e.id === experienceType)?.label} {tripScope === 'foreign' ? 'International' : 'Domestic'} Trip
                  </p>
                </div>
              </div>
              <p className="text-center text-lg" style={{ color: '#64748b' }}>
                Let's continue to create your perfect itinerary! 🎉
              </p>
            </div>
          )}

          {/* Step 5: Dates */}
          {step === 5 && (
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

          {/* Step 6: Budget */}
          {step === 6 && (
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

          {/* Step 7: Travelers */}
          {step === 7 && (
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

          {/* Step 8: Vibe Profile */}
          {step === 8 && (
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

          {/* Step 9: Custom Vibe Description */}
          {step === 9 && (
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
