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

    const handleSubmit = (e) => {
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

        onSubmit(texto)
            .then(() => {
                setTexto('');
                setIsSubmitting(false);
            })
            .catch((err) => {
                setError(err.message || 'Error al enviar el comentario');
                setIsSubmitting(false);
            });
    };

    const handleCancel = () => {
        setTexto(initialValue);
        setError(null);
        if (onCancel) onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
                <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    maxLength={2000}
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 border-2 border-paleta1-blue-light bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-paleta1-blue focus:border-paleta1-blue resize-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 placeholder-gray-400 text-gray-900"
                />
                
                {/* Contador de caracteres estilizado */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <span className={`text-sm font-medium ${texto.length > 1800 ? 'text-red-600' : 'text-paleta1-blue'}`}>
                        {texto.length}
                    </span>
                    <span className="text-gray-400 text-sm">/2000</span>
                </div>
            </div>

            {/* Mensaje de error mejorado */}
            {error && (
                <div className="flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Botones de acción modernos */}
            <div className="flex gap-3 justify-end pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-paleta1-cream-light text-paleta1-blue rounded-xl hover:bg-paleta1-cream disabled:cursor-not-allowed transition-colors font-medium border border-paleta1-blue"
                    >
                        Cancelar
                    </button>
                )}
                
                <button
                    type="submit"
                    disabled={isSubmitting || !texto.trim()}
                    className="px-8 py-3 bg-paleta1-blue text-white rounded-xl hover:bg-paleta1-blue-light disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Enviando...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            {submitLabel}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ComentarioForm;
