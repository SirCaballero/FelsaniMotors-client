import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MetodoPagoForm from "./MetodoPagoForm";
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import carritoService from '../../services/carritoService';

const TransaccionForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [transaccionData, setTransaccionData] = useState({
        metodoPago: "Visa",
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
        headers.append('Authorization', `Bearer ${token}`);

        // Validar si el usuario está activo
        if (!user?.activo) {
            alert("Tu cuenta está inactiva. No puedes realizar compras.");
            navigate('/');
            return;
        }

        // Determinar si viene del carrito o de una publicación individual
        const isFromCart = location.pathname === '/comprar-carrito';

        if (isFromCart) {
            // Cargar desde el carrito
            const items = carritoService.getCart();
            
            if (items.length === 0) {
                alert("El carrito está vacío");
                navigate('/');
                return;
            }

            // Verificar que todas las publicaciones sigan disponibles
            Promise.all(
                items.map(item => 
                    fetch(`http://localhost:4002/api/publicaciones/${item.idPublicacion}`, {
                        method: "GET",
                        headers: headers
                    })
                    .then(response => response.json())
                )
            )
            .then(pubs => {
                const vendidas = pubs.filter(pub => pub.estado === 'V');
                if (vendidas.length > 0) {
                    alert(`Algunas publicaciones ya fueron vendidas. Por favor, actualiza tu carrito.`);
                    navigate('/');
                    return;
                }
                setPublicaciones(pubs);
                setTotal(pubs.reduce((sum, pub) => sum + pub.precio, 0));
            })
            .catch(error => {
                console.error('Error al verificar publicaciones:', error);
            });

        } else if (id) {
            // Cargar una sola publicación (pero la tratamos como array de 1)
            const idPublicacion = parseInt(id);
            const URLPublicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`;
            
            fetch(URLPublicacion, {
                method: "GET",
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.estado === 'V') {
                    alert("Esta publicación está vendida.");
                    navigate('/');
                    return;
                }
                
                // Guardar como array de 1 elemento
                setPublicaciones([data]);
                setTotal(data.precio);
            })
            .catch((error) => console.error('Error al buscar publicacion:', error));
        } else {
            alert("No se especificó qué comprar");
            navigate('/');
        }
    }, [id, location.pathname, user, navigate]);

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
            metodoPago: metodoPagoData.metodoPago
        });
    };

    const generarReferenciaPago = () => {
        const primeraParte = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const segundaParte = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return `REF-${primeraParte}-${segundaParte}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        try {
            // Crear una transacción por cada publicación
            const transacciones = publicaciones.map(p => ({
                idPublicacion: p.idPublicacion,
                idComprador: user.idUsuario,
                idVendedor: p.idUsuario,
                monto: p.precio,
                metodoPago: transaccionData.metodoPago,
                referenciaPago: generarReferenciaPago(),
                comentarios: transaccionData.comentarios
            }));

            // Procesar todas las transacciones en paralelo
            const resultados = await Promise.all(
                transacciones.map(transaccion =>
                    fetch(URLTransaccion, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(transaccion)
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw new Error(`Error ${response.status}: ${text}`);
                            });
                        }
                        return response.json();
                    })
                )
            );

            // Actualizar el estado de todas las publicaciones a "Vendido" (V)
            await Promise.all(
                publicaciones.map(pub => {
                    const URLActualizarPublicacion = `http://localhost:4002/api/publicaciones/${pub.idPublicacion}`;
                    return fetch(URLActualizarPublicacion, {
                        method: "PUT",
                        headers: headers,
                        body: JSON.stringify({ estado: 'V' })
                    });
                })
            );

            // Si vino del carrito, limpiarlo
            if (location.pathname === '/comprar-carrito') {
                carritoService.clearCart();
            }

            const mensaje = resultados.length === 1 
                ? "¡Transacción exitosa!"
                : `¡Compra exitosa! Se procesaron ${resultados.length} transacciones.`;
            
            alert(mensaje);
            navigate('/mis-transacciones');

        } catch (error) {
            console.error("Error al procesar las transacciones:", error);
            alert("Hubo un error al procesar tu compra. Intenta nuevamente.");
        } finally {
            setIsProcessing(false);
        }
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de compra</h3>
                
                <div className={`space-y-3 ${esMultiple ? 'max-h-96 overflow-y-auto' : ''}`}>
                    {publicaciones.map((pub, index) => (
                        <div key={pub.idPublicacion} className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
                            <div className="flex-1">
                                <span className="text-base font-medium text-gray-800">
                                    {esMultiple ? `${index + 1}. ` : ''}{pub.titulo}
                                </span>
                                <p className="text-sm text-gray-600">{pub.marcaAuto} {pub.modeloAuto}</p>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 ml-4">{formatearPrecio(pub.precio)}</span>
                        </div>
                    ))}
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

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
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
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none hover:border-blue-400 transition-colors"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
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