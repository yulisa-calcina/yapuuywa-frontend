import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout      from './components/layout/AppLayout'
import Login          from './pages/auth/Login'
import Dashboard      from './pages/dashboard/Dashboard'
import GanadoList     from './pages/ganado/GanadoList'
import Sanitario      from './pages/sanitario/Sanitario'
import InsumoList     from './pages/insumos/InsumoList'
import PersonalList   from './pages/personal/PersonalList'
import FinanzasPage   from './pages/finanzas/Finanzas'
import UsuarioList    from './pages/usuarios/UsuarioList'
import ReportesPage   from './pages/reportes/Reportes'
import ParcelaList    from './pages/parcelas/ParcelaList'
import ProduccionPage from './pages/produccion/Produccion'
import CultivosPage   from './pages/cultivos/Cultivos'
import { Alertas } from './pages/Placeholders'

function PrivateRoute({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index           element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="ganado"     element={<GanadoList />} />
        <Route path="sanitario"  element={<Sanitario />} />
        <Route path="cultivos"   element={<CultivosPage />} />
        <Route path="parcelas"   element={<ParcelaList />} />
        <Route path="insumos"    element={<InsumoList />} />
        <Route path="produccion" element={<ProduccionPage />} />
        <Route path="personal"   element={<PersonalList />} />
        <Route path="finanzas"   element={<FinanzasPage />} />
        <Route path="reportes"   element={<ReportesPage />} />
        <Route path="usuarios"   element={<UsuarioList />} />
        <Route path="alertas"    element={<Alertas />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}