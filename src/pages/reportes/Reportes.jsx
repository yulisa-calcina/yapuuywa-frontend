import { useState } from 'react'
import { useToast, useGanado } from '../../hooks/index'
import { Button, Toast } from '../../components/ui/index'
import apiClient from '../../api/axiosConfig'

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, padding:'24px', display:'flex', flexDirection:'column', gap:12 },
  icon:  { fontSize:36, marginBottom:4 },
  name:  { fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:600, color:'#1e2e1e' },
  desc:  { fontSize:12, color:'#8d9e8d', lineHeight:1.6 },
  info:  { fontSize:11, color:'#3b8c52', background:'#eef7f0', padding:'6px 10px', borderRadius:6 },
}

const REPORTES = [
  {
    id: 'ganado',
    icon: '🐄',
    nombre: 'Inventario de ganado',
    desc: 'Lista completa de animales con arete, especie, raza, peso y estado actual.',
    info: 'Incluye todos los animales activos, vendidos y bajas.',
    endpoint: '/reportes/ganado',
    filename: 'reporte-ganado-yapuuywa.pdf',
  },
  {
    id: 'finanzas',
    icon: '💰',
    nombre: 'Reporte financiero',
    desc: 'Balance de ingresos vs egresos con detalle de ventas y gastos por período.',
    info: 'Incluye balance total y listado completo.',
    endpoint: '/reportes/finanzas',
    filename: 'reporte-finanzas-yapuuywa.pdf',
  },
  {
    id: 'historial',
    icon: '🩺',
    nombre: 'Historial sanitario',
    desc: 'Registro de vacunaciones, tratamientos y revisiones por animal.',
    info: 'Próximamente disponible.',
    endpoint: '/reportes/historial',
    filename: 'reporte-historial-yapuuywa.pdf',
    proximamente: false,
  },
  {
    id: 'insumos',
    icon: '📦',
    nombre: 'Inventario de insumos',
    desc: 'Estado actual del stock de semillas, fertilizantes y medicamentos.',
    info: 'Próximamente disponible.',
    endpoint: '/reportes/insumos',
    filename: 'reporte-insumos-yapuuywa.pdf',
    proximamente: false,
  },
]

export default function Reportes() {
  const { toast, show } = useToast()
  const { ganado }      = useGanado()
  const [loading, setLoading] = useState({})

  const descargar = async (reporte) => {
    if (reporte.proximamente) {
      show('Este reporte estará disponible próximamente', 'warning')
      return
    }
    setLoading(prev => ({ ...prev, [reporte.id]: true }))
    try {
      const res = await apiClient.get(reporte.endpoint, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', reporte.filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      show(`Reporte descargado: ${reporte.nombre}`)
    } catch (_) {
      show('Error al generar el reporte', 'error')
    } finally {
      setLoading(prev => ({ ...prev, [reporte.id]: false }))
    }
  }

  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>Reportes PDF</h1>
          <p style={S.sub}>Genera y descarga reportes profesionales por módulo</p>
        </div>
      </div>

      <div style={S.grid2}>
        {REPORTES.map(r => (
          <div key={r.id} style={{...S.card, opacity: r.proximamente ? .7 : 1}}>
            <div style={S.icon}>{r.icon}</div>
            <div style={S.name}>{r.nombre}</div>
            <div style={S.desc}>{r.desc}</div>
            <div style={S.info}>{r.info}</div>
            <Button
              variant={r.proximamente ? 'ghost' : 'primary'}
              size="md"
              icon="📄"
              onClick={() => descargar(r)}
              disabled={loading[r.id]}
            >
              {loading[r.id] ? 'Generando...' : r.proximamente ? 'Próximamente' : 'Descargar PDF'}
            </Button>
          </div>
        ))}
      </div>

      <Toast message={toast.msg} visible={toast.visible} type={toast.type}/>
    </div>
  )
}