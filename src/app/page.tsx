import SimpleHero from '@/components/SimpleHero';
import SimpleNewsletter from '@/components/SimpleNewsletter';
import SimpleFAQ from '@/components/SimpleFAQ';
import ImprovedExitModal from '@/components/ImprovedExitModal';
import RealtimeSocialProof from '@/components/RealtimeSocialProof';
import InstantTestimonialsCarousel from '@/components/InstantTestimonialsCarousel';
import ForYouSection from '@/components/ForYouSection';
import LiveRadarSection from '@/components/LiveRadarSection';

export default function HomePage() {
  return (
    <>
      <ImprovedExitModal />

      <SimpleHero />
      <LiveRadarSection />
      <ForYouSection />

      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <RealtimeSocialProof />
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <InstantTestimonialsCarousel />
        </div>
      </section>

      <SimpleNewsletter />
      <SimpleFAQ />
    </>
  );
}
