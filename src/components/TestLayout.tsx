'use client';

interface TestLayoutProps {
  children: React.ReactNode;
}

export default function TestLayout({ children }: TestLayoutProps) {
  return (
    <div className="min-h-screen">
      <h1>Test Layout</h1>
      {children}
    </div>
  );
}
