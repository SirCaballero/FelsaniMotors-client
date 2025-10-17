import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PublicacionCard = ({ idPublicacion, titulo, ubicacion, precio, estado, marcaAuto, modeloAuto }) => {

    const [image, setImage] = useState("https://via.placeholder.com/300x200?text=Loading...");
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
    const descuentosPorOwner = {
        1: 0.10,
        3: 0.15,
        5: 0.05,
    }

    const handleClick = () => {
        navigate(`/publicacion/${idPublicacion}`);
    };

    const handleComprar = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para comprar");
            return;
        }
        if (!user?.activo) {
            alert("Tu cuenta está inactiva. Contacta al administrador para activarla.");
            return;
        }
        if (estado === 'V') {
            alert("Esta publicación ya fue vendida.");
            return;
        }
        navigate(`/comprar/${idPublicacion}`);
    };

    const formatearEstado = (estado) => {
        const estadosMap = {
            'A': 'Disponible',
            'V': 'Vendido',
            'P': 'Pausado'
        };
        return estadosMap[estado] || estado || 'Disponible';
    };

    useEffect(() => {
        // Cargar imagen
        fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`)
        .then(response => {
            if (!response.ok) { 
                throw new Error('No se encontraron imágenes')
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                setImage(`data:image/jpeg;base64,${data[0].file}`);
            }
        })
        .catch(error => { 
            console.error('Error cargando imagen:', error);
        });

        const idOwnerConDescuento = 1;

        fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}`)
        .then(response => response.json())
        .then(data => {
        const descuento = descuentosPorOwner[data?.userOwnerId] || 0;
        const nuevoPrecio = precio - (precio * descuento);
        setPrecioFinal(nuevoPrecio);
        })
        .catch(() => setPrecioFinal(precio));
    }, [idPublicacion, precio]);

    return(
        <div 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-paleta1-cream"
            onClick={handleClick}
        >
            {/* Imagen */}
            <div className="relative">
                <img 
                    src={image} 
                    alt={titulo} 
                    className="w-full h-48 object-cover"
                />
            </div>

            {/* Contenido */}
            <div className="p-4">
                {/* Precio */}
                <div className="mb-2">
                    {precioFinal !== precio ? (
                        <>
                        <span className="text-sm text-gray-500 line-through mr-2">
                            ${precio?.toLocaleString()}
                        </span>
                        <span className="text-2xl font-bold text-green-700">
                            ${precioFinal?.toLocaleString()}
                        </span>
                        <span className="text-xs text-green-600 ml-1 font-medium">
                            (-{DESCUENTO_OWNER * 100}%)
                        </span>
                        </>
                    ) : (
                        <span className="text-2xl font-bold text-gray-900">
                        ${precio?.toLocaleString()}
                        </span>
                    )}
                    <span className="text-sm text-gray-500 ml-1">ARS</span>
                </div>

                {/* Título */}
                <h3 className="text-lg font-semibold text-paleta1-blue mb-2 line-clamp-2">
                    {titulo}
                </h3>

                {/* Información del auto */}
                <div className="text-sm text-gray-600 mb-3">
                    <p className="font-medium">{marcaAuto} {modeloAuto}</p>
                </div>

                {/* Ubicación y estado */}
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{ubicacion}</span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        estado === 'V' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                    }`}>
                        {formatearEstado(estado)}
                    </span>
                </div>

                {/* Envío gratis simulado (estilo ML) */}
                <div className="mt-3 pt-3 border-t border-paleta1-cream-light">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-600 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">Inspección incluida</span>
                        </div>
                        {estado === 'V' ? (
                            <div className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                                VENDIDO
                            </div>
                        ) : (
                            <button
                                onClick={handleComprar}
                                className="bg-paleta1-blue cursor-pointer hover:bg-paleta1-blue-light text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Comprar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};
export default PublicacionCard;