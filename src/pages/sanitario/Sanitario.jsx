import { useState } from 'react'
import { useGanado, useAlertas, useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import { historialApi } from '../../api/services'

const TIPOS = ['Vacunación','Desparasitación','Tratamiento médico','Revisión de rutina','Diagnóstico']
const FORM0 = { animal_id:'', tipo:'Vacunación', fecha:'', medicamento:'', dosis:'', descripcion:'', veterinario:'', costo:'', proxima_revision:'' }

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
  cardH: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 },
  cardT: { fontSize:13, fontWeight:600, color:'#1e2e1e' },
  aRow:  { display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:'1px solid #eef1ee' },
  aIco:  { width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:15 },
  aInfo: { flex:1, minWidth:0 },
  aT:    { fontSize:12, fontWeight:600, color:'#1e2e1e' },
  aS:    { fontSize:11, color:'#8d9e8d', marginTop:2 },
  aBtn:  { fontSize:11, background:'#fff', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 11px', color:'#4a5e4a', cursor:'pointer', flexShrink:0 },
  sel:   { fontSize:11, padding:'5px 8px', border:'1px solid #dde3dd', borderRadius:6, background:'#fff', color:'#4a5e4a', fontFamily:'inherit' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th:    { padding:'9px 13px', textAlign:'left', fontSize:10, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', letterSpacing:'.03em', background:'#f7f9f7' },
  td:    { padding:'9px 13px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
}

export default function Sanitario() {
  const { ganado }           = useGanado()
  const { alertas, atender } = useAlertas()
  const { toast, show }      = useToast()
  const [modal, setModal]    = useState(false)
  const [form, setForm]      = useState(FORM0)
  const [saving, setSaving]  = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState('')
  const [historial, setHistorial] = useState([])

  const setField = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const loadHistorial = async (animalId) => {
    if (!animalId) return
    try {
      const res = await historialApi.getByAnimal(animalId)
      setHistorial(res.data.data ?? res.data)
    } catch (_) {
      setHistorial([])
    }
  }

  const handleAnimalChange = (e) => {
    setSelectedAnimal(e.target.value)
    loadHistorial(e.target.value)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.animal_id || !form.fecha) return
    setSaving(true)
    try {
      const res = await historialApi.create(form.animal_id, {
        fecha:            form.fecha,
        tipo:             form.tipo,
        medicamento:      form.medicamento,
        dosis:            form.dosis,
        descripcion:      form.descripcion,
        veterinario:      form.veterinario,
        costo:            form.costo || null,
        proxima_revision: form.proxima_revision || null,
      })
      show('Atención registrada correctamente')
      setModal(false)
      setForm(FORM0)
      if (form.animal_id === selectedAnimal) {
        loadHistorial(selectedAnimal)
      }
    } catch (err) {
      show('Error al guardar la atención', 'error')
    } finally {
      setSaving(false)
    }
  }

  const alertasVacuna = alertas.filter(a => a.tipo === 'vacuna')

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Control sanitario</h1>
          <p style={S.sub}>Historial médico y alertas de vacunación</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={() => setModal(true)}>Nueva atención</Button>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Alertas activas</div><div style={S.mcVal}>{alertasVacuna.length}</div><div style={{fontSize:11,color:'#7a4f08',fontWeight:500,marginTop:3}}>vacunaciones</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Insumos críticos</div><div style={S.mcVal}>{alertas.filter(a=>a.tipo==='stock').length}</div><div style={{fontSize:11,color:'#8b1a24',fontWeight:500,marginTop:3}}>stock bajo</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Animales</div><div style={S.mcVal}>{ganado.length}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>en inventario</div></div>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardH}>
            <span style={S.cardT}>🚨 Alertas de vacunación</span>
            {alertasVacuna.length > 0
              ? <Badge color="red">{alertasVacuna.length} urgentes</Badge>
              : <Badge color="green">Al día</Badge>}
          </div>
          {alertasVacuna.length === 0
            ? <EmptyState icon="✅" title="Todo al día" description="No hay vacunaciones pendientes."/>
            : alertasVacuna.map(a => (
              <div key={a.id} style={S.aRow}>
                <div style={{...S.aIco, background: a.estado==='critico'?'#fde8ea':'#fef3dc'}}>
                  {a.estado === 'critico' ? '🚨' : '⏰'}
                </div>
                <div style={S.aInfo}>
                  <div style={S.aT}>{a.descripcion || 'Alerta sanitaria'}</div>
                  <div style={S.aS}>{a.medicamento || 'Sin medicamento'}</div>
                </div>
                <button style={S.aBtn} onClick={() => { atender(a.id); show('Alerta atendida') }}>Atender</button>
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={S.cardH}>
            <span style={S.cardT}>📋 Historial médico</span>
            <select style={S.sel} value={selectedAnimal} onChange={handleAnimalChange}>
              <option value="">Seleccionar animal...</option>
              {ganado.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.arete})</option>)}
            </select>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={S.table}>
              <thead>
                <tr>{['Fecha','Tipo','Medicamento','Vet.'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {historial.length === 0
                  ? <tr><td colSpan={4}><EmptyState icon="📋" title="Sin registros" description="Selecciona un animal para ver su historial."/></td></tr>
                  : historial.map((h, i) => (
                    <tr key={h.id || i}>
                      <td style={S.td}>{h.fecha}</td>
                      <td style={S.td}>
                        <Badge color={h.tipo==='Vacunación'?'green':h.tipo==='Diagnóstico'?'amber':'blue'}>{h.tipo}</Badge>
                      </td>
                      <td style={S.td}>{h.medicamento || '—'}</td>
                      <td style={S.td}>{h.veterinario || '—'}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Registrar nueva atención sanitaria">
        <form onSubmit={handleSave}>
          <div style={S.row2}>
            <FormGroup label="Animal" required>
              <Select value={form.animal_id} onChange={setField('animal_id')} required>
                <option value="">Seleccionar...</option>
                {ganado.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.arete})</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Tipo" required>
              <Select value={form.tipo} onChange={setField('tipo')} required>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </Select>
            </FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Fecha" required>
              <Input type="date" value={form.fecha} onChange={setField('fecha')} required/>
            </FormGroup>
            <FormGroup label="Costo (S/)">
              <Input type="number" step="0.01" placeholder="0.00" value={form.costo} onChange={setField('costo')}/>
            </FormGroup>
          </div>
          <div style={S.row2}>
            <FormGroup label="Medicamento">
              <Input placeholder="Ej: Vacuna aftosa" value={form.medicamento} onChange={setField('medicamento')}/>
            </FormGroup>
            <FormGroup label="Dosis">
              <Input placeholder="Ej: 5ml IM" value={form.dosis} onChange={setField('dosis')}/>
            </FormGroup>
          </div>
          <FormGroup label="Descripción / diagnóstico">
            <Input placeholder="Descripción clínica..." value={form.descripcion} onChange={setField('descripcion')}/>
          </FormGroup>
          <div style={S.row2}>
            <FormGroup label="Veterinario">
              <Input placeholder="Ej: Dr. Quispe" value={form.veterinario} onChange={setField('veterinario')}/>
            </FormGroup>
            <FormGroup label="Próxima revisión">
              <Input type="date" value={form.proxima_revision} onChange={setField('proxima_revision')}/>
            </FormGroup>
          </div>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar atención'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}