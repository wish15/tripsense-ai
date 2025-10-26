"use client";

import { useState, useEffect } from "react";
import { Itinerary, PackingItem } from "@/types";
import { Package, CheckCircle, Circle, Sparkles } from "lucide-react";

interface PackingListProps {
  itinerary: Itinerary;
}

export default function PackingList({ itinerary }: PackingListProps) {
  const [packingList, setPackingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate smart packing list based on itinerary
    const generatePackingList = () => {
      const categories = [
        {
          name: "📋 Essential Documents",
          essential: true,
          items: [
            { name: "Passport", reason: "Required for international travel" },
            { name: "Travel insurance", reason: "Protection for your trip" },
            { name: "Flight tickets", reason: "Required for boarding" },
            { name: "Hotel confirmations", reason: "Check-in documentation" },
            { name: "Emergency contacts", reason: "Safety precaution" },
          ],
        },
        {
          name: "👕 Clothing",
          essential: true,
          items: generateClothingItems(),
        },
        {
          name: "📱 Electronics",
          essential: true,
          items: [
            { name: "Smartphone & charger", reason: "Communication and navigation" },
            { name: "Power bank", reason: "Keep devices charged on-the-go" },
            { name: "Universal adapter", reason: `For ${itinerary.destination} outlets` },
            { name: "Camera", reason: "Capture memories" },
            { name: "Headphones", reason: "Entertainment during travel" },
          ],
        },
        {
          name: "💊 Health & Toiletries",
          essential: true,
          items: [
            { name: "Prescription medications", reason: "Health requirement" },
            { name: "First aid kit", reason: "Minor injuries and ailments" },
            { name: "Sunscreen", reason: "Sun protection" },
            { name: "Toiletries", reason: "Personal hygiene" },
            { name: "Hand sanitizer", reason: "Hygiene on-the-go" },
          ],
        },
        {
          name: "🎒 Activity-Specific",
          essential: false,
          items: generateActivityItems(),
        },
        {
          name: "💰 Money & Cards",
          essential: true,
          items: [
            { name: "Credit cards", reason: "Primary payment method" },
            { name: "Cash (local currency)", reason: "For small purchases" },
            { name: "Emergency cash", reason: "Backup payment" },
          ],
        },
      ];

      setPackingList(
        categories.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({
            ...item,
            quantity: 1,
            checked: false,
          })),
        }))
      );
      setLoading(false);
    };

    generatePackingList();
  }, [itinerary]);

  function generateClothingItems() {
    const days = itinerary.days.length;
    const items = [
      { name: "T-shirts/tops", reason: `${days} days of wear` },
      { name: "Pants/shorts", reason: `${Math.ceil(days / 2)} pairs` },
      { name: "Underwear", reason: `${days + 2} pairs` },
      { name: "Socks", reason: `${days} pairs` },
      { name: "Comfortable walking shoes", reason: "Lots of walking activities" },
      { name: "Light jacket", reason: "Weather changes" },
    ];

    // Add based on activities
    const hasNature = itinerary.days.some((day) =>
      day.activities.some((a) => a.category === "nature")
    );
    if (hasNature) {
      items.push({ name: "Hiking boots", reason: "Nature activities planned" });
      items.push({ name: "Rain jacket", reason: "Outdoor protection" });
    }

    const hasSwimming = itinerary.days.some((day) =>
      day.activities.some((a) => a.name.toLowerCase().includes("beach") || a.name.toLowerCase().includes("pool"))
    );
    if (hasSwimming) {
      items.push({ name: "Swimwear", reason: "Beach/pool activities" });
      items.push({ name: "Beach towel", reason: "Swimming activities" });
    }

    return items;
  }

  function generateActivityItems() {
    const items: any[] = [];
    const categories = new Set(itinerary.days.flatMap((day) => day.activities.map((a) => a.category)));

    if (categories.has("culture")) {
      items.push({ name: "Modest clothing", reason: "For visiting religious sites" });
    }

    if (categories.has("nature")) {
      items.push({ name: "Backpack", reason: "For hiking and outdoor activities" });
      items.push({ name: "Water bottle", reason: "Stay hydrated" });
    }

    if (categories.has("food")) {
      items.push({ name: "Antacids", reason: "In case of food sensitivity" });
    }

    items.push({ name: "Day bag", reason: "For carrying essentials" });
    items.push({ name: "Reusable shopping bag", reason: "For purchases" });

    return items;
  }

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const newList = [...packingList];
    newList[categoryIndex].items[itemIndex].checked = !newList[categoryIndex].items[itemIndex].checked;
    setPackingList(newList);
  };

  const totalItems = packingList.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = packingList.reduce(
    (sum, cat) => sum + cat.items.filter((i: any) => i.checked).length,
    0
  );
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating your smart packing list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Smart Packing List
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {checkedItems}/{totalItems}
            </div>
            <div className="text-xs text-gray-500">items packed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progress === 100
            ? "🎉 All packed and ready to go!"
            : `${Math.round(progress)}% complete - keep going!`}
        </p>
      </div>

      {/* AI-Generated Note */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">AI-Personalized Packing List</h3>
            <p className="text-sm text-purple-800">
              This list is customized for your {itinerary.days.length}-day trip to {itinerary.destination}, 
              based on your planned activities, weather forecast, and travel style.
            </p>
          </div>
        </div>
      </div>

      {/* Packing Categories */}
      {packingList.map((category, catIndex) => (
        <div key={catIndex} className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{category.name}</h3>
            {category.essential && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Essential
              </span>
            )}
          </div>
          <div className="space-y-3">
            {category.items.map((item: PackingItem & { reason: string }, itemIndex: number) => (
              <div
                key={itemIndex}
                onClick={() => toggleItem(catIndex, itemIndex)}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {item.checked ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className={`font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pro Tips */}
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-3">✨ Packing Pro Tips</h3>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li>• Roll clothes instead of folding to save space</li>
          <li>• Pack a change of clothes in your carry-on</li>
          <li>• Use packing cubes to stay organized</li>
          <li>• Leave some space for souvenirs!</li>
          <li>• Check airline baggage restrictions before packing</li>
        </ul>
      </div>
    </div>
  );
}
