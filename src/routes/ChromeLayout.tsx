import { Outlet } from 'react-router-dom'
import Chrome from '../components/Chrome'

export default function ChromeLayout() {
  return (
    <Chrome>
      <Outlet />
    </Chrome>
  )
}

