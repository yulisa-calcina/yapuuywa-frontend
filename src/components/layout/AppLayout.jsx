import { Outlet, useLocation } from 'react-router-dom'
import Topnav from './Topnav'
import Sidebar from './Sidebar'
import { Toast } from '../ui/index'
import { useToast, useAlertas } from '../../hooks/index'

export default function AppLayout() {
  const location = useLocation()
  const { toast } = useToast()
  const { alertas } = useAlertas()

  const badges = { alertas: alertas.filter(a=>a.tipo==='vacuna').length, insumos: alertas.filter(a=>a.tipo==='stock').length }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Topnav activePath={location.pathname} alertCount={alertas.length} />
      <div style={{ display:'flex', flex:1, minHeight:0 }}>
        <Sidebar badges={badges} />
        <main style={{ flex:1, background:'#f7f9f7', overflowY:'auto', padding:'22px 26px' }}>
          <Outlet />
        </main>
      </div>
      <Toast message={toast.msg} visible={toast.visible} type={toast.type} />
    </div>
  )
}
