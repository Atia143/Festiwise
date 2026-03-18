import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

export const metadata: Metadata = {
  title: 'Musikfestivals 2026 — Finde Dein Perfektes Festival',
  description: 'Entdecke die besten Musikfestivals 2026 weltweit. Kostenloser Quiz: 5 Fragen — und wir zeigen dir dein perfektes Festival nach Musikgeschmack, Budget und Reiseziel.',
  keywords: 'Musikfestivals 2026, beste Musikfestival Deutschland, Festival Europa, Musikfestival Sommer, Festival Finder',
  alternates: {
    canonical: 'https://getfestiwise.com/de',
    languages: {
      'en': 'https://getfestiwise.com',
      'es': 'https://getfestiwise.com/es',
      'de': 'https://getfestiwise.com/de',
      'fr': 'https://getfestiwise.com/fr',
    },
  },
  openGraph: {
    title: 'Musikfestivals 2026 — Finde Dein Perfektes Festival',
    description: 'Kostenloser Quiz: 5 Fragen für dein perfektes Musikfestival. 100+ Festivals weltweit.',
    locale: 'de_DE',
    alternateLocale: ['en_US', 'es_ES', 'fr_FR'],
  },
};

const GERMAN_FESTIVALS = ['rock_am_ring', 'rock_im_park', 'tomorrowland', 'montreux_jazz', 'roskilde', 'glastonbury'];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Persönlicher Quiz',
    body: 'Beantworte 5 kurze Fragen zu Musik, Budget und Reisedaten. Du bekommst sofort präzise Festival-Empfehlungen.',
  },
  {
    icon: '🌍',
    title: '100+ Festivals Weltweit',
    body: 'Von Rock am Ring in Deutschland bis Glastonbury in England — wir decken die besten Festivals aller Kontinente ab.',
  },
  {
    icon: '💸',
    title: 'Preise Vergleichen',
    body: 'Sieh die geschätzten Kosten jedes Festivals auf einen Blick. Filtere nach Budget und finde das beste Preis-Leistungs-Verhältnis.',
  },
  {
    icon: '📅',
    title: 'Kalender 2026',
    body: 'Alle Festivals nach Monat sortiert. Plane dein Festival-Jahr mit einem einzigen Blick.',
  },
];

const FAQS = [
  {
    q: 'Welche sind die besten Musikfestivals in Deutschland 2026?',
    a: 'Rock am Ring und Rock im Park (Juni, Nürburgring/Nürnberg) sind die größten Rock-Festivals Deutschlands. Für elektronische Musik empfehlen wir das Ruhr-in-Love und weitere Events. Nutze unseren Quiz für eine persönliche Empfehlung.',
  },
  {
    q: 'Wie funktioniert der Festival-Quiz?',
    a: 'Beantworte 5 Fragen zu deinem Lieblingsgenre, Budget, Vibe, bevorzugter Region und verfügbaren Daten. Der Algorithmus analysiert 100+ Festivals und zeigt dir deine Top-6-Matches.',
  },
  {
    q: 'Ist FestiWise kostenlos?',
    a: 'Ja, der Quiz und alle Empfehlungen sind vollständig kostenlos. Du musst kein Konto erstellen.',
  },
  {
    q: 'Kann ich nach Musikgenre filtern?',
    a: 'Ja. Nutze die Suchseite, um nach EDM, Rock, Hip-Hop, Jazz, Weltmusik und mehr zu filtern. Außerdem kannst du nach Land, Monat und Budget filtern.',
  },
];

export default function GermanPage() {
  const featured = GERMAN_FESTIVALS
    .map(id => (festivalsData as Festival[]).find(f => f.id === id))
    .filter(Boolean) as Festival[];

  return (
    <main lang="de" className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            100+ Festivals · Kostenlos · Ohne Registrierung
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Finde Dein Perfektes<br />
            <span className="text-yellow-300">Musikfestival 2026</span><br />
            in 2 Minuten
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Beantworte 5 kurze Fragen zu Musikgeschmack, Budget und Reisedaten. Wir zeigen dir die besten Festivals aus über 100 weltweiten Events — personalisiert für dich.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg shadow-xl hover:shadow-yellow-400/30 transition-all active:scale-95"
            >
              Quiz Starten — Kostenlos
            </Link>
            <Link
              href="/festivals"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold rounded-2xl text-lg transition-all"
            >
              Alle Festivals Erkunden
            </Link>
          </div>

          {/* Trust stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/70">
            <span><strong className="text-white text-lg font-black">50K+</strong><br />Nutzer dieses Jahr</span>
            <span><strong className="text-white text-lg font-black">100+</strong><br />Festivals weltweit</span>
            <span><strong className="text-white text-lg font-black">2 Min.</strong><br />bis zur Empfehlung</span>
          </div>
        </div>
      </section>

      {/* Featured Festivals */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Empfohlene Festivals 2026</h2>
        <p className="text-gray-500 mb-8">Eine Auswahl der besten Musikfestivals der Welt</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(f => (
            <Link
              key={f.id}
              href={`/festival/${f.id}`}
              className="group bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-2xl p-5 transition-all"
            >
              <h3 className="font-bold text-gray-900 group-hover:text-purple-700 mb-1">{f.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{f.city}, {f.country} · {f.months.slice(0,2).join(', ')}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {f.genres.slice(0, 3).map(g => (
                  <span key={g} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">{g}</span>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-700">${f.estimated_cost_usd.min}–${f.estimated_cost_usd.max}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/search" className="text-purple-600 font-semibold hover:text-purple-700 text-sm">
            Alle 100+ Festivals ansehen →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">Warum FestiWise?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-gray-900 mb-8">Häufig gestellte Fragen</h2>
        <div className="space-y-4">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 text-center px-4">
        <h2 className="text-3xl font-black mb-4">Bereit, dein Festival zu finden?</h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">Der Quiz dauert 2 Minuten. Ohne Registrierung. Ohne Spam.</p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg shadow-xl transition-all active:scale-95"
        >
          Jetzt Starten — Kostenlos
        </Link>
      </section>

      {/* Language switcher */}
      <div className="text-center py-6 text-sm text-gray-400 space-x-4">
        <Link href="/" className="hover:text-gray-600">English</Link>
        <Link href="/es" className="hover:text-gray-600">Español</Link>
        <span className="text-purple-600 font-semibold">Deutsch</span>
        <Link href="/fr" className="hover:text-gray-600">Français</Link>
      </div>
    </main>
  );
}
