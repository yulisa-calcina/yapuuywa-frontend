import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const FORM0 = { nombre:'', dni:'', tipo:'jornalero', cargo:'', salario_diario:'', telefono:'' }

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 },
  mc:    { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'14px 16px' },
  mcLbl: { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:4 },
  mcVal: { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1e2e1e' },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden' },
  cardH: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 },
  cardT: { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', letterSpacing:'.03em', background:'#f7f9f7' },
  td:    { padding:'10px 14px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  acts:  { display:'flex', gap:4 },
  btn:   { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
  jcard: { background:'#eef7f0', border:'1px solid #c0ddc8', borderRadius:14, padding:20, marginTop:16 },
  jrow:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, fontSize:13 },
  jtotal:{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:700, color:'#1a5c2a' },
}

export default function PersonalList() {
  const { toast, show } = useToast()
  const [personal, setPersonal] = useState([])
  const [modal, setModal]       = useState(false)
  const [jornalModal, setJornalModal] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(FORM0)
  const [dias, setDias]         = useState('')
  const [jornal, setJornal]     = useState(null)
  const [saving, setSaving]     = useState(false)

  const load = async () => {
    try {
      const res = await apiClient.get('/personal')
      setPersonal(res.data.data ?? res.data)
    } catch (_) {}
  }

  useEffect(() => { load() }, [])

  const activos    = personal.filter(p => p.activo).length
  const jornaleros = personal.filter(p => p.tipo === 'jornalero').length

  const openCreate  = () => { setEditing(null); setForm(FORM0); setModal(true) }
  const openEdit    = (p) => { setEditing(p); setForm({ nombre:p.nombre, dni:p.dni, tipo:p.tipo, cargo:p.cargo||'', salario_diario:p.salario_diario, telefono:p.telefono||'' }); setModal(true) }
  const openJornal  = (p) => { setSelected(p); setDias(''); setJornal(null); setJornalModal(true) }
  const setField    = k   => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await apiClient.put(`/personal/${editing.id}`, form)
        show('Trabajador actualizado')
      } else {
        await apiClient.post('/personal', form)
        show('Trabajador registrado')
      }
      setModal(false)
      load()
    } catch (err) {
      show(err.response?.data?.message || 'Error al guardar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este trabajador?')) return
    try {
      await apiClient.delete(`/personal/${id}`)
      show('Trabajador eliminado')
      load()
    } catch (_) { show('Error al eliminar', 'error') }
  }

  const calcularJornal = async () => {
    if (!dias || dias < 1) return
    try {
      const res = await apiClient.post(`/personal/${selected.id}/jornal`, { dias_trabajados: dias })
      setJornal(res.data.data)
    } catch (_) { show('Error al calcular', 'error') }
  }

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Personal y jornales</h1>
          <p style={S.sub}>Registro de trabajadores y cálculo automático de pago</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={openCreate}>Nuevo trabajador</Button>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Total trabajadores</div><div style={S.mcVal}>{personal.length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>registrados</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Activos</div><div style={S.mcVal}>{activos}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>en planilla</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Jornaleros</div><div style={S.mcVal}>{jornaleros}</div><div style={{fontSize:11,color:'#7a4f08',fontWeight:500,marginTop:3}}>eventuales</div></div>
      </div>

      <div style={S.card}>
        <div style={S.cardH}>
          <span style={S.cardT}>Lista de trabajadores</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={S.table}>
            <thead>
              <tr>{['Nombre','DNI','Tipo','Cargo','Salario/día','Teléfono','Estado','Acciones'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {personal.length===0
                ? <tr><td colSpan={8}><EmptyState icon="👷" title="Sin trabajadores" description="Registra tu primer trabajador."/></td></tr>
                : personal.map(p=>(
                  <tr key={p.id}>
                    <td style={S.td}><strong>{p.nombre}</strong></td>
                    <td style={S.td}>{p.dni}</td>
                    <td style={S.td}><Badge color={p.tipo==='permanente'?'green':'amber'}>{p.tipo}</Badge></td>
                    <td style={S.td}>{p.cargo||'—'}</td>
                    <td style={S.td}>S/ {parseFloat(p.salario_diario).toFixed(2)}</td>
                    <td style={S.td}>{p.telefono||'—'}</td>
                    <td style={S.td}><Badge color={p.activo?'green':'gray'}>{p.activo?'activo':'inactivo'}</Badge></td>
                    <td style={S.td}>
                      <div style={S.acts}>
                        <button style={S.btn} title="Calcular jornal" onClick={()=>openJornal(p)}>💰</button>
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

      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar trabajador':'Registrar nuevo trabajador'}>
        <form onSubmit={handleSave}>
          <FormGroup label="Nombre completo" required><Input placeholder="Ej: Juan Mamani Quispe" value={form.nombre} onChange={setField('nombre')} required/></FormGroup>
          <div style={S.row2}>
            <FormGroup label="DNI" required><Input placeholder="8 dígitos" maxLength={8} value={form.dni} onChange={setField('dni')} required/></FormGroup>
            <FormGroup label="Teléfono"><Input placeholder="Ej: 987654321" value={form.telefono} onChange={setField('telefono')}/></FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Tipo" required>
              <Select value={form.tipo} onChange={setField('tipo')} required>
                <option value="jornalero">Jornalero eventual</option>
                <option value="permanente">Permanente</option>
              </Select>
            </FormGroup>
            <FormGroup label="Cargo"><Input placeholder="Ej: Vaquero" value={form.cargo} onChange={setField('cargo')}/></FormGroup>
          </div>
          <FormGroup label="Salario diario (S/)" required>
            <Input type="number" step="0.01" placeholder="0.00" value={form.salario_diario} onChange={setField('salario_diario')} required/>
          </FormGroup>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':editing?'Actualizar':'Guardar trabajador'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={jornalModal} onClose={()=>setJornalModal(false)} title={`Calcular jornal — ${selected?.nombre}`} width={420}>
        <div style={{marginBottom:16}}>
          <FormGroup label="Días trabajados">
            <Input type="number" min="1" placeholder="Ej: 15" value={dias} onChange={e=>setDias(e.target.value)}/>
          </FormGroup>
          <Button variant="primary" size="md" onClick={calcularJornal}>Calcular jornal</Button>
        </div>
        {jornal && (
          <div style={S.jcard}>
            <div style={S.jrow}><span>Trabajador:</span><strong>{jornal.trabajador}</strong></div>
            <div style={S.jrow}><span>Días trabajados:</span><strong>{jornal.dias_trabajados}</strong></div>
            <div style={S.jrow}><span>Salario diario:</span><strong>S/ {parseFloat(jornal.salario_diario).toFixed(2)}</strong></div>
            <hr style={{border:'none',borderTop:'1px solid #c0ddc8',margin:'10px 0'}}/>
            <div style={S.jrow}><span style={{fontWeight:600}}>Total a pagar:</span><div style={S.jtotal}>S/ {parseFloat(jornal.total_pagar).toFixed(2)}</div></div>
          </div>
        )}
        <div style={S.mfoot}>
          <Button variant="ghost" onClick={()=>setJornalModal(false)}>Cerrar</Button>
        </div>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}