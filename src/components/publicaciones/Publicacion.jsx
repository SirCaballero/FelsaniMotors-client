import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Publicacion = () => {
    const { id } = useParams();
    const idPublicacion = parseInt(id);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    
    const [publicacion, setPublicacion] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatearEstado = (estado) => {
        const estadosMap = {
            'A': 'Disponible',
            'V': 'Vendido',
            'P': 'Pausado'
        };
        return estadosMap[estado] || estado || 'Disponible';
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    useEffect(() => {
        if (!idPublicacion) return;

        setLoading(true);

        // Obtener datos de la publicación
        fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}`)
            .then((response) => {
                if (!response.ok) throw new Error('Publicación no encontrada');
                return response.json();
            })
            .then((data) => {
                setPublicacion(data);

                // Obtener imágenes de la publicación
                return fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`);
            })
            .then((fotosResponse) => {
                if (fotosResponse.ok) {
                    return fotosResponse.json();
                }
                return null;
            })
            .then((fotosData) => {
                if (fotosData) {
                    const imagenesFormateadas = fotosData.map(foto => `data:image/jpeg;base64,${foto.file}`);
                    setImagenes(imagenesFormateadas);
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [idPublicacion]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar la publicación</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!publicacion) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-gray-400 text-4xl mb-4">📄</div>
                <p className="text-gray-600">Publicación no encontrada</p>
            </div>
        );
    }

    // Vista completa de la publicación
    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header de la publicación */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold">{publicacion.titulo}</h1>
                        <span className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold">
                            {formatearEstado(publicacion.estado)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold">${publicacion.precio?.toLocaleString()} ARS</span>
                        {publicacion.fechaPublicacion && (
                            <span className="text-blue-100 text-sm">
                                Publicado el {formatearFecha(publicacion.fechaPublicacion)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Galería de imágenes */}
                    <div>
                        {imagenes.length > 0 ? (
                            <div className="space-y-4">
                                <img 
                                    src={imagenes[0]} 
                                    alt={publicacion.titulo}
                                    className="w-full h-96 object-cover rounded-lg"
                                />
                                {imagenes.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {imagenes.slice(1, 5).map((imagen, index) => (
                                            <img 
                                                key={index}
                                                src={imagen} 
                                                alt={`${publicacion.titulo} ${index + 2}`}
                                                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Sin imágenes disponibles</span>
                            </div>
                        )}
                    </div>

                    {/* Información del vehículo */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del vehículo</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Marca:</span>
                                    <span className="text-gray-800">{publicacion.marcaAuto}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Modelo:</span>
                                    <span className="text-gray-800">{publicacion.modeloAuto}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Ubicación:</span>
                                    <span className="text-gray-800">{publicacion.ubicacion}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Estado:</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                        {formatearEstado(publicacion.estado)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        {publicacion.descripcion && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {publicacion.descripcion}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        alert("Debes iniciar sesión para comprar");
                                        return;
                                    }
                                    navigate(`/comprar/${idPublicacion}`);
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Comprar Ahora
                            </button>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300">
                                Contactar Vendedor
                            </button>
                            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-lg transition duration-300">
                                Agregar a Favoritos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default Publicacion;