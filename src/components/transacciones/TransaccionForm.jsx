import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MetodoPagoForm from "./MetodoPagoForm";
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import carritoService from '../../services/carritoService';

const TransaccionForm = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [transaccionData, setTransaccionData] = useState({
        metodoPago: "Visa",
        numeroTarjeta: "",
        fechaCaducidad: "",
        codigoSeguridad: "",
        comentarios: ""
    });
    
    const [publicaciones, setPublicaciones] = useState([]);
    const [total, setTotal] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const URLTransaccion = `http://localhost:4002/api/transacciones`;

    useEffect(() => {
        const token = authService.getToken();
        
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        // Validar si el usuario está loggeado
        if (!user) {
            alert('Debes iniciar sesión para completar tu compra.\n\nPor favor, inicia sesión y vuelve a intentarlo.');
            navigate('/');
            return;
        }

        // Validar si el usuario está activo
        if (!user?.activo) {
            alert("Tu cuenta está inactiva. No puedes realizar compras. Contacta al administrador.");
            navigate('/');
            return;
        }

        // Cargar publicaciones desde el carrito
        const items = carritoService.getCart();
        
        if (items.length === 0) {
            alert("El carrito está vacío");
            navigate('/');
            return;
        }

        // Verificar que todas las publicaciones sigan disponibles
        let publicacionesVerificadas = [];
        let currentIndex = 0;

        const verificarPublicacion = () => {
            if (currentIndex >= items.length) {

                // Verifico todas las publis
                const vendidas = publicacionesVerificadas.filter(p => p.estado === 'V');
                if (vendidas.length > 0) {
                    alert(`Algunas publicaciones se vendieron. Por favor, actualiza tu carrito.`);
                    navigate('/');
                    return;
                }
                setPublicaciones(publicacionesVerificadas);
                
                // Calcular total con descuentos
                const totalConDescuentos = publicacionesVerificadas.reduce((sum, p) => {
                    const descuento = p.descuentoPorcentaje || 0;
                    let precioFinal = p.precio;
                    if (descuento > 0) {
                        precioFinal = p.precio - (p.precio * descuento / 100);
                    }
                    return sum + precioFinal;
                }, 0);
                
                setTotal(totalConDescuentos);
                return;
            }

            const item = items[currentIndex];

            fetch(`http://localhost:4002/api/publicaciones/${item.idPublicacion}`, {
                method: "GET",
                headers: headers
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('No tienes autorización. Por favor, inicia sesion nuevamente.');
                    }
                    throw new Error(`Error al cargar publicación ${item.idPublicacion}: ${response.status}`);
                }
                return response.json();
            })
            .then(pub => {
                publicacionesVerificadas.push(pub);
                currentIndex++;
                verificarPublicacion();
            })
            .catch(error => {
                alert(error.message || 'Error al cargar las publicaciones del carrito');
                navigate('/');
            });
        };

        verificarPublicacion();
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaccionData({
            ...transaccionData,
            [name]: value
        });
    };

    const handleMetodoPagoChange = (metodoPagoData) => {
        setTransaccionData({
            ...transaccionData,
            metodoPago: metodoPagoData.metodoPago,
            numeroTarjeta: metodoPagoData.numeroTarjeta,
            fechaCaducidad: metodoPagoData.fechaCaducidad,
            codigoSeguridad: metodoPagoData.codigoSeguridad
        });
    };

    const generarReferenciaPago = () => {
        const primeraParte = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const segundaParte = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return `REF-${primeraParte}-${segundaParte}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        // Validar que se hayan ingresado los datos de pago
        if (!transaccionData.numeroTarjeta || !transaccionData.fechaCaducidad || !transaccionData.codigoSeguridad) {
            alert('Por favor, completa todos los datos de la tarjeta');
            setIsProcessing(false);
            return;
        }

        // Procesar cada publicación secuencialmente
        let transaccionesCreadas = [];
        let currentIndex = 0;

        const crearTransaccion = () => {
            if (currentIndex >= publicaciones.length) {
                // Todas las transacciones creadas, ahora actualizar
                actualizarTransacciones();
                return;
            }

            const p = publicaciones[currentIndex];
            
            // Calcular precio con descuento si existe
            const descuentoPorcentaje = p.descuentoPorcentaje || 0;
            let precioFinal = p.precio;
            if (descuentoPorcentaje > 0) {
                precioFinal = p.precio - (p.precio * descuentoPorcentaje / 100);
            }
            
            const transaccionRequest = {
                idPublicacion: p.idPublicacion,
                idComprador: user.idUsuario,
                monto: precioFinal,
                metodoPago: `${transaccionData.metodoPago} **** ${transaccionData.numeroTarjeta.slice(-4)}`,
                referenciaPago: generarReferenciaPago(),
                comentarios: transaccionData.comentarios || ''
            };

            fetch(URLTransaccion, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(transaccionRequest)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                transaccionesCreadas.push(data);
                currentIndex++;
                crearTransaccion(); // Siguiente publicación
            })
            .catch(() => {
                alert("Hubo un error al procesar tu compra. Intenta nuevamente.");
                setIsProcessing(false);
            });
        };

        const actualizarTransacciones = () => {
            let updateIndex = 0;

            const actualizarSiguiente = () => {
                if (updateIndex >= transaccionesCreadas.length) {
                    // Todas actualizadas, finalizar
                    finalizarCompra();
                    return;
                }

                const transaccion = transaccionesCreadas[updateIndex];
                const URLActualizarTransaccion = `http://localhost:4002/api/transacciones/${transaccion.idTransaccion}`;
                
                const updateRequest = {
                    estado: 'COMPLETADA'
                };

                fetch(URLActualizarTransaccion, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(updateRequest)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`Error al actualizar transacción ${transaccion.idTransaccion}: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(() => {
                    updateIndex++;
                    actualizarSiguiente(); // Siguiente transacción
                })
                .catch(() => {
                    alert("Hubo un error al procesar tu compra. Intenta nuevamente.");
                    setIsProcessing(false);
                });
            };

            actualizarSiguiente();
        };

        const finalizarCompra = () => {
            // Limpiar carrito luego de comprarlo
            carritoService.clearCart();

            const mensaje = transaccionesCreadas.length === 1 
                ? "¡Transacción exitosa!"
                : `¡Compra exitosa! Se procesaron ${transaccionesCreadas.length} transacciones.`;
            
            alert(mensaje);
            setIsProcessing(false);
            navigate('/');
        };

        crearTransaccion(); // Iniciar el proceso
    };

    const formatearPrecio = (precio) => {
        return `$${parseFloat(precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const cantidadVehiculos = publicaciones.length;
    const esMultiple = cantidadVehiculos > 1;

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Transaccion
                </h2>
                <p className="text-lg text-gray-600">
                    {esMultiple 
                        ? `Completa la información para finalizar tu compra de ${cantidadVehiculos} vehículos`
                        : 'Completa la información para finalizar tu compra'
                    }
                </p>
            </div>

            {/* Resumen de compra - Siempre es un listado */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de compra</h3>
                
                <div className={`space-y-3 ${esMultiple ? 'max-h-96 overflow-y-auto' : ''}`}>
                    {publicaciones.map((p, index) => {
                        const descuentoPorcentaje = p.descuentoPorcentaje || 0;
                        const precioOriginal = p.precio;
                        let precioFinal = precioOriginal;
                        if (descuentoPorcentaje > 0) {
                            precioFinal = precioOriginal - (precioOriginal * descuentoPorcentaje / 100);
                        }
                        
                        return (
                            <div key={p.idPublicacion} className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
                                <div className="flex-1">
                                    <span className="text-base font-medium text-gray-800">
                                        {esMultiple ? `${index + 1}. ` : ''}{p.titulo}
                                    </span>
                                    <p className="text-sm text-gray-600">{p.marcaAuto} {p.modeloAuto}</p>
                                    {descuentoPorcentaje > 0 && (
                                        <p className="text-xs text-green-600 font-semibold mt-1">
                                            🏷️ {descuentoPorcentaje}% de descuento aplicado
                                        </p>
                                    )}
                                </div>
                                <div className="ml-4 text-right">
                                    {descuentoPorcentaje > 0 ? (
                                        <>
                                            <p className="text-sm text-gray-500 line-through">
                                                {formatearPrecio(precioOriginal)}
                                            </p>
                                            <p className="text-lg font-semibold text-green-600">
                                                {formatearPrecio(precioFinal)}
                                            </p>
                                        </>
                                    ) : (
                                        <span className="text-lg font-semibold text-gray-900">
                                            {formatearPrecio(precioOriginal)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className={`${esMultiple ? 'border-t-2' : 'border-t'} border-blue-300 pt-4 mt-4`}>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">
                            Total {esMultiple ? `(${cantidadVehiculos} vehículos)` : ''}
                        </span>
                        <span className="text-3xl font-bold text-blue-600">{formatearPrecio(total)}</span>
                    </div>
                </div>
            </div>

            <MetodoPagoForm onMetodoPagoChange={handleMetodoPagoChange} />

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <label htmlFor="comentarios" className="block text-base font-semibold text-gray-700 mb-3">
                    Comentarios adicionales (opcional)
                </label>
                <textarea
                    id="comentarios"
                    name="comentarios"
                    value={transaccionData.comentarios}
                    onChange={handleChange}
                    placeholder="Agrega cualquier información adicional sobre tu compra..."
                    rows="4"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <button 
                    onClick={handleSubmit}
                    disabled={isProcessing || publicaciones.length === 0}
                    className={`w-full text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 ${
                        isProcessing || publicaciones.length === 0
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    }`}
                >
                    {isProcessing 
                        ? '⏳ Procesando...' 
                        : esMultiple 
                            ? `🛒 Finalizar Compra (${cantidadVehiculos} vehículos)` 
                            : 'Finalizar Compra'
                    }
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                    Al finalizar, aceptas los términos y condiciones de la compra
                </p>
                <button
                    onClick={() => navigate('/')}
                    disabled={isProcessing}
                    className="w-full mt-3 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default TransaccionForm;