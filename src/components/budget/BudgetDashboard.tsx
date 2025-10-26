"use client";

import { useState } from "react";
import { Itinerary } from "@/types";
import { DollarSign, TrendingDown, Lightbulb, Percent } from "lucide-react";

interface BudgetDashboardProps {
  itinerary: Itinerary;
}

export default function BudgetDashboard({ itinerary }: BudgetDashboardProps) {
  const [flexView, setFlexView] = useState<'70' | '100' | '130'>('100');

  // Calculate totals by category
  const categoryTotals: Record<string, number> = {};
  let totalCost = 0;

  itinerary.days.forEach((day) => {
    day.activities.forEach((activity) => {
      const category = activity.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + activity.cost;
      totalCost += activity.cost;
    });
  });

  const categories = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / totalCost) * 100,
  }));

  const categoryColors: Record<string, string> = {
    attraction: 'bg-blue-500',
    food: 'bg-orange-500',
    transport: 'bg-gray-500',
    entertainment: 'bg-purple-500',
    shopping: 'bg-pink-500',
    nature: 'bg-green-500',
    culture: 'bg-indigo-500',
    relaxation: 'bg-teal-500',
    accommodation: 'bg-yellow-500',
  };

  const budgetMultiplier = flexView === '70' ? 0.7 : flexView === '130' ? 1.3 : 1;
  const adjustedTotal = Math.round(totalCost * budgetMultiplier);
  const perPerson = Math.round(adjustedTotal / itinerary.travelers);
  const perDay = Math.round(adjustedTotal / itinerary.days.length);

  return (
    <div className="space-y-6">
      {/* Budget Flex View */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5 text-blue-600" />
          Budget Flex View
        </h2>
        <p className="text-gray-600 mb-4">
          See how your trip looks at different budget levels
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setFlexView('70')}
            className={`p-6 border-2 rounded-xl transition-all ${
              flexView === '70'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-green-600'
            }`}
          >
            <div className="text-sm text-gray-600 mb-1">Budget Saver</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${Math.round(totalCost * 0.7).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">70% of current</div>
          </button>

          <button
            onClick={() => setFlexView('100')}
            className={`p-6 border-2 rounded-xl transition-all ${
              flexView === '100'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-600'
            }`}
          >
            <div className="text-sm text-gray-600 mb-1">Current Plan</div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              ${totalCost.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">100% recommended</div>
          </button>

          <button
            onClick={() => setFlexView('130')}
            className={`p-6 border-2 rounded-xl transition-all ${
              flexView === '130'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-600'
            }`}
          >
            <div className="text-sm text-gray-600 mb-1">Premium</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              ${Math.round(totalCost * 1.3).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">130% upgrade</div>
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Budget Breakdown
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-sm text-blue-700 mb-1">Total Budget</div>
            <div className="text-3xl font-bold text-blue-900">
              ${adjustedTotal.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-sm text-green-700 mb-1">Per Person</div>
            <div className="text-3xl font-bold text-green-900">
              ${perPerson.toLocaleString()}
            </div>
            <div className="text-xs text-green-700 mt-1">
              {itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-sm text-purple-700 mb-1">Per Day</div>
            <div className="text-3xl font-bold text-purple-900">
              ${perDay.toLocaleString()}
            </div>
            <div className="text-xs text-purple-700 mt-1">
              {itinerary.days.length} days
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">By Category</h3>
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{category.name}</span>
                <span className="text-gray-600">
                  ${Math.round(category.amount * budgetMultiplier).toLocaleString()} ({category.percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${categoryColors[category.name] || 'bg-gray-400'} transition-all`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Money-Saving Tips */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-green-600" />
          Money-Saving Tips
        </h2>
        <div className="space-y-3">
          {[
            'Book activities in advance for early-bird discounts',
            'Use public transportation instead of taxis when possible',
            'Eat like a local - street food is authentic and budget-friendly',
            'Visit free attractions and museums on discount days',
            'Share meals and split costs with your travel companions',
            `Travel during shoulder season in ${itinerary.destination} for better prices`,
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Optimizer Button */}
      <button
        onClick={() => alert('Budget optimization coming soon! This will use AI to find cheaper alternatives.')}
        className="w-full p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        🤖 Optimize My Budget with AI
      </button>
    </div>
  );
}
