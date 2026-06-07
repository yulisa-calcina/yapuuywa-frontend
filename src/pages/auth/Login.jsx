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
      const { access_token } = res.data
      localStorage.setItem('token', access_token)
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setRegError(Object.values(errors)[0][0])
      } else {
        setRegError(err.response?.data?.message || 'Error al registrarse')
      }
    } finally { setRegLoading(false) }
  }

  const setRegField = k => e => setRegForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: 20,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      }}>
        {/* LOGO */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <img src="/logo.png" alt="YapuUywa" style={{ width:120, height:120, objectFit:'contain' }}/>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#1a5c2a', margin:'8px 0 2px' }}>
            YapuUywa SGA
          </h1>
          <p style={{ fontSize:12, color:'#666', margin:0 }}>
            Sistema de Gestión Agropecuaria
          </p>
          <p style={{ fontSize:11, color:'#888', marginTop:4 }}>
            Por favor ingrese sus credenciales
          </p>
        </div>

        {/* TABS */}
        <div style={{ display:'flex', background:'#f0f4f0', borderRadius:10, padding:4, marginBottom:24 }}>
          {['login','register'].map(m => (
            <button key={m} onClick={()=>setModo(m)} style={{
              flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer',
              fontWeight:600, fontSize:13, transition:'all .2s',
              background: modo===m ? '#1a5c2a' : 'transparent',
              color: modo===m ? '#fff' : '#4a5e4a',
            }}>
              {m==='login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        {modo === 'login' ? (
          <>
            <h2 style={{ fontSize:16, fontWeight:600, color:'#1e2e1e', marginBottom:4 }}>
              Bienvenido al sistema
            </h2>
            <p style={{ fontSize:12, color:'#888', marginBottom:20 }}>
              Ingresa tu DNI y contraseña para continuar
            </p>
            {error && (
              <div style={{ background:'#fde8ea', color:'#8b1a24', borderRadius:8, padding:'10px 14px', fontSize:12, marginBottom:16, fontWeight:500 }}>
                ⚠️ {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>
                  DNI *
                </label>
                <input
                  style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:14, color:'#1e2e1e', outline:'none', boxSizing:'border-box' }}
                  type="text" placeholder="Ingresa tus 8 dígitos" maxLength={8} inputMode="numeric"
                  value={dni} onChange={e=>setDni(e.target.value.replace(/\D/g,''))} disabled={blocked}
                />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>
                  CONTRASEÑA *
                </label>
                <input
                  style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:14, color:'#1e2e1e', outline:'none', boxSizing:'border-box' }}
                  type="password" placeholder="Mínimo 8 caracteres"
                  value={pass} onChange={e=>setPass(e.target.value)} disabled={blocked}
                />
              </div>
              <button style={{
                width:'100%', background:'#1a5c2a', color:'#fff', border:'none',
                padding:'13px', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer',
                opacity: loading||blocked ? .6 : 1,
              }} type="submit" disabled={loading||blocked}>
                {loading ? 'Verificando...' : '→ Ingresar al sistema'}
              </button>
            </form>

            <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:8 }}>
              {[
                ['🛡️','Administrador','Acceso completo'],
                ['🐄','Ganadero / Agricultor','Módulos productivos'],
                ['🩺','Veterinario / Técnico','Módulo sanitario'],
              ].map(([ico,name,desc]) => (
                <div key={name} style={{ display:'flex', alignItems:'center', gap:10, background:'#f7f9f7', borderRadius:8, padding:'8px 12px' }}>
                  <span style={{ fontSize:18 }}>{ico}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e2e1e' }}>{name}</div>
                    <div style={{ fontSize:10, color:'#8d9e8d' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize:16, fontWeight:600, color:'#1e2e1e', marginBottom:4 }}>Crear cuenta</h2>
            <p style={{ fontSize:12, color:'#888', marginBottom:20 }}>Regístrate para usar YapuUywa</p>
            {regError && (
              <div style={{ background:'#fde8ea', color:'#8b1a24', borderRadius:8, padding:'10px 14px', fontSize:12, marginBottom:16, fontWeight:500 }}>
                ⚠️ {regError}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>NOMBRE COMPLETO *</label>
                <input style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:14, outline:'none', boxSizing:'border-box' }}
                  type="text" placeholder="Ej: Juan Mamani" value={regForm.nombre} onChange={setRegField('nombre')} required/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>DNI *</label>
                  <input style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:14, outline:'none', boxSizing:'border-box' }}
                    type="text" placeholder="8 dígitos" maxLength={8} value={regForm.dni} onChange={setRegField('dni')} required/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>ROL *</label>
                  <select style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:13, outline:'none', boxSizing:'border-box', background:'#fff' }}
                    value={regForm.rol} onChange={setRegField('rol')} required>
                    <option value="ganadero">Ganadero</option>
                    <option value="veterinario">Veterinario</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>CONTRASEÑA *</label>
                <input style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:14, outline:'none', boxSizing:'border-box' }}
                  type="password" placeholder="Mínimo 8 caracteres" value={regForm.password} onChange={setRegField('password')} required/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#4a5e4a', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>CONFIRMAR CONTRASEÑA *</label>
                <input style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:14, outline:'none', boxSizing:'border-box' }}
                  type="password" placeholder="Repite la contraseña" value={regForm.password_confirmation} onChange={setRegField('password_confirmation')} required/>
              </div>
              <button style={{
                width:'100%', background:'#1a5c2a', color:'#fff', border:'none',
                padding:'13px', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer',
                opacity: regLoading ? .6 : 1,
              }} type="submit" disabled={regLoading}>
                {regLoading ? 'Creando cuenta...' : '→ Crear mi cuenta'}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign:'center', fontSize:10, color:'#aaa', marginTop:20 }}>
          YapuUywa SGA © 2026 · Puno, Perú
        </p>
      </div>
    </div>
  )
}