import { useEffect, useState } from "react";

export default function Loader({ onComplete }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in animation
    setOpacity(1);

    // Complete after 2 seconds with fade out
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 750);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 flex items-center justify-center z-50 transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center gap-12">
        {/* Logo with breathing animation */}
        <div className="relative">
          <div className="text-7xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 animate-pulse">
            VOXAIDE
          </div>

          {/* Glowing orbs */}
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-slate-400/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-slate-500/15 rounded-full blur-3xl animate-pulse delay-75" />
        </div>

        {/* Animated dots */}
        <div className="flex gap-3">
          <div className="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
