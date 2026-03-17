import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { Home } from 'lucide-react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
          }) => void
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: string
              size?: string
              width?: string
              text?: string
              shape?: string
              locale?: string
            },
          ) => void
        }
      }
    }
  }
}

export default function LoginPage() {
  const { signInWithGoogle, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleGoogleCallback = useCallback(
    async (response: { credential: string }) => {
      setIsLoading(true)
      setError(null)
      try {
        await signInWithGoogle(response.credential)
        navigate('/dashboard', { replace: true })
      } catch {
        setError('Falha ao autenticar com Google. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    },
    [signInWithGoogle, navigate],
  )

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      })
      const buttonDiv = document.getElementById('google-signin-button')
      if (buttonDiv) {
        window.google?.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          locale: 'pt-BR',
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [handleGoogleCallback])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Home size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Casa MCMV</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Controle de gastos da construcao</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-2">Bem-vindo!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Faca login para acessar o sistema</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-3 mb-4">
              <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-500">Autenticando...</span>
            </div>
          )}

          {GOOGLE_CLIENT_ID ? (
            <div id="google-signin-button" className="flex justify-center" />
          ) : (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Google Client ID nao configurado. Defina VITE_GOOGLE_CLIENT_ID no .env
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
          Seus dados sao armazenados de forma segura no servidor
        </p>
      </div>
    </div>
  )
}
