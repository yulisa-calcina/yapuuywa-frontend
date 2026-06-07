import { useState, useEffect } from 'react';
import { ganadoApi } from '../api/ganado.api';

export function useGanado() {
    const [ganado, setGanado]   = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const fetchGanado = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ganadoApi.getAll();
            setGanado(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar ganado');
        } finally {
            setLoading(false);
        }
    };

    const deleteAnimal = async (id) => {
        try {
            await ganadoApi.delete(id);
            setGanado(prev => prev.filter(a => a.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false };
        }
    };

    useEffect(() => {
        fetchGanado();
    }, []);

    return { ganado, loading, error, fetchGanado, deleteAnimal };
}