// Simple dictionary for i18n scaffold
export const dictionary = {
  en: {
    hero: {
      title: "Find Your Perfect Music Festival",
      subtitle: "Discover music festivals worldwide that match your preferences",
      cta: "Find My Festival",
      ctaSubtext: "2 min quiz - No login needed"
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Find your perfect festival match in 3 simple steps",
      steps: [
        {
          title: "Tell us your vibe",
          description: "Share your music taste, budget, and travel preferences in our 2-minute quiz"
        },
        {
          title: "Get ranked matches", 
          description: "We match by genre affinity, budget range, and travel‑time tolerance"
        },
        {
          title: "Book with confidence",
          description: "We only link to official ticket pages. No extra fees"
        }
      ]
    },
    festivalExplorer: {
      title: "Festival Marketplace",
      subtitle: "Discover extraordinary music festivals from around the globe. Advanced search, intelligent filtering, and personalized recommendations await.",
      cta: "Find My Festival (2 min) — No login needed",
      dataSource: "Data sources: official festival sites"
    },
    newsletter: {
      title: "Never Miss Epic Festivals Again",
      subtitle: "Get personalized festival picks and new festival discoveries delivered to your inbox.",
      emailPlaceholder: "Enter your email",
      namePlaceholder: "Your name (optional)",
      submitButton: "Get Free Festival Intel",
      privacy: "By subscribing, you agree to our Privacy Policy",
      successMessage: "🎉 Welcome aboard! Your first festival recommendations are heading to your inbox.",
      errorMessage: "Oops! Please try again or contact us if the issue persists."
    }
  }
};

export type Dictionary = typeof dictionary.en;
export type Language = keyof typeof dictionary;
