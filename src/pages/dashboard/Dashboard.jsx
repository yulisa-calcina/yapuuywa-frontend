import { useDashboard, useAlertas, useGanado } from '../../hooks/index'
import { Badge, EmptyState, Spinner } from '../../components/ui/index'

const S = {
  hdr:    { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title:  { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:    { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid4:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 },
  mc:     { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'16px' },
  mcIco:  { fontSize:24, marginBottom:10 },
  mcLbl:  { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:5 },
  mcVal:  { fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:700, color:'#1e2e1e', lineHeight:1 },
  mcSub:  { fontSize:11, fontWeight:500, marginTop:5 },
  grid2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  card:   { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden' },
  cardH:  { padding:'13px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between' },
  cardT:  { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  cardLnk:{ fontSize:11, color:'#8d9e8d', textDecoration:'none' },
  aRow:   { display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:'1px solid #eef1ee' },
  aIco:   { width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:15 },
  aInfo:  { flex:1, minWidth:0 },
  aTitle: { fontSize:12, fontWeight:600, color:'#1e2e1e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  aSub:   { fontSize:11, color:'#8d9e8d', marginTop:2 },
  aBtn:   { fontSize:11, background:'#fff', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 11px', color:'#4a5e4a', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 },
  spRow:  { display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #eef1ee' },
  spIco:  { fontSize:22, flexShrink:0 },
  spName: { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  spDet:  { fontSize:11, color:'#8d9e8d', marginTop:2 },
  spCnt:  { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700 },
}

export default function Dashboard() {
  const { kpis, lastSync } = useDashboard()
  const { alertas, atender } = useAlertas()
  const { ganado } = useGanado()

  const bovinos = ganado.filter(a=>a.especie==='bovino').length
  const ovinos  = ganado.filter(a=>a.especie==='ovino').length
  const alpacas = ganado.filter(a=>a.especie==='alpaca').length
  const porcinos= ganado.filter(a=>a.especie==='porcino').length

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Panel principal</h1>
          <p style={S.sub}>YapuUywa SGA · Temporada 2026-I · Puno{lastSync && ` · ${lastSync.toLocaleTimeString('es-PE')}`}</p>
        </div>
      </div>

      <div style={S.grid4}>
        {[
          { icon:'🐄', label:'Total animales',    val: kpis?.total_animales ?? ganado.length, sub:'activos en inventario', c:'#3b8c52' },
          { icon:'🌱', label:'Hectáreas activas', val: kpis?.hectareas_activas ?? '—',        sub:`${kpis?.cultivos_activos??0} cultivos`, c:'#3b8c52' },
          { icon:'⚠️', label:'Alertas sanitarias',val: alertas.length,                        sub: alertas.length>0?'revisar hoy':'sin alertas', c: alertas.length>0?'#7a4f08':'#3b8c52' },
          { icon:'💰', label:'Balance del mes',   val: kpis?.balance_mes!=null?`+S/${kpis.balance_mes}`:'—', sub:'ingresos vs egresos', c:'#3b8c52' },
        ].map(m=>(
          <div key={m.label} style={S.mc}>
            <div style={S.mcIco}>{m.icon}</div>
            <div style={S.mcLbl}>{m.label}</div>
            <div style={S.mcVal}>{m.val}</div>
            <div style={{...S.mcSub, color:m.c}}>{m.sub}</div>
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
              <div key={a.id} style={{...S.aRow, borderBottom:'1px solid #eef1ee'}}>
                <div style={{...S.aIco, background: a.estado==='critico'?'#fde8ea':'#fef3dc'}}>{a.tipo==='stock'?'📦':a.estado==='critico'?'🚨':'⏰'}</div>
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
            {ico:'🐂',name:'Vacuno', det:'Criollo / Holstein', cnt:bovinos, c:'#27500A'},
            {ico:'🦙',name:'Alpaca', det:'Huacaya / Suri',     cnt:alpacas, c:'#7c3aed'},
            {ico:'🐑',name:'Ovino',  det:'Corriedale / Merino',cnt:ovinos,  c:'#c2410c'},
            {ico:'🐷',name:'Porcino',det:'Yorkshire / Cruce',  cnt:porcinos,c:'#db2777'},
          ].map(sp=>(
            <div key={sp.name} style={{...S.spRow, borderBottom:'1px solid #eef1ee'}}>
              <div style={{fontSize:22,flexShrink:0}}>{sp.ico}</div>
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
