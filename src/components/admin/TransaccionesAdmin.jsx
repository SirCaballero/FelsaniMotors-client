import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const API_URL = 'http://localhost:4002/api';

const TransaccionesAdmin = () => {
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Helper para obtener headers de autenticación
    const getAuthHeaders = () => {
        const token = authService.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = () => {
        setLoading(true);
        fetch(`${API_URL}/transacciones`, {
            method: 'GET',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener transacciones');
                return response.json();
            })
            .then(data => {
                setTransacciones(data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar transacciones. Verifica que tengas permisos de administrador.');
                console.error(err);
                setLoading(false);
            });
    };

    const handleEliminar = (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta transacción?')) {
            return;
        }

        fetch(`${API_URL}/transacciones/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar transacción');
                fetchTransacciones();
                alert('Transacción eliminada exitosamente');
            })
            .catch(err => {
                alert('Error al eliminar la transacción');
                console.error(err);
            });
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearMonto = (monto) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(monto);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando transacciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-red-600 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-semibold mb-2">Error</p>
                        <p>{error}</p>
                        <button 
                            onClick={() => navigate('/admin')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Volver al Panel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Transacciones</h1>
                        <p className="text-gray-600">Total: {transacciones.length} transacción(es)</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transacciones.map((transaccion) => (
                                    <tr key={transaccion.idTransaccion} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {transaccion.idTransaccion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatearFecha(transaccion.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {formatearMonto(transaccion.monto)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                transaccion.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                                                transaccion.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {transaccion.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {transaccion.tipo || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEliminar(transaccion.idTransaccion)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {transacciones.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg shadow mt-4">
                        <p className="text-gray-500">No hay transacciones registradas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransaccionesAdmin;
