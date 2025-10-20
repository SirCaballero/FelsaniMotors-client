import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PublicacionCard from "./PublicacionCard";
import PublicacionDestacada from "./PublicacionDestacada";

const PublicacionList = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionDestacada, setPublicacionDestacada] = useState(null);
    const [searchParams] = useSearchParams();
    
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
        
        if (userId) {
            url = `http://localhost:4002/api/publicaciones/usuario/${userId}`;
        } 
        else if (consultaBusqueda.trim() !== '' || hasFiltros) {
            const params = new URLSearchParams();
            
            if (consultaBusqueda.trim() !== '') {
                params.append('busqueda', consultaBusqueda);
            }
            
            // Agregar filtros
            if (hasFiltros) {
                const filtros = new URLSearchParams(paramsString);
                filtros.delete('q');
                filtros.delete('userId');
                filtros.forEach((value, key) => {
                    params.append(key, value);
                });
            }
            
            url = `http://localhost:4002/api/publicaciones/filtrar?${params.toString()}`;
        }

        fetch(url)
        .then((response) => {
            if (response.status === 204) { 
                setPublicaciones([]);
                return null;
            }
            return response.json();
        })
        .then((data) => {
            if (data === null) return;
            
            if (data.content) {
                setPublicaciones(data.content);
                return;
            }
            
            setPublicaciones(data || []);
        })
        .catch(() => {
            setPublicaciones([]);
        });

    }, [userId, consultaBusqueda, hasFiltros, paramsString]);

    // Actualizar publicacion destacada cuando cambian las publicaciones
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
            </div>
        </div>
    );
};

export default PublicacionList;