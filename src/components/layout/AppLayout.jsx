import { Outlet, useLocation } from 'react-router-dom'
import Topnav from './Topnav'
import Sidebar from './Sidebar'
import { Toast } from '../ui/index'
import { useToast, useAlertas } from '../../hooks/index'

export default function AppLayout() {
  const location = useLocation()
  const { toast } = useToast()
  const { alertas } = useAlertas()

  const badges = {
    alertas: alertas.filter(a => a.tipo === 'vacuna').length,
    insumos: alertas.filter(a => a.tipo === 'stock').length
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Topnav activePath={location.pathname} alertCount={alertas.length} />
      <div style={{ display:'flex', flex:1, minHeight:0 }}>
        <Sidebar badges={badges} />
        <main style={{
          flex: 1,
          background: '#f0f7f0',
          overflowY: 'auto',
          padding: '22px 26px',
          backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=30')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}>
          <div style={{
            backdropFilter: 'blur(0px)',
            minHeight: '100%',
          }}>
            <Outlet />
          </div>
        </main>
      </div>
      <Toast message={toast.msg} visible={toast.visible} type={toast.type} />
    </div>
  )
}