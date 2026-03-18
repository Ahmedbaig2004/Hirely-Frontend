export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 w-48 bg-surface-container rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-surface-container rounded-lg animate-pulse"></div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container p-6 rounded-xl border border-outline-variant"
            >
              <div className="h-6 w-3/4 bg-surface-container-high rounded mb-4 animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-surface-container-high rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
