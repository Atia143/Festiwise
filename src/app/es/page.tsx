import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

export const metadata: Metadata = {
  title: 'Festivales de Música 2026 — Encuentra Tu Festival Perfecto',
  description: 'Descubre los mejores festivales de música del mundo 2026. Quiz gratuito: responde 5 preguntas y encuentra tu festival ideal según tu gusto, presupuesto y fechas.',
  keywords: 'festivales de música 2026, festival de música España, festival de música Europa, mejor festival música, buscar festival música',
  alternates: {
    canonical: 'https://getfestiwise.com/es',
    languages: {
      'en': 'https://getfestiwise.com',
      'es': 'https://getfestiwise.com/es',
      'de': 'https://getfestiwise.com/de',
      'fr': 'https://getfestiwise.com/fr',
    },
  },
  openGraph: {
    title: 'Festivales de Música 2026 — Encuentra Tu Festival Perfecto',
    description: 'Quiz gratuito: 5 preguntas para encontrar tu festival de música ideal. 100+ festivales de todo el mundo.',
    locale: 'es_ES',
    alternateLocale: ['en_US', 'de_DE', 'fr_FR'],
  },
};

const SPANISH_FESTIVALS = ['primavera', 'sonar', 'benicassim', 'tomorrowland', 'glastonbury', 'exit_festival'];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Quiz Personalizado',
    body: 'Responde 5 preguntas rápidas sobre tu música, presupuesto y fechas. Obtienes recomendaciones precisas al instante.',
  },
  {
    icon: '🌍',
    title: '100+ Festivales Mundiales',
    body: 'Desde Glastonbury en Reino Unido hasta Primavera Sound en Barcelona — cubrimos los mejores festivales de todos los continentes.',
  },
  {
    icon: '💸',
    title: 'Compara Precios',
    body: 'Ve el coste estimado de cada festival antes de decidir. Filtra por presupuesto y encuentra la mejor opción para ti.',
  },
  {
    icon: '📅',
    title: 'Calendario 2026',
    body: 'Todos los festivales organizados por mes. Planifica tu año festivalero con un vistazo.',
  },
];

const FAQS = [
  {
    q: '¿Cuáles son los mejores festivales de música en España en 2026?',
    a: 'Primavera Sound (Barcelona, junio) y Sónar (Barcelona, junio) son los más internacionales. Benicàssim FIB es ideal para rock e indie en agosto. Usa nuestro quiz para encontrar el que mejor se adapta a ti.',
  },
  {
    q: '¿Cómo funciona el quiz de festivales?',
    a: 'Responde 5 preguntas sobre tu género musical favorito, presupuesto, vibes, región preferida y fechas disponibles. El algoritmo analiza 100+ festivales y te muestra tu top 6 personalizado.',
  },
  {
    q: '¿Es gratuito FestiWise?',
    a: 'Sí, el quiz y todas las recomendaciones son completamente gratuitos. No necesitas crear una cuenta.',
  },
  {
    q: '¿Puedo buscar festivales por género musical?',
    a: 'Sí. Usa la página de búsqueda para filtrar por EDM, Rock, Hip-Hop, Jazz, World Music y más. También puedes filtrar por país, mes y presupuesto.',
  },
];

export default function SpanishPage() {
  const featured = SPANISH_FESTIVALS
    .map(id => (festivalsData as Festival[]).find(f => f.id === id))
    .filter(Boolean) as Festival[];

  return (
    <main lang="es" className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            100+ festivales · Gratis · Sin registro
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Encuentra Tu Festival<br />
            <span className="text-yellow-300">de Música Perfecto</span><br />
            en 2 Minutos
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Responde 5 preguntas rápidas sobre tu música, presupuesto y fechas. Te mostramos los festivales que mejor encajan contigo de entre más de 100 eventos mundiales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg shadow-xl hover:shadow-yellow-400/30 transition-all active:scale-95"
            >
              Comenzar el Quiz — Gratis
            </Link>
            <Link
              href="/festivals"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold rounded-2xl text-lg transition-all"
            >
              Ver Todos los Festivales
            </Link>
          </div>

          {/* Trust stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/70">
            <span><strong className="text-white text-lg font-black">50K+</strong><br />usuarios este año</span>
            <span><strong className="text-white text-lg font-black">100+</strong><br />festivales mundiales</span>
            <span><strong className="text-white text-lg font-black">2 min</strong><br />para tu recomendación</span>
          </div>
        </div>
      </section>

      {/* Featured Festivals */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Festivales Destacados 2026</h2>
        <p className="text-gray-500 mb-8">Una selección de los mejores festivales del mundo</p>
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
            Ver los 100+ festivales →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">Por qué usar FestiWise</h2>
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
        <h2 className="text-2xl font-black text-gray-900 mb-8">Preguntas Frecuentes</h2>
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
        <h2 className="text-3xl font-black mb-4">¿Listo para encontrar tu festival?</h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">El quiz dura 2 minutos. Sin registro. Sin spam.</p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg shadow-xl transition-all active:scale-95"
        >
          Comenzar Ahora — Gratis
        </Link>
      </section>

      {/* Language switcher */}
      <div className="text-center py-6 text-sm text-gray-400 space-x-4">
        <Link href="/" className="hover:text-gray-600">English</Link>
        <span className="text-purple-600 font-semibold">Español</span>
        <Link href="/de" className="hover:text-gray-600">Deutsch</Link>
        <Link href="/fr" className="hover:text-gray-600">Français</Link>
      </div>
    </main>
  );
}
