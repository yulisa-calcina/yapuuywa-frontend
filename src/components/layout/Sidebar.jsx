import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { section:'General', items:[
    { label:'Dashboard',         path:'/dashboard',  icon:'🏠' },
  ]},
  { section:'Ganadería', items:[
    { label:'Inventario ganado', path:'/ganado',     icon:'🐄', roles:['admin','ganadero'] },
    { label:'Control sanitario', path:'/sanitario',  icon:'💉', badge:'alertas' },
    { label:'Producción',        path:'/produccion', icon:'🥛', roles:['admin','ganadero'] },
  ]},
  { section:'Agricultura', items:[
    { label:'Parcelas',          path:'/parcelas',   icon:'🗺️', roles:['admin','ganadero'] },
    { label:'Cultivos',          path:'/cultivos',   icon:'🌾', roles:['admin','ganadero'] },
  ]},
  { section:'Sistema', items:[
    { label:'Insumos',           path:'/insumos',    icon:'🧪', badge:'insumos' },
    { label:'Personal',          path:'/personal',   icon:'👨‍🌾', roles:['admin'] },
    { label:'Finanzas',          path:'/finanzas',   icon:'💵', roles:['admin','ganadero'] },
    { label:'Reportes PDF',      path:'/reportes',   icon:'📊' },
    { label:'Usuarios',          path:'/usuarios',   icon:'👥', roles:['admin'] },
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
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
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
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{user?.nombre || 'Usuario'}</div>
            <div style={{ fontSize: 10, color: '#c8a030', textTransform: 'capitalize' }}>{user?.rol || 'rol'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}