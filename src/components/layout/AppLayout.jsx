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
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '22px 26px',
          background: '#f0f7f0',
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.04' fill='%231a5c2a'%3E%3Cpath d='M50 10 C45 20 35 25 30 35 C25 45 28 55 35 60 C42 65 50 62 50 62 C50 62 58 65 65 60 C72 55 75 45 70 35 C65 25 55 20 50 10Z'/%3E%3Cpath d='M20 70 C18 65 15 60 18 55 C21 50 26 52 28 57 C30 62 28 68 25 70Z'/%3E%3Cpath d='M75 70 C73 65 70 60 73 55 C76 50 81 52 83 57 C85 62 83 68 80 70Z'/%3E%3Ccircle cx='50' cy='80' r='3'/%3E%3Ccircle cx='20' cy='30' r='2'/%3E%3Ccircle cx='80' cy='30' r='2'/%3E%3Cpath d='M10 85 Q15 75 20 85 Q25 75 30 85'/%3E%3Cpath d='M65 85 Q70 75 75 85 Q80 75 85 85'/%3E%3C/g%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%232d7a40' fill-opacity='0.03'%3E%3Cpath d='M30 5 C28 12 22 16 20 23 C18 30 21 36 26 39 C31 42 30 42 30 42 C30 42 29 42 34 39 C39 36 42 30 40 23 C38 16 32 12 30 5Z'/%3E%3Cpath d='M10 45 L10 55 M8 50 Q10 45 12 50'/%3E%3Cpath d='M50 45 L50 55 M48 50 Q50 45 52 50'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundSize: '200px 200px, 120px 120px',
          backgroundPosition: '0 0, 60px 60px',
        }}>
          <Outlet />
        </main>
      </div>
      <Toast message={toast.msg} visible={toast.visible} type={toast.type} />
    </div>
  )
}