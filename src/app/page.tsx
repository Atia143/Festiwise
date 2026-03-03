import SimpleHero from '@/components/SimpleHero';
import SimpleNewsletter from '@/components/SimpleNewsletter';
import SimpleFAQ from '@/components/SimpleFAQ';
import ConversionBanner from '@/components/ConversionBanner';
import ImprovedExitModal from '@/components/ImprovedExitModal';
import RealtimeSocialProof from '@/components/RealtimeSocialProof';
import InstantTestimonialsCarousel from '@/components/InstantTestimonialsCarousel';

export default function HomePage() {
  return (
    <>
      <ImprovedExitModal />
      <ConversionBanner variant="quiz" position="bottom" autoHide={30} />

      <SimpleHero />

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
