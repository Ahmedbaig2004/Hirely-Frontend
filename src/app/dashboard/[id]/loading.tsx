export default function Loading() {
  return (
    <main className="min-h-screen bg-[#080810] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="h-6 w-32 bg-white/[0.06] rounded mb-6 animate-pulse"></div>

        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
            <div className="flex-1">
              <div className="h-8 w-48 bg-white/[0.06] rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-64 bg-white/[0.06] rounded animate-pulse"></div>
            </div>
            <div className="h-20 w-48 bg-white/[0.06] rounded-xl animate-pulse"></div>
          </div>
          <div className="mb-8">
            <div className="h-4 w-32 bg-white/[0.06] rounded mb-2 animate-pulse"></div>
            <div className="h-24 bg-white/[0.04] rounded-lg animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-white/[0.04] rounded-xl animate-pulse"></div>
            <div className="h-48 bg-white/[0.04] rounded-xl animate-pulse"></div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="h-4 w-40 bg-white/[0.06] rounded mb-6 animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-20 bg-white/[0.06] rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-white/[0.06] rounded animate-pulse"></div>
                </div>
                <div className="h-2.5 bg-white/[0.06] rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8 w-32 bg-white/[0.06] rounded mb-6 animate-pulse"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 rounded-xl">
              <div className="h-6 w-24 bg-white/[0.06] rounded mb-4 animate-pulse"></div>
              <div className="h-6 w-full bg-white/[0.06] rounded mb-4 animate-pulse"></div>
              <div className="h-20 bg-white/[0.04] rounded-lg mb-4 animate-pulse"></div>
              <div className="h-4 w-full bg-white/[0.06] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
