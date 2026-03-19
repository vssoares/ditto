import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { storage } from '../utils/storage'

export default function RequireAuth() {
  const location = useLocation()
  const authed = storage.isAuthenticated()

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

