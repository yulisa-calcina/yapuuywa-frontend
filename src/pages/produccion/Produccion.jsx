import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import { useGanado } from '../../hooks/index'
import apiClient from '../../api/axiosConfig'

const TIPOS = ['leche','lana','huevo','carne','otro']
const UNIDADES = { leche:'litros', lana:'kg', huevo:'unidades', carne:'kg', otro:'kg' }
const FORM0 = { fecha:'', tipo:'leche', cantidad:'', unidad:'litros', animal_id:'', precio_unitario:'', observaciones:'' }

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid4: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 },
  mc:    { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'14px 16px' },
  mcLbl: { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:4 },
  mcVal: { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1e2e1e' },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden' },
  cardH: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between' },
  cardT: { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'9px 13px', textAlign:'left', fontSize:10, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', background:'#f7f9f7' },
  td:    { padding:'9px 13px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  btn:   { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
}

const tipoColor = (t) => t==='leche'?'blue':t==='lana'?'amber':t==='huevo'?'green':t==='carne'?'red':'gray'
const tipoIco   = (t) => t==='leche'?'🥛':t==='lana'?'🐑':t==='huevo'?'🥚':t==='carne'?'🥩':'📦'

export default function Produccion() {
  const { toast, show } = useToast()
  const { ganado }      = useGanado()
  const [registros, setRegistros] = useState([])
  const [resumen, setResumen]     = useState([])
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState(FORM0)
  const [saving, setSaving]       = useState(false)

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        apiClient.get('/producciones'),
        apiClient.get('/producciones-resumen'),
      ])
      setRegistros(r.data.data ?? r.data)
      setResumen(s.data.data ?? s.data)
    } catch (_) {}
  }

  useEffect(() => { load() }, [])

  const setField = k => e => {
    const val = e.target.value
    setForm(f => ({
      ...f,
      [k]: val,
      ...(k === 'tipo' ? { unidad: UNIDADES[val] || 'kg' } : {}),
    }))
  }

  const totalProduccion = registros.reduce((s, r) => s + parseFloat(r.cantidad || 0), 0)
  const totalIngresos   = registros.reduce((s, r) => s + parseFloat(r.total || 0), 0)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.post('/producciones', form)
      show('Producción registrada correctamente')
      setModal(false)
      setForm(FORM0)
      load()
    } catch (err) {
      show(err.response?.data?.message || 'Error al guardar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este registro?')) return
    try { await apiClient.delete(`/producciones/${id}`); show('Registro eliminado'); load() }
    catch (_) { show('Error', 'error') }
  }

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Registro de producción</h1>
          <p style={S.sub}>Leche, lana, huevos y otros productos</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={() => setModal(true)}>Nuevo registro</Button>
      </div>

      <div style={S.grid4}>
        <div style={S.mc}><div style={S.mcLbl}>Total registros</div><div style={S.mcVal}>{registros.length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>registrados</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Total producción</div><div style={S.mcVal}>{totalProduccion.toFixed(1)}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>unidades</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Total ingresos</div><div style={S.mcVal}>S/ {totalIngresos.toFixed(2)}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>estimado</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Tipos</div><div style={S.mcVal}>{resumen.length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>distintos</div></div>
      </div>

      {resumen.length > 0 && (
        <div style={S.grid3}>
          {resumen.map(r => (
            <div key={r.tipo} style={S.mc}>
              <div style={{fontSize:24,marginBottom:6}}>{tipoIco(r.tipo)}</div>
              <div style={S.mcLbl}>{r.tipo.charAt(0).toUpperCase()+r.tipo.slice(1)}</div>
              <div style={S.mcVal}>{parseFloat(r.total_cantidad).toFixed(1)}</div>
              <div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>{r.registros} registros · S/ {parseFloat(r.total_ingresos||0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      <div style={S.card}>
        <div style={S.cardH}>
          <span style={S.cardT}>Historial de producción</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={S.table}>
            <thead>
              <tr>{['Fecha','Tipo','Animal','Cantidad','Precio unit.','Total','Observaciones',''].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {registros.length===0
                ? <tr><td colSpan={8}><EmptyState icon="🥛" title="Sin registros" description="Registra tu primera producción."/></td></tr>
                : registros.map(r=>(
                  <tr key={r.id}>
                    <td style={S.td}>{r.fecha}</td>
                    <td style={S.td}><Badge color={tipoColor(r.tipo)}>{tipoIco(r.tipo)} {r.tipo}</Badge></td>
                    <td style={S.td}>{r.animal?`${r.animal.nombre} (${r.animal.arete})`:'—'}</td>
                    <td style={S.td}><strong>{r.cantidad} {r.unidad}</strong></td>
                    <td style={S.td}>{r.precio_unitario?`S/ ${parseFloat(r.precio_unitario).toFixed(2)}`:'—'}</td>
                    <td style={S.td}>{r.total?<strong style={{color:'#1a5c2a'}}>S/ {parseFloat(r.total).toFixed(2)}</strong>:'—'}</td>
                    <td style={S.td}>{r.observaciones||'—'}</td>
                    <td style={S.td}><button style={S.btn} onClick={()=>handleDelete(r.id)}>🗑️</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Nuevo registro de producción">
        <form onSubmit={handleSave}>
          <div style={S.row2}>
            <FormGroup label="Fecha" required>
              <Input type="date" value={form.fecha} onChange={setField('fecha')} required/>
            </FormGroup>
            <FormGroup label="Tipo" required>
              <Select value={form.tipo} onChange={setField('tipo')} required>
                {TIPOS.map(t=><option key={t} value={t}>{tipoIco(t)} {t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </Select>
            </FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Cantidad" required>
              <Input type="number" step="0.01" placeholder="0" value={form.cantidad} onChange={setField('cantidad')} required/>
            </FormGroup>
            <FormGroup label="Unidad" required>
              <Input placeholder="litros, kg, unidades" value={form.unidad} onChange={setField('unidad')} required/>
            </FormGroup>
          </div>
          <FormGroup label="Animal (opcional)">
            <Select value={form.animal_id} onChange={setField('animal_id')}>
              <option value="">Sin animal específico</option>
              {ganado.map(a=><option key={a.id} value={a.id}>{a.nombre} ({a.arete})</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="Precio unitario (S/)">
            <Input type="number" step="0.01" placeholder="0.00" value={form.precio_unitario} onChange={setField('precio_unitario')}/>
          </FormGroup>
          <FormGroup label="Observaciones">
            <Input placeholder="Notas adicionales..." value={form.observaciones} onChange={setField('observaciones')}/>
          </FormGroup>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':'Guardar registro'}</Button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}