import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const PublicacionForm = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Opciones para dropdowns

    const marcasDisponibles = [
        "Toyota", "Volkswagen", "Ford", "Chevrolet", "Honda", "Nissan", 
        "Renault", "Peugeot", "Fiat", "Mercedes-Benz", "BMW", "Audi",
        "Hyundai", "Kia", "Mazda", "Jeep", "Citroën", "Suzuki"
    ];

    const estadosDisponibles = ["Nuevo", "Usado"];

    const combustiblesDisponibles = ["Nafta", "Diesel", "GNC", "Eléctrico"];

    const tiposCajaDisponibles = ["Manual", "Automática", "Semiautomática"];

    // Estructura JSON de endpoints
    const [autoData, setAutoData] = useState({
        marca: "",
        modelo: "",
        anio: "",
        estado: "",
        kilometraje: "",
        combustible: "",
        tipoCategoria: "",
        capacidadTanque: "",
        tipoCaja: "",
        motor: ""
    });

    const [publicacionData, setPublicacionData] = useState({
        titulo: "",
        descripcion: "",
        ubicacion: "",
        precio: "",
        metodoDePago: ""
    });

    // States

    const [fotos, setFotos] = useState([]);
    const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validar si el usuario está activo
    if (!user?.activo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white border-2 border-red-500 rounded-xl p-8 max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Cuenta Inactiva</h2>
                        <p className="text-gray-600 mb-6">
                            Tu cuenta está inactiva. No puedes crear publicaciones hasta que se active tu cuenta.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Contacta al administrador para activar tu cuenta.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-paleta1-blue-light transition-colors"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Conexion a Back, con Bearer Token

    const AUTO_URL = "http://localhost:4002/api/autos";
    const PUBLICACION_URL = "http://localhost:4002/api/publicaciones";
    
    const USUARIO_ID = user?.idUsuario;

    const createAuthHeaders = (includeContentType = true) => {
        const headers = new Headers();
        const token = authService.getToken();
        
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        
        if (includeContentType) {
            headers.append('Content-Type', 'application/json');
        }
        
        return headers;
    };

    const handleAutoChange = (e) => {
        const { name, value } = e.target;
        setAutoData({
            ...autoData,
            [name]: value
        });
    };

    const handlePublicacionChange = (e) => {
        const { name, value } = e.target;
        setPublicacionData({
            ...publicacionData,
            [name]: value
        });
    };

    const handleFotosChange = (e) => {
        const files = Array.from(e.target.files);
        setFotos(files);
        if (fotoPrincipalIndex >= files.length) {
            setFotoPrincipalIndex(0);
        }
    };

    const handleFotoPrincipalChange = (e) => {
        setFotoPrincipalIndex(parseInt(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!autoData.marca || !autoData.modelo || !publicacionData.titulo || !publicacionData.precio) {
            alert("Por favor completa todos los campos obligatorios");
            setIsSubmitting(false);
            return;
        }

        if (publicacionData.descripcion && publicacionData.descripcion.length > 255) {
            alert("La descripción no puede superar los 255 caracteres");
            setIsSubmitting(false);
            return;
        }
        
        const autoDataRequest = {
            marca: autoData.marca,
            modelo: autoData.modelo,
            anio: autoData.anio ? parseInt(autoData.anio) : null,
            estado: autoData.estado || null,
            kilometraje: autoData.kilometraje ? parseInt(autoData.kilometraje) : null,
            combustible: autoData.combustible || null,
            tipoCategoria: autoData.tipoCategoria || null,
            capacidadTanque: autoData.capacidadTanque ? parseFloat(autoData.capacidadTanque) : null,
            tipoCaja: autoData.tipoCaja || null,
            motor: autoData.motor || null
        };
        
        //Crear el Auto
        fetch(AUTO_URL, {
            method: "POST",
            headers: createAuthHeaders(),
            body: JSON.stringify(autoDataRequest)
        })
        .then((autoResponse) => {
            if (!autoResponse.ok) {
                return autoResponse.text().then(text => {
                    throw new Error(`Error al crear el auto: ${text}`);
                });
            }
            return autoResponse.json();
        })
        .then((createdAuto) => {
            // 2. Crear la Publicación
            const publicacionDataRequest = {
                titulo: publicacionData.titulo,
                descripcion: publicacionData.descripcion || null,
                ubicacion: publicacionData.ubicacion || null,
                precio: parseFloat(publicacionData.precio),
                metodoDePago: publicacionData.metodoDePago || null,
                idUsuario: USUARIO_ID,
                idAuto: createdAuto.idAuto,
                estado: 'A'
            };
            
            return fetch(PUBLICACION_URL, {
                method: "POST",
                headers: createAuthHeaders(),
                body: JSON.stringify(publicacionDataRequest)
            }).then((publicacionResponse) => {
                if (!publicacionResponse.ok) {
                    return publicacionResponse.text().then(text => {
                        throw new Error(`Error al crear la publicación: ${text}`);
                    });
                }
                return publicacionResponse.json();
            });
        })
        .then((createdPublicacion) => {
            // 3. Subir las fotos
            if (fotos.length > 0) {
                const FOTOS_URL = `http://localhost:4002/api/publicaciones/${createdPublicacion.idPublicacion}/fotos`;
                
                const uploadPromises = [];
                
                for (let i = 0; i < fotos.length; i++) {
                    const formData = new FormData();
                    formData.append("file", fotos[i]);
                    formData.append("esPrincipal", i === fotoPrincipalIndex ? "true" : "false");
                    formData.append("orden", i.toString());
                    
                    const uploadPromise = fetch(FOTOS_URL, {
                        method: "POST",
                        headers: createAuthHeaders(false),
                        body: formData
                    })
                    .then((fotoResponse) => {
                        if (!fotoResponse.ok) {
                            return null;
                        }
                        return fotoResponse.json();
                    })
                    .catch(() => {
                        return null;
                    });
                    
                    uploadPromises.push(uploadPromise);
                }
                
                return Promise.all(uploadPromises);
            }
        })
        .then(() => {
            // Limpiar formulario
            setAutoData({
                marca: "",
                modelo: "",
                anio: "",
                estado: "",
                kilometraje: "",
                combustible: "",
                tipoCategoria: "",
                capacidadTanque: "",
                tipoCaja: "",
                motor: ""
            });
            
            setPublicacionData({
                titulo: "",
                descripcion: "",
                ubicacion: "",
                precio: "",
                metodoDePago: ""
            });
            
            setFotos([]);
            setFotoPrincipalIndex(0);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            
            alert("Publicación creada exitosamente");
            navigate('/publicaciones');
        })
        .catch((error) => {
            alert(`Error al crear publicación: ${error.message}`);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="px-10 border-gray-300">
            <h2 className="justify-center text-center text-4xl font-bold text-paleta1-blue my-6">Crear Nueva Publicación</h2>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl ">Datos del Auto</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Marca:</label>
                    <select
                        name="marca"
                        value={autoData.marca}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar marca</option>
                        {marcasDisponibles.map((marca) => (
                            <option key={marca} value={marca}>{marca}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Modelo:</label>
                    <input
                        type="text"
                        name="modelo"
                        value={autoData.modelo}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Año:</label>
                    <input
                        type="number"
                        name="anio"
                        value={autoData.anio}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Estado:</label>
                    <select
                        name="estado"
                        value={autoData.estado}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar estado</option>
                        {estadosDisponibles.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Kilometraje:</label>
                    <input
                        type="number"
                        name="kilometraje"
                        value={autoData.kilometraje}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Combustible:</label>
                    <select
                        name="combustible"
                        value={autoData.combustible}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar combustible</option>
                        {combustiblesDisponibles.map((combustible) => (
                            <option key={combustible} value={combustible}>{combustible}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Tipo Categoría:</label>
                    <input
                        type="text"
                        name="tipoCategoria"
                        value={autoData.tipoCategoria}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Capacidad Tanque:</label>
                    <input
                        type="number"
                        name="capacidadTanque"
                        value={autoData.capacidadTanque}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Tipo Caja:</label>
                    <select
                        name="tipoCaja"
                        value={autoData.tipoCaja}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar tipo de caja</option>
                        {tiposCajaDisponibles.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Motor:</label>
                    <input
                        type="text"
                        name="motor"
                        value={autoData.motor}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>

                <h3 className="text-xl font-semibold mb-4 mt-6 text-paleta1-blue">Datos de la Publicación</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Título:</label>
                    <input
                        type="text"
                        name="titulo"
                        value={publicacionData.titulo}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Descripción: 
                        <span className={`ml-2 text-sm ${publicacionData.descripcion.length > 255 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                            ({publicacionData.descripcion.length}/255 caracteres)
                        </span>
                    </label>
                    <textarea
                        name="descripcion"
                        value={publicacionData.descripcion}
                        onChange={handlePublicacionChange}
                        maxLength={255}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        rows="4"
                        placeholder="Describe el vehículo (máximo 255 caracteres)"
                    />
                    {publicacionData.descripcion.length > 255 && (
                        <p className="text-red-600 text-sm mt-1">La descripción no puede superar los 255 caracteres</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Ubicación:</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={publicacionData.ubicacion}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        placeholder="Ej: Buenos Aires, CABA"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={publicacionData.precio}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Método de Pago:</label>
                    <input
                        type="text"
                        name="metodoDePago"
                        value={publicacionData.metodoDePago}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        placeholder="Ej: Efectivo, transferencia, financiación"
                    />
                </div>

                <h3 className="text-xl font-semibold mb-4 mt-6 text-paleta1-blue">Fotos del Vehículo</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Seleccionar Fotos:</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFotosChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>

                {fotos.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Foto Principal:</label>
                        <select
                            value={fotoPrincipalIndex}
                            onChange={handleFotoPrincipalChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        >
                            {fotos.map((foto, index) => (
                                <option key={index} value={index}>
                                    Foto {index + 1} - {foto.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {fotos.length} foto{fotos.length > 1 ? 's' : ''} seleccionada{fotos.length > 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full text-white py-3 px-6 rounded-md transition-colors font-semibold ${
                        isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-paleta1-blue hover:bg-paleta1-blue/90'
                    }`}
                >
                    {isSubmitting ? 'Creando Publicación...' : 'Crear Publicación'}
                </button>
            </form>
        </div>
    );
};

export default PublicacionForm;