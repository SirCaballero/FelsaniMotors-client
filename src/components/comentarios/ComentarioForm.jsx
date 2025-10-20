import { useState } from 'react';

const ComentarioForm = ({ 
    onSubmit, 
    initialValue = '', 
    onCancel 
}) => {
    const [texto, setTexto] = useState(initialValue);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!texto.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        if (texto.length > 500) {
            setError(`El comentario no puede exceder los 500 caracteres`);
            return;
        }

        setError(null);

        onSubmit(texto)
            .then(() => {
                setTexto('');
            })
            .catch((err) => {
                setError(err.message || 'Error al enviar el comentario');
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
                    placeholder="Escribe tu comentario..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-5 py-4 border-2 border-paleta1-blue-light bg-white rounded-xl focus:outline-none resize-none transition-all duration-200 placeholder-gray-400 text-gray-900"
                />
                
                {/* Contador de caracteres */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 
                rounded-full border border-gray-200">

                    <span className="text-sm font-medium text-paleta1-blue">
                        {texto.length}
                    </span>
                    <span className="text-gray-400 text-sm">/500</span>
                </div>

            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium"> {error} </span>
                </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 justify-end pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-white text-paleta1-blue rounded-xl hover:bg-gray-200
                        transition-colors font-medium border border-paleta1-blue">
                        Cancelar
                    </button>
                )}
                
                <button
                    type="submit"
                    disabled={!texto.trim()}
                    className="px-8 py-3 bg-paleta1-blue text-white rounded-xl hover:bg-paleta1-blue-light 
                    disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 
                    font-medium flex items-center gap-2">

                    Enviar
                </button>

            </div>
        </form>
    );
};

export default ComentarioForm;
