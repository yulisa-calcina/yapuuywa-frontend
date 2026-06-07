import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const FORM_CICLO0 = { cultivo:'', variedad:'', fecha_siembra:'', fecha_cosecha_est:'', semilla_kg:'', superficie_ha:'', estado:'crecimiento', observaciones:'' }

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 },
  mc:    { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'14px 16px' },
  mcLbl: { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:4 },
  mcVal: { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1e2e1e' },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden', marginBottom:14 },
  cardH: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#f0f9f0,#fff)' },
  cardT: { fontSize:13, fontWeight:700, color:'#1a3a1a' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'9px 13px', textAlign:'left', fontSize:10, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', background:'#f7f9f7' },
  td:    { padding:'9px 13px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  acts:  { display:'flex', gap:4 },
  btn:   { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
  pcard: { background:'#f7f9f7', border:'1px solid #dde3dd', borderRadius:12, padding:'14px 16px', marginBottom:10 },
  pcardH:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  pcardT:{ fontSize:13, fontWeight:700, color:'#1a3a1a' },
  pcardS:{ fontSize:11, color:'#8d9e8d' },
}

const estadoColor = (e) => e==='crecimiento'?'green':e==='cosechado'?'blue':'red'
const estadoIco   = (e) => e==='crecimiento'?'🌱':e==='cosechado'?'🌾':'❌'

export default function Cultivos() {
  const { toast, show } = useToast()
  const [parcelas, setParcelas]   = useState([])
  const [ciclos, setCiclos]       = useState({})
  const [modal, setModal]         = useState(false)
  const [selectedParcela, setSelectedParcela] = useState(null)
  const [form, setForm]           = useState(FORM_CICLO0)
  const [saving, setSaving]       = useState(false)

  const load = async () => {
    try {
      const res = await apiClient.get('/parcelas')
      const ps  = res.data.data ?? res.data
      setParcelas(ps)
      const ciclosData = {}
      await Promise.all(ps.map(async p => {
        const r = await apiClient.get(`/parcelas/${p.id}/ciclos`)
        ciclosData[p.id] = r.data.data ?? r.data
      }))
      setCiclos(ciclosData)
    } catch (_) {}
  }

  useEffect(() => { load() }, [])

  const setField = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const totalCiclos      = Object.values(ciclos).flat().length
  const enCrecimiento    = Object.values(ciclos).flat().filter(c => c.estado === 'crecimiento').length
  const cosechados       = Object.values(ciclos).flat().filter(c => c.estado === 'cosechado').length

  const openModal = (parcela) => {
    setSelectedParcela(parcela)
    setForm(FORM_CICLO0)
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.post(`/parcelas/${selectedParcela.id}/ciclos`, form)
      show('Ciclo registrado correctamente')
      setModal(false)
      load()
    } catch (err) {
      show(err.response?.data?.message || 'Error al guardar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async (cicloId) => {
    if (!confirm('¿Eliminar este ciclo?')) return
    try { await apiClient.delete(`/ciclos/${cicloId}`); show('Ciclo eliminado'); load() }
    catch (_) { show('Error', 'error') }
  }

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Cultivos agrícolas</h1>
          <p style={S.sub}>Ciclos de siembra y cosecha por parcela</p>
        </div>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Total ciclos</div><div style={S.mcVal}>{totalCiclos}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>registrados</div></div>
        <div style={S.mc}><div style={S.mcLbl}>En crecimiento</div><div style={S.mcVal}>{enCrecimiento}</div><div style={{fontSize:11,color:'#2d7a40',fontWeight:500,marginTop:3}}>activos</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Cosechados</div><div style={S.mcVal}>{cosechados}</div><div style={{fontSize:11,color:'#c8a030',fontWeight:500,marginTop:3}}>completados</div></div>
      </div>

      {parcelas.length === 0 ? (
        <div style={S.card}>
          <EmptyState icon="📍" title="Sin parcelas" description="Primero registra una parcela en el módulo de Parcelas."/>
        </div>
      ) : (
        parcelas.map(p => (
          <div key={p.id} style={S.card}>
            <div style={S.cardH}>
              <div>
                <div style={S.cardT}>📍 {p.nombre} <span style={{fontSize:11,color:'#8d9e8d',fontWeight:400}}>({p.codigo})</span></div>
                <div style={{fontSize:11,color:'#8d9e8d',marginTop:2}}>{p.ubicacion||'Sin ubicación'} · {p.superficie_ha||'—'} ha · <Badge color={p.estado==='activo'?'green':'amber'}>{p.estado}</Badge></div>
              </div>
              <Button variant="primary" size="sm" icon="+" onClick={() => openModal(p)}>Nuevo ciclo</Button>
            </div>

            {(!ciclos[p.id] || ciclos[p.id].length === 0) ? (
              <div style={{padding:'20px'}}>
                <EmptyState icon="🌱" title="Sin ciclos" description="Registra el primer ciclo de cultivo para esta parcela."/>
              </div>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table style={S.table}>
                  <thead>
                    <tr>{['Cultivo','Variedad','Siembra','Cosecha est.','Semilla (kg)','Superficie (ha)','Estado',''].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {ciclos[p.id].map(c => (
                      <tr key={c.id}>
                        <td style={S.td}><strong>{c.cultivo}</strong></td>
                        <td style={S.td}>{c.variedad||'—'}</td>
                        <td style={S.td}>{c.fecha_siembra}</td>
                        <td style={S.td}>{c.fecha_cosecha_est||'—'}</td>
                        <td style={S.td}>{c.semilla_kg||'—'}</td>
                        <td style={S.td}>{c.superficie_ha||'—'}</td>
                        <td style={S.td}><Badge color={estadoColor(c.estado)}>{estadoIco(c.estado)} {c.estado}</Badge></td>
                        <td style={S.td}>
                          <button style={S.btn} onClick={() => handleDelete(c.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title={`Nuevo ciclo — ${selectedParcela?.nombre}`}>
        <form onSubmit={handleSave}>
          <div style={S.row2}>
            <FormGroup label="Cultivo" required>
              <Input placeholder="Ej: Papa, Quinua, Cebada" value={form.cultivo} onChange={setField('cultivo')} required/>
            </FormGroup>
            <FormGroup label="Variedad">
              <Input placeholder="Ej: Huayro, Blanca" value={form.variedad} onChange={setField('variedad')}/>
            </FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Fecha de siembra" required>
              <Input type="date" value={form.fecha_siembra} onChange={setField('fecha_siembra')} required/>
            </FormGroup>
            <FormGroup label="Fecha estimada de cosecha">
              <Input type="date" value={form.fecha_cosecha_est} onChange={setField('fecha_cosecha_est')}/>
            </FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Semilla (kg)">
              <Input type="number" step="0.1" placeholder="0" value={form.semilla_kg} onChange={setField('semilla_kg')}/>
            </FormGroup>
            <FormGroup label="Superficie (ha)">
              <Input type="number" step="0.01" placeholder="0" value={form.superficie_ha} onChange={setField('superficie_ha')}/>
            </FormGroup>
          </div>
          <FormGroup label="Estado">
            <Select value={form.estado} onChange={setField('estado')}>
              <option value="crecimiento">🌱 En crecimiento</option>
              <option value="cosechado">🌾 Cosechado</option>
              <option value="perdido">❌ Perdido</option>
            </Select>
          </FormGroup>
          <FormGroup label="Observaciones">
            <Input placeholder="Notas adicionales..." value={form.observaciones} onChange={setField('observaciones')}/>
          </FormGroup>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':'Registrar ciclo'}</Button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}