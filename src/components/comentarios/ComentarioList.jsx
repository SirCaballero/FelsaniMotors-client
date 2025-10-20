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

    const createAuthHeaders = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${authService.getToken()}`);
        return headers;
    };

    // GET comentarios
    useEffect(() => {
        fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();})
        .then((data) => { 
            setComentarios(data);
            setError(null);
        })
        .catch((e) => {
            setError(e.message);
        })
    }, [API_URL]);

    // POST comentario
    const handleCrearComentario = (texto) => {

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
                throw error;
            });
    };

    // PUT comentario
    const handleEditarComentario = (idComentario, nuevoTexto) => {

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
                throw error;
            });
    };

    // DELETE comentario
    const handleEliminarComentario = (idComentario) => {

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
                throw error;
            });
    };

    // Responder comentario
    const handleResponder = (idComentarioPadre, textoRespuesta) => {
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
                const actualizarComentarios = (comentariosList) => {
                    return comentariosList.map(comentario => {
                        if (comentario.idComentario === idComentarioPadre) {
                            return {
                                ...comentario,
                                respuestas: [...(comentario.respuestas || []), nuevaRespuesta]
                            };
                        }
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
                throw error;
            });
    };

    // Renderizar un comentario con respuestas anteriores
    const renderComentarioConRespuestas = (comentario) => {
        const tieneRespuestas = comentario.respuestas?.length > 0;
        
        return (
            <div key={comentario.idComentario} className="space-y-3">
                <ComentarioItem
                    comentario={comentario}
                    handleEditarComentario={handleEditarComentario}
                    handleEliminarComentario={handleEliminarComentario}
                    handleResponder={handleResponder}
                />
                
                {/** GET de comentarios modo arbol */}
                {tieneRespuestas && (
                    <div className="ml-8 pl-6 border-l-4 border-paleta1-blue-light space-y-2 mt-6">
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
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
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

            {/* Form comentario */}
            <div className="bg-white border border-paleta1-cream rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-2xl font-bold text-paleta1-blue">Crear un comentario</h3>
                </div>
                
                {/** Chequea si esta loggeado o no. Si no lo esta, no le permite escribir un commentario */}
                {isAuthenticated ? (
                    <ComentarioForm 
                        onSubmit={handleCrearComentario}
                    />
                ) : (
                    <div className="bg-white border border-paleta1-cream p-6 rounded-xl">
                        <div className="flex items-start gap-4">

                            <div className="w-12 h-12 bg-paleta1-cream rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-paleta1-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <div className='self-center-safe'>
                                <p className="text-gray-700 leading-relaxed">
                                    Inicia sesión para escribir comentarios en la publicación.
                                </p>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            {/* Lista de comentarios */}
            <div className="bg-white border border-paleta1-cream rounded-xl p-8">
                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-paleta1-blue">
                            Todos los comentarios
                        </h3>

                    </div>

                    <div className="bg-gradient-to-r from-paleta1-blue to-paleta1-blue/90 text-white px-4 py-2 rounded-xl text-sm font-bold">
                        {comentarios.length} comentarios
                    </div>

                </div>

                {/** chequea si hay comentarios en la publicacion. Muestra un mensaje si no hay nada*/}
                {comentarios.length === 0 ? (

                    <div className="text-center py-16">

                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-paleta1-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-paleta1-blue mb-3">
                            No existen comentarios para esta publicacion.
                        </h4>

                    </div>

                    ) : (

                    <div className="space-y-6">
                        {comentarios
                            .filter(c => !c.idComentarioPadre)
                            .map(comentario => renderComentarioConRespuestas(comentario))}
                    </div>)
                }
            </div>
        </div>
    );
};

export default ComentarioList;
