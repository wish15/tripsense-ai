"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Itinerary } from "@/types";
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Share2, 
  Download,
  Sparkles,
  TrendingUp,
  Clock,
  Heart
} from "lucide-react";
import DayCard from "@/components/itinerary/DayCard";
import BudgetDashboard from "@/components/budget/BudgetDashboard";
import MapView from "@/components/map/MapView";
import PackingList from "@/components/packing/PackingList";

export default function ItineraryPage() {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [vibeScore, setVibeScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'map' | 'packing'>('itinerary');

  useEffect(() => {
    const itineraryStr = localStorage.getItem('currentItinerary');
    const vibeScoreStr = localStorage.getItem('vibeScore');

    if (!itineraryStr) {
      router.push('/onboarding');
      return;
    }

    setItinerary(JSON.parse(itineraryStr));
    setVibeScore(parseInt(vibeScoreStr || '0'));
  }, [router]);

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${itinerary.destination} Trip`,
          text: `Check out my ${itinerary.days.length}-day itinerary for ${itinerary.destination}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon!');
  };

  const totalCost = itinerary.days.reduce((sum, day) => {
    return sum + day.activities.reduce((daySum, activity) => daySum + activity.cost, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold">{itinerary.destination}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <StatCard icon={<Calendar className="h-5 w-5" />} label="Duration" value={`${itinerary.days.length} days`} />
            <StatCard icon={<DollarSign className="h-5 w-5" />} label="Budget" value={`$${totalCost.toLocaleString()}`} />
            <StatCard icon={<Users className="h-5 w-5" />} label="Travelers" value={itinerary.travelers.toString()} />
            <StatCard icon={<Clock className="h-5 w-5" />} label="Activities" value={itinerary.days.reduce((sum, d) => sum + d.activities.length, 0).toString()} />
            <StatCard icon={<Heart className="h-5 w-5 text-red-500" />} label="Vibe Match" value={`${vibeScore}%`} color="text-red-600" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b overflow-x-auto">
            {[
              { id: 'itinerary', label: 'Itinerary', icon: Calendar },
              { id: 'budget', label: 'Budget', icon: DollarSign },
              { id: 'map', label: 'Map', icon: MapPin },
              { id: 'packing', label: 'Packing', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold">Trip Highlights</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {itinerary.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Day by Day */}
            {itinerary.days.map((day) => (
              <DayCard key={day.day} day={day} currency={itinerary.currency} />
            ))}
          </div>
        )}

        {activeTab === 'budget' && (
          <BudgetDashboard itinerary={itinerary} />
        )}

        {activeTab === 'map' && (
          <MapView itinerary={itinerary} />
        )}

        {activeTab === 'packing' && (
          <PackingList itinerary={itinerary} />
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color = "text-blue-600" }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={color}>{icon}</div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}
