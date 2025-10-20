import { useState, useContext } from 'react';
import ComentarioForm from './ComentarioForm';
import { AuthContext } from '../../context/AuthContext';

const ComentarioItem = ({ 
    comentario, 
    handleEditarComentario, 
    handleEliminarComentario, 
    handleResponder
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    // Obtener datos del usuario desde el contexto
    const { isAuthenticated, user } = useContext(AuthContext);
    const currentUserId = user?.idUsuario;
    const currentUserRole = user?.rol;

    const isOwner = currentUserId && comentario.usuario?.idUsuario === currentUserId;
    const isAdmin = currentUserRole === 'ADMIN';
    const canEdit = isAuthenticated && isOwner;
    const canDelete = isAuthenticated && (isOwner || isAdmin);
    const canReply = isAuthenticated;

    const handleEdit = (nuevoTexto) => {
        return handleEditarComentario(comentario.idComentario, nuevoTexto)
            .then(() => setIsEditing(false))
            .catch((error) => {
                setErrorMessage('Error al editar: ' + error.message);
                setShowErrorModal(true);
            });
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        handleEliminarComentario(comentario.idComentario)
            .catch((error) => {
                setErrorMessage('Error al eliminar: ' + error.message);
                setShowErrorModal(true);
            });
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleReply = (textoRespuesta) => {
        return handleResponder(comentario.idComentario, textoRespuesta)
            .then(() => setIsReplying(false))
            .catch((error) => {
                setErrorMessage('Error al responder: ' + error.message);
                setShowErrorModal(true);
            });
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-paleta1-blue-light transition-all duration-300">
            
            {/* Header del comentario */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    
                    {/* Info del usuario */}
                    <div>
                        <p className="font-bold text-gray-900 text-lg">
                            {comentario.usuario?.nombre} {comentario.usuario?.apellido}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            {formatearFecha(comentario.fecha)}
                        </p>
                    </div>
                </div>

                {/* Botones */}
                {!isEditing && (canEdit || canDelete) && (
                    <div className="flex gap-2">
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-50 text-paleta1-blue hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-paleta1-blue-light"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-red-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Contenido del comentario */}
            {isEditing ? (
                <div>
                    <ComentarioForm
                        initialValue={comentario.texto}
                        onSubmit={handleEdit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <>
                    <div className=" mb-5">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {comentario.texto}
                            </p>
                        </div>
                    </div>

                    {canReply && handleResponder && (
                        <div>
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="inline-flex items-center gap-2 text-paleta1-blue hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-paleta1-blue-light"
                            >
                                {'Responder'}
                            </button>
                        </div>
                    )}

                    {isReplying && (
                        <div className="mt-6 p-4 bg-blue-100 rounded-lg border-2 border-paleta1-blue-light">
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-paleta1-blue flex items-center gap-2">
                                    Respondiendo a {comentario.usuario?.nombre}
                                </p>
                            </div>
                            <ComentarioForm
                                onSubmit={handleReply}
                                onCancel={() => setIsReplying(false)}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Popup de confirmacion de eliminacion */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 border border-paleta1-blue-light">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    ¿Eliminar comentario?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Esta acción no se puede deshacer
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            ¿Estás seguro de que deseas eliminar este comentario?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Eliminar comentario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Error */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <div className="text-center">
                            <div className="text-red-500 text-5xl mb-4">✕</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
                            <p className="text-gray-600 mb-4">{errorMessage}</p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-paleta1-blue hover:bg-paleta1-blue-light hover:text-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComentarioItem;
