import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const API_URL = 'http://localhost:4002/api';

const PublicacionesAdmin = () => {
    const [publicaciones, setPublicaciones] = useState([]);
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
        fetchPublicaciones();
    }, []);

    const fetchPublicaciones = () => {
        setLoading(true);
        fetch(`${API_URL}/publicaciones`, {
            method: 'GET',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener publicaciones');
                return response.json();
            })
            .then(data => {
                setPublicaciones(data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar publicaciones. Verifica que tengas permisos de administrador.');
                console.error(err);
                setLoading(false);
            });
    };

    const handleEliminar = (id, titulo) => {
        if (!window.confirm(`¿Estás seguro de eliminar la publicación "${titulo}"?`)) {
            return;
        }

        fetch(`${API_URL}/publicaciones/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorData => {
                        console.error('Error del servidor:', response.status, errorData);
                        throw new Error(`Error al eliminar publicación: ${response.status}`);
                    });
                }
                fetchPublicaciones();
                alert('Publicación eliminada exitosamente');
            })
            .catch(err => {
                alert('Error al eliminar la publicación');
                console.error(err);
            });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando publicaciones...</p>
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Todas las Publicaciones</h1>
                        <p className="text-gray-600">Total: {publicaciones.length} publicación(es)</p>
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

                {/* Tabla de publicaciones */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {publicaciones.map((pub) => (
                                    <tr key={pub.idPublicacion} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {pub.idPublicacion}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="font-semibold">{pub.titulo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                            <div className="line-clamp-2">{pub.descripcion}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                pub.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' : 
                                                pub.estado === 'VENDIDO' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {pub.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {pub.precio ? `$${pub.precio.toLocaleString('es-AR')}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => navigate(`/publicacion/${pub.idPublicacion}`)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Ver
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(pub.idPublicacion, pub.titulo)}
                                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    DELETE
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {publicaciones.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg shadow mt-4">
                        <p className="text-gray-500">No hay publicaciones disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicacionesAdmin;
