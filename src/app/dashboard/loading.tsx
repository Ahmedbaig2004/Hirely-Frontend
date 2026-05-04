export default function Loading() {
  return (
    <main
      className="lp-page min-h-screen p-8"
      style={{
        background: "transparent",
        color: "var(--lp-foreground)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 w-48 lp-surface-md rounded animate-pulse"></div>
          <div className="h-10 w-36 lp-surface-md rounded-lg animate-pulse"></div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-card p-6 rounded-xl"
            >
              <div className="h-6 w-3/4 lp-surface-hi rounded mb-4 animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 lp-surface-hi rounded animate-pulse"></div>
                <div className="h-4 w-24 lp-surface-hi rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
