import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Music Festival Safety Tips 2025 - Stay Safe at Concerts & Festivals',
  description: 'Essential music festival safety guide 2025! Expert tips for staying safe at concerts, festivals & raves. Protect yourself and have the best time.',
  keywords: 'music festival safety, concert safety tips, festival security, rave safety, crowd safety, festival survival guide',
  openGraph: {
    title: 'Music Festival Safety Tips 2025 - Complete Safety Guide',
    description: 'Expert safety tips to protect yourself at music festivals and concerts',
    url: 'https://getfestiwise.com/music-festival-safety-tips-2025',
  },
};

const safetyCategories = [
  {
    category: 'Personal Safety',
    icon: '👤',
    tips: [
      'Stay hydrated - drink water regularly',
      'Eat proper meals, don\'t rely on alcohol',
      'Know your limits with substances',
      'Stay with your group, use buddy system',
      'Share your location with trusted friends',
      'Trust your instincts if something feels wrong',
      'Have an emergency contact plan',
      'Carry a whistle for emergencies'
    ]
  },
  {
    category: 'Health & Medical',
    icon: '🏥',
    tips: [
      'Bring a basic first aid kit',
      'Pack any personal medications',
      'Know where medical tents are located',
      'Recognize signs of heat exhaustion',
      'Watch for dehydration symptoms',
      'Protect your hearing with earplugs',
      'Wear sunscreen and reapply often',
      'Get enough sleep between festival days'
    ]
  },
  {
    category: 'Crowd Safety',
    icon: '👥',
    tips: [
      'Avoid overcrowded areas if uncomfortable',
      'Stay near exits in dense crowds',
      'Don\'t push or rush in crowds',
      'Help others who have fallen',
      'Move with the crowd, not against it',
      'Find higher ground if crowd gets intense',
      'Identify safe spaces and meeting points',
      'Leave if crowd feels unsafe'
    ]
  },
  {
    category: 'Security & Theft',
    icon: '🔒',
    tips: [
      'Use a money belt or hidden pocket',
      'Don\'t carry unnecessary valuables',
      'Keep copies of important documents',
      'Use lockers when available',
      'Don\'t leave belongings unattended',
      'Be aware of pickpocket tactics',
      'Secure your campsite properly',
      'Report suspicious activity to security'
    ]
  }
];

const emergencyPrep = [
  {
    category: 'Emergency Contacts',
    items: [
      'Local emergency services number',
      'Festival security contact',
      'Medical tent locations',
      'Emergency contact at home',
      'Hotel/accommodation contact',
      'Transportation company info',
      'Embassy contact (international festivals)',
      'Insurance company contact'
    ]
  },
  {
    category: 'Essential Information',
    items: [
      'Your full name and address',
      'Emergency contact name/number',
      'Medical conditions and allergies',
      'Current medications',
      'Blood type (if known)',
      'Insurance information',
      'Hotel/accommodation address',
      'Return travel information'
    ]
  }
];

const situationGuides = [
  {
    situation: 'Getting Separated from Friends',
    icon: '🔍',
    steps: [
      'Don\'t panic - stay calm and think clearly',
      'Go to your predetermined meeting spot',
      'Check your phone for messages/calls',
      'Ask festival staff for help if needed',
      'Stay in well-lit, populated areas',
      'Use festival apps or social media to reconnect',
      'Wait at the meeting point for agreed time',
      'Head to information booth if all else fails'
    ]
  },
  {
    situation: 'Feeling Overwhelmed/Anxious',
    icon: '😰',
    steps: [
      'Remove yourself from the crowd',
      'Find a quiet space to breathe deeply',
      'Sit down and drink water',
      'Call or text a trusted friend',
      'Use grounding techniques (5-4-3-2-1 method)',
      'Seek help from medical staff if needed',
      'Consider leaving early if necessary',
      'Don\'t be embarrassed to ask for help'
    ]
  },
  {
    situation: 'Someone is Too Intoxicated',
    icon: '🚨',
    steps: [
      'Stay with the person - don\'t leave them alone',
      'Get them to a safe, cool area',
      'Keep them awake and talking',
      'Give them water if conscious',
      'Put them in recovery position if unconscious',
      'Call for medical help immediately',
      'Don\'t try to "walk it off"',
      'Monitor breathing and pulse'
    ]
  },
  {
    situation: 'Severe Weather',
    icon: '⛈️',
    steps: [
      'Seek immediate shelter in designated areas',
      'Avoid metal structures and tall objects',
      'Stay away from water and wet areas',
      'Follow festival evacuation procedures',
      'Stay low if in open areas during storms',
      'Wait for all-clear from officials',
      'Check weather apps regularly',
      'Have a backup plan for severe weather'
    ]
  }
];

const preventionTips = [
  {
    title: 'Before You Go',
    tips: [
      'Research the festival venue and local area',
      'Check weather forecasts and pack accordingly',
      'Inform someone of your plans and return date',
      'Get travel insurance for international festivals',
      'Pack a comprehensive first aid kit',
      'Download offline maps and festival apps',
      'Charge all devices and bring portable chargers',
      'Read festival rules and prohibited items list'
    ]
  },
  {
    title: 'During the Festival',
    tips: [
      'Check in with friends regularly',
      'Stay aware of your surroundings',
      'Don\'t accept drinks from strangers',
      'Pace yourself with alcohol and substances',
      'Take breaks from crowds and noise',
      'Stay hydrated and eat regularly',
      'Keep important items secure',
      'Follow all festival rules and security guidelines'
    ]
  },
  {
    title: 'Common Sense Rules',
    tips: [
      'If it feels wrong, it probably is',
      'Don\'t be a hero - ask for help when needed',
      'Look out for others around you',
      'Respect festival staff and security',
      'Know your personal limits',
      'Have an exit strategy',
      'Stay sober enough to make good decisions',
      'Remember: festivals should be fun, not dangerous'
    ]
  }
];

const specificFestivalTypes = [
  {
    type: 'Electronic/Rave Festivals',
    icon: '🎧',
    risks: ['Loud music/hearing damage', 'Substance use issues', 'Dehydration from dancing'],
    tips: [
      'Bring high-quality earplugs',
      'Take regular breaks from dancing',
      'Be extra cautious with substances',
      'Stay hydrated - more than usual',
      'Wear comfortable, breathable clothing',
      'Know signs of heat stroke and exhaustion'
    ]
  },
  {
    type: 'Camping Festivals',
    icon: '🏕️',
    risks: ['Theft from tents', 'Weather exposure', 'Fire hazards'],
    tips: [
      'Lock or secure valuable items',
      'Camp near friends when possible',
      'Follow fire safety rules strictly',
      'Prepare for temperature changes',
      'Bring proper camping gear',
      'Know campground emergency procedures'
    ]
  },
  {
    type: 'International Festivals',
    icon: '🌍',
    risks: ['Language barriers', 'Different emergency systems', 'Cultural differences'],
    tips: [
      'Learn basic local phrases',
      'Know local emergency numbers',
      'Research local customs and laws',
      'Keep embassy contact information',
      'Have travel insurance',
      'Understand local healthcare system'
    ]
  }
];

export default function MusicFestivalSafetyTips2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
            Music Festival Safety Tips 2025
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto text-center leading-relaxed">
            Stay safe and have the best time at music festivals! Expert safety guide covering everything 
            from crowd safety to emergency preparedness at concerts, festivals, and raves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              🎯 Find Safe Festivals Near You →
            </Link>
          </div>
        </div>
      </section>

      {/* Core Safety Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🛡️ Essential Safety Categories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Master these four core areas to stay safe and enjoy your festival experience to the fullest.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {safetyCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-red-600">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Preparedness */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🚨 Emergency Preparedness
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Be prepared for emergencies with essential contacts and information ready at all times.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {emergencyPrep.map((prep, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <h3 className="text-2xl font-bold text-red-600 mb-6">{prep.category}</h3>
                <ul className="space-y-3">
                  {prep.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <span className="text-red-500 mr-3">📋</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Situation-Specific Guides */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            🎯 What to Do When...
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {situationGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{guide.icon}</span>
                  <h3 className="text-xl font-bold text-orange-600">{guide.situation}</h3>
                </div>
                <ol className="space-y-3">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start text-gray-700">
                      <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention Tips */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            🔒 Prevention is Key
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {preventionTips.map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
                <h3 className="text-2xl font-bold text-yellow-600 mb-6">{category.title}</h3>
                <ul className="space-y-4">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-gray-700">
                      <span className="text-yellow-500 mr-3 mt-1">⚡</span>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Type-Specific Safety */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎪 Safety by Festival Type
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Different festival types have unique risks - know what to expect and how to prepare.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {specificFestivalTypes.map((festType, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{festType.icon}</span>
                  <h3 className="text-xl font-bold text-red-600">{festType.type}</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-bold text-orange-600 mb-3">Key Risks:</h4>
                  <ul className="space-y-2">
                    {festType.risks.map((risk, riskIndex) => (
                      <li key={riskIndex} className="text-gray-700 text-sm flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-green-600 mb-3">Safety Tips:</h4>
                  <ul className="space-y-2">
                    {festType.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-gray-700 text-sm flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Resources CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl p-12 text-center border border-red-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Get Personalized Safety Tips</h2>
          <p className="text-xl text-gray-700 mb-8">
            Want safety advice specific to your planned festivals? Take our quiz to get customized safety recommendations!
          </p>
          <Link href="/quiz" className="bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg inline-block">
            Get My Safety Guide 🛡️
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Safe, Have Fun!</h2>
          <p className="text-xl text-white/90 mb-8">
            Find festivals that prioritize safety and get personalized recommendations based on your experience level!
          </p>
          <Link href="/quiz" className="bg-white text-red-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find Safe Festivals for Me 🎉
          </Link>
        </div>
      </section>
    </div>
  );
}
