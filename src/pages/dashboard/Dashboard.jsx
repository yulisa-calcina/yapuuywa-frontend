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
      🍀 YapuUywa SGA · {hora.toLocaleTimeString('es-PE')}
    </p>
  )
}

const SVG = {
  ganado: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8"/>
      <path d="M4 14h16"/><path d="M8 6V4"/><path d="M16 6V4"/>
      <circle cx="9" cy="11" r="1" fill="rgba(255,255,255,0.9)" stroke="none"/>
      <circle cx="15" cy="11" r="1" fill="rgba(255,255,255,0.9)" stroke="none"/>
    </svg>
  ),
  cultivos: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10"/>
      <path d="M12 10C12 10 7 9 6 4c3 0 5.5 2 6 6z"/>
      <path d="M12 10C12 10 17 9 18 4c-3 0-5.5 2-6 6z"/>
      <path d="M6 20h12"/>
    </svg>
  ),
  gestion: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  animal: (size=28) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2d7a40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8"/>
      <path d="M4 14h16"/><path d="M8 6V4"/><path d="M16 6V4"/>
      <circle cx="9" cy="11" r="1" fill="#2d7a40" stroke="none"/>
      <circle cx="15" cy="11" r="1" fill="#2d7a40" stroke="none"/>
    </svg>
  ),
  planta: (size=28) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2d7a40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10"/>
      <path d="M12 10C12 10 7 9 6 4c3 0 5.5 2 6 6z"/>
      <path d="M12 10C12 10 17 9 18 4c-3 0-5.5 2-6 6z"/>
      <path d="M6 20h12"/>
    </svg>
  ),
  alerta: (size=28) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#c8a030" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  dinero: (size=28) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2d7a40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  check: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d7a40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
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
    { svg: SVG.animal(28),  label:'Total animales',     val: kpis?.total_animales ?? ganado.length, sub:'activos en inventario', color:'#1a5c2a', bg:'linear-gradient(135deg,#eef7f0,#d4edda)', border:'#b8ddc4' },
    { svg: SVG.planta(28),  label:'Hectáreas activas',  val: kpis?.hectareas_activas ?? '—',        sub:`${kpis?.cultivos_activos??0} cultivos`,  color:'#1a5c2a', bg:'linear-gradient(135deg,#e8f5e8,#c8e6c9)', border:'#a5d6a7' },
    { svg: SVG.alerta(28),  label:'Alertas sanitarias', val: alertas.length,                        sub: alertas.length>0?'revisar hoy':'sin alertas', color: alertas.length>0?'#7a4f08':'#1a5c2a', bg: alertas.length>0?'linear-gradient(135deg,#fef9e7,#fdebd0)':'linear-gradient(135deg,#eef7f0,#d4edda)', border: alertas.length>0?'#f9ca8a':'#b8ddc4' },
    { svg: SVG.dinero(28),  label:'Balance del mes',    val: kpis?.balance_mes!=null?`S/${kpis.balance_mes}`:'—', sub:'ingresos vs egresos', color:'#1a5c2a', bg:'linear-gradient(135deg,#e8f5e8,#c8e6c9)', border:'#a5d6a7' },
  ]

  const especiesSVG = {
    vacuno:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8"/><path d="M4 14h16"/><path d="M8 6V4"/><path d="M16 6V4"/><circle cx="9" cy="11" r="1" fill="#27500A" stroke="none"/><circle cx="15" cy="11" r="1" fill="#27500A" stroke="none"/></svg>,
    alpaca:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M8 12c-3 1-5 3-5 6h18c0-3-2-5-5-6"/><path d="M10 4V2m4 2V2"/></svg>,
    ovino:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><path d="M7 14c-3 1-4 3-4 5h18c0-2-1-4-4-5"/><path d="M9 4c-1-1-3-1-3 1m9-1c1-1 3-1 3 1"/></svg>,
    porcino: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="10" rx="6" ry="5"/><path d="M6 15c-3 1-4 3-4 5h20c0-2-1-4-4-5"/><circle cx="10" cy="9" r="1" fill="#db2777" stroke="none"/><circle cx="14" cy="9" r="1" fill="#db2777" stroke="none"/><ellipse cx="12" cy="12" rx="2" ry="1"/></svg>,
  }

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif" }}>

      {/* ENCABEZADO */}
      <div style={{
        background: 'linear-gradient(135deg, #0d3318, #1a5c2a)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(13,51,24,0.4)',
        border: '1px solid rgba(200,160,48,0.2)',
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
          {[
            { svg: SVG.ganado,   lbl:'Ganadería' },
            { svg: SVG.cultivos, lbl:'Cultivos'  },
            { svg: SVG.gestion,  lbl:'Gestión'   },
          ].map(({ svg, lbl }) => (
            <div key={lbl} style={{ background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 14px', textAlign:'center', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:24 }}>{svg}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.6)', marginTop:4, letterSpacing:'0.05em' }}>{lbl}</div>
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
            <div style={{ marginBottom:10, width:44, height:44, background:'rgba(255,255,255,0.7)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {m.svg}
            </div>
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
            <div style={{ fontSize:14, fontWeight:700, color:'#1a3a1a', display:'flex', alignItems:'center', gap:8 }}>
              {SVG.bell} Alertas activas
            </div>
            {alertas.length > 0 ? <Badge color="red">{alertas.length} urgentes</Badge> : <Badge color="green">Sin alertas</Badge>}
          </div>
          {alertas.length === 0
            ? <EmptyState icon="✅" title="Todo en orden" description="No hay alertas pendientes." />
            : alertas.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #eef1ee' }}>
                <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:a.estado==='critico'?'#fde8ea':'#fef3dc' }}>
                  {a.estado==='critico' ? SVG.alerta(18) : SVG.bell}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1e2e1e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.descripcion||a.animal?.nombre}</div>
                  <div style={{ fontSize:11, color:'#8d9e8d', marginTop:2 }}>{a.tipo==='stock'?`Stock: ${a.cantidad_actual}`:`${a.dias_restantes===0?'Vence hoy':`${a.dias_restantes}d`}`}</div>
                </div>
                <button style={{ fontSize:12, background:'#1a5c2a', border:'none', borderRadius:8, padding:'6px 14px', color:'#fff', cursor:'pointer', fontWeight:600 }}
                  onClick={()=>atender(a.id)}>Atender</button>
              </div>
            ))
          }
        </div>

        {/* GANADO POR ESPECIE */}
        <div style={{ background:'#fff', border:'1px solid #dde3dd', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#f0f9f0,#fff)' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#1a3a1a', display:'flex', alignItems:'center', gap:8 }}>
              {SVG.animal(16)} Ganado por especie
            </div>
            <a href="/ganado" style={{ fontSize:12, color:'#1a5c2a', textDecoration:'none', fontWeight:600, padding:'5px 12px', background:'#eef7f0', borderRadius:20 }}>Ver todos →</a>
          </div>
          {[
            { svg: especiesSVG.vacuno,  name:'Vacuno',  det:'Criollo / Holstein',  cnt:bovinos,  c:'#27500A' },
            { svg: especiesSVG.alpaca,  name:'Alpaca',  det:'Huacaya / Suri',      cnt:alpacas,  c:'#7c3aed' },
            { svg: especiesSVG.ovino,   name:'Ovino',   det:'Corriedale / Merino', cnt:ovinos,   c:'#c2410c' },
            { svg: especiesSVG.porcino, name:'Porcino', det:'Yorkshire / Cruce',   cnt:porcinos, c:'#db2777' },
          ].map(sp => (
            <div key={sp.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:'1px solid #eef1ee' }}>
              <div style={{ flexShrink:0, width:44, height:44, background:'#f0f9f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {sp.svg}
              </div>
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