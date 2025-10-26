"use client";

import { useState } from "react";
import { DayPlan, Activity } from "@/types";
import { Clock, DollarSign, MapPin, Lightbulb, Repeat, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

interface DayCardProps {
  day: DayPlan;
  currency: string;
}

export default function DayCard({ day, currency }: DayCardProps) {
  const [expanded, setExpanded] = useState(true);

  const energyColors = {
    chill: 'bg-green-100 text-green-700',
    balanced: 'bg-yellow-100 text-yellow-700',
    intense: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Day Header */}
      <div
        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-blue-600 shadow-sm">
              {day.day}
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#0f172a' }}>{day.theme || `Day ${day.day}`}</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${energyColors[day.energyLevel]}`}>
              {day.energyLevel}
            </span>
            <span className="text-lg font-bold text-blue-600">
              {currency}{day.totalCost?.toLocaleString() || 0}
            </span>
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* Activities */}
      {expanded && (
        <div className="p-6 space-y-4">
          {day.activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} currency={currency} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity, currency }: { activity: Activity; currency: string }) {
  const [showPlanB, setShowPlanB] = useState(false);

  const categoryColors: Record<string, string> = {
    attraction: 'bg-blue-100 text-blue-700',
    food: 'bg-orange-100 text-orange-700',
    transport: 'bg-gray-100 text-gray-700',
    entertainment: 'bg-purple-100 text-purple-700',
    shopping: 'bg-pink-100 text-pink-700',
    nature: 'bg-green-100 text-green-700',
    culture: 'bg-indigo-100 text-indigo-700',
    relaxation: 'bg-teal-100 text-teal-700',
  };

  const energyEmoji = {
    low: '😌',
    medium: '🚶',
    high: '🏃',
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      {/* Activity Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
          {activity.startTime}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>{activity.name}</h4>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>{activity.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-green-600">
                {currency}{activity.cost}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>per person</div>
            </div>
          </div>

          {/* Activity Meta */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColors[activity.category] || 'bg-gray-100 text-gray-700'}`}>
              {activity.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.duration} min
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
              {energyEmoji[activity.energyLevel]} {activity.energyLevel} energy
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
              {activity.vibeMatch}% match
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm mb-3" style={{ color: '#475569' }}>
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{activity.location.address}</span>
          </div>

          {/* Tips */}
          {activity.tips && activity.tips.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#92400e' }}>Insider Tips:</p>
                  <ul className="text-xs space-y-1" style={{ color: '#92400e' }}>
                    {activity.tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Plan B Toggle */}
          <button
            onClick={() => setShowPlanB(!showPlanB)}
            className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Repeat className="h-4 w-4" />
            {showPlanB ? 'Hide' : 'Show'} backup options
          </button>

          {/* Plan B Options (Placeholder) */}
          {showPlanB && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm" style={{ color: '#334155' }}>
                💡 If plans change, try nearby alternatives like museums, cafes, or indoor activities. 
                Full Plan B suggestions available on upgrade!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
