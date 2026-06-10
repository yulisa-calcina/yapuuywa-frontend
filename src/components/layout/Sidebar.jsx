import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const IC = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  ganado:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="20" x2="4" y2="16"/><line x1="20" y1="20" x2="20" y2="16"/></svg>,
  sanitario: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  produccion:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M12 8v8"/></svg>,
  parcelas:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  cultivos:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12C12 12 7 10 5 6c4 0 7 2 7 6zM12 12C12 12 17 10 19 6c-4 0-7 2-7 6z"/></svg>,
  insumos:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  personal:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  finanzas:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  reportes:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  usuarios:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
}

const MENU = [
  { section:'General', items:[
    { label:'Dashboard',         path:'/dashboard',  icon: IC.dashboard },
  ]},
  { section:'Ganadería', items:[
    { label:'Inventario ganado', path:'/ganado',     icon: IC.ganado,    roles:['admin','ganadero'] },
    { label:'Control sanitario', path:'/sanitario',  icon: IC.sanitario, badge:'alertas' },
    { label:'Producción',        path:'/produccion', icon: IC.produccion,roles:['admin','ganadero'] },
  ]},
  { section:'Agricultura', items:[
    { label:'Parcelas',          path:'/parcelas',   icon: IC.parcelas,  roles:['admin','ganadero'] },
    { label:'Cultivos',          path:'/cultivos',   icon: IC.cultivos,  roles:['admin','ganadero'] },
  ]},
  { section:'Sistema', items:[
    { label:'Insumos',           path:'/insumos',    icon: IC.insumos,   badge:'insumos' },
    { label:'Personal',          path:'/personal',   icon: IC.personal,  roles:['admin'] },
    { label:'Finanzas',          path:'/finanzas',   icon: IC.finanzas,  roles:['admin','ganadero'] },
    { label:'Reportes PDF',      path:'/reportes',   icon: IC.reportes },
    { label:'Usuarios',          path:'/usuarios',   icon: IC.usuarios,  roles:['admin'] },
  ]},
]

export default function Sidebar({ badges = {} }) {
  const { user } = useAuth()
  const rol = user?.rol || 'ganadero'

  return (
    <aside style={{
      width: 220,
      background: 'linear-gradient(180deg, #0d3318 0%, #1a5c2a 100%)',
      borderRight: '1px solid rgba(45,122,64,0.3)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      padding: '12px 0',
      overflowY: 'auto',
    }}>

      {MENU.map(group => {
        const visible = group.items.filter(i => !i.roles || i.roles.includes(rol))
        if (!visible.length) return null
        return (
          <div key={group.section}>
            <p style={{
              padding: '10px 16px 4px',
              fontSize: 9,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              {group.section}
            </p>
            {visible.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  margin: '2px 8px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all .15s',
                  background: isActive ? 'rgba(200,160,48,0.2)' : 'transparent',
                  color: isActive ? '#c8a030' : 'rgba(255,255,255,0.65)',
                  borderLeft: isActive ? '3px solid #c8a030' : '3px solid transparent',
                })}
              >
                <span style={{ flexShrink:0, opacity:0.85 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && badges[item.badge] > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: item.badge === 'insumos' ? '#c8a030' : '#dc3545',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 20,
                    minWidth: 18,
                    textAlign: 'center',
                  }}>
                    {badges[item.badge]}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )
      })}

      {/* USUARIO ABAJO */}
      <div style={{
        marginTop: 'auto',
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: '#2d7a40',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>
            {(user?.nombre || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{user?.nombre || 'Usuario'}</div>
            <div style={{ fontSize:10, color:'#c8a030', textTransform:'capitalize' }}>{user?.rol || 'rol'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}