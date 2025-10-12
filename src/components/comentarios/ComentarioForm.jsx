import { useState } from 'react';

const ComentarioForm = ({ 
    onSubmit, 
    initialValue = '', 
    placeholder = 'Escribe tu comentario...', 
    submitLabel = 'Comentar',
    onCancel 
}) => {
    const [texto, setTexto] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!texto.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        if (texto.length > 2000) {
            setError('El comentario no puede exceder los 2000 caracteres');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit(texto);
            setTexto('');
        } catch (err) {
            setError(err.message || 'Error al enviar el comentario');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setTexto(initialValue);
        setError(null);
        if (onCancel) onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    maxLength={2000}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 bg-[#f2f5f6] rounded focus:outline-none focus:ring-2 focus:ring-[#6c94c4] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="text-sm text-gray-500 mt-1 text-right">
                    {texto.length}/2000
                </div>
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting || !texto.trim()}
                    className="px-4 py-2 bg-[#6c94c4] text-white rounded hover:bg-[#5a7da8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Enviando...' : submitLabel}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default ComentarioForm;
