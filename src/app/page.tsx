// src/app/page.tsx
import InterviewPanel from '@/components/InterviewPanel'

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1>HIRELY — Frontend</h1>
      <p>This is a demo showing the Interview Panel powered by Zustand.</p>

      <section style={{ marginTop: 24 }}>
        <InterviewPanel />
      </section>
    </main>
  )
}
