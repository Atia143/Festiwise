'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="text-8xl mb-8">🎵</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Don't worry! You can still browse cached festivals and take the quiz offline. 
          Your data will sync when you're back online.
        </p>
        
        <div className="space-y-4">
          <a
            href="/quiz"
            className="block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Find My Perfect Festival →
          </a>
          
          <button
            onClick={() => window.location.reload()}
            className="block w-full text-blue-600 hover:text-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Available Offline:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Festival discovery quiz
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Cached festival data
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Browse guides & tips
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Save preferences locally
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
