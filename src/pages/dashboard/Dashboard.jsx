import { useDashboard, useAlertas, useGanado } from '../../hooks/index'
import { Badge, EmptyState } from '../../components/ui/index'

const S = {
  hdr:    { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title:  { fontFamily:"'Sora',sans-serif", fontSize:24, fontWeight:800, color:'#1a3a1a' },
  grid4:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 },
  mc:     { background:'#fff', border:'1px solid #dde3dd', borderRadius:16, padding:'18px', position:'relative', overflow:'hidden' },
  mcIco:  { fontSize:32, marginBottom:10 },
  mcLbl:  { fontSize:12, color:'#8d9e8d', fontWeight:500, marginBottom:5 },
  mcVal:  { fontFamily:"'Sora',sans-serif", fontSize:30, fontWeight:800, color:'#1a3a1a', lineHeight:1 },
  mcSub:  { fontSize:12, fontWeight:600, marginTop:6 },
  mcImg:  { position:'absolute', bottom:0, right:0, width:80, height:80, opacity:0.12, objectFit:'cover', borderRadius:'50% 0 0 0' },
  grid2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  card:   { background:'#fff', border:'1px solid #dde3dd', borderRadius:16, overflow:'hidden' },
  cardH:  { padding:'14px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg, #f0f9f0, #fff)' },
  cardT:  { fontSize:14, fontWeight:700, color:'#1a3a1a' },
  cardLnk:{ fontSize:12, color:'#2d7a40', textDecoration:'none', fontWeight:600, padding:'5px 12px', background:'#eef7f0', borderRadius:20 },
  aRow:   { display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #eef1ee' },
  aIco:   { width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 },
  aInfo:  { flex:1, minWidth:0 },
  aTitle: { fontSize:13, fontWeight:600, color:'#1e2e1e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  aSub:   { fontSize:11, color:'#8d9e8d', marginTop:2 },
  aBtn:   { fontSize:12, background:'#1a5c2a', border:'none', borderRadius:8, padding:'6px 14px', color:'#fff', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, fontWeight:600 },
  spRow:  { display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:'1px solid #eef1ee' },
  spIco:  { width:44, height:44, borderRadius:12, objectFit:'cover', flexShrink:0 },
  spName: { fontSize:14, fontWeight:700, color:'#1e2e1e' },
  spDet:  { fontSize:11, color:'#8d9e8d', marginTop:2 },
  spCnt:  { fontFamily:"'Sora',sans-serif", fontSize:24, fontWeight:800 },
}

const FOTOS = {
  ganado:   'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&q=60',
  cultivos: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&q=60',
  alertas:  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=200&q=60',
  finanzas: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&q=60',
  vacuno:   'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=100&q=60',
  alpaca:   'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=100&q=60',
  ovino:    'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=100&q=60',
  porcino:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=60',
}

export default function Dashboard() {
  const { kpis, lastSync } = useDashboard()
  const { alertas, atender } = useAlertas()
  const { ganado } = useGanado()

  const bovinos  = ganado.filter(a => a.especie === 'bovino').length
  const ovinos   = ganado.filter(a => a.especie === 'ovino').length
  const alpacas  = ganado.filter(a => a.especie === 'alpaca').length
  const porcinos = ganado.filter(a => a.especie === 'porcino').length

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Panel principal</h1>
          {lastSync && <p style={{ fontSize:12, color:'#8d9e8d', marginTop:3 }}>Última actualización: {lastSync.toLocaleTimeString('es-PE')}</p>}
        </div>
      </div>

      <div style={S.grid4}>
        {[
          { icon:'🐄', label:'Total animales',     val: kpis?.total_animales ?? ganado.length, sub:'activos en inventario', color:'#2d7a40', foto: FOTOS.ganado },
          { icon:'🌱', label:'Hectáreas activas',  val: kpis?.hectareas_activas ?? '—',        sub:`${kpis?.cultivos_activos??0} cultivos`,  color:'#2d7a40', foto: FOTOS.cultivos },
          { icon:'⚠️', label:'Alertas sanitarias', val: alertas.length,                        sub: alertas.length>0?'revisar hoy':'sin alertas', color: alertas.length>0?'#c8a030':'#2d7a40', foto: FOTOS.alertas },
          { icon:'💰', label:'Balance del mes',    val: kpis?.balance_mes!=null?`+S/${kpis.balance_mes}`:'—', sub:'ingresos vs egresos', color:'#2d7a40', foto: FOTOS.finanzas },
        ].map(m => (
          <div key={m.label} style={S.mc}>
            <img src={m.foto} alt="" style={S.mcImg}/>
            <div style={S.mcIco}>{m.icon}</div>
            <div style={S.mcLbl}>{m.label}</div>
            <div style={S.mcVal}>{m.val}</div>
            <div style={{...S.mcSub, color: m.color}}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardH}>
            <div style={S.cardT}>🔔 Alertas activas</div>
            {alertas.length>0 ? <Badge color="red">{alertas.length} urgentes</Badge> : <Badge color="green">Sin alertas</Badge>}
          </div>
          {alertas.length===0
            ? <EmptyState icon="✅" title="Todo en orden" description="No hay alertas pendientes." />
            : alertas.map(a=>(
              <div key={a.id} style={S.aRow}>
                <div style={{...S.aIco, background: a.estado==='critico'?'#fde8ea':'#fef3dc'}}>
                  {a.tipo==='stock'?'📦':a.estado==='critico'?'🚨':'⏰'}
                </div>
                <div style={S.aInfo}>
                  <div style={S.aTitle}>{a.descripcion || a.animal?.nombre}</div>
                  <div style={S.aSub}>{a.tipo==='stock'?`Stock: ${a.cantidad_actual}`:`${a.dias_restantes===0?'Vence hoy':`${a.dias_restantes}d`}`}</div>
                </div>
                <button style={S.aBtn} onClick={()=>atender(a.id)}>Atender</button>
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={S.cardH}>
            <div style={S.cardT}>🐄 Ganado por especie</div>
            <a href="/ganado" style={S.cardLnk}>Ver todos →</a>
          </div>
          {[
            { foto: FOTOS.vacuno,  name:'Vacuno',  det:'Criollo / Holstein',  cnt: bovinos,  c:'#27500A' },
            { foto: FOTOS.alpaca,  name:'Alpaca',  det:'Huacaya / Suri',      cnt: alpacas,  c:'#7c3aed' },
            { foto: FOTOS.ovino,   name:'Ovino',   det:'Corriedale / Merino', cnt: ovinos,   c:'#c2410c' },
            { foto: FOTOS.porcino, name:'Porcino', det:'Yorkshire / Cruce',   cnt: porcinos, c:'#db2777' },
          ].map(sp=>(
            <div key={sp.name} style={S.spRow}>
              <img src={sp.foto} alt={sp.name} style={S.spIco}/>
              <div style={{flex:1}}>
                <div style={S.spName}>{sp.name}</div>
                <div style={S.spDet}>{sp.det}</div>
              </div>
              <div style={{...S.spCnt, color:sp.c}}>{sp.cnt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}