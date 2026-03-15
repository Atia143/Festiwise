import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

export const metadata: Metadata = {
  title: 'Festivals de Musique 2026 — Trouve Ton Festival Idéal | FestiWise',
  description: 'Découvre les meilleurs festivals de musique 2026 dans le monde. Quiz gratuit : 5 questions pour trouver ton festival parfait selon ton style, budget et disponibilités.',
  keywords: 'festivals de musique 2026, festival de musique France, meilleur festival musique Europe, chercher festival musique, festival été 2026',
  alternates: {
    canonical: 'https://getfestiwise.com/fr',
    languages: {
      'en': 'https://getfestiwise.com',
      'es': 'https://getfestiwise.com/es',
      'de': 'https://getfestiwise.com/de',
      'fr': 'https://getfestiwise.com/fr',
    },
  },
  openGraph: {
    title: 'Festivals de Musique 2026 — Trouve Ton Festival Idéal',
    description: 'Quiz gratuit : 5 questions pour ton festival de musique parfait. 100+ festivals dans le monde entier.',
    locale: 'fr_FR',
    alternateLocale: ['en_US', 'es_ES', 'de_DE'],
  },
};

const FRENCH_FESTIVALS = ['montreux_jazz', 'glastonbury', 'primavera', 'tomorrowland', 'roskilde', 'sonar'];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Quiz Personnalisé',
    body: 'Réponds à 5 questions rapides sur ta musique, ton budget et tes dates. Tu obtiens des recommandations précises en quelques secondes.',
  },
  {
    icon: '🌍',
    title: '100+ Festivals Mondiaux',
    body: 'De Glastonbury en Angleterre au Montreux Jazz en Suisse — on couvre les meilleurs festivals de tous les continents.',
  },
  {
    icon: '💸',
    title: 'Compare les Prix',
    body: 'Vois le coût estimé de chaque festival avant de décider. Filtre par budget et trouve le meilleur rapport qualité-prix.',
  },
  {
    icon: '📅',
    title: 'Calendrier 2026',
    body: 'Tous les festivals organisés par mois. Planifie ton année festival d\'un seul regard.',
  },
];

const FAQS = [
  {
    q: 'Quels sont les meilleurs festivals de musique en France en 2026 ?',
    a: 'Le festival Hellfest (Clisson, juin) est l\'un des plus grands festivals de metal et rock en Europe. Pour l\'électro, Electrobeach et les festivals d\'été de la Côte d\'Azur sont incontournables. Utilise notre quiz pour trouver ce qui te convient.',
  },
  {
    q: 'Comment fonctionne le quiz de festivals ?',
    a: 'Réponds à 5 questions sur ton genre musical préféré, ton budget, ton vibe, ta région préférée et tes dates disponibles. L\'algorithme analyse 100+ festivals et t\'affiche ton top 6 personnalisé.',
  },
  {
    q: 'FestiWise est-il gratuit ?',
    a: 'Oui, le quiz et toutes les recommandations sont entièrement gratuits. Aucun compte nécessaire.',
  },
  {
    q: 'Puis-je rechercher des festivals par genre musical ?',
    a: 'Oui. Utilise la page de recherche pour filtrer par EDM, Rock, Hip-Hop, Jazz, World Music et plus. Tu peux aussi filtrer par pays, mois et budget.',
  },
];

export default function FrenchPage() {
  const featured = FRENCH_FESTIVALS
    .map(id => (festivalsData as Festival[]).find(f => f.id === id))
    .filter(Boolean) as Festival[];

  return (
    <main lang="fr" className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            100+ festivals · Gratuit · Sans inscription
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Trouve Ton Festival<br />
            <span className="text-yellow-300">de Musique Parfait</span><br />
            en 2 Minutes
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Réponds à 5 questions rapides sur ta musique, ton budget et tes dates. On te montre les festivals qui te correspondent parmi plus de 100 événements mondiaux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg shadow-xl hover:shadow-yellow-400/30 transition-all active:scale-95"
            >
              Commencer le Quiz — Gratuit
            </Link>
            <Link
              href="/festivals"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold rounded-2xl text-lg transition-all"
            >
              Voir Tous les Festivals
            </Link>
          </div>

          {/* Trust stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/70">
            <span><strong className="text-white text-lg font-black">50K+</strong><br />utilisateurs cette année</span>
            <span><strong className="text-white text-lg font-black">100+</strong><br />festivals mondiaux</span>
            <span><strong className="text-white text-lg font-black">2 min</strong><br />pour ta recommandation</span>
          </div>
        </div>
      </section>

      {/* Featured Festivals */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Festivals Incontournables 2026</h2>
        <p className="text-gray-500 mb-8">Une sélection des meilleurs festivals de musique au monde</p>
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
            Voir les 100+ festivals →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">Pourquoi utiliser FestiWise ?</h2>
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
        <h2 className="text-2xl font-black text-gray-900 mb-8">Questions Fréquentes</h2>
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
        <h2 className="text-3xl font-black mb-4">Prêt(e) à trouver ton festival ?</h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">Le quiz dure 2 minutes. Sans inscription. Sans spam.</p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg shadow-xl transition-all active:scale-95"
        >
          Commencer Maintenant — Gratuit
        </Link>
      </section>

      {/* Language switcher */}
      <div className="text-center py-6 text-sm text-gray-400 space-x-4">
        <Link href="/" className="hover:text-gray-600">English</Link>
        <Link href="/es" className="hover:text-gray-600">Español</Link>
        <Link href="/de" className="hover:text-gray-600">Deutsch</Link>
        <span className="text-purple-600 font-semibold">Français</span>
      </div>
    </main>
  );
}
