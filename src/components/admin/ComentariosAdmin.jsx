import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const API_URL = 'http://localhost:4002/api';

const ComentariosAdmin = () => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroPublicacion, setFiltroPublicacion] = useState('');
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
        fetchComentarios();
    }, []);

    const fetchComentarios = () => {
        setLoading(true);
        
        // Primero obtenemos todas las publicaciones
        fetch(`${API_URL}/publicaciones`, {
            method: 'GET',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener publicaciones');
                return response.json();
            })
            .then(publicaciones => {
                // Luego obtenemos los comentarios de cada publicación
                const todosLosComentarios = [];
                const promises = [];
                
                publicaciones.forEach(pub => {
                    const promise = fetch(`${API_URL}/publicaciones/${pub.idPublicacion}/comentarios`, {
                        method: 'GET'
                    })
                        .then(response => {
                            if (!response.ok) throw new Error('Error al obtener comentarios');
                            return response.json();
                        })
                        .then(comentariosDePub => {
                            // Agregamos la info de la publicación a cada comentario
                            const comentariosConPublicacion = comentariosDePub.map(com => ({
                                ...com,
                                publicacion: {
                                    idPublicacion: pub.idPublicacion,
                                    titulo: pub.titulo
                                }
                            }));
                            todosLosComentarios.push(...comentariosConPublicacion);
                        })
                        .catch(() => {
                            console.log(`No hay comentarios para la publicación ${pub.idPublicacion}`);
                        });
                    
                    promises.push(promise);
                });
                
                return Promise.all(promises).then(() => todosLosComentarios);
            })
            .then(todosLosComentarios => {
                setComentarios(todosLosComentarios);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar comentarios. Verifica que tengas permisos de administrador.');
                console.error(err);
                setLoading(false);
            });
    };

    const handleEliminarComentario = (idComentario, usuario, idPublicacion) => {
        if (!window.confirm(`¿Estás seguro de eliminar el comentario de ${usuario}?`)) {
            return;
        }

        // Intentar varios endpoints posibles
        const endpoints = [
            `${API_URL}/admin/comentarios/${idComentario}`,
            `${API_URL}/publicaciones/${idPublicacion}/comentarios/${idComentario}`,
            `${API_URL}/comentarios/${idComentario}`
        ];

        const tryDeleteEndpoint = (index) => {
            if (index >= endpoints.length) {
                alert('No se pudo eliminar el comentario. Ningún endpoint disponible.');
                return;
            }

            const endpoint = endpoints[index];
            console.log(`Intentando eliminar con endpoint: ${endpoint}`);

            fetch(endpoint, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
                .then(response => {
                    if (response.ok) {
                        console.log(`✓ Comentario eliminado exitosamente usando: ${endpoint}`);
                        fetchComentarios();
                        alert('Comentario eliminado exitosamente');
                        return;
                    }

                    // Si es 404, intentar siguiente endpoint
                    if (response.status === 404) {
                        tryDeleteEndpoint(index + 1);
                        return;
                    }

                    // Si es otro error, mostrar y no intentar más
                    return response.text().then(errorData => {
                        console.error('Error del servidor:', response.status, errorData);
                        throw new Error(`Error al eliminar comentario: ${response.status}`);
                    });
                })
                .catch(err => {
                    console.error('Error completo:', err);
                    alert('Error al eliminar el comentario. Verifica que el backend tenga implementado el endpoint de eliminación.');
                });
        };

        tryDeleteEndpoint(0);
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const comentariosFiltrados = filtroPublicacion
        ? comentarios.filter(c => c.publicacion?.titulo?.toLowerCase().includes(filtroPublicacion.toLowerCase()))
        : comentarios;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando comentarios...</p>
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
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Comentarios</h1>
                        <p className="text-gray-600">Total: {comentariosFiltrados.length} comentario(s)</p>
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

                {/* Filtro */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrar por publicación:
                    </label>
                    <input
                        type="text"
                        value={filtroPublicacion}
                        onChange={(e) => setFiltroPublicacion(e.target.value)}
                        placeholder="Buscar por título de publicación..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Lista de comentarios */}
                <div className="space-y-4">
                    {comentariosFiltrados.map((comentario) => (
                        <div key={comentario.idComentario} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {/* Info del comentario */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                                            ID: {comentario.idComentario}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {formatearFecha(comentario.fechaCreacion || comentario.fecha)}
                                        </span>
                                    </div>

                                    {/* Usuario */}
                                    <div className="mb-2">
                                        <span className="font-semibold text-gray-700">Usuario: </span>
                                        <span className="text-gray-900">
                                            {comentario.usuario?.nombre} {comentario.usuario?.apellido} 
                                            <span className="text-gray-500 ml-2">({comentario.usuario?.email})</span>
                                        </span>
                                    </div>

                                    {/* Publicación */}
                                    <div className="mb-3">
                                        <span className="font-semibold text-gray-700">Publicación: </span>
                                        <button
                                            onClick={() => navigate(`/publicacion/${comentario.publicacion?.idPublicacion}`)}
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {comentario.publicacion?.titulo || 'N/A'}
                                        </button>
                                    </div>

                                    {/* Contenido del comentario */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-800">{comentario.contenido || comentario.texto}</p>
                                    </div>

                                    {/* Calificación si existe */}
                                    {comentario.calificacion && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">Calificación:</span>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-5 h-5 ${
                                                            i < comentario.calificacion ? 'text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({comentario.calificacion}/5)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botón eliminar */}
                                <button
                                    onClick={() => handleEliminarComentario(
                                        comentario.idComentario,
                                        `${comentario.usuario?.nombre} ${comentario.usuario?.apellido}`,
                                        comentario.publicacion?.idPublicacion
                                    )}
                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {comentariosFiltrados.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg shadow">
                        <p className="text-gray-500">
                            {filtroPublicacion 
                                ? 'No se encontraron comentarios con ese filtro' 
                                : 'No hay comentarios en el sistema'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComentariosAdmin;
