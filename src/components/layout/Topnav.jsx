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

  const S = {
    nav:   { background:'#1a5c2a', height:54, display:'flex', alignItems:'center', padding:'0 20px', gap:16, flexShrink:0, position:'sticky', top:0, zIndex:100 },
    brand: { display:'flex', alignItems:'center', gap:10, textDecoration:'none' },
    icon:  { width:34, height:34, borderRadius:9, background:'#2d7a40', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    name:  { fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:'#fff' },
    sga:   { fontSize:10, color:'#a8d5b5', fontWeight:500, letterSpacing:'.06em' },
    links: { display:'flex', gap:2, marginLeft:8 },
    link:  { padding:'6px 13px', borderRadius:6, fontSize:12, fontWeight:500, color:'#a8d5b5', transition:'all .15s', textDecoration:'none' },
    linkActive: { background:'#2d7a40', color:'#fff' },
    spacer: { flex:1 },
    right:  { display:'flex', alignItems:'center', gap:10 },
    online: { display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#a8d5b5' },
    dot:    { width:7, height:7, borderRadius:'50%', background:'#4ade80' },
    bell:   { position:'relative', width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.08)', border:'none', color:'#a8d5b5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer' },
    bellBadge: { position:'absolute', top:3, right:3, minWidth:16, height:16, borderRadius:8, background:'#dc3545', border:'2px solid #1a5c2a', fontSize:9, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px' },
    chip:   { display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.08)', borderRadius:20, padding:'4px 12px 4px 4px' },
    avatar: { width:28, height:28, borderRadius:'50%', background:'#2d7a40', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'#fff', flexShrink:0 },
    uname:  { fontSize:12, fontWeight:500, color:'#fff' },
    rbadge: { fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:500, background:'#eef7f0', color:'#1a5c2a' },
    logout: { background:'none', border:'1px solid rgba(255,255,255,.2)', color:'#a8d5b5', padding:'5px 12px', borderRadius:6, fontSize:11, cursor:'pointer' },
  }

  return (
    <nav style={S.nav}>
      <Link to="/dashboard" style={S.brand}>
        <div style={S.icon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#d4edd9">
            <path d="M17 8C8 10 5.9 16.17 3.82 19.65c.33.41.75.64 1.18.35C7 19 8 17 9 15c2 0 5 1 7 5 0 0 1-7-3-10 0 0 2 0 4 2 0 0 0-4-4-4z"/>
          </svg>
        </div>
        <div>
          <span style={S.name}>YapuUywa <span style={S.sga}>SGA</span></span>
        </div>
      </Link>

      <div style={S.links}>
        {NAV_LINKS.map(l => (
          <Link key={l.path} to={l.path} style={{ ...S.link, ...(activePath?.startsWith(l.path) ? S.linkActive : {}) }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div style={S.spacer} />

      <div style={S.right}>
        <div style={S.online}><div style={S.dot}/>En línea</div>
        <Link to="/alertas" style={S.bell}>
          🔔
          {alertCount > 0 && <span style={S.bellBadge}>{alertCount}</span>}
        </Link>
        <div style={S.chip}>
          <div style={S.avatar}>{initials(user?.nombre)}</div>
          <span style={S.uname}>{user?.nombre || 'Usuario'}</span>
          <span style={S.rbadge}>{rolLabel(user?.rol)}</span>
        </div>
        <button style={S.logout} onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  )
}
