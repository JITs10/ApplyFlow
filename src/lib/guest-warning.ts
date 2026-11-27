import { toast } from 'sonner'

export const GUEST_RESTRICTION_ERROR = 'GUEST_MODE_RESTRICTED'

export function showGuestSignInWarning(customMessage?: string) {
  toast.warning('Sign In Required (Demo Guest Mode)', {
    description:
      customMessage ||
      'You are currently exploring in Demo Guest Mode. Sign in with GitHub to save applications, update stages, and track your real job search.',
    action: {
      label: 'Sign in with GitHub',
      onClick: () => {
        window.location.href = '/sign-in'
      },
    },
    duration: 8000,
  })
}
