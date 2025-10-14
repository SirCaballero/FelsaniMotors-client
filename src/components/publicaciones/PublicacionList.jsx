import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PublicacionCard from "./PublicacionCard";
import PublicacionDestacada from "./PublicacionDestacada";

const PublicacionList = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionDestacada, setPublicacionDestacada] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const consultaBusqueda = searchParams.get('q') || '';
    const userId = searchParams.get('userId');
    
    const paramsString = useMemo(() => searchParams.toString(), [searchParams]);
    
    const hasFiltros = useMemo(() => {
        const params = new URLSearchParams(paramsString);
        params.delete('q');
        params.delete('userId');
        return params.toString().length > 0;
    }, [paramsString]);

    const publicacionesRestantes = publicaciones.filter(p => p.idPublicacion !== publicacionDestacada?.idPublicacion);

    useEffect(() => {
        let url = "http://localhost:4002/api/publicaciones";
        
        // Caso 1: Filtrar por usuario específico
        if (userId) {
            url = `http://localhost:4002/api/publicaciones/usuario/${userId}`;
        } 
        // Caso 2: Búsqueda de texto y/o filtros
        else if (consultaBusqueda.trim() !== '' || hasFiltros) {
            const params = new URLSearchParams();
            
            // Agregar búsqueda de texto si existe
            if (consultaBusqueda.trim() !== '') {
                params.append('busqueda', consultaBusqueda);
            }
            
            // Agregar todos los filtros activos
            searchParams.forEach((value, key) => {
                if (key !== 'q' && key !== 'userId') {
                    params.append(key, value);
                }
            });
            
            url = `http://localhost:4002/api/publicaciones/filtrar?${params.toString()}`;
        }

        fetch(url)
        .then((response) => {
            if (response.status === 204) { return []; }
            return response.json();
        })
        .then((data) => {
            // Si la respuesta tiene estructura paginada, extraer content
            if (data.content) {
                setPublicaciones(data.content);
            } else {
                setPublicaciones(data);
            }
        })
        .catch((error) => console.error("Error al obtener datos", error));

    }, [userId, consultaBusqueda, hasFiltros, searchParams]);

    // Actualizar publicación destacada cuando cambian las publicaciones
    useEffect(() => {
        if (publicaciones.length > 0) {
            const randomIndex = Math.floor(Math.random() * publicaciones.length);
            setPublicacionDestacada(publicaciones[randomIndex]);
        } else {
            setPublicacionDestacada(null);
        }
    }, [publicaciones]);



    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                
                {/* Publicación Destacada */}
                {publicacionDestacada && !consultaBusqueda && !userId && !hasFiltros && (
                    <PublicacionDestacada publicacion={publicacionDestacada} />
                )}

                {/* Título de sección */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {userId ? 'Mis Publicaciones' : 
                         consultaBusqueda ? `Resultados para "${consultaBusqueda}"` : 
                         hasFiltros ? 'Resultados filtrados' :
                         'Todas las publicaciones'}
                    </h2>
                    <p className="text-gray-600">
                        {consultaBusqueda || userId || hasFiltros ? publicaciones.length : publicacionesRestantes.length} vehículos disponibles
                        {userId && ' de tus publicaciones'}
                        {consultaBusqueda && ` que coinciden con "${consultaBusqueda}"`}
                        {hasFiltros && ' según los filtros aplicados'}
                    </p>
                    
                    {/* Botón para limpiar filtros */}
                    {(userId || consultaBusqueda || hasFiltros) && (
                        <button 
                            onClick={() => navigate('/publicaciones')}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Mostrar todas las publicaciones
                        </button>
                    )}
                </div>

                {/* Grid de publicaciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {(consultaBusqueda || userId || hasFiltros ? publicaciones : publicacionesRestantes).map((publicacion) => (
                        <PublicacionCard 
                            key={publicacion.idPublicacion}
                            idPublicacion={publicacion.idPublicacion}
                            titulo={publicacion.titulo}
                            ubicacion={publicacion.ubicacion}
                            precio={publicacion.precio}
                            estado={publicacion.estado}
                            marcaAuto={publicacion.marcaAuto}
                            modeloAuto={publicacion.modeloAuto}
                        />
                    ))}
                </div>

                {/* Mensaje si no hay publicaciones */}
                {publicaciones.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {userId ? 'No tienes publicaciones aún' :
                             consultaBusqueda ? 'No se encontraron resultados' :
                             'No hay publicaciones disponibles'}
                        </h3>
                        <p className="text-gray-500">
                            {userId ? 'Crea tu primera publicación para vender tu vehículo' :
                             consultaBusqueda ? 'Intenta con otros términos de búsqueda' :
                             'Sé el primero en publicar tu vehículo'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicacionList;