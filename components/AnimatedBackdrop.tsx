'use client';

export function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-black to-black" />
      <div
        className="absolute h-[90vw] w-[90vw] rounded-full animate-drift-1"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,213,90,0.18), rgba(255,213,90,0) 60%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute h-[80vw] w-[80vw] rounded-full animate-drift-2"
        style={{
          right: '-20vw',
          top: '30vh',
          background:
            'radial-gradient(circle at center, rgba(200,150,30,0.14), rgba(0,0,0,0) 60%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}
