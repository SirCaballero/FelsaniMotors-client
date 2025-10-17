import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const API_URL = 'http://localhost:4002/api';

const UsuariosAdmin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioExpandido, setUsuarioExpandido] = useState(null);
    const [publicacionesPorUsuario, setPublicacionesPorUsuario] = useState({});
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
        fetchUsuarios();
    }, []);

    const fetchUsuarios = () => {
        setLoading(true);
        fetch(`${API_URL}/usuarios`, {
            method: 'GET',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener usuarios');
                return response.json();
            })
            .then(data => {
                setUsuarios(data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar usuarios. Verifica que tengas permisos de administrador.');
                console.error(err);
                setLoading(false);
            });
    };

    const fetchPublicacionesUsuario = (idUsuario) => {
        fetch(`${API_URL}/publicaciones?userId=${idUsuario}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar publicaciones');
                return response.json();
            })
            .then(data => {
                setPublicacionesPorUsuario(prev => ({
                    ...prev,
                    [idUsuario]: data
                }));
            })
            .catch(err => {
                console.error('Error al cargar publicaciones del usuario:', err);
                setPublicacionesPorUsuario(prev => ({
                    ...prev,
                    [idUsuario]: []
                }));
            });
    };

    const toggleUsuario = (idUsuario) => {
        if (usuarioExpandido === idUsuario) {
            setUsuarioExpandido(null);
        } else {
            setUsuarioExpandido(idUsuario);
            if (!publicacionesPorUsuario[idUsuario]) {
                fetchPublicacionesUsuario(idUsuario);
            }
        }
    };

    const handleEliminarUsuario = (idUsuario, nombreCompleto) => {
        if (!window.confirm(`¿Estás seguro de eliminar al usuario ${nombreCompleto}? Esta acción no se puede deshacer y eliminará todas sus publicaciones.`)) {
            return;
        }

        fetch(`${API_URL}/usuarios/${idUsuario}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar usuario');
                fetchUsuarios(); // Recargar lista
                alert('Usuario eliminado exitosamente');
            })
            .catch(err => {
                alert('Error al eliminar el usuario');
                console.error(err);
            });
    };

    const handleEliminarPublicacion = (idPublicacion, titulo, idUsuario) => {
        if (!window.confirm(`¿Estás seguro de eliminar la publicación "${titulo}"?`)) {
            return;
        }

        fetch(`${API_URL}/publicaciones/${idPublicacion}`, {
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
                // Recargar las publicaciones del usuario
                fetchPublicacionesUsuario(idUsuario);
                alert('Publicación eliminada exitosamente');
            })
            .catch(err => {
                console.error('Error completo:', err);
                alert('Error al eliminar la publicación. Puede que tenga transacciones o items en carritos asociados. Verifica el backend.');
            });
    };

    const usuariosFiltrados = usuarios;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
                        <p className="text-gray-600">Total: {usuariosFiltrados.length} usuario(s)</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>

                {/* Lista de usuarios */}
                <div className="space-y-4">
                    {usuariosFiltrados.map((usuario) => (
                        <div key={usuario.idUsuario} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Datos principales del usuario */}
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {usuario.nombre} {usuario.apellido}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                usuario.rol === 'ADMIN' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {usuario.rol}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                usuario.activo 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-semibold">ID:</span> {usuario.idUsuario}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Email:</span> {usuario.email}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Teléfono:</span> {usuario.telefono || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleUsuario(usuario.idUsuario)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                            {usuarioExpandido === usuario.idUsuario ? 'Ocultar' : 'Ver'} Publicaciones
                                        </button>
                                        <button
                                            onClick={() => handleEliminarUsuario(usuario.idUsuario, `${usuario.nombre} ${usuario.apellido}`)}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar Usuario
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Publicaciones del usuario */}
                            {usuarioExpandido === usuario.idUsuario && (
                                <div className="border-t border-gray-200 bg-gray-50 p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                        Publicaciones de {usuario.nombre}
                                    </h4>
                                    
                                    {!publicacionesPorUsuario[usuario.idUsuario] ? (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
                                        </div>
                                    ) : publicacionesPorUsuario[usuario.idUsuario].length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">Este usuario no tiene publicaciones</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {publicacionesPorUsuario[usuario.idUsuario].map((pub) => (
                                                <div key={pub.idPublicacion} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                                    <h5 className="font-semibold text-gray-800 mb-2">{pub.titulo}</h5>
                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{pub.descripcion}</p>
                                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                                        <span>ID: {pub.idPublicacion}</span>
                                                        <span className={`px-2 py-1 rounded ${
                                                            pub.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {pub.estado}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/publicacion/${pub.idPublicacion}`)}
                                                            className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                                        >
                                                            Ver Detalles
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarPublicacion(pub.idPublicacion, pub.titulo, usuario.idUsuario)}
                                                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {usuariosFiltrados.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg shadow mt-4">
                        <p className="text-gray-500">No se encontraron usuarios con el filtro seleccionado</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsuariosAdmin;
