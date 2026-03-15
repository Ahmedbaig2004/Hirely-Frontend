"use client";

export function MeshGradient() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Violet orb — top-left */}
      <div
        className="absolute rounded-full opacity-30 blur-[120px]"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)",
          animation: "meshFloat1 18s ease-in-out infinite",
        }}
      />
      {/* Cyan orb — bottom-right */}
      <div
        className="absolute rounded-full opacity-20 blur-[140px]"
        style={{
          width: 500,
          height: 500,
          bottom: "-5%",
          right: "-5%",
          background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)",
          animation: "meshFloat2 22s ease-in-out infinite",
        }}
      />
      {/* Indigo orb — center */}
      <div
        className="absolute rounded-full opacity-20 blur-[160px]"
        style={{
          width: 700,
          height: 700,
          bottom: "10%",
          left: "30%",
          background: "radial-gradient(circle, #4338CA 0%, transparent 70%)",
          animation: "meshFloat3 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
