'use client'

import { useActionState } from 'react'
import { startStudentSession } from './actions'
import { Beaker } from 'lucide-react'

const initialState = {
  error: '',
}

export default function Home() {
  // @ts-ignore
  const [state, formAction] = useActionState(startStudentSession, initialState)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md space-y-8 z-10 relative">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Beaker className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            WSHS SciOly Portal
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enter your name to begin testing
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-input bg-background/50 backdrop-blur-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-lg shadow-sm transition-all duration-200"
              placeholder="Enter your full name"
              suppressHydrationWarning
            />
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-md">
              {state.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              suppressHydrationWarning
            >
              Start Session
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-4 mt-8">
          <a href="/library" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
            <span className="bg-primary/10 p-1.5 rounded-full">📚</span>
            View Past Test Library
          </a>

          <a href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Leader Login
          </a>
        </div>
      </div>
    </div>
  )
}
