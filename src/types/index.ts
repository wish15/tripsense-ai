// User and Preferences Types
export interface User {
  id: string;
  email?: string;
  createdAt: Date;
}

export interface VibeProfile {
  adventure: number; // 0-100
  culture: number; // 0-100
  relaxation: number; // 0-100
  foodie: number; // 0-100
  nightlife: number; // 0-100
  nature: number; // 0-100
}

export interface TravelPreferences {
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  travelers: number;
  travelerTypes: ('adult' | 'child' | 'senior')[];
  vibe: VibeProfile;
  pace: 'slow' | 'moderate' | 'fast';
  accommodation?: string;
}

// Itinerary Types
export interface Location {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  country?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: Location;
  startTime: string; // HH:mm format
  endTime: string;
  duration: number; // minutes
  cost: number;
  currency: string;
  category: ActivityCategory;
  imageUrl?: string;
  tips?: string[];
  bookingUrl?: string;
  bookingRequired: boolean;
  energyLevel: 'low' | 'medium' | 'high';
  vibeMatch: number; // 0-100
  planB?: Activity[]; // Alternative activities
}

export type ActivityCategory = 
  | 'attraction'
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'shopping'
  | 'nature'
  | 'culture'
  | 'relaxation';

export interface DayPlan {
  day: number;
  date: Date;
  theme?: string;
  activities: Activity[];
  totalCost: number;
  totalDuration: number;
  weather?: WeatherInfo;
  energyLevel: 'chill' | 'balanced' | 'intense';
}

export interface Itinerary {
  id: string;
  userId?: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  days: DayPlan[];
  totalBudget: number;
  actualCost: number;
  currency: string;
  travelers: number;
  vibe: VibeProfile;
  highlights: string[];
  packingList: PackingList;
  shareToken?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Budget Types
export interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  name: string;
  cost: number;
  day?: number;
  category: ActivityCategory;
}

export interface BudgetBreakdown {
  total: number;
  categories: BudgetCategory[];
  dailyAverage: number;
  perPersonCost: number;
  flexViews: {
    budget70: number;
    budget100: number;
    budget130: number;
  };
  savingsTips: string[];
}

// Weather Types
export interface WeatherInfo {
  date: Date;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
}

// Packing List Types
export interface PackingCategory {
  name: string;
  items: PackingItem[];
  essential: boolean;
}

export interface PackingItem {
  name: string;
  quantity: number;
  checked: boolean;
  reason?: string;
  category: string;
}

export interface PackingList {
  categories: PackingCategory[];
  totalItems: number;
  checkedItems: number;
}

// Plan B Types
export interface PlanBOption {
  reason: 'rain' | 'closed' | 'tired' | 'expensive' | 'crowded';
  alternatives: Activity[];
  explanation: string;
}

// AI Response Types
export interface AIItineraryResponse {
  itinerary: Itinerary;
  vibeScore: number;
  confidence: number;
  suggestions: string[];
}

// Map Types
export interface MapMarker {
  id: string;
  location: Location;
  activity: Activity;
  day: number;
  icon: string;
  color: string;
}

export interface MapRoute {
  from: Location;
  to: Location;
  mode: 'walking' | 'driving' | 'transit';
  duration: number;
  distance: number;
}

// Share Types
export interface ShareableItinerary {
  itinerary: Itinerary;
  shareUrl: string;
  expiresAt?: Date;
}
