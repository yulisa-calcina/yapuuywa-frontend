import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../api/axiosConfig'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo]   = useState('login')
  const [dni, setDni]     = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [blocked, setBlocked]   = useState(false)

  const [regForm, setRegForm] = useState({
    nombre:'', dni:'', rol:'ganadero', password:'', password_confirmation:''
  })
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (blocked) return
    if (!dni || !pass) { setError('Ingresa tu DNI y contraseña.'); return }
    setError('')
    const result = await login(dni, pass)
    if (result.success) {
      navigate('/dashboard')
    } else {
      const n = attempts + 1
      setAttempts(n)
      if (n >= 5) {
        setBlocked(true)
        setError('Cuenta bloqueada 15 minutos por 5 intentos fallidos.')
        setTimeout(() => { setBlocked(false); setAttempts(0) }, 15*60*1000)
      } else {
        setError(`DNI o contraseña incorrectos. Intento ${n}/5.`)
      }
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    if (regForm.password !== regForm.password_confirmation) {
      setRegError('Las contraseñas no coinciden.')
      return
    }
    setRegLoading(true)
    try {
      const res = await apiClient.post('/register', regForm)
      const { access_token, user } = res.data
      localStorage.setItem('token', access_token)
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0][0]
        setRegError(first)
      } else {
        setRegError(err.response?.data?.message || 'Error al registrarse')
      }
    } finally { setRegLoading(false) }
  }

  const setRegField = k => e => setRegForm(f => ({ ...f, [k]: e.target.value }))

  const S = {
    root:  { display:'flex', minHeight:'100vh', background:'#0d3318' },
    left:  { flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 56px', maxWidth:520 },
    right: { display:'flex', alignItems:'center', justifyContent:'center', padding:32, flexShrink:0 },
    logoRow:  { display:'flex', alignItems:'center', gap:14, marginBottom:36 },
    logoIcon: { width:52, height:52, borderRadius:14, background:'#2d7a40', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    brandName:{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:700, color:'#fff' },
    brandTag: { fontSize:11, color:'#a8d5b5', letterSpacing:'.06em', textTransform:'uppercase', marginTop:2 },
    headline: { fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:14 },
    desc:  { fontSize:14, color:'#a8d5b5', lineHeight:1.75, marginBottom:30 },
    roles: { display:'flex', flexDirection:'column', gap:10 },
    roleCard: { display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:'12px 16px' },
    roleIcon: { width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, background:'rgba(255,255,255,.1)' },
    roleName: { fontSize:13, fontWeight:600, color:'#fff' },
    roleDesc: { fontSize:11, color:'#a8d5b5', marginTop:2 },
    card:  { background:'#fff', borderRadius:20, padding:'32px', width:400, boxShadow:'0 20px 60px rgba(0,0,0,.25)' },
    cardTitle:{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:700, color:'#1e2e1e', marginBottom:4 },
    cardSub:  { fontSize:12, color:'#8d9e8d', marginBottom:20 },
    error: { background:'#fde8ea', color:'#8b1a24', borderRadius:6, padding:'9px 13px', fontSize:12, fontWeight:500, marginBottom:16 },
    group: { marginBottom:14 },
    label: { display:'block', fontSize:12, fontWeight:600, color:'#4a5e4a', marginBottom:6 },
    req:   { color:'#dc3545' },
    input: { width:'100%', padding:'10px 13px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:13, color:'#1e2e1e', outline:'none', fontFamily:'inherit' },
    hint:  { fontSize:11, color:'#8d9e8d', marginTop:4 },
    btnSubmit: { width:'100%', background:'#1a5c2a', color:'#fff', border:'none', padding:12, borderRadius:10, fontSize:14, fontWeight:600, marginTop:4, cursor:'pointer' },
    tabs:  { display:'flex', gap:4, marginBottom:20 },
    tab:   { flex:1, padding:'9px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', border:'1.5px solid #dde3dd', background:'#fff', color:'#4a5e4a', textAlign:'center' },
    tabOn: { background:'#1a5c2a', color:'#fff', border:'1.5px solid #1a5c2a' },
    row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  }

  return (
    <div style={S.root}>
      <div style={S.left}>
        <div style={S.logoRow}>
          <div style={S.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#d4edd9">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.65c.33.41.75.64 1.18.35C7 19 8 17 9 15c2 0 5 1 7 5 0 0 1-7-3-10 0 0 2 0 4 2 0 0 0-4-4-4z"/>
            </svg>
          </div>
          <div>
            <div style={S.brandName}>YapuUywa</div>
            <div style={S.brandTag}>SGA · Sistema de Gestión Agropecuaria</div>
          </div>
        </div>
        <h1 style={S.headline}>Gestión inteligente<br/>para el agro andino</h1>
        <p style={S.desc}>Registra animales, cultivos, vacunas e insumos. Alertas automáticas y reportes PDF para tomar mejores decisiones.</p>
        <div style={S.roles}>
          {[
            ['🛡️','Administrador','Acceso completo al sistema'],
            ['🐄','Ganadero / Agricultor','Módulos de producción'],
            ['🩺','Veterinario / Técnico','Solo módulo sanitario']
          ].map(([ico,name,desc])=>(
            <div key={name} style={S.roleCard}>
              <div style={S.roleIcon}>{ico}</div>
              <div><div style={S.roleName}>{name}</div><div style={S.roleDesc}>{desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          <div style={S.tabs}>
            <button style={{...S.tab,...(modo==='login'?S.tabOn:{})}} onClick={()=>setModo('login')}>Ingresar</button>
            <button style={{...S.tab,...(modo==='register'?S.tabOn:{})}} onClick={()=>setModo('register')}>Crear cuenta</button>
          </div>

          {modo === 'login' ? (
            <>
              <div style={S.cardTitle}>Ingresar al sistema</div>
              <div style={S.cardSub}>Ingresa tu DNI y contraseña</div>
              {error && <div style={S.error}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div style={S.group}>
                  <label style={S.label}>DNI <span style={S.req}>*</span></label>
                  <input style={S.input} type="text" placeholder="8 dígitos" maxLength={8} inputMode="numeric"
                    value={dni} onChange={e=>setDni(e.target.value.replace(/\D/g,''))} disabled={blocked}/>
                  <p style={S.hint}>Tu DNI es tu identificador de acceso</p>
                </div>
                <div style={S.group}>
                  <label style={S.label}>Contraseña <span style={S.req}>*</span></label>
                  <input style={S.input} type="password" placeholder="Mínimo 8 caracteres"
                    value={pass} onChange={e=>setPass(e.target.value)} disabled={blocked}/>
                </div>
                <button style={{...S.btnSubmit, opacity:loading||blocked?.6:1}} type="submit" disabled={loading||blocked}>
                  {loading ? 'Verificando...' : 'Ingresar al sistema'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={S.cardTitle}>Crear cuenta</div>
              <div style={S.cardSub}>Regístrate para usar YapuUywa</div>
              {regError && <div style={S.error}>{regError}</div>}
              <form onSubmit={handleRegister}>
                <div style={S.group}>
                  <label style={S.label}>Nombre completo <span style={S.req}>*</span></label>
                  <input style={S.input} type="text" placeholder="Ej: Juan Mamani" value={regForm.nombre} onChange={setRegField('nombre')} required/>
                </div>
                <div style={{...S.row2, marginBottom:14}}>
                  <div>
                    <label style={S.label}>DNI <span style={S.req}>*</span></label>
                    <input style={S.input} type="text" placeholder="8 dígitos" maxLength={8} value={regForm.dni} onChange={setRegField('dni')} required/>
                  </div>
                  <div>
                    <label style={S.label}>Rol <span style={S.req}>*</span></label>
                    <select style={S.input} value={regForm.rol} onChange={setRegField('rol')} required>
                      <option value="ganadero">Ganadero / Agricultor</option>
                      <option value="veterinario">Veterinario / Técnico</option>
                    </select>
                  </div>
                </div>
                <div style={S.group}>
                  <label style={S.label}>Contraseña <span style={S.req}>*</span></label>
                  <input style={S.input} type="password" placeholder="Mínimo 8 caracteres" value={regForm.password} onChange={setRegField('password')} required/>
                </div>
                <div style={S.group}>
                  <label style={S.label}>Confirmar contraseña <span style={S.req}>*</span></label>
                  <input style={S.input} type="password" placeholder="Repite la contraseña" value={regForm.password_confirmation} onChange={setRegField('password_confirmation')} required/>
                </div>
                <button style={{...S.btnSubmit, opacity:regLoading?.6:1}} type="submit" disabled={regLoading}>
                  {regLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}