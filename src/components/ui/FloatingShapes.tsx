export default function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -left-1/4 top-0 h-[min(520px,50vw)] w-[min(520px,50vw)] rounded-full opacity-[0.35]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      <div
        className="absolute -right-1/4 bottom-0 h-[min(520px,55vw)] w-[min(520px,55vw)] rounded-full opacity-[0.28]"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
          filter: "blur(52px)",
        }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-[min(360px,40vw)] w-[min(360px,40vw)] -translate-y-1/2 rounded-full opacity-[0.2]"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 68%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
