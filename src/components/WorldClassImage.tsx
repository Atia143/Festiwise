'use client';

import { useState, useRef, useEffect, CSSProperties } from 'react';
import Image, { ImageProps } from 'next/image';

interface WorldClassImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  priority?: boolean;
  className?: string;
  blurDataURL?: string;
  aspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function WorldClassImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  blurDataURL,
  aspectRatio,
  onLoad,
  onError,
  fetchPriority = 'auto',
  ...props
}: WorldClassImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);
  const [imageMetrics, setImageMetrics] = useState<{
    loadTime?: number;
    renderTime?: number;
  }>({});

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    setImageMetrics(prev => ({ ...prev, loadTime: startTime }));
  }, []);

  // Intersection Observer for lazy loading with root margin optimization
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Optimized root margin for better UX
        rootMargin: '100px 0px', // Load images when they're 100px away from viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  // Handle image load with performance metrics
  const handleLoad = () => {
    const loadCompleteTime = performance.now();
    const startTime = imageMetrics.loadTime || 0;
    const loadDuration = loadCompleteTime - startTime;
    
    setIsLoaded(true);
    setImageMetrics(prev => ({ 
      ...prev, 
      renderTime: loadDuration 
    }));
    
    // Report to analytics if load time is slow
    if (loadDuration > 2000) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'slow_image_load', {
          event_category: 'Performance',
          event_label: src.toString(),
          value: Math.round(loadDuration)
        });
      }
    }
    
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    
    // Report image load error to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'image_load_error', {
        event_category: 'Performance',
        event_label: src.toString()
      });
    }
    
    onError?.();
  };

  // Generate optimized blur placeholder
  const generateBlurDataURL = (): string => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a minimal gradient blur placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiBzdG9wLW9wYWNpdHk9IjAuOCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2U1ZTdlYiIgc3RvcC1vcGFjaXR5PSIwLjYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDFkNWRiIiBzdG9wLW9wYWNpdHk9IjAuNCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+';
  };

  // Container styles for preventing layout shift
  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio && {
      aspectRatio: aspectRatio
    }),
    ...(width && height && !aspectRatio && {
      aspectRatio: `${width} / ${height}`
    })
  };

  // Error fallback with minimal layout shift
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
        style={containerStyle}
      >
        <div className="text-center text-gray-400">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative ${className}`}
      style={containerStyle}
    >
      {/* Loading placeholder with improved blur */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse"
          style={{
            backgroundImage: `url(${generateBlurDataURL()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.05)',
          }}
        />
      )}

      {/* Actual optimized image */}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          quality={priority ? 95 : 85} // Higher quality for priority images
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          sizes={
            priority 
              ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
          }
          // Add fetchpriority for supporting browsers
          {...(fetchPriority !== 'auto' && { fetchPriority })}
          {...props}
        />
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && isLoaded && imageMetrics.renderTime && (
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded opacity-75 ${
          imageMetrics.renderTime > 2000 ? 'bg-red-500 text-white' : 
          imageMetrics.renderTime > 1000 ? 'bg-yellow-500 text-black' : 
          'bg-green-500 text-white'
        }`}>
          {Math.round(imageMetrics.renderTime)}ms
        </div>
      )}
    </div>
  );
}

// Specialized components for different use cases

// Hero image component for LCP optimization
export function HeroWorldClassImage(props: WorldClassImageProps) {
  return (
    <WorldClassImage
      {...props}
      priority={true}
      fetchPriority="high"
      quality={95}
      sizes="100vw"
    />
  );
}

// Card image component for consistent aspect ratios
export function CardWorldClassImage(props: WorldClassImageProps) {
  return (
    <WorldClassImage
      {...props}
      aspectRatio="16/9"
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      fetchPriority="low"
    />
  );
}

// Avatar/profile image component
export function AvatarWorldClassImage(props: WorldClassImageProps) {
  return (
    <WorldClassImage
      {...props}
      aspectRatio="1/1"
      quality={90}
      sizes="(max-width: 768px) 60px, 80px"
    />
  );
}

// Thumbnail image component for minimal bandwidth
export function ThumbnailWorldClassImage(props: WorldClassImageProps) {
  return (
    <WorldClassImage
      {...props}
      quality={75}
      sizes="(max-width: 768px) 150px, 200px"
      fetchPriority="low"
    />
  );
}