import SimpleHero from '@/components/SimpleHero';
import SimpleNewsletter from '@/components/SimpleNewsletter';
import SimpleFAQ from '@/components/SimpleFAQ';
import ImprovedExitModal from '@/components/ImprovedExitModal';
import RealtimeSocialProof from '@/components/RealtimeSocialProof';
import ForYouSection from '@/components/ForYouSection';
import LiveRadarSection from '@/components/LiveRadarSection';
import FeaturedFestivalsSection from '@/components/FeaturedFestivalsSection';
import HowItWorks from '@/components/HowItWorks';
import CompareShowcase from '@/components/CompareShowcase';
import CityExplorer from '@/components/CityExplorer';

export default function HomePage() {
  return (
    <>
      <ImprovedExitModal />

      <SimpleHero />
      <HowItWorks />
      <FeaturedFestivalsSection />
      <LiveRadarSection />
      <ForYouSection />
      <CompareShowcase />
      <CityExplorer />

      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <RealtimeSocialProof />
        </div>
      </section>

      <SimpleNewsletter />
      <SimpleFAQ />
    </>
  );
}
