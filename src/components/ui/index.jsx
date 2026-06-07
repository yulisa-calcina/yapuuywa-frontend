import React from 'react'

/* ════════════════════════════════
   ESTILOS INLINE — sin módulos CSS externos
   para evitar cualquier error de importación
════════════════════════════════ */

const S = {
  /* Button */
  btn: { display:'inline-flex', alignItems:'center', gap:6, border:'none', borderRadius:10, fontFamily:'inherit', fontWeight:600, cursor:'pointer', transition:'all .15s' },
  btn_primary:   { background:'#1a5c2a', color:'#fff' },
  btn_secondary: { background:'#fff', color:'#4a5e4a', border:'1.5px solid #dde3dd' },
  btn_danger:    { background:'#fde8ea', color:'#8b1a24', border:'1.5px solid #fde8ea' },
  btn_ghost:     { background:'none', color:'#4a5e4a', border:'1.5px solid #dde3dd' },
  btn_sm:  { fontSize:11, padding:'5px 12px' },
  btn_md:  { fontSize:13, padding:'9px 18px' },
  btn_lg:  { fontSize:14, padding:'12px 24px' },

  /* Badge */
  badge: { display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:20, fontSize:10, fontWeight:600 },
  badge_green: { background:'#eef7f0', color:'#1a5c2a' },
  badge_red:   { background:'#fde8ea', color:'#8b1a24' },
  badge_amber: { background:'#fef3dc', color:'#7a4f08' },
  badge_blue:  { background:'#e3f0fb', color:'#0c3d62' },
  badge_gray:  { background:'#eef1ee', color:'#4a5e4a' },

  /* Card */
  card:        { background:'#fff', border:'1px solid #dde3dd', borderRadius:14, overflow:'hidden' },
  card_header: { padding:'12px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between' },

  /* Spinner */
  spinner: { border:'2px solid #dde3dd', borderTopColor:'#2d7a40', borderRadius:'50%', animation:'spin .6s linear infinite' },

  /* Empty */
  empty:       { padding:'48px 24px', textAlign:'center' },
  empty_icon:  { fontSize:40, marginBottom:14, opacity:.5 },
  empty_title: { fontSize:14, fontWeight:600, color:'#4a5e4a', marginBottom:6 },
  empty_desc:  { fontSize:12, color:'#8d9e8d', maxWidth:320, margin:'0 auto 16px', lineHeight:1.6 },

  /* Modal */
  overlay:      { position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  modal:        { background:'#fff', borderRadius:20, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 8px 32px rgba(0,0,0,.12)' },
  modal_header: { padding:'20px 24px 16px', borderBottom:'1px solid #eef1ee', display:'flex', alignItems:'center', justifyContent:'space-between' },
  modal_title:  { fontFamily:"'Sora', sans-serif", fontSize:16, fontWeight:600, color:'#1e2e1e' },
  modal_close:  { background:'none', border:'none', fontSize:18, color:'#8d9e8d', cursor:'pointer', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6 },
  modal_body:   { padding:'20px 24px 24px' },

  /* Toast */
  toast:         { position:'fixed', bottom:24, right:24, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, zIndex:300, transition:'all .25s', display:'flex', alignItems:'center', gap:8, pointerEvents:'none' },
  toast_success: { background:'#1a5c2a', color:'#fff' },
  toast_error:   { background:'#dc3545', color:'#fff' },
  toast_warning: { background:'#e8a020', color:'#fff' },

  /* Form */
  form_group: { marginBottom:16 },
  form_label: { display:'block', fontSize:12, fontWeight:600, color:'#4a5e4a', marginBottom:6, letterSpacing:'.02em' },
  req:        { color:'#dc3545' },
  form_input: { width:'100%', padding:'9px 12px', border:'1.5px solid #dde3dd', borderRadius:10, fontSize:13, color:'#1e2e1e', background:'#fff', outline:'none', fontFamily:'inherit' },
  form_hint:  { fontSize:11, color:'#8d9e8d', marginTop:4 },
}

/* ── BUTTON ── */
export function Button({ children, variant='primary', size='md', onClick, type='button', disabled, icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...S.btn, ...S[`btn_${variant}`], ...S[`btn_${size}`], opacity: disabled ? .6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

/* ── BADGE ── */
export function Badge({ children, color='green' }) {
  return <span style={{ ...S.badge, ...S[`badge_${color}`] }}>{children}</span>
}

/* ── CARD ── */
export function Card({ children, style }) {
  return <div style={{ ...S.card, ...style }}>{children}</div>
}
export function CardHeader({ children }) {
  return <div style={S.card_header}>{children}</div>
}
export function CardBody({ children }) {
  return <div>{children}</div>
}

/* ── SPINNER ── */
export function Spinner({ size=20 }) {
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ ...S.spinner, width:size, height:size }} />
    </>
  )
}

/* ── EMPTY STATE ── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={S.empty}>
      {icon && <div style={S.empty_icon}>{icon}</div>}
      <p style={S.empty_title}>{title}</p>
      {description && <p style={S.empty_desc}>{description}</p>}
      {action}
    </div>
  )
}

/* ── MODAL ── */
export function Modal({ open, onClose, title, children, width=500 }) {
  if (!open) return null
  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modal, maxWidth: width }}>
        <div style={S.modal_header}>
          <h2 style={S.modal_title}>{title}</h2>
          <button style={S.modal_close} onClick={onClose}>✕</button>
        </div>
        <div style={S.modal_body}>{children}</div>
      </div>
    </div>
  )
}

/* ── TOAST ── */
export function Toast({ message, visible, type='success' }) {
  return (
    <div style={{
      ...S.toast,
      ...S[`toast_${type}`],
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
    }}>
      {type==='success'?'✓':type==='error'?'✕':'⚠'} {message}
    </div>
  )
}

/* ── FORM GROUP ── */
export function FormGroup({ label, required, hint, children }) {
  return (
    <div style={S.form_group}>
      <label style={S.form_label}>
        {label} {required && <span style={S.req}>*</span>}
      </label>
      {children}
      {hint && <p style={S.form_hint}>{hint}</p>}
    </div>
  )
}

/* ── INPUT ── */
export function Input(props) {
  return <input style={S.form_input} {...props} />
}

/* ── SELECT ── */
export function Select({ children, ...props }) {
  return <select style={S.form_input} {...props}>{children}</select>
}
