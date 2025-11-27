import React from 'react';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  blurred?: boolean;
};

export default function OptimizedImg({ blurred = true, style, loading = 'lazy', ...props }: ImgProps) {
  const baseStyle: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // keep any user-provided inline styles
    ...(style || {})
  };

  return (
    // Render attributes consistently on server and client to avoid hydration mismatches
    <img
      {...props}
      loading={loading}
      data-optimized={true}
      style={baseStyle}
    />
  );
}
