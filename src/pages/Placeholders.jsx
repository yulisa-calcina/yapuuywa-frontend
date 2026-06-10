import { EmptyState, Button } from '../components/ui/index'

const S = {
  hdr:   { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
  title: { fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:'#1e2e1e' },
  sub:   { fontSize:12, color:'#8d9e8d', marginTop:3 },
  card:  { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden', minHeight:300, display:'flex', alignItems:'center', justifyContent:'center' },
}

function PlaceholderPage({ icon, title, subtitle, description, btnLabel }) {
  return (
    <div>
      <div style={S.hdr}>
        <div>
          <h1 style={S.title}>{title}</h1>
          <p style={S.sub}>{subtitle}</p>
        </div>
        {btnLabel && <Button variant="primary" size="sm" icon="+">{btnLabel}</Button>}
      </div>
      <div style={S.card}>
        <EmptyState icon={icon} title="Módulo en desarrollo" description={description} />
      </div>
    </div>
  )
}

export function Cultivos()   { return <PlaceholderPage icon="🌱" title="Cultivos agrícolas"      subtitle="Ciclos de siembra y cosecha · RF06, RF07"         description="Registra papa, quinua, cebada. Seguimiento desde siembra hasta cosecha." btnLabel="Nueva parcela"/> }
export function Insumos()    { return <PlaceholderPage icon="📦" title="Inventario de insumos"   subtitle="Control de semillas y medicamentos · RF08, RF09"   description="Alertas automáticas cuando el stock llega al mínimo configurado." btnLabel="Nuevo insumo"/> }
export function Produccion() { return <PlaceholderPage icon="🥛" title="Registro de producción"  subtitle="Leche, lana y ventas · RF11"                       description="Registra litros de leche por animal y kg de lana por esquila." btnLabel="Nuevo registro"/> }
export function Parcelas()   { return <PlaceholderPage icon="📍" title="Parcelas agrícolas"      subtitle="Gestión de terrenos · RF06"                        description="Registra terrenos con superficie, tipo de suelo y riego." btnLabel="Nueva parcela"/> }
export function Personal()   { return <PlaceholderPage icon="👷" title="Personal y jornales"     subtitle="Trabajadores y cálculo de pago · RF10"             description="Fórmula: Días trabajados × Salario diario = Total a pagar." btnLabel="Nuevo trabajador"/> }
export function Finanzas()   { return <PlaceholderPage icon="💰" title="Finanzas"                subtitle="Ingresos, egresos y balance · RF11, RF12"          description="Controla gastos e ingresos con balance automático por período." btnLabel="Nuevo registro"/> }
export function Reportes()   { return <PlaceholderPage icon="📄" title="Reportes PDF"            subtitle="Reportes profesionales por módulo · RF13"         description="Genera reportes de inventario, historial médico y balance financiero."/> }
export function Usuarios()   { return <PlaceholderPage icon="👤" title="Gestión de usuarios"     subtitle="Cuentas por rol · RF02"                           description="Administrador, Ganadero y Veterinario con permisos diferenciados." btnLabel="Nuevo usuario"/> }
export function Alertas()    { return <PlaceholderPage icon="🔔" title="Centro de alertas"       subtitle="Alertas activas del sistema · RF05, RF09"         description="Alertas de vacunación ordenadas por urgencia y stock crítico."/> }