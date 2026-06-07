import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { section:'General', items:[
    { label:'Dashboard',         path:'/dashboard',  icon:'⊞' },
  ]},
  { section:'Ganadería', items:[
    { label:'Inventario ganado', path:'/ganado',     icon:'🐄', roles:['admin','ganadero'] },
    { label:'Control sanitario', path:'/sanitario',  icon:'🩺', badge:'alertas' },
    { label:'Producción',        path:'/produccion', icon:'🥛', roles:['admin','ganadero'] },
  ]},
  { section:'Agricultura', items:[
    { label:'Parcelas',          path:'/parcelas',   icon:'📍', roles:['admin','ganadero'] },
    { label:'Cultivos',          path:'/cultivos',   icon:'🌱', roles:['admin','ganadero'] },
  ]},
  { section:'Sistema', items:[
    { label:'Insumos',           path:'/insumos',    icon:'📦', badge:'insumos' },
    { label:'Personal',          path:'/personal',   icon:'👷', roles:['admin'] },
    { label:'Finanzas',          path:'/finanzas',   icon:'💰', roles:['admin','ganadero'] },
    { label:'Reportes PDF',      path:'/reportes',   icon:'📄' },
    { label:'Usuarios',          path:'/usuarios',   icon:'👤', roles:['admin'] },
  ]},
]

const S = {
  sidebar:  { width:200, background:'#fff', borderRight:'1px solid #dde3dd', display:'flex', flexDirection:'column', flexShrink:0, padding:'10px 0', overflowY:'auto' },
  section:  { padding:'10px 14px 3px', fontSize:9, fontWeight:700, color:'#8d9e8d', letterSpacing:'.1em', textTransform:'uppercase' },
  item:     { display:'flex', alignItems:'center', gap:8, padding:'8px 10px', margin:'1px 6px', borderRadius:10, fontSize:12, fontWeight:500, color:'#4a5e4a', transition:'all .12s', textDecoration:'none' },
  itemHov:  { background:'#eef1ee', color:'#1e2e1e' },
  itemAct:  { background:'#eef7f0', color:'#1a5c2a', borderRight:'2px solid #2d7a40' },
  icon:     { fontSize:14, flexShrink:0 },
  label:    { flex:1 },
  badge:    { marginLeft:'auto', background:'#fde8ea', color:'#8b1a24', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:20, minWidth:18, textAlign:'center' },
  badgeWarn:{ background:'#fef3dc', color:'#7a4f08' },
}

export default function Sidebar({ badges={} }) {
  const { user } = useAuth()
  const rol = user?.rol || 'ganadero'

  return (
    <aside style={S.sidebar}>
      {MENU.map(group => {
        const visible = group.items.filter(i => !i.roles || i.roles.includes(rol))
        if (!visible.length) return null
        return (
          <div key={group.section}>
            <p style={S.section}>{group.section}</p>
            {visible.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({ ...S.item, ...(isActive ? S.itemAct : {}) })}
              >
                <span style={S.icon}>{item.icon}</span>
                <span style={S.label}>{item.label}</span>
                {item.badge && badges[item.badge] > 0 && (
                  <span style={{ ...S.badge, ...(item.badge==='insumos' ? S.badgeWarn : {}) }}>
                    {badges[item.badge]}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )
      })}
    </aside>
  )
}
