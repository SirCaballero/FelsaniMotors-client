import { useState, useEffect, useContext } from 'react';
import ComentarioItem from './ComentarioItem';
import ComentarioForm from './ComentarioForm';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const ComentarioList = ({ idPublicacion }) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Obtener contexto de autenticación - con manejo de errores
    let isAuthenticated = false;
    let user = null;
    
    try {
        const authContext = useContext(AuthContext);
        isAuthenticated = authContext?.isAuthenticated || false;
        user = authContext?.user || null;
    } catch (authError) {
        console.warn('AuthContext no disponible, ejecutando en modo público');
    }
    
    const API_URL = `http://localhost:4002/api/publicaciones/${idPublicacion}/comentarios`;

    // Función auxiliar para crear headers con Bearer token
    const createAuthHeaders = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        // Solo agregar Bearer token si el usuario está autenticado
        if (isAuthenticated) {
            const token = authService?.getToken();
            if (token) {
                headers.append('Authorization', `Bearer ${token}`);
            }
        }
        
        return headers;
    };

    // Cargar comentarios al montar
    useEffect(() => {
        cargarComentarios();
    }, [idPublicacion]);

    const cargarComentarios = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Solicitando comentarios desde:', API_URL);
            // GET comentarios es público - NO requiere Bearer token
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Obtener el texto de la respuesta primero
            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);
            
            // Intentar parsear como JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                console.error('Respuesta recibida:', responseText);
                throw new Error(`JSON inválido recibido del servidor. Error: ${parseError.message}. Respuesta: ${responseText.substring(0, 200)}...`);
            }
            
            setComentarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error en cargarComentarios:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearComentario = async (texto) => {
        if (!isAuthenticated) {
            throw new Error('Debes iniciar sesión para comentar');
        }

        // POST comentarios requiere Bearer token
        const headers = createAuthHeaders();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ idUsuario: user?.id, texto })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const nuevoComentario = await response.json();
        setComentarios([nuevoComentario, ...comentarios]);
    };

    const handleEditarComentario = async (idComentario, nuevoTexto) => {
        if (!isAuthenticated) {
            throw new Error('Debes iniciar sesión para editar comentarios');
        }

        // PUT comentarios requiere Bearer token
        const headers = createAuthHeaders();
        const response = await fetch(`${API_URL}/${idComentario}/texto`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ texto: nuevoTexto })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
            if (response.status === 403) {
                throw new Error('No tienes permisos para editar este comentario.');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const actualizado = await response.json();
        setComentarios(comentarios.map(c => 
            c.idComentario === idComentario ? actualizado : c
        ));
    };

    const handleEliminarComentario = async (idComentario) => {
        if (!isAuthenticated) {
            throw new Error('Debes iniciar sesión para eliminar comentarios');
        }

        // DELETE comentarios requiere Bearer token
        const headers = createAuthHeaders();
        const response = await fetch(`${API_URL}/${idComentario}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
            if (response.status === 403) {
                throw new Error('No tienes permisos para eliminar este comentario.');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        setComentarios(comentarios.filter(c => c.idComentario !== idComentario));
    };

    const handleResponder = async (idComentarioPadre, textoRespuesta) => {
        if (!isAuthenticated) {
            throw new Error('Debes iniciar sesión para responder');
        }

        // POST respuestas requiere Bearer token
        const headers = createAuthHeaders();
        const response = await fetch(`${API_URL}/${idComentarioPadre}/respuestas`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ idUsuario: user?.id, texto: textoRespuesta })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Recargar comentarios para mostrar la respuesta
        cargarComentarios();
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c94c4]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                <p className="font-semibold">Error al cargar comentarios</p>
                <p className="text-sm">{error}</p>
                <button 
                    onClick={cargarComentarios}
                    className="mt-2 text-sm underline hover:no-underline"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header informativo */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    💬 Comentarios de la Publicación #{idPublicacion}
                </h2>
                <div className="text-sm text-gray-600">
                    <p>
                        📡 <strong>Estado de conexión:</strong> {isAuthenticated ? '🟢 Autenticado' : '🔵 Modo público'}
                        {isAuthenticated && user && (
                            <span className="ml-2">
                                | 👤 Usuario: <strong>{user.email}</strong>
                            </span>
                        )}
                    </p>
                    <p className="mt-1">
                        🔓 <strong>Lectura:</strong> Pública (sin autenticación) | 
                        🔒 <strong>Escritura:</strong> Requiere autenticación
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-[#6c94c4]">Dejar un comentario</h3>
                {isAuthenticated ? (
                    <ComentarioForm 
                        onSubmit={handleCrearComentario}
                        placeholder="Escribe tu comentario sobre esta publicación..."
                    />
                ) : (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded">
                        <p className="text-sm">
                            📖 <strong>Modo público:</strong> Puedes ver todos los comentarios, pero necesitas <strong>iniciar sesión</strong> para escribir, editar o eliminar comentarios.
                        </p>
                        <p className="text-xs mt-2 text-blue-600">
                            💡 Los comentarios se cargan automáticamente sin necesidad de autenticación según la configuración del servidor.
                        </p>
                    </div>
                )}
            </div>

            {/* Lista */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-[#6c94c4]">
                    Comentarios ({comentarios.length})
                </h3>

                {comentarios.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No hay comentarios aún. ¡Sé el primero en comentar!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comentarios.map(comentario => (
                            <ComentarioItem
                                key={comentario.idComentario}
                                comentario={comentario}
                                currentUserId={user?.id}
                                onEdit={handleEditarComentario}
                                onDelete={handleEliminarComentario}
                                onReply={handleResponder}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComentarioList;
