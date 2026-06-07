import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/index'
import { Modal, Button, Badge, FormGroup, Input, Select, EmptyState, Toast } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const FORM0 = { nombre:'', dni:'', email:'', rol:'ganadero', password:'' }

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
  th:    { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#8d9e8d', borderBottom:'1px solid #dde3dd', textTransform:'uppercase', background:'#f7f9f7' },
  td:    { padding:'10px 14px', color:'#1e2e1e', borderBottom:'1px solid #eef1ee' },
  acts:  { display:'flex', gap:4 },
  btn:   { background:'none', border:'1px solid #dde3dd', borderRadius:6, padding:'4px 8px', fontSize:12, color:'#8d9e8d', cursor:'pointer' },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  mfoot: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:16, paddingTop:16, borderTop:'1px solid #eef1ee' },
}

export default function UsuarioList() {
  const { toast, show } = useToast()
  const [usuarios, setUsuarios] = useState([])
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(FORM0)
  const [saving, setSaving]     = useState(false)

  const load = async () => {
    try {
      const res = await apiClient.get('/usuarios')
      setUsuarios(res.data.data ?? res.data)
    } catch (_) {}
  }

  useEffect(() => { load() }, [])

  const admins     = usuarios.filter(u => u.rol === 'admin').length
  const ganaderos  = usuarios.filter(u => u.rol === 'ganadero').length
  const vets       = usuarios.filter(u => u.rol === 'veterinario').length

  const openCreate = () => { setEditing(null); setForm(FORM0); setModal(true) }
  const openEdit   = (u) => { setEditing(u); setForm({ nombre:u.nombre, dni:u.dni, email:u.email, rol:u.rol, password:'' }); setModal(true) }
  const setField   = k   => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await apiClient.put(`/usuarios/${editing.id}`, form)
        show('Usuario actualizado')
      } else {
        await apiClient.post('/usuarios', form)
        show('Usuario creado correctamente')
      }
      setModal(false)
      load()
    } catch (err) {
      show(err.response?.data?.message || 'Error al guardar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await apiClient.delete(`/usuarios/${id}`)
      show('Usuario eliminado')
      load()
    } catch (_) { show('Error al eliminar', 'error') }
  }

  const toggleActivo = async (u) => {
    try {
      await apiClient.put(`/usuarios/${u.id}`, { activo: !u.activo })
      show(u.activo ? 'Usuario desactivado' : 'Usuario activado')
      load()
    } catch (_) { show('Error', 'error') }
  }

  const rolColor = (r) => r==='admin'?'green':r==='ganadero'?'blue':'amber'

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Gestión de usuarios</h1>
          <p style={S.sub}>Crea y administra cuentas por rol</p>
        </div>
        <Button variant="primary" size="sm" icon="+" onClick={openCreate}>Nuevo usuario</Button>
      </div>

      <div style={S.grid3}>
        <div style={S.mc}><div style={S.mcLbl}>Administradores</div><div style={S.mcVal}>{admins}</div><div style={{fontSize:11,color:'#3b8c52',fontWeight:500,marginTop:3}}>acceso total</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Ganaderos</div><div style={S.mcVal}>{ganaderos}</div><div style={{fontSize:11,color:'#0c3d62',fontWeight:500,marginTop:3}}>módulos productivos</div></div>
        <div style={S.mc}><div style={S.mcLbl}>Veterinarios</div><div style={S.mcVal}>{vets}</div><div style={{fontSize:11,color:'#7a4f08',fontWeight:500,marginTop:3}}>módulo sanitario</div></div>
      </div>

      <div style={S.card}>
        <div style={S.cardH}>
          <span style={S.cardT}>Lista de usuarios</span>
          <span style={{fontSize:11,color:'#8d9e8d'}}>{usuarios.length} usuarios registrados</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={S.table}>
            <thead>
              <tr>{['Nombre','DNI','Email','Rol','Estado','Acciones'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {usuarios.length===0
                ? <tr><td colSpan={6}><EmptyState icon="👤" title="Sin usuarios" description="Crea el primer usuario del sistema."/></td></tr>
                : usuarios.map(u=>(
                  <tr key={u.id}>
                    <td style={S.td}><strong>{u.nombre}</strong></td>
                    <td style={S.td}>{u.dni}</td>
                    <td style={S.td}>{u.email}</td>
                    <td style={S.td}><Badge color={rolColor(u.rol)}>{u.rol}</Badge></td>
                    <td style={S.td}>
                      <button
                        style={{...S.btn, color: u.activo?'#3b8c52':'#8b1a24', borderColor: u.activo?'#c0ddc8':'#f5b8be'}}
                        onClick={()=>toggleActivo(u)}
                      >
                        {u.activo ? '✓ Activo' : '✕ Inactivo'}
                      </button>
                    </td>
                    <td style={S.td}>
                      <div style={S.acts}>
                        <button style={S.btn} title="Editar" onClick={()=>openEdit(u)}>✏️</button>
                        <button style={S.btn} title="Eliminar" onClick={()=>handleDelete(u.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar usuario':'Crear nuevo usuario'}>
        <form onSubmit={handleSave}>
          <FormGroup label="Nombre completo" required>
            <Input placeholder="Ej: Juan Mamani" value={form.nombre} onChange={setField('nombre')} required/>
          </FormGroup>
          <div style={S.row2}>
            <FormGroup label="DNI" required>
              <Input placeholder="8 dígitos" maxLength={8} value={form.dni} onChange={setField('dni')} required disabled={!!editing}/>
            </FormGroup>
            <FormGroup label="Rol" required>
              <Select value={form.rol} onChange={setField('rol')} required>
                <option value="admin">Administrador</option>
                <option value="ganadero">Ganadero / Agricultor</option>
                <option value="veterinario">Veterinario / Técnico</option>
              </Select>
            </FormGroup>
          </div>
          <FormGroup label="Correo electrónico" required>
            <Input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={setField('email')} required/>
          </FormGroup>
          <FormGroup label={editing ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'} required={!editing}>
            <Input type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={setField('password')} required={!editing}/>
          </FormGroup>
          <div style={S.mfoot}>
            <Button variant="ghost" type="button" onClick={()=>setModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving?'Guardando...':editing?'Actualizar':'Crear usuario'}</Button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}