"use client";

import { useState } from "react";
import { Itinerary } from "@/types";
import { MapPin, Navigation, Clock, Hotel, Plane, Train, CheckCircle, ArrowRight, Calendar } from "lucide-react";

interface MapViewProps {
  itinerary: Itinerary;
}

export default function MapView({ itinerary }: MapViewProps) {
  const [exploredActivities, setExploredActivities] = useState<Set<string>>(new Set());
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Collect all activities with day information
  const allActivities = itinerary.days.flatMap((day) =>
    day.activities.map((activity) => ({
      ...activity,
      day: day.day,
      date: day.date,
    }))
  );

  const toggleExplored = (activityId: string) => {
    const newExplored = new Set(exploredActivities);
    if (newExplored.has(activityId)) {
      newExplored.delete(activityId);
    } else {
      newExplored.add(activityId);
    }
    setExploredActivities(newExplored);
  };

  const handleBooking = () => {
    setShowBookingModal(true);
    setTimeout(() => setShowBookingModal(false), 2000);
  };

  const isAccommodation = (category: string) => category === 'accommodation';
  const isTransport = (category: string) => category === 'transport';

  return (
    <div className="space-y-6">
      {/* Journey Timeline Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Navigation className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Your Journey Map</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Follow your adventure timeline and mark places as explored!
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span className="text-sm">Explored ({exploredActivities.size})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <span className="text-sm">Upcoming ({allActivities.length - exploredActivities.size})</span>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {allActivities.map((activity, index) => {
              const activityKey = `${activity.day}-${index}`;
              const isExplored = exploredActivities.has(activityKey);
              const isLast = index === allActivities.length - 1;
              
              return (
                <div key={activityKey} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white z-10 ${
                    isExplored ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>

                  {/* Day Badge */}
                  {(index === 0 || allActivities[index - 1].day !== activity.day) && (
                    <div className="ml-20 mb-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      <Calendar className="h-4 w-4" />
                      Day {activity.day}
                    </div>
                  )}

                  {/* Activity Card */}
                  <div className={`ml-20 bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-lg ${
                    isExplored ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            isAccommodation(activity.category) ? 'bg-orange-100' :
                            isTransport(activity.category) ? 'bg-blue-100' :
                            'bg-purple-100'
                          }`}>
                            {isAccommodation(activity.category) ? (
                              <Hotel className="h-5 w-5 text-orange-600" />
                            ) : isTransport(activity.category) ? (
                              <Train className="h-5 w-5 text-blue-600" />
                            ) : (
                              <MapPin className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold" style={{ color: '#0f172a' }}>{activity.name}</h3>
                            <p className="text-sm mt-1" style={{ color: '#64748b' }}>{activity.description}</p>
                          </div>
                        </div>

                        {/* Time and Location */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mt-3" style={{ color: '#475569' }}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{activity.startTime}</span>
                            <span className="text-gray-400">•</span>
                            <span>{activity.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            <span>{activity.location.address}</span>
                          </div>
                        </div>

                        {/* Cost */}
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                            ${activity.cost} per person
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      {/* Booking Buttons */}
                      {isAccommodation(activity.category) && (
                        <button
                          onClick={handleBooking}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all hover:scale-105"
                        >
                          <Hotel className="h-4 w-4" />
                          Book Hotel
                        </button>
                      )}
                      
                      {isTransport(activity.category) && (
                        <button
                          onClick={handleBooking}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all hover:scale-105"
                        >
                          <Plane className="h-4 w-4" />
                          Book Travel
                        </button>
                      )}

                      {/* Google Maps Link */}
                      {activity.location.lat && activity.location.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${activity.location.lat},${activity.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 hover:border-blue-500 rounded-lg font-medium transition-all hover:scale-105"
                          style={{ color: '#475569' }}
                        >
                          <MapPin className="h-4 w-4" />
                          View on Map
                        </a>
                      )}

                      {/* Explored Toggle */}
                      <button
                        onClick={() => toggleExplored(activityKey)}
                        className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                          isExplored
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {isExplored ? 'Explored' : 'Mark as Explored'}
                      </button>

                      {!isLast && !isExplored && (
                        <button
                          onClick={() => toggleExplored(activityKey)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all hover:scale-105"
                        >
                          Move to Next
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Journey Complete */}
          <div className="relative mt-8">
            <div className="absolute left-6 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-4 border-white z-10"></div>
            <div className="ml-20 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Journey Complete! 🎉</h3>
              <p style={{ color: '#64748b' }}>You've reached the end of your amazing adventure in {itinerary.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-100">
          <div className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>Total Stops</div>
          <div className="text-3xl font-bold text-blue-600">{allActivities.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-100">
          <div className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>Explored</div>
          <div className="text-3xl font-bold text-green-600">{exploredActivities.size}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-100">
          <div className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>Progress</div>
          <div className="text-3xl font-bold text-purple-600">
            {allActivities.length > 0 ? Math.round((exploredActivities.size / allActivities.length) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-orange-100">
          <div className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>Days</div>
          <div className="text-3xl font-bold text-orange-600">{itinerary.days.length}</div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Coming Soon!</h3>
            <p style={{ color: '#64748b' }}>Booking integration will be available soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
