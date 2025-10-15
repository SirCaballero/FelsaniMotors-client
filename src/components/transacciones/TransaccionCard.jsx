import { useEffect, useState } from "react";
import TransaccionEstado from "./TransaccionEstado";
import authService from '../../services/authService';

const TransaccionCard = ({transaccion}) => {

    const [image, setImage] = useState("https://via.placeholder.com/300x200?text=Loading...");
    
    const [publicacion, setPublicacion] = useState({
        titulo: "",
        descripcion: "",
        ubicacion: "",
        precio: "",
        metodoDePago: "",
        fotoPrincipal: ""
    });
    const [comprador, setComprador] = useState({
        email: "", 
        contrasena: "", 
        nombre: "", 
        apellido: "", 
        telefono: "", 
        rol: ""
    });
    const [vendedor, setVendedor] = useState({
        email: "", 
        contrasena: "", 
        nombre: "", 
        apellido: "", 
        telefono: "", 
        rol: ""
    });

    useEffect(() => {
        if (!transaccion?.idPublicacion || !transaccion?.idComprador || !transaccion?.idVendedor) {
            return; 
        }

        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        const URLPublicacion = `http://localhost:4002/api/publicaciones/${transaccion.idPublicacion}`;
        const URLPublicacionFoto = `http://localhost:4002/api/publicaciones/${transaccion.idPublicacion}/fotos-contenido`;
        const URLComprador = `http://localhost:4002/api/usuarios/${transaccion.idComprador}`;
        const URLVendedor = `http://localhost:4002/api/usuarios/${transaccion.idVendedor}`;

        fetch(URLPublicacion, {
            method: "GET",
            headers: headers
        })
        .then((response) => {
            if(!response.ok) throw new Error("No se encontró la publicación");
            return response.json();
        })
        .then((data) => setPublicacion(data))
        .catch((error) => console.error('Error buscando la publicación: ', error));

        fetch(URLPublicacionFoto)
        .then(response => {
            if (!response.ok) throw new Error('No se encontraron imágenes');
            return response.json();
        })
        .then(data => { setImage(`data:image/jpeg;base64,${data[0].file}`); })
        .catch(error => { console.error('Error cargando imagen:', error); });

        fetch(URLComprador, {
            method: "GET",
            headers: headers
        })
        .then((response) => {
            if(!response.ok) throw new Error("No se encontró al comprador");
            return response.json();
        })
        .then((data) => setComprador(data))
        .catch((error) => console.error('Error buscando comprador: ', error));

        fetch(URLVendedor, {
            method: "GET",
            headers: headers
        })
        .then((response) => {
            if(!response.ok) throw new Error("No se encontró al vendedor");
            return response.json();
        })
        .then((data) => setVendedor(data))
        .catch((error) => console.error('Error buscando al vendedor: ', error));
        
    }, [transaccion]);

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const formatearMonto = (monto) => {
        if (!monto) return '$0.00';
        return `$${parseFloat(monto).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        <div className="bg-white border border-gray-200 mb-6 max-w-5xl mx-auto">
            {/* Header con información principal */}
            <div className="bg-blue-50 border-b border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Transacción #{transaccion.idTransaccion || 'Cargando...'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {formatearFecha(transaccion.fechaTransaccion)}
                        </p>
                    </div>
                    <TransaccionEstado estado={transaccion.estado} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Estado</p>
                        <p className="text-base font-medium text-gray-900">
                            {transaccion.estado || 'Cargando...'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Monto Total</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatearMonto(transaccion.monto)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Productos / Selección */}
            <div className="border-b border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-800 mb-4">Productos</h4>
                
                <div className="flex gap-4">
                    <div className="w-32 h-24 flex-shrink-0">
                        {image ? (
                            <img 
                                src={image} 
                                alt={publicacion.titulo}
                                className="w-full h-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                <p className="text-xs text-gray-400">Sin imagen</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                            {publicacion.titulo || 'Cargando...'}
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                            {formatearMonto(transaccion.monto)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Compra */}
            <div className="border-b border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-800 mb-4">Compra</h4>
                
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Vendedor</p>
                        <p className="text-sm text-gray-600">
                            {vendedor.nombre && vendedor.apellido 
                                ? `${vendedor.nombre} ${vendedor.apellido}` 
                                : 'Cargando...'}
                        </p>
                        <p className="text-xs text-gray-500">{vendedor.email || 'Cargando...'}</p>
                        <p className="text-xs text-gray-500">{vendedor.telefono || 'Cargando...'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 mb-1">Comprador</p>
                        <p className="text-sm text-gray-600">
                            {comprador.nombre && comprador.apellido 
                                ? `${comprador.nombre} ${comprador.apellido}` 
                                : 'Cargando...'}
                        </p>
                        <p className="text-xs text-gray-500">{comprador.email || 'Cargando...'}</p>
                        <p className="text-xs text-gray-500">{comprador.telefono || 'Cargando...'}</p>
                    </div>
                </div>
            </div>


            {/* Pago */}
            <div className="p-6">
                <h4 className="text-base font-semibold text-gray-800 mb-4">Pago</h4>
                
                
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">{transaccion.metodoPago || 'Cargando...'} - {transaccion.referenciaPago || 'Cargando...'}</p>
                    {transaccion.comentarios && (
                        <p className="text-sm text-gray-600 italic">
                            Comentarios: {transaccion.comentarios}
                        </p>
                    )}
                </div>
            </div>
        </div>
    ) 
}

export default TransaccionCard