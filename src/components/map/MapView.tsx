"use client";

import { Itinerary } from "@/types";
import { MapPin, Navigation, Clock } from "lucide-react";

interface MapViewProps {
  itinerary: Itinerary;
}

export default function MapView({ itinerary }: MapViewProps) {
  // Collect all locations
  const allActivities = itinerary.days.flatMap((day) =>
    day.activities.map((activity) => ({
      ...activity,
      day: day.day,
      date: day.date,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Add your Mapbox token to see an interactive map with all your activities
            </p>
            <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">To enable the map:</p>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Get a free Mapbox token from mapbox.com</li>
                <li>Add it to your .env.local file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List with Map Context */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          Your Journey
        </h2>
        <div className="space-y-4">
          {allActivities.map((activity, index) => (
            <div key={`${activity.day}-${index}`} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">{activity.day}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{activity.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{activity.startTime}</span>
                      <span className="text-gray-400">•</span>
                      <span>{activity.duration} min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${activity.cost}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{activity.location.address}</span>
                </div>
                {activity.location.lat && activity.location.lng && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activity.location.lat},${activity.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Open in Google Maps →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-gray-600 text-sm mb-1">Total Locations</div>
          <div className="text-3xl font-bold text-blue-600">{allActivities.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-gray-600 text-sm mb-1">Cities</div>
          <div className="text-3xl font-bold text-purple-600">
            {new Set(allActivities.map((a) => a.location.city)).size}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-gray-600 text-sm mb-1">Estimated Travel Time</div>
          <div className="text-3xl font-bold text-green-600">
            {Math.round(allActivities.reduce((sum, a) => sum + a.duration, 0) / 60)}h
          </div>
        </div>
      </div>
    </div>
  );
}
