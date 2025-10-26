import Link from "next/link";
import { MapPin, Sparkles, DollarSign, Map, Share2, Lightbulb, PackagePlus, Repeat } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TripSense AI
            </span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-medium mb-6" style={{ color: '#1e40af' }}>
            <Sparkles className="h-4 w-4" />
            AI-Powered Travel Planning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ 
            background: 'linear-gradient(to right, #1e40af, #7c3aed, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Perfect Trip, Planned in Minutes
          </h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#1e293b' }}>
            Get personalized itineraries that match your vibe, budget, and travel style. 
            Smart AI planning with real-time insights and backup plans.
          </p>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Sparkles className="h-5 w-5" />
            Start Planning Your Trip
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0f172a' }}>
          Everything You Need for the Perfect Trip
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-blue-600" />}
            title="Vibe Matching"
            description="AI learns your personality and suggests activities that truly match your style"
          />
          <FeatureCard
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
            title="Smart Budgeting"
            description="Real-time cost tracking with budget optimization and money-saving alternatives"
          />
          <FeatureCard
            icon={<Map className="h-8 w-8 text-red-600" />}
            title="Interactive Maps"
            description="Visualize your journey with routes, time estimates, and hidden gems"
          />
          <FeatureCard
            icon={<Repeat className="h-8 w-8 text-purple-600" />}
            title="Plan B Generator"
            description="Weather changes? Place closed? Get instant backup options"
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-pink-600" />}
            title="Easy Sharing"
            description="Share your itinerary with friends or export as PDF"
          />
          <FeatureCard
            icon={<PackagePlus className="h-8 w-8 text-orange-600" />}
            title="Smart Packing"
            description="Personalized packing list based on your activities and weather"
          />
          <FeatureCard
            icon={<Lightbulb className="h-8 w-8 text-yellow-600" />}
            title="Local Insights"
            description="Insider tips from locals, not just tourist traps"
          />
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-indigo-600" />}
            title="Time Optimizer"
            description="Avoid crowds, catch golden hours, and plan perfect timing"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0f172a' }}>
          How It Works
        </h2>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Tell Us About You"
            description="Quick 5-question quiz about your destination, budget, and travel vibe"
          />
          <StepCard
            number="2"
            title="AI Creates Your Plan"
            description="Our AI generates a personalized day-by-day itinerary in seconds"
          />
          <StepCard
            number="3"
            title="Refine & Go"
            description="Adjust, optimize budget, add Plan B options, and share with friends"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who plan smarter with TripSense AI
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Get Started - It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2025 TripSense AI. Built with ❤️ for travelers.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#0f172a' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#1e293b' }}>{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{ 
        background: 'linear-gradient(to right, #1e40af, #7c3aed)',
        color: '#ffffff'
      }}>
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: '#0f172a' }}>{title}</h3>
      <p style={{ color: '#1e293b' }}>{description}</p>
    </div>
  );
}
