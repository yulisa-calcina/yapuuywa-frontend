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

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #2d5a2d',
    borderRadius: 8,
    fontSize: 13,
    color: '#8aaa8a',
    background: '#0a1f0a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 10,
    color: '#5a8a5a',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* FONDO IZQUIERDO — GANADO */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '50%', height: '100%',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=960&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}/>

      {/* FONDO DERECHO — CULTIVOS */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '50%', height: '100%',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=960&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}/>

      {/* OVERLAY VERDE OSCURO */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(5,20,5,0.3)',
      }}/>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 20,
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: 860,
          minHeight: 520,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          border: '1px solid rgba(45,90,45,0.4)',
        }}>

          {/* PANEL IZQUIERDO — MARCA */}
          <div style={{
            flex: 1,
            background: 'rgba(10,31,10,0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 40px',
            borderRight: '1px solid #1a3a1a',
          }}>
            {/* Logo */}
            <img src="/logo.png" alt="YapuUywa"
              style={{ width: 110, height: 110, objectFit: 'contain', borderRadius: 22, marginBottom: 20,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}/>

            {/* Título 3D dorado */}
            <div style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#c8a030',
              textShadow: '2px 2px 0 #6b5010, 4px 4px 0 rgba(107,80,16,0.5), 6px 6px 0 rgba(107,80,16,0.2)',
              letterSpacing: '-2px',
              lineHeight: 1,
              textAlign: 'center',
              marginBottom: 6,
            }}>
              YapuUywa
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#e8c84a',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              SGA
            </div>
            <div style={{
              width: 50, height: 2,
              background: '#c8a030',
              borderRadius: 1,
              marginBottom: 16,
            }}/>
            <div style={{
              fontSize: 11,
              color: '#4a6a4a',
              textAlign: 'center',
              lineHeight: 1.7,
            }}>
              Sistema de Gestión Agropecuaria<br/>
              Puno · Perú
            </div>

            {/* Iconos módulos */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              {[['🐄','Ganadería'],['🌾','Cultivos'],['📊','Gestión']].map(([ico, lbl]) => (
                <div key={lbl} style={{
                  background: '#0d3318',
                  border: '1px solid #2d5a2d',
                  borderRadius: 10,
                  padding: '10px 14px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20 }}>{ico}</div>
                  <div style={{ fontSize: 9, color: '#4a6a4a', marginTop: 4, letterSpacing: '0.05em' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DERECHO — FORMULARIO */}
          <div style={{
            width: 320,
            background: 'rgba(17,31,17,0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 32px',
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 10,
              padding: 3,
              marginBottom: 28,
              border: '1px solid #1a3a1a',
            }}>
              {['login','register'].map(m => (
                <button key={m} onClick={() => setModo(m)} style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  fontFamily: 'inherit',
                  transition: 'all .2s',
                  background: modo === m ? '#c8a030' : 'transparent',
                  color: modo === m ? '#1a0e00' : '#4a6a4a',
                }}>
                  {m === 'login' ? 'Ingresar' : 'Crear cuenta'}
                </button>
              ))}
            </div>

            {modo === 'login' ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#c8a030', marginBottom: 4 }}>
                  Bienvenido
                </div>
                <div style={{ fontSize: 11, color: '#4a6a4a', marginBottom: 24 }}>
                  Ingresa tus credenciales de acceso
                </div>

                {error && (
                  <div style={{
                    background: 'rgba(139,26,36,0.15)',
                    color: '#f08090',
                    border: '1px solid rgba(139,26,36,0.3)',
                    borderRadius: 8,
                    padding: '9px 13px',
                    fontSize: 12,
                    marginBottom: 16,
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Número de DNI</label>
                    <input style={inputStyle} type="text"
                      placeholder="8 dígitos" maxLength={8} inputMode="numeric"
                      value={dni} onChange={e => setDni(e.target.value.replace(/\D/g,''))}
                      disabled={blocked}/>
                  </div>
                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>Contraseña</label>
                    <input style={inputStyle} type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={pass} onChange={e => setPass(e.target.value)}
                      disabled={blocked}/>
                  </div>
                  <button type="submit" disabled={loading || blocked} style={{
                    width: '100%',
                    padding: '12px',
                    background: '#c8a030',
                    color: '#1a0e00',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '3px 3px 0 #6b5010',
                    opacity: loading || blocked ? 0.6 : 1,
                  }}>
                    {loading ? 'Verificando...' : 'Ingresar al sistema →'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#c8a030', marginBottom: 4 }}>
                  Crear cuenta
                </div>
                <div style={{ fontSize: 11, color: '#4a6a4a', marginBottom: 20 }}>
                  Regístrate para usar YapuUywa
                </div>

                {regError && (
                  <div style={{
                    background: 'rgba(139,26,36,0.15)',
                    color: '#f08090',
                    border: '1px solid rgba(139,26,36,0.3)',
                    borderRadius: 8,
                    padding: '9px 13px',
                    fontSize: 12,
                    marginBottom: 14,
                  }}>
                    ⚠️ {regError}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>Nombre completo</label>
                    <input style={inputStyle} type="text" placeholder="Ej: Juan Mamani"
                      value={regForm.nombre} onChange={setRegField('nombre')} required/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
                    <div>
                      <label style={labelStyle}>DNI</label>
                      <input style={inputStyle} type="text" placeholder="8 dígitos" maxLength={8}
                        value={regForm.dni} onChange={setRegField('dni')} required/>
                    </div>
                    <div>
                      <label style={labelStyle}>Rol</label>
                      <select style={{...inputStyle, background:'#0a1f0a'}}
                        value={regForm.rol} onChange={setRegField('rol')} required>
                        <option value="ganadero">Ganadero</option>
                        <option value="veterinario">Veterinario</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>Contraseña</label>
                    <input style={inputStyle} type="password" placeholder="Mínimo 8 caracteres"
                      value={regForm.password} onChange={setRegField('password')} required/>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Confirmar contraseña</label>
                    <input style={inputStyle} type="password" placeholder="Repite la contraseña"
                      value={regForm.password_confirmation} onChange={setRegField('password_confirmation')} required/>
                  </div>
                  <button type="submit" disabled={regLoading} style={{
                    width: '100%',
                    padding: '12px',
                    background: '#c8a030',
                    color: '#1a0e00',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '3px 3px 0 #6b5010',
                    opacity: regLoading ? 0.6 : 1,
                  }}>
                    {regLoading ? 'Creando...' : 'Crear mi cuenta →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}