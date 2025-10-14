import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PublicacionDestacada = ({ publicacion }) => {
    const [image, setImage] = useState("https://via.placeholder.com/800x400?text=Loading...");
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/publicacion/${publicacion.idPublicacion}`);
    };

    const formatearEstado = (estado) => {
        const estadosMap = {
            'A': 'Disponible',
            'V': 'Vendido',
            'P': 'Pausado'
        };
        return estadosMap[estado] || 'Disponible';
    };
    
    useEffect(() => {
        if (publicacion?.idPublicacion) {
            fetch(`http://localhost:4002/api/publicaciones/${publicacion.idPublicacion}/fotos-contenido`)
                .then(response => {
                    if (!response.ok) { 
                        throw new Error('No se encontraron imágenes')
                    }
                    return response.json()
                })
                .then(data => {
                    setImage(`data:image/jpeg;base64,${data[0].file}`)
                })
                .catch(error => { 
                    console.error('Error cargando imagen:', error)
                });
        }
    }, [publicacion?.idPublicacion]);

    return(
        <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 mx-4 cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={handleClick}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Imagen */}
                <div className="relative">
                    <img 
                        src={image} 
                        alt={publicacion.titulo} 
                        className="w-full h-80 lg:h-96 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        DESTACADO
                    </div>
                </div>

                {/* Información */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                            {publicacion.titulo}
                        </h2>

                        <div className="mb-4">
                            <span className="text-3xl lg:text-4xl font-bold text-green-600">
                                ${publicacion.precio?.toLocaleString()} ARS
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-600">
                                <span className="font-semibold text-gray-800">🚗 Vehículo:</span>
                                <span className="ml-2">{publicacion.marcaAuto} {publicacion.modeloAuto}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <span className="font-semibold text-gray-800">📍 Ubicación:</span>
                                <span className="ml-2">{publicacion.ubicacion}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <span className="font-semibold text-gray-800">🏷️ Estado:</span>
                                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                    {formatearEstado(publicacion.estado)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicacionDestacada;