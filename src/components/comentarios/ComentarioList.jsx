import { useState, useEffect, useContext } from 'react';
import ComentarioItem from './ComentarioItem';
import ComentarioForm from './ComentarioForm';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const ComentarioList = ({ idPublicacion }) => {

    const [comentarios, setComentarios] = useState([]);
    const [error, setError] = useState(null);
    
    const { isAuthenticated = false, user = null } = useContext(AuthContext);
    const API_URL = `http://localhost:4002/api/publicaciones/${idPublicacion}/comentarios`;

    // Creacion de headers para Bearer token
    const createAuthHeaders = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${authService.getToken()}`);
        return headers;
    };

    // Cargar comentarios con useEffect - GET es público, no requiere Bearer token
    useEffect(() => {
        fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();})
        .then((data) => { setComentarios(data) })
        .catch((e) => {
            console.error('Error al obtener los comentarios:', e);
            setError(e.message) })
    }, [API_URL]);

    // Crear comentario - POST requiere Bearer token
    const handleCrearComentario = (texto) => {
        // Validar si el usuario está activo
        if (!user?.activo) {
            alert('Tu cuenta está inactiva. No puedes comentar.');
            return;
        }
        
        return fetch(API_URL, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify({ 
                idUsuario: user.idUsuario, 
                texto 
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((nuevoComentario) => {
                setComentarios([nuevoComentario, ...comentarios]);
                return nuevoComentario;
            })
            .catch((error) => {
                console.error('Error al crear comentario:', error);
                throw error;
            });
    };

    // Editar comentario - PUT requiere Bearer token
    const handleEditarComentario = (idComentario, nuevoTexto) => {
        // Validar si el usuario está activo
        if (!user?.activo) {
            alert('Tu cuenta está inactiva. No puedes editar comentarios.');
            return;
        }
        
        return fetch(`${API_URL}/${idComentario}/texto`, {
            method: 'PUT',
            headers: createAuthHeaders(),
            body: JSON.stringify({ texto: nuevoTexto })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((actualizado) => {
                setComentarios(comentarios.map(c => 
                    c.idComentario === idComentario ? actualizado : c
                ));
                return actualizado;
            })
            .catch((error) => {
                console.error('Error al editar comentario:', error);
                throw error;
            });
    };

    // Eliminar comentario - DELETE requiere Bearer token
    const handleEliminarComentario = (idComentario) => {
        // Validar si el usuario está activo
        if (!user?.activo) {
            alert('Tu cuenta está inactiva. No puedes eliminar comentarios.');
            return;
        }
        
        return fetch(`${API_URL}/${idComentario}`, {
            method: 'DELETE',
            headers: createAuthHeaders()
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .then(() => {
                setComentarios(comentarios.filter(c => c.idComentario !== idComentario));
            })
            .catch((error) => {
                console.error('Error al eliminar comentario:', error);
                throw error;
            });
    };

    // Responder comentario - POST requiere Bearer token
    const handleResponder = (idComentarioPadre, textoRespuesta) => {
        // Validar si el usuario está activo
        if (!user?.activo) {
            alert('Tu cuenta está inactiva. No puedes responder comentarios.');
            return;
        }
        
        return fetch(`${API_URL}/${idComentarioPadre}/respuestas`, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify({ 
                idUsuario: user.idUsuario, 
                texto: textoRespuesta 
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((nuevaRespuesta) => {
                // Actualizar el estado agregando la nueva respuesta al comentario padre
                const actualizarComentarios = (comentariosList) => {
                    return comentariosList.map(comentario => {
                        if (comentario.idComentario === idComentarioPadre) {
                            // Encontramos el comentario padre, agregamos la respuesta
                            return {
                                ...comentario,
                                respuestas: [...(comentario.respuestas || []), nuevaRespuesta]
                            };
                        }
                        // Si tiene respuestas anidadas, buscar recursivamente
                        if (comentario.respuestas?.length > 0) {
                            return {
                                ...comentario,
                                respuestas: actualizarComentarios(comentario.respuestas)
                            };
                        }
                        return comentario;
                    });
                };
                
                setComentarios(actualizarComentarios(comentarios));
                return nuevaRespuesta;
            })
            .catch((error) => {
                console.error('Error al responder comentario:', error);
                throw error;
            });
    };

    // Renderizar un comentario con sus respuestas anidadas
    const renderComentarioConRespuestas = (comentario) => {
        const tieneRespuestas = comentario.respuestas?.length > 0;
        
        return (
            <div key={comentario.idComentario} className="space-y-3">
                <ComentarioItem
                    comentario={comentario}
                    currentUserId={user?.idUsuario}
                    currentUserRole={user?.rol}
                    isAuthenticated={isAuthenticated}
                    handleEditarComentario={handleEditarComentario}
                    handleEliminarComentario={handleEliminarComentario}
                    handleResponder={handleResponder}
                />

                {tieneRespuestas && (
                    <div className="ml-8 pl-6 border-l-4 border-paleta1-blue-light space-y-4 mt-6">
                        {comentario.respuestas.map(respuesta => 
                            renderComentarioConRespuestas(respuesta)
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-red-800">Error al cargar comentarios</p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-paleta1-cream-light p-6 rounded-xl">
            {/* Sección de formulario moderna */}
            <div className="bg-white border border-paleta1-cream rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-paleta1-blue rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-paleta1-blue">Dejar un comentario</h3>
                </div>
                
                {isAuthenticated ? (
                    <ComentarioForm 
                        onSubmit={handleCrearComentario}
                        placeholder="Comparte tu opinión sobre esta publicación..."
                        submitLabel="Publicar comentario"
                    />
                ) : (
                    <div className="bg-white border border-paleta1-cream p-6 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-paleta1-cream rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-paleta1-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-paleta1-blue mb-2">
                                    Modo público activado
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                    Puedes ver todos los comentarios, pero necesitas <strong>iniciar sesión</strong> para escribir, editar o eliminar comentarios.
                                </p>
                                <p className="text-sm mt-3 text-paleta1-blue font-medium">
                                    💡 Los comentarios se cargan automáticamente sin necesidad de autenticación.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de comentarios mejorada */}
            <div className="bg-white border border-paleta1-cream rounded-xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-paleta1-blue to-paleta1-blue/80 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-paleta1-blue">
                            Todos los comentarios
                        </h3>
                    </div>
                    <div className="bg-gradient-to-r from-paleta1-blue to-paleta1-blue/90 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                        {comentarios.length} comentarios
                    </div>
                </div>

                {comentarios.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-paleta1-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-paleta1-blue mb-3">
                            ¡Sé el primero en comentar!
                        </h4>
                        <p className="text-gray-600 text-lg">
                            No hay comentarios aún. Comparte tu opinión sobre esta publicación.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comentarios
                            .filter(c => !c.idComentarioPadre)
                            .map(comentario => renderComentarioConRespuestas(comentario))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComentarioList;
