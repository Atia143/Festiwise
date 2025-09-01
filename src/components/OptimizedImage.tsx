// components/OptimizedImage.tsx - Zero CLS Image Component
'use client';

import { useState, useRef, useEffect, CSSProperties } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  priority?: boolean;
  className?: string;
  blurDataURL?: string;
  aspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
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
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
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
        rootMargin: '50px 0px',
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

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder
  const generateBlurDataURL = (): string => {
    if (blurDataURL) return blurDataURL;
    
    // Simple gradient blur placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjNmNGY2O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlNWU3ZWI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+';
  };

  // Container styles for aspect ratio
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

  // Error fallback
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
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{
            backgroundImage: `url(${generateBlurDataURL()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Actual image */}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          quality={90}
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
          {...props}
        />
      )}

      {/* Success indicator for development */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-75">
          ✓ Loaded
        </div>
      )}
    </div>
  );
}

// Hero image component for LCP optimization
export function HeroOptimizedImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      quality={95}
      sizes="100vw"
    />
  );
}

// Card image component for consistent aspect ratios
export function CardOptimizedImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      aspectRatio="16/9"
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Avatar/profile image component
export function AvatarOptimizedImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      aspectRatio="1/1"
      quality={90}
      sizes="(max-width: 768px) 60px, 80px"
    />
  );
}
