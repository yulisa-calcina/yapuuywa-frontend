import { useState, useMemo } from 'react'
import { useGanado, useToast } from '../../hooks/index'
import { Modal, Button, Badge, Spinner, EmptyState, FormGroup, Input, Select, Toast } from '../../components/ui/index'

const ESPECIES = ['bovino','ovino','porcino','alpaca','camélido','caprino','equino']
const ESTADOS  = ['activo','vendido','muerto']
const FORM0    = { arete:'', nombre:'', especie:'', raza:'', fecha_nac:'', peso_kg:'', estado:'activo' }

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  acts:  { display:'flex', gap:8 },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 },
  mc:    { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'14px 16px' },
  mcLbl: { fontSize:11, color:'#8d9e8d', fontWeight:500, marginBottom:4 },
  mcVal: { fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1e2e1e' },
  mcSub: { fontSize:11, color:'#3b8c52', fontWeight:500, marginTop:3 },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden' },
  cardH: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 },
  cardT: { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  search:{ fontSize:12, padding:'7px 12px', border:'1.5px solid #dde3dd', borderRadius:10, color:'#1e2e1e', background:'#fff', outline:'none', width:240, fontFamily:'inherit' },
  wrap:  { overflowX:'auto' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', letterSpacing:'.03em', textTransform:'uppercase', background:'#f7f9f7', whiteSpace:'nowrap' },
  td:    { padding:'10px 14px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  tdA:   { display:'flex', gap:4 },
  tdBtn: { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
  load:  { display:'flex', alignItems:'center', gap:8, justifyContent:'center', padding:32, color:'#8d9e8d', fontSize:13 },
}

export default function GanadoList() {
  const { ganado, loading, error, create, update, remove } = useGanado()
  const { toast, show } = useToast()
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(FORM0)
  const [query, setQuery]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = useMemo(() =>
    query ? ganado.filter(a =>
      a.nombre?.toLowerCase().includes(query.toLowerCase()) ||
      a.arete?.toLowerCase().includes(query.toLowerCase())  ||
      a.especie?.toLowerCase().includes(query.toLowerCase()))
    : ganado, [ganado, query])

  const totalActivos = ganado.filter(a=>a.estado==='activo').length
  const pesoPromedio = ganado.length ? (ganado.reduce((s,a)=>s+(parseFloat(a.peso_kg)||0),0)/ganado.length).toFixed(1) : 0

  const openCreate = () => { setEditing(null); setForm(FORM0); setModal(true) }
  const openEdit   = (a)  => { setEditing(a); setForm({ arete:a.arete||'', nombre:a.nombre||'', especie:a.especie||'', raza:a.raza||'', fecha_nac:a.fecha_nac||'', peso_kg:a.peso_kg||'', estado:a.estado||'activo' }); setModal(true) }
  const setField   = k    => e => setForm(f=>({...f,[k]:e.target.value}))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.arete || !form.nombre || !form.especie) return
    setSaving(true)
    const payload = {...form, peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null}
    const result = editing ? await update(editing.id, payload) : await create(payload)
    setSaving(false)
    if (result.success) { show(editing?'Animal actualizado':'Animal registrado'); setModal(false) }
    else show('Error al guardar', 'error')
  }

  const handleDelete = async (id) => {
    const r = await remove(id)
    if (r.success) show('Animal eliminado')
    setConfirmId(null)
  }

  const estadoBadge = (e) => {
    const map = {activo:'green', vendido:'blue', muerto:'red'}
    return <Badge color={map[e]||'gray'}>{e}</Badge>
  }

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Inventario de ganado</h1>
          <p style={S.sub}>Registro individual por arete · {totalActivos} animales activos</p>
        </div>
        <div style={S.acts}>
          <Button variant="secondary" size="sm" icon="📄">Exportar PDF</Button>
          <Button variant="primary"   size="sm" icon="+" onClick={openCreate}>Nuevo animal</Button>
        </div>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Total activos</div><div style={S.mcVal}>{totalActivos}</div><div style={S.mcSub}>en inventario</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Peso promedio</div><div style={S.mcVal}>{pesoPromedio} kg</div><div style={S.mcSub}>del lote</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Especies</div><div style={S.mcVal}>{[...new Set(ganado.map(a=>a.especie))].length}</div><div style={S.mcSub}>distintas</div></div>
      </div>

      <div style={S.card}>
        <div style={S.cardH}>
          <span style={S.cardT}>Lista de animales</span>
          <input style={S.search} placeholder="🔍 Buscar por arete, nombre o especie..." value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        {loading && <div style={S.load}><Spinner/>Cargando...</div>}
        {error   && <div style={{padding:'12px 16px', background:'#fde8ea', color:'#8b1a24', fontSize:12}}>{error}</div>}
        {!loading && (
          <div style={S.wrap}>
            <table style={S.table}>
              <thead>
                <tr>{['Arete','Nombre','Especie','Raza','Peso (kg)','Estado','Acciones'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length===0
                  ? <tr><td colSpan={7}><EmptyState icon="🐄" title="Sin animales" description="Registra tu primer animal con 'Nuevo animal'."/></td></tr>
                  : filtered.map(a=>(
                    <tr key={a.id} onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background='#f7f9f7')} onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background='')}>
                      <td style={S.td}><strong>{a.arete}</strong></td>
                      <td style={S.td}>{a.nombre}</td>
                      <td style={S.td}>{a.especie}</td>
                      <td style={S.td}>{a.raza||'—'}</td>
                      <td style={S.td}>{a.peso_kg?`${a.peso_kg} kg`:'—'}</td>
                      <td style={S.td}>{estadoBadge(a.estado)}</td>
                      <td style={S.td}>
                        <div style={S.tdA}>
                          <button style={S.tdBtn} title="Historial" onClick={()=>{}}>🩺</button>
                          <button style={S.tdBtn} title="Editar"    onClick={()=>openEdit(a)}>✏️</button>
                          <button style={{...S.tdBtn}} title="Eliminar" onClick={()=>setConfirmId(a.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar animal':'Registrar nuevo animal'}>
        <form onSubmit={handleSave}>
          <FormGroup label="Código de arete" required><Input placeholder="Ej: A-004" value={form.arete} onChange={setField('arete')} required/></FormGroup>
          <FormGroup label="Nombre del animal" required><Input placeholder="Ej: Vaquita Andina" value={form.nombre} onChange={setField('nombre')} required/></FormGroup>
          <div style={S.row2}>
            <FormGroup label="Especie" required><Select value={form.especie} onChange={setField('especie')} required><option value="">Seleccionar...</option>{ESPECIES.map(e=><option key={e}>{e}</option>)}</Select></FormGroup>
            <FormGroup label="Raza"><Input placeholder="Ej: Criollo" value={form.raza} onChange={setField('raza')}/></FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Fecha de nacimiento"><Input type="date" value={form.fecha_nac} onChange={setField('fecha_nac')}/></FormGroup>
            <FormGroup label="Peso actual (kg)"><Input type="number" step="0.1" placeholder="0.0" value={form.peso_kg} onChange={setField('peso_kg')}/></FormGroup>
          </div>
          <FormGroup label="Estado" required><Select value={form.estado} onChange={setField('estado')} required>{ESTADOS.map(s=><option key={s}>{s}</option>)}</Select></FormGroup>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':editing?'Actualizar':'Guardar animal'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmId} onClose={()=>setConfirmId(null)} title="Confirmar eliminación" width={400}>
        <p style={{fontSize:13,color:'#4a5e4a',marginBottom:20}}>¿Eliminar este animal del inventario? Esta acción no se puede deshacer.</p>
        <div style={S.mfoot}>
          <Button variant="ghost" onClick={()=>setConfirmId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={()=>handleDelete(confirmId)}>Sí, eliminar</Button>
        </div>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}
