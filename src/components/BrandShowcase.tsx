import { HeroWorldClassImage, CardWorldClassImage, AvatarWorldClassImage } from "@/components/WorldClassImage";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface BrandPreviewCardProps {
  title: string;
  description: string;
  imageUrl: string;
  badges: string[];
  variant?: 'default' | 'premium' | 'featured';
}

export function BrandPreviewCard({ 
  title, 
  description, 
  imageUrl, 
  badges, 
  variant = 'default' 
}: BrandPreviewCardProps) {
  const cardClass = variant === 'premium' 
    ? 'card card-premium' 
    : variant === 'featured' 
      ? 'card brand-glow' 
      : 'card';

  return (
    <div className={cardClass}>
      <div className="aspect-video overflow-hidden rounded-t-2xl">
        <CardWorldClassImage
          src={imageUrl}
          alt={title}
          width={400}
          height={250}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
          {badges.map((badge, index) => (
            <Badge key={index} variant="default" className="badge badge-primary">
              {badge}
            </Badge>
          ))}
        </div>        <h3 className="text-2xl font-semibold mb-3 text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex gap-3">
          <Button variant="primary" size="sm" className="btn btn-primary btn-sm">
            View Details
          </Button>
          <Button variant="secondary" size="sm" className="btn btn-secondary btn-sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BrandHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="display-xl brand-gradient-text mb-6">
              Discover Your Next 
              <br />
              Music Adventure
            </h1>
            
            <p className="text-lead mb-8 max-w-lg">
              Find the perfect festivals around the world with our comprehensive 
              guide featuring curated recommendations, insider tips, and real-time updates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="btn btn-primary btn-lg brand-glow"
              >
                Explore Festivals
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="btn btn-secondary btn-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden brand-glow">
              <HeroWorldClassImage
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
                alt="Music festival crowd enjoying live performance"
                width={600}
                height={450}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrandStats() {
  const stats = [
    { number: '2,500+', label: 'Festivals Worldwide' },
    { number: '150k+', label: 'Happy Travelers' },
    { number: '45', label: 'Countries Covered' },
    { number: '4.9★', label: 'User Rating' }
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold brand-gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandTestimonial() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <AvatarWorldClassImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              alt="Happy festival goer testimonial"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full mx-auto mb-6"
            />
          </div>
          
          <blockquote className="text-2xl lg:text-3xl font-medium text-gray-800 mb-6">
            "FestiWise transformed how I discover music festivals. The recommendations 
            are spot-on and the insider tips saved me hundreds of dollars!"
          </blockquote>
          
          <cite className="text-lg text-gray-600">
            Sarah Chen, Music Enthusiast
          </cite>
          
          <div className="flex justify-center mt-6">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}