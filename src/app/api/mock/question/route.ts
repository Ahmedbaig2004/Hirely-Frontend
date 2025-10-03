// src/app/api/mock/question/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    id: 'mock-q-1',
    text: 'Tell us about your final year project and your role in it.'
  })
}
