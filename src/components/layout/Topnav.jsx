import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label:'Panel',       path:'/dashboard' },
  { label:'Ganadería',   path:'/ganado'    },
  { label:'Agricultura', path:'/cultivos'  },
  { label:'Inventario',  path:'/insumos'   },
  { label:'Reportes',    path:'/reportes'  },
]

function initials(nombre='') {
  return nombre.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'YU'
}

function rolLabel(rol) {
  return rol==='admin' ? 'Admin' : rol==='ganadero' ? 'Ganadero' : 'Veterinario'
}

export default function Topnav({ activePath, alertCount=0 }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #0d3318, #1a5c2a)',
      height: 62,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(200,160,48,0.3)',
    }}>

      {/* LOGO + NOMBRE */}
      <Link to="/dashboard" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
        <img src="/logo.png" alt="YapuUywa" style={{ width:42, height:42, borderRadius:10, objectFit:'contain' }}/>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:'#fff', lineHeight:1.1, letterSpacing:'-0.3px' }}>
            YapuUywa
          </div>
          <div style={{ fontSize:9, color:'#c8a030', letterSpacing:'0.18em', textTransform:'uppercase', marginTop:1 }}>
            SGA
          </div>
        </div>
      </Link>

      {/* SEPARADOR */}
      <div style={{ width:1, height:32, background:'rgba(255,255,255,0.1)', flexShrink:0 }}/>

      {/* LINKS */}
      <div style={{ display:'flex', gap:2 }}>
        {NAV_LINKS.map(l => (
          <Link key={l.path} to={l.path} style={{
            padding: '7px 15px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: activePath?.startsWith(l.path) ? '#fff' : 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            background: activePath?.startsWith(l.path) ? 'rgba(200,160,48,0.2)' : 'transparent',
            borderBottom: activePath?.startsWith(l.path) ? '2px solid #c8a030' : '2px solid transparent',
            transition: 'all .15s',
          }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ flex:1 }}/>

      {/* DERECHA */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>

        {/* EN LÍNEA */}
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(255,255,255,0.6)' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80' }}/>
          En línea
        </div>

        {/* CAMPANA */}
        <Link to="/alertas" style={{
          position: 'relative',
          width: 36, height: 36,
          borderRadius: 9,
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          🔔
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top:3, right:3,
              minWidth:16, height:16, borderRadius:8,
              background:'#dc3545', border:'2px solid #1a5c2a',
              fontSize:9, fontWeight:700, color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:'0 3px',
            }}>
              {alertCount}
            </span>
          )}
        </Link>

        {/* CHIP USUARIO */}
        <div style={{
          display: 'flex', alignItems: 'center', gap:8,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '4px 14px 4px 4px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background: '#2d7a40',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:700, color:'#fff', flexShrink:0,
          }}>
            {initials(user?.nombre)}
          </div>
          <span style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{user?.nombre || 'Usuario'}</span>
          <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600, background:'rgba(200,160,48,0.2)', color:'#c8a030' }}>
            {rolLabel(user?.rol)}
          </span>
        </div>

        {/* SALIR */}
        <button onClick={handleLogout} style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)',
          padding: '7px 16px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          Salir
        </button>
      </div>
    </nav>
  )
}