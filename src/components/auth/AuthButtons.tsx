'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface GuestSignInButtonProps extends ButtonProps {
  callbackUrl?: string
}

export function GuestSignInButton({
  children,
  callbackUrl = '/dashboard',
  disabled,
  ...props
}: GuestSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleGuestSignIn = async () => {
    try {
      setLoading(true)
      await signIn('guest', { callbackUrl })
    } catch (err) {
      console.error('Guest sign-in failed:', err)
      setLoading(false)
    }
  }

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={handleGuestSignIn}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : (
        children || (
          <>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Guest Demo</span>
          </>
        )
      )}
    </Button>
  )
}

interface GitHubSignInButtonProps extends ButtonProps {
  callbackUrl?: string
}

export function GitHubSignInButton({
  children,
  callbackUrl = '/dashboard',
  disabled,
  ...props
}: GitHubSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true)
      await signIn('github', { callbackUrl })
    } catch (err) {
      console.error('GitHub sign-in failed:', err)
      setLoading(false)
    }
  }

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={handleGitHubSignIn}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        children
      )}
    </Button>
  )
}
