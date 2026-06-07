import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const FORM0 = { codigo:'', nombre:'', ubicacion:'', superficie_ha:'', tipo_suelo:'franco', riego:'lluvia', estado:'activo' }
const CICLO0 = { cultivo:'', variedad:'', fecha_siembra:'', fecha_cosecha_est:'', semilla_kg:'', superficie_ha:'', estado:'crecimiento', observaciones:'' }

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 },
  mc:    { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'14px 16px' },
  mcLbl: { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:4 },
  mcVal: { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1e2e1e' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden' },
  cardH: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 },
  cardT: { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', background:'#f7f9f7' },
  td:    { padding:'10px 14px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  acts:  { display:'flex', gap:4 },
  btn:   { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
}

export default function ParcelaList() {
  const { toast, show } = useToast()
  const [parcelas, setParcelas]   = useState([])
  const [ciclos, setCiclos]       = useState([])
  const [selected, setSelected]   = useState(null)
  const [modal, setModal]         = useState(false)
  const [cicloModal, setCicloModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(FORM0)
  const [cicloForm, setCicloForm] = useState(CICLO0)
  const [saving, setSaving]       = useState(false)

  const load = async () => {
    try {
      const res = await apiClient.get('/parcelas')
      setParcelas(res.data.data ?? res.data)
    } catch (_) {}
  }

  const loadCiclos = async (parcelaId) => {
    try {
      const res = await apiClient.get(`/parcelas/${parcelaId}/ciclos`)
      setCiclos(res.data.data ?? res.data)
    } catch (_) { setCiclos([]) }
  }

  useEffect(() => { load() }, [])

  const activas   = parcelas.filter(p => p.estado === 'activo').length
  const totalHa   = parcelas.reduce((s, p) => s + parseFloat(p.superficie_ha || 0), 0)

  const openCreate  = () => { setEditing(null); setForm(FORM0); setModal(true) }
  const openEdit    = (p) => { setEditing(p); setForm({ codigo:p.codigo, nombre:p.nombre, ubicacion:p.ubicacion||'', superficie_ha:p.superficie_ha||'', tipo_suelo:p.tipo_suelo||'franco', riego:p.riego||'lluvia', estado:p.estado }); setModal(true) }
  const openCiclo   = (p) => { setSelected(p); setCicloForm(CICLO0); loadCiclos(p.id); setCicloModal(true) }
  const setField    = k   => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setCField   = k   => e => setCicloForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await apiClient.put(`/parcelas/${editing.id}`, form)
        show('Parcela actualizada')
      } else {
        await apiClient.post('/parcelas', form)
        show('Parcela registrada')
      }
      setModal(false)
      load()
    } catch (err) {
      show(err.response?.data?.message || 'Error al guardar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta parcela?')) return
    try { await apiClient.delete(`/parcelas/${id}`); show('Parcela eliminada'); load() }
    catch (_) { show('Error', 'error') }
  }

  const handleSaveCiclo = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.post(`/parcelas/${selected.id}/ciclos`, cicloForm)
      show('Ciclo registrado correctamente')
      loadCiclos(selected.id)
      setCicloForm(CICLO0)
    } catch (_) { show('Error al guardar ciclo', 'error') }
    finally { setSaving(false) }
  }

  const estadoColor = (e) => e==='activo'?'green':e==='descanso'?'amber':'gray'
  const cicloColor  = (e) => e==='crecimiento'?'green':e==='cosechado'?'blue':'red'

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Parcelas agrícolas</h1>
          <p style={S.sub}>Gestión de terrenos de cultivo</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={openCreate}>Nueva parcela</Button>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Total parcelas</div><div style={S.mcVal}>{parcelas.length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>registradas</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Activas</div><div style={S.mcVal}>{activas}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>en uso</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Total hectáreas</div><div style={S.mcVal}>{totalHa.toFixed(1)} ha</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>superficie total</div></div>
      </div>

      <div style={S.card}>
        <div style={S.cardH}>
          <span style={S.cardT}>Lista de parcelas</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={S.table}>
            <thead>
              <tr>{['Código','Nombre','Ubicación','Superficie','Suelo','Riego','Estado','Acciones'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {parcelas.length===0
                ? <tr><td colSpan={8}><EmptyState icon="📍" title="Sin parcelas" description="Registra tu primera parcela."/></td></tr>
                : parcelas.map(p=>(
                  <tr key={p.id}>
                    <td style={S.td}><strong>{p.codigo}</strong></td>
                    <td style={S.td}>{p.nombre}</td>
                    <td style={S.td}>{p.ubicacion||'—'}</td>
                    <td style={S.td}>{p.superficie_ha ? `${p.superficie_ha} ha` : '—'}</td>
                    <td style={S.td}>{p.tipo_suelo||'—'}</td>
                    <td style={S.td}>{p.riego||'—'}</td>
                    <td style={S.td}><Badge color={estadoColor(p.estado)}>{p.estado}</Badge></td>
                    <td style={S.td}>
                      <div style={S.acts}>
                        <button style={S.btn} title="Ver ciclos" onClick={()=>openCiclo(p)}>🌱</button>
                        <button style={S.btn} title="Editar" onClick={()=>openEdit(p)}>✏️</button>
                        <button style={S.btn} title="Eliminar" onClick={()=>handleDelete(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARCELA */}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar parcela':'Nueva parcela'}>
        <form onSubmit={handleSave}>
          <div style={S.row2}>
            <FormGroup label="Código" required><Input placeholder="Ej: P-001" value={form.codigo} onChange={setField('codigo')} required/></FormGroup>
            <FormGroup label="Nombre" required><Input placeholder="Ej: Parcela Norte" value={form.nombre} onChange={setField('nombre')} required/></FormGroup>
          </div>
          <FormGroup label="Ubicación"><Input placeholder="Ej: Sector Huayro, Azángaro" value={form.ubicacion} onChange={setField('ubicacion')}/></FormGroup>
          <div style={S.row2}>
            <FormGroup label="Superficie (ha)"><Input type="number" step="0.01" placeholder="0.0" value={form.superficie_ha} onChange={setField('superficie_ha')}/></FormGroup>
            <FormGroup label="Estado" required>
              <Select value={form.estado} onChange={setField('estado')} required>
                <option value="activo">Activo</option>
                <option value="descanso">En descanso</option>
                <option value="preparacion">En preparación</option>
              </Select>
            </FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Tipo de suelo">
              <Select value={form.tipo_suelo} onChange={setField('tipo_suelo')}>
                {['arcilloso','arenoso','franco','limoso','otro'].map(s=><option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Sistema de riego">
              <Select value={form.riego} onChange={setField('riego')}>
                {['lluvia','canal','aspersion','goteo','otro'].map(r=><option key={r}>{r}</option>)}
              </Select>
            </FormGroup>
          </div>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':editing?'Actualizar':'Guardar parcela'}</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL CICLOS */}
      <Modal open={cicloModal} onClose={()=>setCicloModal(false)} title={`Ciclos de cultivo — ${selected?.nombre}`} width={700}>
        <div style={{marginBottom:20}}>
          <h4 style={{fontSize:13,fontWeight:600,color:'#1e2e1e',marginBottom:12}}>Registrar nuevo ciclo</h4>
          <form onSubmit={handleSaveCiclo}>
            <div style={S.row2}>
              <FormGroup label="Cultivo" required><Input placeholder="Ej: Papa, Quinua" value={cicloForm.cultivo} onChange={setCField('cultivo')} required/></FormGroup>
              <FormGroup label="Variedad"><Input placeholder="Ej: Huayro, Blanca" value={cicloForm.variedad} onChange={setCField('variedad')}/></FormGroup>
            </div>
            <div style={S.row2}>
              <FormGroup label="Fecha de siembra" required><Input type="date" value={cicloForm.fecha_siembra} onChange={setCField('fecha_siembra')} required/></FormGroup>
              <FormGroup label="Fecha estimada de cosecha"><Input type="date" value={cicloForm.fecha_cosecha_est} onChange={setCField('fecha_cosecha_est')}/></FormGroup>
            </div>
            <div style={S.row2}>
              <FormGroup label="Semilla (kg)"><Input type="number" step="0.1" placeholder="0" value={cicloForm.semilla_kg} onChange={setCField('semilla_kg')}/></FormGroup>
              <FormGroup label="Estado">
                <Select value={cicloForm.estado} onChange={setCField('estado')}>
                  <option value="crecimiento">En crecimiento</option>
                  <option value="cosechado">Cosechado</option>
                  <option value="perdido">Perdido</option>
                </Select>
              </FormGroup>
            </div>
            <div style={S.mfoot}>
              <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':'Registrar ciclo'}</Button>
            </div>
          </form>
        </div>

        <h4 style={{fontSize:13,fontWeight:600,color:'#1e2e1e',marginBottom:10}}>Historial de ciclos</h4>
        {ciclos.length===0
          ? <EmptyState icon="🌱" title="Sin ciclos" description="Registra el primer ciclo de cultivo."/>
          : (
            <table style={S.table}>
              <thead><tr>{['Cultivo','Variedad','Siembra','Cosecha est.','Estado'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {ciclos.map(c=>(
                  <tr key={c.id}>
                    <td style={S.td}><strong>{c.cultivo}</strong></td>
                    <td style={S.td}>{c.variedad||'—'}</td>
                    <td style={S.td}>{c.fecha_siembra}</td>
                    <td style={S.td}>{c.fecha_cosecha_est||'—'}</td>
                    <td style={S.td}><Badge color={cicloColor(c.estado)}>{c.estado}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}