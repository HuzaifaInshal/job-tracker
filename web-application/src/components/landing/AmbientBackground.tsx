"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AmbientBackground() {
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slow drifting orbs
    gsap.to(orb1.current, {
      x: 60,
      y: 40,
      duration: 12,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    gsap.to(orb2.current, {
      x: -50,
      y: 60,
      duration: 15,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
    gsap.to(orb3.current, {
      x: 40,
      y: -50,
      duration: 18,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 4,
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Orbs */}
      <div
        ref={orb1}
        className="glow-orb w-[700px] h-[700px] bg-blue-600/7 top-[-100px] left-[15%]"
      />
      <div
        ref={orb2}
        className="glow-orb w-[500px] h-[500px] bg-indigo-600/6 top-[35%] right-[10%]"
      />
      <div
        ref={orb3}
        className="glow-orb w-[400px] h-[400px] bg-violet-600/5 bottom-[10%] left-[30%]"
      />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
