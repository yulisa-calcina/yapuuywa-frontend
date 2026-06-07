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
    padding: '12px 16px',
    border: '1.5px solid rgba(255,255,255,0.3)',
    borderRadius: 10,
    fontSize: 14,
    color: '#1a3a1a',
    background: 'rgba(255,255,255,0.7)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#1a4a1a',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* FONDO DIVIDIDO */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        {/* Mitad ganado */}
        <div style={{
          background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=960&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}/>
        {/* Mitad cultivos */}
        <div style={{
          background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=960&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}/>
      </div>

      {/* LÍNEA DIVISORIA CENTRAL */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: '50%',
        width: 3,
        background: 'linear-gradient(180deg, transparent, #f0c040, #2d7a40, #f0c040, transparent)',
        transform: 'translateX(-50%)',
        zIndex: 1,
      }}/>

      {/* TARJETA LOGIN */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: 'rgba(210, 240, 215, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: 24,
        padding: '40px 40px',
        width: '100%',
        maxWidth: 480,
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        border: '1.5px solid rgba(255,255,255,0.5)',
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="/logo.png" alt="YapuUywa"
            style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 20,
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}/>
        </div>

        {/* TÍTULO 3D GRANDE */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <div style={{
            fontSize: 42,
            fontWeight: 800,
            fontFamily: "'Sora', 'Segoe UI', sans-serif",
            color: '#0d3318',
            textShadow: '2px 2px 0px #2d7a40, 4px 4px 0px rgba(45,122,64,0.5), 6px 6px 0px rgba(45,122,64,0.2)',
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}>
            YapuUywa
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#1a5c2a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: 4,
          }}>
            SGA
          </div>
          <div style={{
            fontSize: 12,
            color: '#2d5a2d',
            marginTop: 4,
            letterSpacing: '0.05em',
          }}>
            Sistema de Gestión Agropecuaria
          </div>
          <div style={{
            width: 60, height: 3,
            background: 'linear-gradient(90deg, #2d7a40, #c8a030)',
            margin: '10px auto 0',
            borderRadius: 2,
          }}/>
        </div>

        {/* SUBTÍTULO */}
        <div style={{ textAlign: 'center', fontSize: 12, color: '#3a5a3a', marginBottom: 24 }}>
          Por favor ingrese sus credenciales
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.4)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
          border: '1px solid rgba(255,255,255,0.5)',
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setModo(m)} style={{
              flex: 1,
              padding: '10px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all .2s',
              fontFamily: 'inherit',
              background: modo === m ? '#1a5c2a' : 'transparent',
              color: modo === m ? '#fff' : '#2d5a2d',
              boxShadow: modo === m ? '0 3px 8px rgba(0,0,0,0.2)' : 'none',
            }}>
              {m === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        {modo === 'login' ? (
          <>
            {error && (
              <div style={{
                background: 'rgba(139,26,36,0.1)',
                color: '#6b1020',
                border: '1px solid rgba(139,26,36,0.3)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                marginBottom: 16,
                fontWeight: 500,
              }}>
                ⚠️ {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>DNI *</label>
                <input style={inputStyle} type="text"
                  placeholder="Ingresa tus 8 dígitos"
                  maxLength={8} inputMode="numeric"
                  value={dni}
                  onChange={e => setDni(e.target.value.replace(/\D/g, ''))}
                  disabled={blocked}/>
                <div style={{ fontSize: 10, color: '#4a7a4a', marginTop: 4 }}>
                  Tu DNI es tu identificador de acceso
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Contraseña *</label>
                <input style={inputStyle} type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  disabled={blocked}/>
              </div>
              <button type="submit" disabled={loading || blocked} style={{
                width: '100%',
                padding: '14px',
                background: '#1a5c2a',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '4px 4px 0px #0d3318',
                opacity: loading || blocked ? 0.6 : 1,
                letterSpacing: '0.03em',
              }}>
                {loading ? 'Verificando...' : '→ Ingresar al sistema'}
              </button>
            </form>
          </>
        ) : (
          <>
            {regError && (
              <div style={{
                background: 'rgba(139,26,36,0.1)',
                color: '#6b1020',
                border: '1px solid rgba(139,26,36,0.3)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                marginBottom: 16,
                fontWeight: 500,
              }}>
                ⚠️ {regError}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Nombre completo *</label>
                <input style={inputStyle} type="text"
                  placeholder="Ej: Juan Mamani"
                  value={regForm.nombre}
                  onChange={setRegField('nombre')} required/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>DNI *</label>
                  <input style={inputStyle} type="text"
                    placeholder="8 dígitos" maxLength={8}
                    value={regForm.dni}
                    onChange={setRegField('dni')} required/>
                </div>
                <div>
                  <label style={labelStyle}>Rol *</label>
                  <select style={inputStyle} value={regForm.rol}
                    onChange={setRegField('rol')} required>
                    <option value="ganadero">Ganadero</option>
                    <option value="veterinario">Veterinario</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Contraseña *</label>
                <input style={inputStyle} type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={regForm.password}
                  onChange={setRegField('password')} required/>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Confirmar contraseña *</label>
                <input style={inputStyle} type="password"
                  placeholder="Repite la contraseña"
                  value={regForm.password_confirmation}
                  onChange={setRegField('password_confirmation')} required/>
              </div>
              <button type="submit" disabled={regLoading} style={{
                width: '100%',
                padding: '14px',
                background: '#1a5c2a',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '4px 4px 0px #0d3318',
                opacity: regLoading ? 0.6 : 1,
              }}>
                {regLoading ? 'Creando cuenta...' : '→ Crear mi cuenta'}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: 10, color: '#4a6a4a', marginTop: 20, marginBottom: 0 }}>
          YapuUywa SGA © 2026 · Puno, Perú
        </p>
      </div>
    </div>
  )
}