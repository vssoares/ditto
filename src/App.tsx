import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import AppLayout from './components/AppLayout'
import AuthRedirect from './routes/AuthRedirect'
import RequireAuth from './routes/RequireAuth'
import ChromeLayout from './routes/ChromeLayout'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route element={<ChromeLayout />}>
        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/app/*" element={<AppLayout />} />
        </Route>

        <Route path="/" element={<Navigate to="/app/generate" replace />} />
        <Route path="*" element={<Navigate to="/app/generate" replace />} />
      </Route>
    </Routes>
  )
}
