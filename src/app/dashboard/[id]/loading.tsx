export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Back button skeleton */}
        <div className="h-6 w-32 bg-slate-200 rounded mb-6 animate-pulse"></div>
        
        {/* Hero card skeleton */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
            <div className="flex-1">
              <div className="h-8 w-48 bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-20 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
          
          <div className="mb-8">
            <div className="h-4 w-32 bg-slate-200 rounded mb-2 animate-pulse"></div>
            <div className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Transcript skeleton */}
        <div className="h-8 w-32 bg-slate-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="h-6 w-24 bg-slate-200 rounded mb-4 animate-pulse"></div>
              <div className="h-6 w-full bg-slate-200 rounded mb-4 animate-pulse"></div>
              <div className="h-20 bg-slate-100 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

