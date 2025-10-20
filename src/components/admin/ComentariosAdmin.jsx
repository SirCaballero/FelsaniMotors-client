import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ComentariosAdmin = () => {
    const [comentarios, setComentarios] = useState([]);
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
        fetch('http://localhost:4002/api/publicaciones', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) return;
                return response.json();
            })
            .then(publicaciones => {
                if (!publicaciones || publicaciones.length === 0) {
                    setComentarios([]);
                    return;
                }
                
                const comentarios = [];
                
                publicaciones.forEach(p => {
                    fetch(`http://localhost:4002/api/publicaciones/${p.idPublicacion}/comentarios`, {
                        method: 'GET'
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            return [];
                        })
                        .then(comentariosDePub => {
                            const comentariosConPublicacion = comentariosDePub.map(com => ({
                                ...com,
                                publicacion: {
                                    idPublicacion: p.idPublicacion,
                                    titulo: p.titulo
                                }
                            }));
                            comentarios.push(...comentariosConPublicacion);
                            setComentarios([...comentarios]);
                        });
                });
            });
    }, []);

    const fetchComentarios = () => {
        fetch('http://localhost:4002/api/publicaciones', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) return;
                return response.json();
            })
            .then(publicaciones => {
                if (!publicaciones || publicaciones.length === 0) {
                    setComentarios([]);
                    return;
                }
                
                const todosLosComentarios = [];
                
                publicaciones.forEach(p => {
                    fetch(`http://localhost:4002/api/publicaciones/${p.idPublicacion}/comentarios`, {
                        method: 'GET'
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            return [];
                        })
                        .then(comentariosDePub => {
                            const comentariosConPublicacion = comentariosDePub.map(com => ({
                                ...com,
                                publicacion: {
                                    idPublicacion: p.idPublicacion,
                                    titulo: p.titulo
                                }
                            }));
                            todosLosComentarios.push(...comentariosConPublicacion);
                            setComentarios([...todosLosComentarios]);
                        });
                });
            });
    };

    const handleEliminarComentario = (idComentario, usuario, idPublicacion) => {
        if (!window.confirm(`¿Estás seguro de eliminar el comentario de ${usuario}?`)) {
            return;
        }

        const urlComentarioPublicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}/comentarios/${idComentario}`;

        fetch(urlComentarioPublicacion, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
            .then(response => {
                if (response.ok) {
                    fetchComentarios();
                    alert('Comentario eliminado exitosamente');
                } else {
                    return response.text().then(text => {
                        throw new Error(text || 'Error al eliminar el comentario');
                    });
                }
            })
            .catch((error) => {
                setError(`Error al eliminar el comentario: ${error.message}`);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion Comentarios</h1>
                        <p className="text-gray-600">Total: {comentarios.length} comentario(s)</p>
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

                {/* Lista de comentarios */}
                <div className="space-y-4">
                    {comentarios.map((comentario) => (
                        <div key={comentario.idComentario} className="bg-white rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">

                                    {/* Info del comentario */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                                            ID: {comentario.idComentario}
                                        </div>
                                    </div>

                                    {/* Usuario */}
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="font-semibold text-gray-700">Usuario:</div>
                                        <div className="text-gray-900">
                                            {comentario.usuario?.nombre} {comentario.usuario?.apellido}
                                        </div>
                                    </div>

                                    {/* Publicacion */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="font-semibold text-gray-700">Publicación:</div>
                                        <div className="text-gray-900">
                                            {comentario.publicacion?.titulo || 'N/A'}
                                        </div>
                                    </div>

                                    {/* Contenido del comentario */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-800">{comentario.contenido || comentario.texto}</p>
                                    </div>

                                    {/* Calificacion si existe */}
                                    {comentario.calificacion && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="text-sm font-semibold text-gray-700">Calificación:</div>
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
                                                <div className="ml-2 text-sm text-gray-600">
                                                    ({comentario.calificacion}/5)
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Boton eliminar */}
                                <button
                                    onClick={() => handleEliminarComentario(
                                        comentario.idComentario,
                                        `${comentario.usuario?.nombre} ${comentario.usuario?.apellido}`,
                                        comentario.publicacion?.idPublicacion
                                    )}
                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {comentarios.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg">
                        <p className="text-gray-500">No hay comentarios en el sistema</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComentariosAdmin;
