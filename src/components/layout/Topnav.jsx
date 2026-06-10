import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const IC = {
  panel:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  ganaderia:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="20" x2="4" y2="16"/><line x1="20" y1="20" x2="20" y2="16"/></svg>,
  agricultura:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12C12 12 7 10 5 6c4 0 7 2 7 6zM12 12C12 12 17 10 19 6c-4 0-7 2-7 6z"/></svg>,
  inventario: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  reportes:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  bell:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  logout:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
}

const NAV_LINKS = [
  { label:'Panel',       path:'/dashboard', icon: IC.panel      },
  { label:'Ganadería',   path:'/ganado',    icon: IC.ganaderia  },
  { label:'Agricultura', path:'/cultivos',  icon: IC.agricultura},
  { label:'Inventario',  path:'/insumos',   icon: IC.inventario },
  { label:'Reportes',    path:'/reportes',  icon: IC.reportes   },
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
      background: 'linear-gradient(90deg, #0a2810, #1a5c2a)',
      height: 62,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(200,160,48,0.25)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>

      {/* LOGO */}
      <Link to="/dashboard" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
        <img src="/logo.png" alt="YapuUywa" style={{ width:40, height:40, borderRadius:10, objectFit:'contain' }}/>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:800, color:'#fff', lineHeight:1.1, letterSpacing:'-0.3px' }}>
            YapuUywa
          </div>
          <div style={{ fontSize:9, color:'#c8a030', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:1 }}>
            SGA
          </div>
        </div>
      </Link>

      {/* SEPARADOR */}
      <div style={{ width:1, height:28, background:'rgba(255,255,255,0.12)', flexShrink:0 }}/>

      {/* LINKS */}
      <div style={{ display:'flex', gap:1 }}>
        {NAV_LINKS.map(l => {
          const isActive = activePath?.startsWith(l.path)
          return (
            <Link key={l.path} to={l.path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 13px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              background: isActive ? 'rgba(200,160,48,0.18)' : 'transparent',
              borderBottom: isActive ? '2px solid #c8a030' : '2px solid transparent',
              transition: 'all .15s',
            }}>
              <span style={{ display:'flex', alignItems:'center', opacity: isActive ? 1 : 0.7 }}>{l.icon}</span>
              {l.label}
            </Link>
          )
        })}
      </div>

      <div style={{ flex:1 }}/>

      {/* DERECHA */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>

        {/* EN LÍNEA */}
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(255,255,255,0.5)', marginRight:4 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80' }}/>
          En línea
        </div>

        {/* CAMPANA */}
        <Link to="/alertas" style={{
          position: 'relative',
          width: 34, height: 34,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'all .15s',
        }}>
          {IC.bell}
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top:4, right:4,
              width:8, height:8, borderRadius:'50%',
              background:'#dc3545', border:'1.5px solid #1a5c2a',
            }}/>
          )}
        </Link>

        {/* CHIP USUARIO */}
        <div style={{
          display: 'flex', alignItems: 'center', gap:8,
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '4px 12px 4px 4px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width:30, height:30, borderRadius:'50%',
            background: 'linear-gradient(135deg, #2d7a40, #1a5c2a)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:700, color:'#fff', flexShrink:0,
            border: '1.5px solid rgba(255,255,255,0.2)',
          }}>
            {initials(user?.nombre)}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff', lineHeight:1.2 }}>{user?.nombre || 'Usuario'}</div>
            <div style={{ fontSize:10, color:'#c8a030', fontWeight:500 }}>{rolLabel(user?.rol)}</div>
          </div>
        </div>

        {/* SALIR */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap:6,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.65)',
          padding: '7px 14px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all .15s',
        }}>
          {IC.logout} Salir
        </button>
      </div>
    </nav>
  )
}