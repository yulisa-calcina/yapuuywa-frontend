import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import { insumosApi } from '../../api/services'

const CATEGORIAS = ['agricola','veterinario','general']
const FORM0 = { nombre:'', categoria:'agricola', unidad:'kg', stock_actual:'', stock_minimo:'', proveedor:'', precio_unitario:'' }

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
  search:{ fontSize:12, padding:'7px 12px', border:'1.5px solid #dde3dd', borderRadius:10, color:'#1e2e1e', background:'#fff', outline:'none', width:220, fontFamily:'inherit' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', letterSpacing:'.03em', background:'#f7f9f7' },
  td:    { padding:'10px 14px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  acts:  { display:'flex', gap:4 },
  btn:   { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
  prog:  { height:6, borderRadius:3, background:'#eef1ee', overflow:'hidden', marginTop:6 },
  progBar: { height:'100%', borderRadius:3, transition:'width .3s' },
}

export default function InsumoList() {
  const { toast, show } = useToast()
  const [insumos, setInsumos]   = useState([])
  const [modal, setModal]       = useState(false)
  const [movModal, setMovModal] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(FORM0)
  const [movForm, setMovForm]   = useState({ tipo:'entrada', cantidad:'' })
  const [saving, setSaving]     = useState(false)
  const [query, setQuery]       = useState('')

  const load = async () => {
    try {
      const res = await insumosApi.getAll()
      setInsumos(res.data.data ?? res.data)
    } catch (_) {}
  }

  useEffect(() => { load() }, [])

  const filtered = query
    ? insumos.filter(i => i.nombre?.toLowerCase().includes(query.toLowerCase()))
    : insumos

  const criticos = insumos.filter(i => i.stock_actual <= i.stock_minimo).length

  const openCreate = () => { setEditing(null); setForm(FORM0); setModal(true) }
  const openEdit   = (i)  => { setEditing(i); setForm({ nombre:i.nombre, categoria:i.categoria, unidad:i.unidad, stock_actual:i.stock_actual, stock_minimo:i.stock_minimo, proveedor:i.proveedor||'', precio_unitario:i.precio_unitario||'' }); setModal(true) }
  const openMov    = (i)  => { setSelected(i); setMovForm({ tipo:'entrada', cantidad:'' }); setMovModal(true) }
  const setField   = k    => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await insumosApi.update(editing.id, form)
        show('Insumo actualizado')
      } else {
        await insumosApi.create(form)
        show('Insumo registrado')
      }
      setModal(false)
      load()
    } catch (_) { show('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este insumo?')) return
    try {
      await insumosApi.remove(id)
      show('Insumo eliminado')
      load()
    } catch (_) { show('Error al eliminar', 'error') }
  }

  const handleMovimiento = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await insumosApi.movimiento(selected.id, movForm)
      show(`${movForm.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada`)
      setMovModal(false)
      load()
    } catch (err) {
      show(err.response?.data?.message || 'Error', 'error')
    } finally { setSaving(false) }
  }

  const catColor  = (c) => c==='veterinario'?'amber':c==='agricola'?'green':'blue'
  const stockColor = (i) => i.stock_actual <= i.stock_minimo ? '#dc3545' : '#2d7a40'
  const stockPct   = (i) => i.stock_minimo > 0 ? Math.min(100, (i.stock_actual / (i.stock_minimo * 3)) * 100) : 100

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Inventario de insumos</h1>
          <p style={S.sub}>Control de semillas, fertilizantes y medicamentos</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={openCreate}>Nuevo insumo</Button>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Total insumos</div><div style={S.mcVal}>{insumos.length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>registrados</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Stock crítico</div><div style={S.mcVal}>{criticos}</div><div style={{fontSize:11,color:criticos>0?'#8b1a24':'#3b8c52',fontWeight:500,marginTop:3}}>{criticos>0?'reponer urgente':'todo en orden'}</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Categorías</div><div style={S.mcVal}>{[...new Set(insumos.map(i=>i.categoria))].length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>distintas</div></div>
      </div>

      <div style={S.card}>
        <div style={S.cardH}>
          <span style={S.cardT}>Lista de insumos</span>
          <input style={S.search} placeholder="🔍 Buscar insumo..." value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={S.table}>
            <thead>
              <tr>{['Nombre','Categoría','Stock actual','Stock mínimo','Unidad','Proveedor','Acciones'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={7}><EmptyState icon="📦" title="Sin insumos" description="Registra tu primer insumo con 'Nuevo insumo'."/></td></tr>
                : filtered.map(i=>(
                  <tr key={i.id}>
                    <td style={S.td}><strong>{i.nombre}</strong></td>
                    <td style={S.td}><Badge color={catColor(i.categoria)}>{i.categoria}</Badge></td>
                    <td style={S.td}>
                      <div style={{color:stockColor(i),fontWeight:600}}>{i.stock_actual} {i.unidad}</div>
                      <div style={S.prog}><div style={{...S.progBar,width:`${stockPct(i)}%`,background:stockColor(i)}}/></div>
                    </td>
                    <td style={S.td}>{i.stock_minimo} {i.unidad}</td>
                    <td style={S.td}>{i.unidad}</td>
                    <td style={S.td}>{i.proveedor||'—'}</td>
                    <td style={S.td}>
                      <div style={S.acts}>
                        <button style={S.btn} title="Movimiento" onClick={()=>openMov(i)}>📥</button>
                        <button style={S.btn} title="Editar" onClick={()=>openEdit(i)}>✏️</button>
                        <button style={S.btn} title="Eliminar" onClick={()=>handleDelete(i.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar insumo':'Registrar nuevo insumo'}>
        <form onSubmit={handleSave}>
          <FormGroup label="Nombre" required><Input placeholder="Ej: Vacuna aftosa" value={form.nombre} onChange={setField('nombre')} required/></FormGroup>
          <div style={S.row2}>
            <FormGroup label="Categoría" required>
              <Select value={form.categoria} onChange={setField('categoria')} required>
                {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Unidad" required><Input placeholder="Ej: kg, litros, dosis" value={form.unidad} onChange={setField('unidad')} required/></FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Stock actual" required><Input type="number" step="0.01" placeholder="0" value={form.stock_actual} onChange={setField('stock_actual')} required/></FormGroup>
            <FormGroup label="Stock mínimo" required><Input type="number" step="0.01" placeholder="0" value={form.stock_minimo} onChange={setField('stock_minimo')} required/></FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Proveedor"><Input placeholder="Ej: Agrovida Puno" value={form.proveedor} onChange={setField('proveedor')}/></FormGroup>
            <FormGroup label="Precio unitario (S/)"><Input type="number" step="0.01" placeholder="0.00" value={form.precio_unitario} onChange={setField('precio_unitario')}/></FormGroup>
          </div>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':editing?'Actualizar':'Guardar insumo'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={movModal} onClose={()=>setMovModal(false)} title={`Movimiento — ${selected?.nombre}`} width={400}>
        <form onSubmit={handleMovimiento}>
          <FormGroup label="Tipo de movimiento" required>
            <Select value={movForm.tipo} onChange={e=>setMovForm(f=>({...f,tipo:e.target.value}))} required>
              <option value="entrada">📥 Entrada (compra)</option>
              <option value="salida">📤 Salida (uso)</option>
            </Select>
          </FormGroup>
          <FormGroup label={`Cantidad (${selected?.unidad})`} required>
            <Input type="number" step="0.01" placeholder="0" value={movForm.cantidad} onChange={e=>setMovForm(f=>({...f,cantidad:e.target.value}))} required/>
          </FormGroup>
          <p style={{fontSize:12,color:'#8d9e8d',marginBottom:16}}>Stock actual: <strong>{selected?.stock_actual} {selected?.unidad}</strong></p>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setMovModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':'Registrar movimiento'}</Button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}