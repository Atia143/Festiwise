export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-purple-900 mb-8 text-center">
          🎪 FestiWise
        </h1>
        <p className="text-2xl text-purple-700 text-center mb-12">
          Find Your Perfect Music Festival in 2 Minutes
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎛️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Electronic Music</h3>
            <p className="text-gray-600">Bass drops, synth waves, and electronic beats</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤘</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Rock & Metal</h3>
            <p className="text-gray-600">Heavy riffs and powerful vocals</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hip Hop</h3>
            <p className="text-gray-600">Rap battles and urban beats</p>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors">
            🎯 Start Quiz Now
          </button>
        </div>
      </div>
    </div>
  );
}
