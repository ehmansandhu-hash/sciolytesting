'use client'

import { useActionState } from 'react'
import { loginLeader } from '../actions'
import { Lock } from 'lucide-react'

const initialState = {
    error: '',
}

export default function LoginPage() {
    // @ts-ignore - types can be tricky
    const [state, formAction] = useActionState(loginLeader, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Leader Access
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter the shared password to manage tests
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                suppressHydrationWarning
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            suppressHydrationWarning
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
