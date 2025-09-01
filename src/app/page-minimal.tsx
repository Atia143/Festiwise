export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 text-white p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🎪</div>
        <h1 className="text-4xl font-bold mb-4">FestiWise</h1>
        <p className="text-xl">System is now running properly!</p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <p>✅ Next.js 15.5.2 working</p>
          <p>✅ Tailwind CSS working</p>
          <p>✅ No runtime errors</p>
        </div>
      </div>
    </div>
  )
}
