import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const FORM_VENTA0 = { fecha:'', producto:'', categoria:'otro', cantidad:'', precio_unitario:'', comprador:'', modalidad:'contado' }
const FORM_GASTO0 = { fecha:'', categoria:'otro', descripcion:'', monto:'', proveedor:'' }

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
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
  tabs:  { display:'flex', gap:2, marginBottom:16 },
  tab:   { padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', border:'1.5px solid #dde3dd', background:'#fff', color:'#4a5e4a' },
  tabOn: { background:'#1a5c2a', color:'#fff', border:'1.5px solid #1a5c2a' },
}

export default function Finanzas() {
  const { toast, show } = useToast()
  const [tab, setTab]       = useState('ventas')
  const [ventas, setVentas] = useState([])
  const [gastos, setGastos] = useState([])
  const [modal, setModal]   = useState(false)
  const [formV, setFormV]   = useState(FORM_VENTA0)
  const [formG, setFormG]   = useState(FORM_GASTO0)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const [v, g] = await Promise.all([
        apiClient.get('/ventas'),
        apiClient.get('/gastos'),
      ])
      setVentas(v.data.data ?? v.data)
      setGastos(g.data.data ?? g.data)
    } catch (_) {}
  }

  useEffect(() => { load() }, [])

  const setFieldV = k => e => setFormV(f => ({ ...f, [k]: e.target.value }))
  const setFieldG = k => e => setFormG(f => ({ ...f, [k]: e.target.value }))

  const totalVentas = ventas.reduce((s, v) => s + parseFloat(v.total || 0), 0)
  const totalGastos = gastos.reduce((s, g) => s + parseFloat(g.monto || 0), 0)

  const handleSaveVenta = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.post('/ventas', formV)
      show('Venta registrada')
      setModal(false)
      setFormV(FORM_VENTA0)
      load()
    } catch (_) { show('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  const handleSaveGasto = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.post('/gastos', formG)
      show('Gasto registrado')
      setModal(false)
      setFormG(FORM_GASTO0)
      load()
    } catch (_) { show('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  const handleDeleteVenta = async (id) => {
    if (!confirm('Eliminar esta venta?')) return
    try { await apiClient.delete(`/ventas/${id}`); show('Venta eliminada'); load() }
    catch (_) { show('Error', 'error') }
  }

  const handleDeleteGasto = async (id) => {
    if (!confirm('Eliminar este gasto?')) return
    try { await apiClient.delete(`/gastos/${id}`); show('Gasto eliminado'); load() }
    catch (_) { show('Error', 'error') }
  }

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Finanzas</h1>
          <p style={S.sub}>Ingresos, egresos y balance comparativo</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={() => setModal(true)}>
          {tab === 'ventas' ? 'Nueva venta' : 'Nuevo gasto'}
        </Button>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}>
          <div style={S.mcLbl}>Total ingresos</div>
          <div style={{...S.mcVal, color:'#1a5c2a'}}>S/ {totalVentas.toFixed(2)}</div>
          <div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>{ventas.length} ventas</div>
        </div>
        <div style={S.mc}>
          <div style={S.mcLbl}>Total egresos</div>
          <div style={{...S.mcVal, color:'#dc3545'}}>S/ {totalGastos.toFixed(2)}</div>
          <div style={{fontSize:11,color:'#8b1a24',fontWeight:500,marginTop:3}}>{gastos.length} gastos</div>
        </div>
        <div style={S.mc}>
          <div style={S.mcLbl}>Balance</div>
          <div style={{...S.mcVal, color:(totalVentas-totalGastos)>=0?'#1a5c2a':'#dc3545'}}>
            S/ {(totalVentas-totalGastos).toFixed(2)}
          </div>
          <div style={{fontSize:11,color:'#8d9e8d',fontWeight:500,marginTop:3}}>ingresos vs egresos</div>
        </div>
      </div>

      <div style={S.tabs}>
        <button style={{...S.tab,...(tab==='ventas'?S.tabOn:{})}} onClick={()=>setTab('ventas')}>
          Ventas ({ventas.length})
        </button>
        <button style={{...S.tab,...(tab==='gastos'?S.tabOn:{})}} onClick={()=>setTab('gastos')}>
          Gastos ({gastos.length})
        </button>
      </div>

      {tab === 'ventas' && (
        <div style={S.card}>
          <div style={S.cardH}><span style={S.cardT}>Registro de ventas</span></div>
          <table style={S.table}>
            <thead>
              <tr>{['Fecha','Producto','Categoría','Cantidad','Precio','Total','Comprador',''].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {ventas.length===0
                ? <tr><td colSpan={8}><EmptyState icon="💰" title="Sin ventas" description="Registra tu primera venta."/></td></tr>
                : ventas.map(v=>(
                  <tr key={v.id}>
                    <td style={S.td}>{v.fecha}</td>
                    <td style={S.td}>{v.producto}</td>
                    <td style={S.td}><Badge color="green">{v.categoria}</Badge></td>
                    <td style={S.td}>{v.cantidad}</td>
                    <td style={S.td}>S/ {parseFloat(v.precio_unitario).toFixed(2)}</td>
                    <td style={S.td}><strong>S/ {parseFloat(v.total).toFixed(2)}</strong></td>
                    <td style={S.td}>{v.comprador||'—'}</td>
                    <td style={S.td}><button style={S.btn} onClick={()=>handleDeleteVenta(v.id)}>🗑️</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gastos' && (
        <div style={S.card}>
          <div style={S.cardH}><span style={S.cardT}>Registro de gastos</span></div>
          <table style={S.table}>
            <thead>
              <tr>{['Fecha','Categoría','Descripción','Monto','Proveedor',''].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {gastos.length===0
                ? <tr><td colSpan={6}><EmptyState icon="📤" title="Sin gastos" description="Registra tu primer gasto."/></td></tr>
                : gastos.map(g=>(
                  <tr key={g.id}>
                    <td style={S.td}>{g.fecha}</td>
                    <td style={S.td}><Badge color="red">{g.categoria}</Badge></td>
                    <td style={S.td}>{g.descripcion}</td>
                    <td style={S.td}><strong style={{color:'#dc3545'}}>S/ {parseFloat(g.monto).toFixed(2)}</strong></td>
                    <td style={S.td}>{g.proveedor||'—'}</td>
                    <td style={S.td}><button style={S.btn} onClick={()=>handleDeleteGasto(g.id)}>🗑️</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title={tab==='ventas'?'Nueva venta':'Nuevo gasto'}>
        {tab === 'ventas' ? (
          <form onSubmit={handleSaveVenta}>
            <div style={S.row2}>
              <FormGroup label="Fecha" required>
                <Input type="date" value={formV.fecha} onChange={setFieldV('fecha')} required/>
              </FormGroup>
              <FormGroup label="Categoría" required>
                <Select value={formV.categoria} onChange={setFieldV('categoria')} required>
                  {['leche','lana','ganado','cosecha','otro'].map(c=><option key={c}>{c}</option>)}
                </Select>
              </FormGroup>
            </div>
            <FormGroup label="Producto" required>
              <Input placeholder="Ej: Leche fresca" value={formV.producto} onChange={setFieldV('producto')} required/>
            </FormGroup>
            <div style={S.row2}>
              <FormGroup label="Cantidad" required>
                <Input type="number" step="0.01" placeholder="0" value={formV.cantidad} onChange={setFieldV('cantidad')} required/>
              </FormGroup>
              <FormGroup label="Precio unitario (S/)" required>
                <Input type="number" step="0.01" placeholder="0.00" value={formV.precio_unitario} onChange={setFieldV('precio_unitario')} required/>
              </FormGroup>
            </div>
            <div style={S.row2}>
              <FormGroup label="Comprador">
                <Input placeholder="Nombre del comprador" value={formV.comprador} onChange={setFieldV('comprador')}/>
              </FormGroup>
              <FormGroup label="Modalidad" required>
                <Select value={formV.modalidad} onChange={setFieldV('modalidad')} required>
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                </Select>
              </FormGroup>
            </div>
            <div style={S.mfoot}>
              <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
              <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':'Guardar venta'}</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveGasto}>
            <div style={S.row2}>
              <FormGroup label="Fecha" required>
                <Input type="date" value={formG.fecha} onChange={setFieldG('fecha')} required/>
              </FormGroup>
              <FormGroup label="Categoría" required>
                <Select value={formG.categoria} onChange={setFieldG('categoria')} required>
                  {['insumos','personal','veterinaria','maquinaria','servicios','otro'].map(c=><option key={c}>{c}</option>)}
                </Select>
              </FormGroup>
            </div>
            <FormGroup label="Descripción" required>
              <Input placeholder="Ej: Compra de fertilizante" value={formG.descripcion} onChange={setFieldG('descripcion')} required/>
            </FormGroup>
            <div style={S.row2}>
              <FormGroup label="Monto (S/)" required>
                <Input type="number" step="0.01" placeholder="0.00" value={formG.monto} onChange={setFieldG('monto')} required/>
              </FormGroup>
              <FormGroup label="Proveedor">
                <Input placeholder="Nombre del proveedor" value={formG.proveedor} onChange={setFieldG('proveedor')}/>
              </FormGroup>
            </div>
            <div style={S.mfoot}>
              <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
              <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':'Guardar gasto'}</Button>
            </div>
          </form>
        )}
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}