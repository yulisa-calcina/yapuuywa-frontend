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
  const [showPass, setShowPass] = useState(false)
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

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 42px',
    border: '1.5px solid rgba(255,255,255,0.2)',
    borderRadius: 10,
    fontSize: 14,
    color: '#fff',
    background: 'rgba(255,255,255,0.1)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      background: `url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* OVERLAY */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(5,30,10,0.55)',
      }}/>

      {/* TARJETA */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 400,
        background: 'rgba(10,40,15,0.82)',
        backdropFilter: 'blur(16px)',
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        border: '1.5px solid rgba(255,255,255,0.1)',
        margin: '20px',
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img src="/logo.png" alt="YapuUywa"
            style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 18,
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}/>
        </div>

        {/* TÍTULO */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 44,
            fontWeight: 900,
            color: '#fff',
            textShadow: '2px 2px 0 #1a5c2a, 4px 4px 0 rgba(26,92,42,0.6), 6px 6px 0 rgba(26,92,42,0.3)',
            letterSpacing: '-1.5px',
            lineHeight: 1,
            marginBottom: 6,
          }}>
            YapuUywa
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            color: '#c8a030',
            textShadow: '2px 2px 0 #6b5010, 3px 3px 0 rgba(107,80,16,0.5)',
            letterSpacing: '0.2em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            SGA
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
            Sistema de Gestión Agropecuaria
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            Por favor ingrese sus credenciales
          </div>
        </div>

        {modo === 'login' ? (
          <>
            {error && (
              <div style={{
                background: 'rgba(220,53,69,0.2)',
                color: '#ffaaaa',
                border: '1px solid rgba(220,53,69,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12,
                marginBottom: 16,
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* DNI */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                  DNI *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, opacity:0.5 }}>👤</span>
                  <input style={inputStyle} type="text"
                    placeholder="Ingrese su DNI"
                    maxLength={8} inputMode="numeric"
                    value={dni} onChange={e => setDni(e.target.value.replace(/\D/g,''))}
                    disabled={blocked}/>
                </div>
              </div>

              {/* CONTRASEÑA */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                  Contraseña *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, opacity:0.5 }}>🔒</span>
                  <input style={inputStyle}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    value={pass} onChange={e => setPass(e.target.value)}
                    disabled={blocked}/>
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', fontSize:16, opacity:0.5, color:'#fff',
                  }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ textAlign:'right', marginBottom:20 }}>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              {/* BOTÓN INGRESAR */}
              <button type="submit" disabled={loading || blocked} style={{
                width: '100%',
                padding: '13px',
                background: 'rgba(255,255,255,0.95)',
                color: '#1a3a1a',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: loading || blocked ? 0.6 : 1,
              }}>
                {loading ? 'Verificando...' : <>Ingresar al sistema <span>→</span></>}
              </button>

              {/* BOTÓN CREAR CUENTA */}
              <button type="button" onClick={() => setModo('register')} style={{
                width: '100%',
                padding: '13px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                Crear cuenta <span style={{ fontSize:16 }}>👤+</span>
              </button>
            </form>
          </>
        ) : (
          <>
            {regError && (
              <div style={{
                background: 'rgba(220,53,69,0.2)',
                color: '#ffaaaa',
                border: '1px solid rgba(220,53,69,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12,
                marginBottom: 14,
              }}>
                ⚠️ {regError}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Nombre completo</label>
                <input style={{...inputStyle, paddingLeft:16}} type="text" placeholder="Ej: Juan Mamani"
                  value={regForm.nombre} onChange={setRegField('nombre')} required/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>DNI</label>
                  <input style={{...inputStyle, paddingLeft:16}} type="text" placeholder="8 dígitos" maxLength={8}
                    value={regForm.dni} onChange={setRegField('dni')} required/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Rol</label>
                  <select style={{...inputStyle, paddingLeft:16}} value={regForm.rol} onChange={setRegField('rol')} required>
                    <option value="ganadero">Ganadero</option>
                    <option value="veterinario">Veterinario</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Contraseña</label>
                <input style={{...inputStyle, paddingLeft:16}} type="password" placeholder="Mínimo 8 caracteres"
                  value={regForm.password} onChange={setRegField('password')} required/>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Confirmar contraseña</label>
                <input style={{...inputStyle, paddingLeft:16}} type="password" placeholder="Repite la contraseña"
                  value={regForm.password_confirmation} onChange={setRegField('password_confirmation')} required/>
              </div>
              <button type="submit" disabled={regLoading} style={{
                width:'100%', padding:'13px',
                background:'rgba(255,255,255,0.95)', color:'#1a3a1a',
                border:'none', borderRadius:10, fontSize:14, fontWeight:700,
                cursor:'pointer', fontFamily:'inherit', marginBottom:10,
                opacity: regLoading ? 0.6 : 1,
              }}>
                {regLoading ? 'Creando...' : 'Crear mi cuenta →'}
              </button>
              <button type="button" onClick={() => setModo('login')} style={{
                width:'100%', padding:'13px',
                background:'transparent', color:'rgba(255,255,255,0.6)',
                border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:10,
                fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
              }}>
                ← Volver a ingresar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}