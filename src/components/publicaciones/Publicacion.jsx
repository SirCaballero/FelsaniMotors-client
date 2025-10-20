import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ComentarioList from "../comentarios/ComentarioList";
import carritoService from "../../services/carritoService";

const Publicacion = () => {
    const { id } = useParams();
    const idPublicacion = parseInt(id);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
    
    const [publicacion, setPublicacion] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
    const [error, setError] = useState(null);
    const [isInCart, setIsInCart] = useState(false);
    const [editarVisible, setEditarVisible] = useState(false);

    const formatearEstado = (estado) => {
        const estadosMap = {
            'A': 'Disponible',
            'V': 'Vendido',
            'P': 'Pausado'
        };
        return estadosMap[estado];
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para agregar al carrito");
            return;
        }
        if (!user?.activo) {
            alert("Tu cuenta está inactiva. Contacta al administrador para activarla.");
            return;
        }
        if (publicacion?.estado === 'V') {
            alert("Esta publicación ya fue vendida.");
            return;
        }

        const item = {
            idPublicacion: publicacion.idPublicacion,
            idVendedor: publicacion.idUsuario,
            titulo: publicacion.titulo,
            ubicacion: publicacion.ubicacion,
            precio: publicacion.precio,
            estado: publicacion.estado,
            marcaAuto: publicacion.marcaAuto,
            modeloAuto: publicacion.modeloAuto,
            imagen: imagenes.length > 0 ? imagenes[0] : ""
        };

        const result = carritoService.addToCart(item);
        if (result.success) {
            setIsInCart(true);
            alert("Auto agregado al carrito");
        } else {
            alert(result.message);
        }
    };

    useEffect(() => {
        if (!idPublicacion) return;

        let publicacionData = null;

        // Obtener datos de la publicación
        fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}`)
            .then((response) => {
                if (!response.ok) throw new Error('Publicación no encontrada');
                return response.json();
            })
            .then((data) => {
                publicacionData = data;
                
                // Verificar si el usuario es el dueño de la publicación
                if(isAuthenticated && user && publicacionData) {
                    if(user.idUsuario === publicacionData.idUsuario) {
                        setEditarVisible(true);
                    }
                }
                
                // Si hay idAuto, obtener datos del auto
                if (data.idAuto) {
                    return fetch(`http://localhost:4002/api/autos/${data.idAuto}`);
                }
                return null;
            })
            .then((autoResponse) => {
                if (autoResponse && autoResponse.ok) {
                    return autoResponse.json();
                }
                return null;
            })
            .then((autoData) => {
                // Combinar datos de publicación con datos del auto
                if (autoData) {
                    publicacionData = {
                        ...publicacionData,
                        // Datos del auto
                        anio: autoData.anio,
                        kilometraje: autoData.kilometraje,
                        combustible: autoData.combustible,
                        motor: autoData.motor,
                        tipoCaja: autoData.tipoCaja,
                        capacidadTanque: autoData.capacidadTanque,
                        tipoCategoria: autoData.tipoCategoria,
                        estadoAuto: autoData.estado
                    };
                }
                
                setPublicacion(publicacionData);

                // Obtener imágenes de la publicación
                return fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`);
            })
            .then((fotosResponse) => {
                if (fotosResponse && fotosResponse.ok) {
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
            });
    }, [idPublicacion, isAuthenticated, user]);

    // Verificar si el item está en el carrito
    useEffect(() => {
        setIsInCart(carritoService.isInCart(idPublicacion));
    }, [idPublicacion]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <div className="text-red-600 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Error al cargar la publicación</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-paleta1-blue text-white rounded-lg"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!publicacion) {
        return (
            <div className="bg-paleta1-cream-light border border-paleta1-cream rounded-lg p-6 text-center">
                <div className="text-paleta1-blue text-4xl mb-4">📄</div>
                <p className="text-paleta1-blue">Publicación no encontrada</p>
            </div>
        );
    }

    // Vista completa de la publicación
    return (
        <div className="pt-8 bg-white min-h-screen">
            <div className="max-w-[95vw] mx-auto bg-white rounded-xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-12 bg-paleta1-cream-light">
                    <div className="lg:col-span-2 flex gap-6">
                        <div className="flex flex-col gap-4 w-32">
                            {imagenes.length > 0 ? (
                                imagenes.map((imagen, index) => (
                                    <div key={index} className={`relative p-2 rounded-2xl border-2 ${
                                        index === imagenSeleccionada 
                                            ? 'border-paleta1-blue bg-paleta1-blue-light' 
                                            : 'border-gray-200 bg-white'
                                    }`}>
                                        <img 
                                            src={imagen} 
                                            alt={`${publicacion.titulo} ${index + 1}`}
                                            className="w-28 h-28 object-contain bg-gray-50 rounded-xl cursor-pointer"
                                            onClick={() => setImagenSeleccionada(index)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">No img</span>
                                </div>
                            )}
                        </div>

                        {/* Imagen principal grande */}
                        <div className="flex-1">
                            {imagenes.length > 0 ? (
                                <div className="bg-white p-6 rounded-3xl border-2 border-gray-200">
                                    <img 
                                        src={imagenes[imagenSeleccionada]} 
                                        alt={publicacion.titulo}
                                        className="w-full h-[450px] lg:h-[550px] object-contain bg-gray-50 rounded-2xl"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-[450px] lg:h-[550px] bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-gray-300">
                                    <div className="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-20 h-20 text-gray-400 mx-auto mb-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span className="text-gray-500 text-xl font-medium">Sin imágenes disponibles</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* informacion */}
                    <div className="space-y-6">
                        {/* Título y precio destacados */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{publicacion.titulo}</h1>
                            <div className="text-3xl lg:text-4xl font-bold text-paleta1-blue mb-4">
                                ${publicacion.precio?.toLocaleString()} ARS
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white text-paleta1-blue px-3 py-1 rounded-full text-sm font-medium border border-paleta1-blue">
                                    {formatearEstado(publicacion.estado)}
                                </span>
                                {publicacion.fechaPublicacion && (
                                    <span className="text-gray-500 text-xs">
                                        Publicado el {formatearFecha(publicacion.fechaPublicacion)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Especificaciones */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <h3 className="text-md font-semibold text-paleta1-blue mb-3 border-b border-gray-200 pb-2">Información Básica</h3>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Marca</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{publicacion.marcaAuto}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Modelo</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{publicacion.modeloAuto}</span>
                                </div>
                                {publicacion.año && (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Año</span>
                                        <span className="font-medium text-paleta1-blue text-sm">{publicacion.año}</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Estado</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{formatearEstado(publicacion.estado)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Ubicación</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{publicacion.ubicacion}</span>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        {publicacion.descripcion && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-md font-semibold text-paleta1-blue mb-3 border-b border-gray-200 pb-2">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed text-sm break-words overflow-wrap-anywhere">
                                    {publicacion.descripcion}
                                </p>
                            </div>
                        )}

                        {/* Información del Propietario */}
                        {publicacion.nombreUsuario && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-md font-semibold text-paleta1-blue mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    Propietario
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-20">Nombre:</span>
                                        <span className="font-medium text-gray-800 text-sm">{publicacion.nombreUsuario}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* componentes en publicacion */}
                        <div className="space-y-3">
                            {/* Mostrar estado de publicacion, segun color */}
                            {publicacion.estado === 'V' ? (
                                <div className="w-full bg-red-100 border-2 border-red-500 text-red-700 font-bold py-3 px-4 rounded-xl text-center text-sm">
                                    <div className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span>VENDIDO - No disponible</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Botón Agregar al Carrito */}
                                    <button
                                        onClick={handleAddToCart}
                                        className={`w-full ${
                                            isInCart
                                                ? 'bg-paleta1-cream text-paleta1-blue border-2 border-paleta1-blue cursor-not-allowed'
                                                : 'bg-paleta1-cream text-paleta1-blue border-2 border-paleta1-blue cursor-pointer'
                                        } font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm`}
                                        disabled={isInCart}
                                        title={isInCart ? 'Ya está en el carrito' : 'Agregar al carrito'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        {isInCart ? 'En el Carrito' : 'Agregar al Carrito'}
                                    </button>

                                    {/* Botón Comprar Ahora */}
                                    <button 
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                alert("Debes iniciar sesión para comprar");
                                                return;
                                            }
                                            if (!user?.activo) {
                                                alert("Tu cuenta está inactiva. Contacta al administrador para activarla.");
                                                return;
                                            }
                                            
                                            // Crear carrito de publicacion
                                            carritoService.clearCart();
                                            carritoService.addToCart({
                                                idPublicacion: publicacion.idPublicacion,
                                                titulo: publicacion.titulo,
                                                precio: publicacion.precio,
                                                marcaAuto: publicacion.marcaAuto,
                                                modeloAuto: publicacion.modeloAuto,
                                                ubicacion: publicacion.ubicacion,
                                                imagen: imagenes[0]?.img,
                                                estado: publicacion.estado
                                            });
                                            
                                            navigate('/comprar-carrito');
                                        }}
                                        className="w-full bg-paleta1-blue text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                        Comprar Ahora
                                    </button>

                                    {/* Botón para editar la publicacion */}
                                    { editarVisible &&
                                        <button 
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    alert("Debes iniciar sesión para editar");
                                                    return;
                                                }
                                                navigate(`/editar-publicacion/${idPublicacion}`);
                                            }}
                                            className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 18.07a4.5 4.5 0 0 1-1.897 1.13L6 20.5l1.09-3.413a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14.25H6a2.25 2.25 0 0 0-2.25 2.25v2.25a2.25 2.25 0 0 0 2.25 2.25h12a2.25 2.25 0 0 0 2.25-2.25v-2.25a2.25 2.25 0 0 0-2.25-2.25Z" />
                                            </svg>
                                            Editar Publicación
                                        </button>
                                     }
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Especificaciones mas a detalle */}
            <div className="max-w-[95vw] mx-auto mt-12 px-6 lg:px-12">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-paleta1-blue mb-8 border-b border-paleta1-cream pb-4 text-left">
                        Especificaciones Técnicas Completas
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* columna de Información General del Vehículo */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-paleta1-blue border-b border-paleta1-blue-light pb-2">
                                Información del Vehículo
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-500 block">Marca</span>
                                    <span className="font-medium text-gray-900">{publicacion.marcaAuto || 'No especificado'}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Modelo</span>
                                    <span className="font-medium text-gray-900">{publicacion.modeloAuto || 'No especificado'}</span>
                                </div>
                                {publicacion.anio && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Año</span>
                                        <span className="font-medium text-gray-900">{publicacion.anio}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-sm text-gray-500 block">Estado</span>
                                    <span className="font-medium text-gray-900">{formatearEstado(publicacion.estadoAuto || publicacion.estado)}</span>
                                </div>
                                {publicacion.kilometraje && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Kilometraje</span>
                                        <span className="font-medium text-gray-900">{publicacion.kilometraje?.toLocaleString()} km</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* columna info de Motor y Combustible */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-paleta1-blue border-b border-paleta1-blue-light pb-2">
                                Motor y Combustible
                            </h4>
                            <div className="space-y-3">
                                {publicacion.motor && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Motor</span>
                                        <span className="font-medium text-gray-900">{publicacion.motor}</span>
                                    </div>
                                )}
                                {publicacion.combustible && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Combustible</span>
                                        <span className="font-medium text-gray-900">{publicacion.combustible}</span>
                                    </div>
                                )}
                                {publicacion.capacidadTanque && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Capacidad del Tanque</span>
                                        <span className="font-medium text-gray-900">{publicacion.capacidadTanque} litros</span>
                                    </div>
                                )}
                                {publicacion.tipoCaja && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Caja de Cambios</span>
                                        <span className="font-medium text-gray-900">{publicacion.tipoCaja}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* columna de Información de Venta y Categoría */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-paleta1-blue border-b border-paleta1-blue-light pb-2">
                                Información de Venta
                            </h4>
                            <div className="space-y-3">
                                {publicacion.tipoCategoria && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Tipo de Categoría</span>
                                        <span className="font-medium text-gray-900">{publicacion.tipoCategoria}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-sm text-gray-500 block">Precio</span>
                                    <span className="font-bold text-xl text-paleta1-blue">${publicacion.precio?.toLocaleString()} ARS</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Ubicación</span>
                                    <span className="font-medium text-gray-900">{publicacion.ubicacion}</span>
                                </div>
                                {publicacion.fechaPublicacion && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Fecha de Publicación</span>
                                        <span className="font-medium text-gray-900">{formatearFecha(publicacion.fechaPublicacion)}</span>
                                    </div>
                                )}
                                {publicacion.metodoDePago && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Método de Pago</span>
                                        <span className="font-medium text-gray-900">{publicacion.metodoDePago}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seccion Comentarios */}
            <div className="max-w-[95vw] mx-auto mt-12 px-6 lg:px-12">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4 text-left">
                        Comentarios
                    </h3>
                    <div className="text-left">
                        <ComentarioList 
                            idPublicacion={idPublicacion}
                        />
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Publicacion;