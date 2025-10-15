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
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 mx-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-paleta1-cream"
            onClick={handleClick}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Imagen */}
                <div className="relative">
                    <img 
                        src={image} 
                        alt={publicacion.titulo} 
                        className="w-full h-80 lg:h-96 object-cover rounded-lg border border-paleta1-cream"
                    />
                    <div className="absolute top-4 left-4 bg-paleta1-blue text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        DESTACADO
                    </div>
                </div>

                {/* Información */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-paleta1-blue mb-4">
                            {publicacion.titulo}
                        </h2>

                        <div className="mb-4">
                            <span className="text-3xl lg:text-4xl font-bold text-paleta1-blue">
                                ${publicacion.precio?.toLocaleString()} ARS
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-600">
                                <span className="font-semibold text-paleta1-blue">Vehículo:</span>
                                <span className="ml-2">{publicacion.marcaAuto} {publicacion.modeloAuto}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <span className="font-semibold text-paleta1-blue">Ubicación:</span>
                                <span className="ml-2">{publicacion.ubicacion}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <span className="font-semibold text-paleta1-blue">Estado:</span>
                                <span className="ml-2 bg-paleta1-blue-light text-paleta1-blue px-2 py-1 rounded-full text-sm font-medium">
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
                        className="w-full bg-paleta1-blue hover:bg-paleta1-blue-light text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicacionDestacada;