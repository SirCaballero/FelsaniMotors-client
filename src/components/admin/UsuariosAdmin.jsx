import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const UsuariosAdmin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = authService.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetch('http://localhost:4002/api/usuarios', {
            method: 'GET',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Error al obtener usuarios');
                    });
                }
                return response.json();
            })
            .then(data => {
                setUsuarios(data);
                setError(null);
            })
            .catch((error) => {
                setError(`Error al cargar usuarios: ${error.message}`);
            });
    }, []);

    const fetchUsuarios = () => {
        fetch('http://localhost:4002/api/usuarios', {
            method: 'GET',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Error al obtener usuarios');
                    });
                }
                return response.json();
            })
            .then(data => {
                setUsuarios(data);
                setError(null);
            })
            .catch((error) => {
                setError(`Error al cargar usuarios: ${error.message}`);
            });
    };

    const handleDesactivarUsuario = (idUsuario) => {
        fetch(`http://localhost:4002/api/usuarios/${idUsuario}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Error al desactivar usuario');
                    });
                }
                fetchUsuarios();
            })
            .catch((error) => {
                setError(`Error al desactivar el usuario: ${error.message}`);
            });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <div className="text-red-600 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button 
                            onClick={() => navigate('/admin')}
                            className="px-6 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-paleta1-blue-light hover:text-gray-800 transition-colors"
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
                        <p className="text-gray-600">Total: {usuarios.length} usuario(s)</p>
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

                {/* Mensaje de error */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-red-800 font-medium">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Lista de usuarios */}
                <div className="space-y-4">
                    {usuarios.map((usuario) => (
                        <div key={usuario.idUsuario} className="bg-white rounded-lg overflow-hidden">
                            
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
                                        {usuario.activo && (
                                            <button
                                                onClick={() => handleDesactivarUsuario(usuario.idUsuario)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            >
                                                Desactivar Usuario
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {usuarios.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg mt-4">
                        <p className="text-gray-500">No hay usuarios en el sistema</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsuariosAdmin;
