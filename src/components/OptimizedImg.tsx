import React from 'react';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  blurred?: boolean;
};

export default function OptimizedImg({ blurred: _blurred = true, style, loading = 'lazy', alt = '', ...props }: ImgProps) {
  const baseStyle: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // keep any user-provided inline styles
    ...(style || {})
  };

  return (
    // Render attributes consistently on server and client to avoid hydration mismatches
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      loading={loading}
      data-optimized={true}
      style={baseStyle}
    />
  );
}
