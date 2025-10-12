import { useState } from 'react';
import ComentarioForm from './ComentarioForm';

const ComentarioItem = ({ 
    comentario, 
    currentUserId = null,
    onEdit, 
    onDelete, 
    onReply,
    showReplyButton = true 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = currentUserId && comentario.usuario?.idUsuario === currentUserId;

    const handleEdit = async (nuevoTexto) => {
        try {
            await onEdit(comentario.idComentario, nuevoTexto);
            setIsEditing(false);
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
            setIsDeleting(true);
            try {
                await onDelete(comentario.idComentario);
            } catch (error) {
                alert('Error al eliminar: ' + error.message);
                setIsDeleting(false);
            }
        }
    };

    const handleReply = async (textoRespuesta) => {
        try {
            await onReply(comentario.idComentario, textoRespuesta);
            setIsReplying(false);
        } catch (error) {
            throw error;
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isDeleting) {
        return (
            <div className="animate-pulse bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-500">Eliminando...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#e8decb] p-4 rounded shadow-sm border border-gray-200">
            {/* Header del comentario */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-[#6c94c4] rounded-full flex items-center justify-center text-white font-semibold">
                        {comentario.usuario?.nombre?.[0]?.toUpperCase() || '?'}
                    </div>
                    
                    {/* Info del usuario */}
                    <div>
                        <p className="font-semibold text-gray-800">
                            {comentario.usuario?.nombre} {comentario.usuario?.apellido}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formatearFecha(comentario.fecha)}
                        </p>
                    </div>
                </div>

                {/* Botones de acción */}
                {isOwner && !isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-[#6c94c4] hover:text-[#5a7da8] text-sm font-medium"
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>

            {/* Contenido */}
            {isEditing ? (
                <ComentarioForm
                    initialValue={comentario.texto}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    submitLabel="Guardar"
                    placeholder="Edita tu comentario..."
                />
            ) : (
                <>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {comentario.texto}
                    </p>

                    {showReplyButton && onReply && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-[#6c94c4] hover:text-[#5a7da8] text-sm font-medium"
                        >
                            {isReplying ? 'Cancelar' : 'Responder'}
                        </button>
                    )}

                    {isReplying && (
                        <div className="mt-3 pl-4 border-l-2 border-[#6c94c4]">
                            <ComentarioForm
                                onSubmit={handleReply}
                                onCancel={() => setIsReplying(false)}
                                submitLabel="Responder"
                                placeholder="Escribe tu respuesta..."
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ComentarioItem;
