'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-purple-900 text-white p-8">
      <h1 className="text-4xl font-bold">🎪 Debug Test Page</h1>
      <p className="text-xl mt-4">If you can see this, the basic layout works!</p>
      <div className="mt-8 p-4 bg-white/10 rounded-lg">
        <p>✅ Layout is working</p>
        <p>✅ Tailwind CSS is working</p>
        <p>✅ React is rendering</p>
      </div>
    </div>
  )
}
