import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const PublicacionForm = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Estructura JSON de los endpoints

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
        
        // 1. Crear el Auto
        fetch(AUTO_URL, {
            method: "POST",
            headers: createAuthHeaders(),
            body: JSON.stringify(autoData)
        })
        .then((autoResponse) => {
            if (!autoResponse.ok) throw new Error("Error al crear el auto");
            return autoResponse.json();
        })
        .then((createdAuto) => {
            // 2. Crear la Publicación
            const publicacionPayload = {
                ...publicacionData,
                idUsuario: USUARIO_ID,
                idAuto: createdAuto.idAuto
            };
            
            return fetch(PUBLICACION_URL, {
                method: "POST",
                headers: createAuthHeaders(),
                body: JSON.stringify(publicacionPayload)
            }).then((publicacionResponse) => {
                if (!publicacionResponse.ok) throw new Error("Error al crear la publicación");
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
                            console.error(`Error al subir foto ${i + 1}`);
                            return null;
                        }
                        return fotoResponse.json();
                    })
                    .catch((error) => {
                        console.error(`Error al subir foto ${i + 1}:`, error);
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
            
            navigate('/publicaciones');
        })
        .catch((error) => {
            console.error("Error al crear publicación:", error);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="px-10 border-gray-300">
            <h2 className="justify-center text-center">Crear Nueva Publicación</h2>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl ">Datos del Auto</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Marca:</label>
                    <input
                        type="text"
                        name="marca"
                        value={autoData.marca}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Modelo:</label>
                    <input
                        type="text"
                        name="modelo"
                        value={autoData.modelo}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
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
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Estado:</label>
                    <input
                        type="text"
                        name="estado"
                        value={autoData.estado}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Kilometraje:</label>
                    <input
                        type="number"
                        name="kilometraje"
                        value={autoData.kilometraje}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Combustible:</label>
                    <input
                        type="text"
                        name="combustible"
                        value={autoData.combustible}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Tipo Categoría:</label>
                    <input
                        type="text"
                        name="tipoCategoria"
                        value={autoData.tipoCategoria}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
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
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Tipo Caja:</label>
                    <input
                        type="text"
                        name="tipoCaja"
                        value={autoData.tipoCaja}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Motor:</label>
                    <input
                        type="text"
                        name="motor"
                        value={autoData.motor}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
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
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={publicacionData.descripcion}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        rows="4"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Ubicación:</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={publicacionData.ubicacion}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        required
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
                        required
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
                        required
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
                    <p className="text-sm text-gray-500 mt-1">Puedes seleccionar múltiples imágenes</p>
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
