import { useState, useEffect } from 'react'
import { Badge, EmptyState } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 },
  mc:    { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'14px 16px' },
  mcLbl: { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:4 },
  mcVal: { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1e2e1e' },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden', marginBottom:14 },
  cardH: { padding:'13px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#f0f9f0,#fff)' },
  cardT: { fontSize:13, fontWeight:700, color:'#1a3a1a' },
  row:   { display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #eef1ee' },
  ico:   { width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 },
  info:  { flex:1, minWidth:0 },
  name:  { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  det:   { fontSize:11, color:'#8d9e8d', marginTop:2 },
  btn:   { fontSize:12, background:'#1a5c2a', border:'none', borderRadius:8, padding:'6px 14px', color:'#fff', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' },
  btnRed:{ fontSize:12, background:'#dc3545', border:'none', borderRadius:8, padding:'6px 14px', color:'#fff', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' },
}

export default function Alertas() {
  const [vacunas, setVacunas]   = useState([])
  const [stock, setStock]       = useState([])
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [v, s] = await Promise.all([
        apiClient.get('/alertas/vacunacion'),
        apiClient.get('/alertas/stock'),
      ])
      setVacunas(v.data.data ?? v.data ?? [])
      setStock(s.data.data ?? s.data ?? [])
    } catch (_) {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const atender = async (id) => {
    try { await apiClient.put(`/alertas/${id}/atender`); load() } catch (_) {}
  }

  const total    = vacunas.length + stock.length
  const criticos = vacunas.filter(a => a.estado === 'critico').length + stock.filter(a => a.estado === 'critico').length

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Centro de alertas</h1>
          <p style={S.sub}>Vacunación y stock crítico del sistema</p>
        </div>
      </div>

      <div style={S.grid2}>
        <div style={S.mc}>
          <div style={S.mcLbl}>Total alertas</div>
          <div style={S.mcVal}>{total}</div>
          <div style={{ fontSize:11, color: total>0?'#c8a030':'#3b8c52', fontWeight:500, marginTop:3 }}>
            {total > 0 ? 'requieren atención' : 'sin alertas'}
          </div>
        </div>
        <div style={S.mc}>
          <div style={S.mcLbl}>Críticas</div>
          <div style={S.mcVal}>{criticos}</div>
          <div style={{ fontSize:11, color: criticos>0?'#dc3545':'#3b8c52', fontWeight:500, marginTop:3 }}>
            {criticos > 0 ? 'urgentes' : 'ninguna'}
          </div>
        </div>
      </div>

      {/* ALERTAS VACUNACIÓN */}
      <div style={S.card}>
        <div style={S.cardH}>
          <div style={S.cardT}>💉 Alertas de vacunación</div>
          <Badge color={vacunas.length > 0 ? 'red' : 'green'}>
            {vacunas.length > 0 ? `${vacunas.length} pendientes` : 'Al día'}
          </Badge>
        </div>
        {loading ? (
          <div style={{ padding:24, textAlign:'center', color:'#8d9e8d' }}>Cargando...</div>
        ) : vacunas.length === 0 ? (
          <EmptyState icon="✅" title="Sin alertas de vacunación" description="Todos los animales están al día."/>
        ) : (
          vacunas.map(a => (
            <div key={a.id} style={S.row}>
              <div style={{ ...S.ico, background: a.estado==='critico'?'#fde8ea':'#fef3dc' }}>
                {a.estado === 'critico' ? '🚨' : '⏰'}
              </div>
              <div style={S.info}>
                <div style={S.name}>{a.descripcion || a.animal?.nombre || 'Animal'}</div>
                <div style={S.det}>
                  {a.dias_restantes === 0 ? 'Vence hoy' : a.dias_restantes < 0 ? `Venció hace ${Math.abs(a.dias_restantes)} días` : `Vence en ${a.dias_restantes} días`}
                  {a.animal?.arete && ` · Arete: ${a.animal.arete}`}
                </div>
              </div>
              <Badge color={a.estado === 'critico' ? 'red' : 'amber'}>
                {a.estado === 'critico' ? 'Crítico' : 'Próximo'}
              </Badge>
              <button style={a.estado==='critico'?S.btnRed:S.btn} onClick={() => atender(a.id)}>
                Atender
              </button>
            </div>
          ))
        )}
      </div>

      {/* ALERTAS STOCK */}
      <div style={S.card}>
        <div style={S.cardH}>
          <div style={S.cardT}>📦 Stock crítico de insumos</div>
          <Badge color={stock.length > 0 ? 'amber' : 'green'}>
            {stock.length > 0 ? `${stock.length} insumos` : 'Stock OK'}
          </Badge>
        </div>
        {loading ? (
          <div style={{ padding:24, textAlign:'center', color:'#8d9e8d' }}>Cargando...</div>
        ) : stock.length === 0 ? (
          <EmptyState icon="✅" title="Stock en orden" description="Todos los insumos están sobre el mínimo."/>
        ) : (
          stock.map(a => (
            <div key={a.id} style={S.row}>
              <div style={{ ...S.ico, background:'#fef3dc' }}>📦</div>
              <div style={S.info}>
                <div style={S.name}>{a.insumo?.nombre || a.descripcion || 'Insumo'}</div>
                <div style={S.det}>
                  Stock actual: <strong>{a.cantidad_actual}</strong> · Mínimo: {a.cantidad_minima}
                  {a.insumo?.unidad && ` ${a.insumo.unidad}`}
                </div>
              </div>
              <Badge color="amber">Stock bajo</Badge>
              <button style={S.btn} onClick={() => atender(a.id)}>Atender</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}