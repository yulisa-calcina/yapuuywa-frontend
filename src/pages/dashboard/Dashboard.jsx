import { useState, useEffect } from 'react'
import { useDashboard, useAlertas, useGanado } from '../../hooks/index'
import { Badge, EmptyState } from '../../components/ui/index'

function RelojTiempoReal() {
  const [hora, setHora] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', margin:0, marginTop:3 }}>
    YapuUywa SGA · {hora.toLocaleTimeString('es-PE')}
    </p>
  )
}

export default function Dashboard() {
  const { kpis } = useDashboard()
  const { alertas, atender } = useAlertas()
  const { ganado } = useGanado()

  const bovinos  = ganado.filter(a => a.especie === 'bovino').length
  const ovinos   = ganado.filter(a => a.especie === 'ovino').length
  const alpacas  = ganado.filter(a => a.especie === 'alpaca').length
  const porcinos = ganado.filter(a => a.especie === 'porcino').length

  const kpiData = [
    {
      icon: '🐄',
      label: 'Total animales',
      val: kpis?.total_animales ?? ganado.length,
      sub: 'activos en inventario',
      color: '#1a5c2a',
      bg: 'linear-gradient(135deg, #eef7f0, #d4edda)',
      border: '#b8ddc4',
    },
    {
      icon: '🌱',
      label: 'Hectáreas activas',
      val: kpis?.hectareas_activas ?? '—',
      sub: `${kpis?.cultivos_activos ?? 0} cultivos`,
      color: '#1a5c2a',
      bg: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
      border: '#a5d6a7',
    },
    {
      icon: '⚠️',
      label: 'Alertas sanitarias',
      val: alertas.length,
      sub: alertas.length > 0 ? 'revisar hoy' : 'sin alertas',
      color: alertas.length > 0 ? '#7a4f08' : '#1a5c2a',
      bg: alertas.length > 0 ? 'linear-gradient(135deg, #fef9e7, #fdebd0)' : 'linear-gradient(135deg, #eef7f0, #d4edda)',
      border: alertas.length > 0 ? '#f9ca8a' : '#b8ddc4',
    },
    {
      icon: '💰',
      label: 'Balance del mes',
      val: kpis?.balance_mes != null ? `S/${kpis.balance_mes}` : '—',
      sub: 'ingresos vs egresos',
      color: '#1a5c2a',
      bg: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
      border: '#a5d6a7',
    },
  ]

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif" }}>

      {/* ENCABEZADO */}
      <div style={{
        background: 'linear-gradient(135deg, #1a5c2a, #2d7a40)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 15px rgba(26,92,42,0.3)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        
          <div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.5px' }}>
              Panel principal
            </h1>
            <RelojTiempoReal />
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {[['🐄','Ganadería'],['🌾','Cultivos'],['📊','Gestión']].map(([ico,lbl]) => (
            <div key={lbl} style={{ background:'rgba(255,255,255,0.15)', borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
              <div style={{ fontSize:18 }}>{ico}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {kpiData.map(m => (
          <div key={m.label} style={{
            background: m.bg,
            border: `1px solid ${m.border}`,
            borderRadius: 16,
            padding: '18px 16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            transition: 'transform .2s, box-shadow .2s',
            cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)' }}
          >
            <div style={{ fontSize:28, marginBottom:10 }}>{m.icon}</div>
            <div style={{ fontSize:11, color:'#6a8a6a', fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{m.label}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:32, fontWeight:800, color:'#1a3a1a', lineHeight:1 }}>{m.val}</div>
            <div style={{ fontSize:12, fontWeight:600, color:m.color, marginTop:6 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* CARDS INFERIORES */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

        {/* ALERTAS */}
        <div style={{ background:'#fff', border:'1px solid #dde3dd', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#f0f9f0,#fff)' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#1a3a1a' }}>🔔 Alertas activas</div>
            {alertas.length > 0 ? <Badge color="red">{alertas.length} urgentes</Badge> : <Badge color="green">Sin alertas</Badge>}
          </div>
          {alertas.length === 0
            ? <EmptyState icon="✅" title="Todo en orden" description="No hay alertas pendientes." />
            : alertas.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #eef1ee' }}>
                <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18, background:a.estado==='critico'?'#fde8ea':'#fef3dc' }}>
                  {a.tipo==='stock'?'📦':a.estado==='critico'?'🚨':'⏰'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1e2e1e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.descripcion||a.animal?.nombre}</div>
                  <div style={{ fontSize:11, color:'#8d9e8d', marginTop:2 }}>{a.tipo==='stock'?`Stock: ${a.cantidad_actual}`:`${a.dias_restantes===0?'Vence hoy':`${a.dias_restantes}d`}`}</div>
                </div>
                <button style={{ fontSize:12, background:'#1a5c2a', border:'none', borderRadius:8, padding:'6px 14px', color:'#fff', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' }}
                  onClick={()=>atender(a.id)}>Atender</button>
              </div>
            ))
          }
        </div>

        {/* GANADO POR ESPECIE */}
        <div style={{ background:'#fff', border:'1px solid #dde3dd', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#f0f9f0,#fff)' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#1a3a1a' }}>🐄 Ganado por especie</div>
            <a href="/ganado" style={{ fontSize:12, color:'#1a5c2a', textDecoration:'none', fontWeight:600, padding:'5px 12px', background:'#eef7f0', borderRadius:20 }}>Ver todos →</a>
          </div>
          {[
            { ico:'🐂', name:'Vacuno',  det:'Criollo / Holstein',  cnt:bovinos,  c:'#27500A' },
            { ico:'🦙', name:'Alpaca',  det:'Huacaya / Suri',      cnt:alpacas,  c:'#7c3aed' },
            { ico:'🐑', name:'Ovino',   det:'Corriedale / Merino', cnt:ovinos,   c:'#c2410c' },
            { ico:'🐷', name:'Porcino', det:'Yorkshire / Cruce',   cnt:porcinos, c:'#db2777' },
          ].map(sp => (
            <div key={sp.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:'1px solid #eef1ee' }}>
              <div style={{ fontSize:28, flexShrink:0, width:44, height:44, background:'#f0f9f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>{sp.ico}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#1e2e1e' }}>{sp.name}</div>
                <div style={{ fontSize:11, color:'#8d9e8d', marginTop:2 }}>{sp.det}</div>
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:sp.c }}>{sp.cnt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}