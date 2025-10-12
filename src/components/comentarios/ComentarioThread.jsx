import { useState, useEffect } from 'react';
import ComentarioItem from './ComentarioItem';
import ComentarioForm from './ComentarioForm';

const ComentarioThread = ({ 
    idPublicacion, 
    currentUserId = null,
    maxDepth = 3 
}) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const API_URL = `http://localhost:4002/api/publicaciones/${idPublicacion}/comentarios`;

    useEffect(() => {
        cargarComentarios();
    }, [idPublicacion]);

    const cargarComentarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/jerarquicos`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            setComentarios(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearComentario = async (texto) => {
        if (!currentUserId) {
            throw new Error('Debes iniciar sesión para comentar');
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: currentUserId, texto })
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        cargarComentarios(); // Recargar toda la jerarquía
    };

    const handleEditarComentario = async (idComentario, nuevoTexto) => {
        const response = await fetch(`${API_URL}/${idComentario}/texto`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: nuevoTexto })
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        cargarComentarios();
    };

    const handleEliminarComentario = async (idComentario) => {
        const response = await fetch(`${API_URL}/${idComentario}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        cargarComentarios();
    };

    const handleResponder = async (idComentarioPadre, textoRespuesta) => {
        if (!currentUserId) {
            throw new Error('Debes iniciar sesión para responder');
        }

        const response = await fetch(`${API_URL}/${idComentarioPadre}/respuestas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: currentUserId, texto: textoRespuesta })
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        cargarComentarios();
    };

    const renderComentarioConRespuestas = (comentario, depth = 0) => {
        const hasRespuestas = comentario.respuestas && comentario.respuestas.length > 0;
        const canReply = depth < maxDepth;

        return (
            <div key={comentario.idComentario} className="space-y-3">
                <ComentarioItem
                    comentario={comentario}
                    currentUserId={currentUserId}
                    onEdit={handleEditarComentario}
                    onDelete={handleEliminarComentario}
                    onReply={canReply ? handleResponder : null}
                    showReplyButton={canReply}
                />

                {hasRespuestas && (
                    <div className="ml-8 pl-4 border-l-2 border-gray-200 space-y-3">
                        {comentario.respuestas.map(respuesta => 
                            renderComentarioConRespuestas(respuesta, depth + 1)
                        )}
                    </div>
                )}
            </div>
        );
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
            {/* Formulario */}
            <div className="bg-[#f2f5f6] p-4 rounded">
                <h3 className="text-lg font-semibold mb-3 text-[#6c94c4]">Dejar un comentario</h3>
                <ComentarioForm 
                    onSubmit={handleCrearComentario}
                    placeholder="Escribe tu comentario sobre esta publicación..."
                />
            </div>

            {/* Comentarios */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-[#6c94c4]">
                    Comentarios ({comentarios.length})
                </h3>

                {comentarios.length === 0 ? (
                    <div className="text-center py-12 bg-[#f2f5f6] rounded">
                        <p className="text-gray-500 text-lg">
                            No hay comentarios aún
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            ¡Sé el primero en comentar!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comentarios.map(comentario => 
                            renderComentarioConRespuestas(comentario)
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComentarioThread;
