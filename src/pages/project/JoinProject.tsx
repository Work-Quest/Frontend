import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { post } from '@/Api'
import { getAxiosApiMessage, getAxiosStatus } from '@/lib/apiError'
import { Button } from '@/components/ui/button'

type AcceptInviteResponse = {
  message?: string
  project_id?: string
  project_name?: string
  error?: string
}

export default function JoinProject() {
  const navigate = useNavigate()
  const params = useParams<{ token?: string }>()
  const [searchParams] = useSearchParams()

  const token = useMemo(() => {
    const fromQuery = (searchParams.get('token') || '').trim()
    const fromParam = (params.token || '').trim()
    return fromQuery || fromParam
  }, [params.token, searchParams])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Missing invite token.')
      return
    }

    let cancelled = false

    async function accept() {
      setLoading(true)
      setError(null)
      try {
        const res = await post<{ token: string }, AcceptInviteResponse>(
          '/api/project/invite/accept/',
          { token }
        )

        if (cancelled) return

        const projectId = (res?.project_id || '').trim()
        if (!projectId) {
          const msg = res?.error || 'Invite accepted, but missing project id.'
          setError(msg)
          toast.error(msg)
          return
        }

        toast.success(res?.message || 'Invite accepted!')
        navigate(`/project/${projectId}`, { replace: true })
      } catch (err: unknown) {
        if (cancelled) return

        const status = getAxiosStatus(err)
        const apiMsg = getAxiosApiMessage(err) || 'Failed to accept invite.'

        // Helpful defaults based on backend behavior.
        if (status === 401) {
          setError('Please log in to accept this invite.')
        } else if (status === 403) {
          setError(apiMsg || 'This invite token does not belong to your account.')
        } else if (status === 404) {
          setError(apiMsg || 'Invalid invite token.')
        } else {
          setError(apiMsg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    accept()
    return () => {
      cancelled = true
    }
  }, [navigate, token])

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border border-brown/10 rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="!text-red text-2xl font-bold">Join Project</h2>

        <div className="mt-3 text-lightBrown">
          {loading && <p>Accepting invite…</p>}
          {!loading && !error && <p>Redirecting…</p>}
          {error && (
            <div className="space-y-4">
              <p className="text-red font-semibold">{error}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="orange" onClick={() => navigate('/home')} type="button">
                  Go to Home
                </Button>
                <Button variant="cream" onClick={() => navigate('/login')} type="button">
                  Log in
                </Button>
              </div>
              <p className="text-sm">
                Tip: invites are tied to the invited email—make sure you’re logged in with the same
                account that received the invite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
