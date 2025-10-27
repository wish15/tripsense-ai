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
  Heart,
  Loader2,
  Edit3,
  Plane,
  Hotel,
  Home
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
  const [changeDescription, setChangeDescription] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [showChangeInput, setShowChangeInput] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'travel' | 'hotels'>('travel');

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

  const handleModifyItinerary = async () => {
    if (!changeDescription.trim()) return;

    setIsModifying(true);
    try {
      const response = await fetch('/api/modify-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentItinerary: itinerary,
          changeDescription: changeDescription.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to modify itinerary');

      const modifiedItinerary = await response.json();
      
      // Update state and localStorage
      setItinerary(modifiedItinerary);
      localStorage.setItem('currentItinerary', JSON.stringify(modifiedItinerary));

      // Reset form
      setChangeDescription("");
      setShowChangeInput(false);
      
      alert('✅ Itinerary updated successfully!');
    } catch (error) {
      console.error('Error modifying itinerary:', error);
      alert('❌ Failed to modify itinerary. Please try again.');
    } finally {
      setIsModifying(false);
    }
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
              <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>{itinerary.destination}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: '#0f172a' }}
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: '#0f172a' }}
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
            {/* AI Itinerary Modifier */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Edit3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#0f172a' }}>
                      Modify Your Itinerary with AI
                    </h3>
                    <p className="text-sm" style={{ color: '#64748b' }}>
                      Describe what you'd like to change, and AI will update your trip
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangeInput(!showChangeInput)}
                  className="px-4 py-2 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-all shadow-sm"
                >
                  {showChangeInput ? 'Cancel' : '✨ Make Changes'}
                </button>
              </div>

              {showChangeInput && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>
                      What would you like to change?
                    </label>
                    <textarea
                      value={changeDescription}
                      onChange={(e) => setChangeDescription(e.target.value)}
                      placeholder="Examples:&#10;• Add more food experiences on day 2&#10;• Make day 3 more relaxing with spa activities&#10;• Replace the museum visit with outdoor hiking&#10;• Add a sunset boat tour in the evening&#10;• Remove breakfast activities and start later"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-inner"
                      style={{ color: '#0f172a', minHeight: '140px', backgroundColor: '#ffffff' }}
                      disabled={isModifying}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleModifyItinerary}
                      disabled={!changeDescription.trim() || isModifying}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isModifying ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Updating Your Trip...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          <span>Apply Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-purple-200">
                    <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      <strong>Pro Tips:</strong> Be specific about what you want to change. For example: "Add a cooking class on day 2 after lunch" or "Replace expensive activities with budget-friendly alternatives"
                    </p>
                  </div>
                </div>
              )}

              {!showChangeInput && (
                <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-purple-200">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    Want to add, remove, or adjust activities? Click <strong>"Make Changes"</strong> and describe what you'd like to modify.
                  </p>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>Trip Highlights</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {itinerary.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                    <p className="text-sm" style={{ color: '#1e293b' }}>{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Day by Day */}
            {itinerary.days.map((day) => (
              <DayCard key={day.day} day={day} currency={itinerary.currency} />
            ))}

            {/* Book Travel & Hotels */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Book Your Trip?
              </h3>
              <p className="text-blue-100 mb-6">
                Book your travel and accommodation to make this itinerary a reality
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setBookingType('travel');
                    setShowBookingModal(true);
                  }}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Plane className="h-6 w-6" style={{ color: '#1e40af' }} />
                  <span style={{ color: '#1e40af' }}>Book Travel</span>
                </button>
                
                <button
                  onClick={() => {
                    setBookingType('hotels');
                    setShowBookingModal(true);
                  }}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Hotel className="h-6 w-6" style={{ color: '#7e22ce' }} />
                  <span style={{ color: '#7e22ce' }}>Book Hotels</span>
                </button>
              </div>
              
              <p className="text-xs text-blue-100 mt-4">
                Flights, trains, hotels, and more - all coming soon!
              </p>
            </div>
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

      {/* Booking Coming Soon Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">
              {bookingType === 'travel' ? '✈️' : '🏨'}
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>
              Coming Soon!
            </h3>
            <p className="mb-6" style={{ color: '#64748b' }}>
              {bookingType === 'travel' 
                ? 'Flight, train, and cab booking will be available soon.'
                : 'Hotel and accommodation booking will be available soon.'}
            </p>
            <button
              onClick={() => setShowBookingModal(false)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color = "text-blue-600" }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={color}>{icon}</div>
      <div>
        <p className="text-xs" style={{ color: '#64748b' }}>{label}</p>
        <p className="font-bold" style={{ color: '#0f172a' }}>{value}</p>
      </div>
    </div>
  );
}
