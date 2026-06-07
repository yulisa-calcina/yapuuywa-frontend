import { useState, useEffect, useCallback, useRef } from 'react'
import { ganadoApi, dashboardApi, alertasApi, historialApi } from '../api/services'

export function useGanado() {
  const [ganado, setGanado]     = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await ganadoApi.getAll()
      setGanado(res.data.data ?? res.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al cargar ganado')
    } finally { setLoading(false) }
  }, [])

  const create = useCallback(async (data) => {
    try {
      const res = await ganadoApi.create(data)
      setGanado(prev => [...prev, res.data.data ?? res.data])
      return { success: true }
    } catch (e) { return { success: false, errors: e.response?.data?.errors } }
  }, [])

  const update = useCallback(async (id, data) => {
    try {
      const res = await ganadoApi.update(id, data)
      const updated = res.data.data ?? res.data
      setGanado(prev => prev.map(a => a.id === id ? updated : a))
      return { success: true }
    } catch (e) { return { success: false } }
  }, [])

  const remove = useCallback(async (id) => {
    try {
      await ganadoApi.remove(id)
      setGanado(prev => prev.filter(a => a.id !== id))
      return { success: true }
    } catch (e) { return { success: false } }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { ganado, loading, error, fetch, create, update, remove }
}

export function useDashboard() {
  const [kpis, setKpis]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [lastSync, setLastSync] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await dashboardApi.getKpis()
      setKpis(res.data.data ?? res.data)
      setLastSync(new Date())
    } catch (_) {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, 60_000)
    return () => clearInterval(id)
  }, [fetch])

  return { kpis, loading, lastSync }
}

export function useAlertas() {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [vac, stock] = await Promise.all([
        alertasApi.getVacunacion(),
        alertasApi.getStock(),
      ])
      setAlertas([
        ...(vac.data.data   ?? vac.data   ?? []).map(a => ({ ...a, tipo: 'vacuna' })),
        ...(stock.data.data ?? stock.data ?? []).map(a => ({ ...a, tipo: 'stock'  })),
      ])
    } catch (_) {}
    finally { setLoading(false) }
  }, [])

  const atender = useCallback(async (id) => {
    try {
      await alertasApi.atender(id)
      setAlertas(prev => prev.filter(a => a.id !== id))
      return { success: true }
    } catch (_) { return { success: false } }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { alertas, loading, fetch, atender }
}

export function useHistorial(animalId) {
  const [historial, setHistorial] = useState([])
  const [loading, setLoading]     = useState(false)

  const fetch = useCallback(async () => {
    if (!animalId) return
    setLoading(true)
    try {
      const res = await historialApi.getByAnimal(animalId)
      setHistorial(res.data.data ?? res.data)
    } catch (_) {}
    finally { setLoading(false) }
  }, [animalId])

  const create = useCallback(async (data) => {
    try {
      const res = await historialApi.create(animalId, data)
      setHistorial(prev => [res.data.data ?? res.data, ...prev])
      return { success: true }
    } catch (e) { return { success: false } }
  }, [animalId])

  useEffect(() => { fetch() }, [fetch])
  return { historial, loading, fetch, create }
}

export function useToast() {
  const [toast, setToast] = useState({ msg: '', visible: false, type: 'success' })
  const timerRef = useRef(null)

  const show = useCallback((msg, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ msg, visible: true, type })
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }, [])

  return { toast, show }
}
