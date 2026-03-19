import { Navigate, Outlet } from 'react-router-dom'
import { storage } from '../utils/storage'

export default function AuthRedirect() {
  const authed = storage.isAuthenticated()
  if (authed) return <Navigate to="/app/generate" replace />
  return <Outlet />
}

