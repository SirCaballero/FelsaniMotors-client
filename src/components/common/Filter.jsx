import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Filter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    marca: [],
    modelo: [],
    anio: [],
    estado: [],
    kilometraje: [],
    combustible: [],
    tipoCategoria: [],
    tipoCaja: [],
    motor: []
  });

  const [filterOptions, setFilterOptions] = useState({
    marca: [],
    modelo: [],
    anio: [],
    estado: [],
    kilometraje: [],
    combustible: [],
    tipoCategoria: [],
    tipoCaja: [],
    motor: []
  });

  // Mapeo para mostrar valores formateados en UI pero enviar valores correctos al backend
  const kilometrajeDisplay = {
    '0-50000': '0-50.000 km',
    '50000-100000': '50.000-100.000 km',
    '100000-150000': '100.000-150.000 km',
    '150000-200000': '150.000-200.000 km',
    '200000-999999999': '200.000+ km'
  };

  useEffect(() => {
    fetch('http://localhost:4002/api/publicaciones/filtros/opciones')
      .then(response => response.json())
      .then(data => {
        setFilterOptions({
          marca: data.marcas || [],
          modelo: data.modelos || [],
          anio: data.anios?.map(String) || [],
          estado: data.estados || [],
          kilometraje: ['0-50000', '50000-100000', '100000-150000', '150000-200000', '200000-999999999'],
          combustible: data.combustibles || [],
          tipoCategoria: data.tipoCategorias || [],
          tipoCaja: data.tipoCajas || [],
          motor: data.motores || []
        });
      })
      .catch(error => console.error('Error cargando opciones de filtros:', error));
  }, []);

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (filterName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleCheckboxChange = (filterName, value) => {
    setFilters(prev => {
      const currentArray = prev[filterName];
      const isSelected = currentArray.includes(value);
      
      let updatedArray;
      if (isSelected) {
        // Si ya esta, lo removemos del array
        updatedArray = currentArray.filter(v => v !== value);
      } else {
        // Si no esta, lo agregamos al array
        updatedArray = [...currentArray, value];
      }
      
      return {
        ...prev,
        [filterName]: updatedArray
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      marca: [],
      modelo: [],
      anio: [],
      estado: [],
      kilometraje: [],
      combustible: [],
      tipoCategoria: [],
      tipoCaja: [],
      motor: []
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    const textoBusqueda = searchParams.get('q');
    if (textoBusqueda) {
      params.append('q', textoBusqueda);
    }
    
    for (const key in filters) {
      filters[key].forEach(value => {
        params.append(key, value);
      });
    }
    
    navigate(`/publicaciones?${params.toString()}`);
    setIsOpen(false);
  };

  const getFilterLabel = (key) => {
    const labels = {
      marca: 'Marca',
      modelo: 'Modelo',
      anio: 'Año',
      estado: 'Estado',
      kilometraje: 'Kilometraje',
      combustible: 'Combustible',
      tipoCategoria: 'Categoría',
      tipoCaja: 'Tipo de Caja',
      motor: 'Motor'
    };
    return labels[key] || key;
  };

  let activeFiltersCount = 0;
  for (const key in filters) {
    activeFiltersCount += filters[key].length;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
      >
        <svg 
          className="w-5 h-5 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        {/* Badge contador de filtros activos */}
        {activeFiltersCount > 0 && (
          <span className="bg-white text-gray-700 rounded-full px-2 py-0.5 text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* === MODAL DE FILTROS === */}
      {/* Utiliza paleta1-blue como color principal y paleta1-cream para fondos suaves */}
      {isOpen && (
        <>
          {/* Overlay de fondo - oscurece el contenido detrás del modal */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Contenedor principal del modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* === HEADER DEL MODAL === */}
              {/* Usa paleta1-blue para títulos y elementos importantes */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-paleta1-blue flex items-center gap-2">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filtros de Búsqueda
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* === CONTENIDO PRINCIPAL === */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Lista expandible de filtros */}
                {/* Implementa design pattern de acordeón con paleta de colores consistente */}
                <div className="space-y-2">
                  {Object.keys(filters).map((filterKey) => (
                    <div key={filterKey} className="relative">
                      {/* Botón de categoría de filtro */}
                      {/* Usa fondos limpios sin beige */}
                      <div
                        onClick={() => toggleDropdown(filterKey)}
                        className={`flex items-center justify-between px-4 py-3 bg-white border border-paleta1-blue-light ${
                          openDropdowns[filterKey] 
                            ? 'rounded-t-lg border-b-0' 
                            : 'rounded-lg'
                        } hover:bg-blue-50 transition-colors cursor-pointer`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-paleta1-blue">
                            {getFilterLabel(filterKey)}
                          </span>
                          {/* Badge de contador para filtros activos en esta categoría */}
                          {filters[filterKey].length > 0 && (
                            <span className="ml-2 text-xs bg-paleta1-blue text-white rounded-full px-2 py-0.5">
                              {filters[filterKey].length}
                            </span>
                          )}
                        </div>
                        {/* Icono de flecha que rota según el estado */}
                        <svg
                          className={`w-4 h-4 text-paleta1-blue transition-transform ${
                            openDropdowns[filterKey] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* === DROPDOWN EXPANDIBLE === */}
                      {/* Se conecta visualmente con el botón principal sin espacios */}
                      {openDropdowns[filterKey] && (
                        <div className="overflow-hidden">
                          <div className="bg-white border-l border-r border-b border-paleta1-blue-light rounded-b-lg">
                            {/* Header del dropdown */}
                            <div className="p-3 bg-blue-50">
                              <div className="text-xs font-medium text-paleta1-blue mb-2">
                                Seleccionar {getFilterLabel(filterKey)}
                              </div>
                            </div>
                            {/* Lista de opciones con scroll */}
                            <div className="p-2 max-h-60 overflow-y-auto">
                              {filterOptions[filterKey].map((option) => {
                                // Para kilometraje, mostrar valor formateado pero guardar valor real
                                const displayValue = filterKey === 'kilometraje' 
                                  ? kilometrajeDisplay[option] || option
                                  : option;
                                
                                return (
                                  <label
                                    key={option}
                                    className="flex items-center px-3 py-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={filters[filterKey].includes(option)}
                                      onChange={() => handleCheckboxChange(filterKey, option)}
                                      className="w-4 h-4 text-paleta1-blue border-paleta1-blue-light rounded focus:ring-paleta1-blue focus:ring-2"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">
                                      {displayValue}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Resumen de filtros activos sin beige */}
                {activeFiltersCount > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-paleta1-blue-light rounded-lg">
                    <h3 className="text-sm font-semibold text-paleta1-blue mb-3">
                      Filtros Activos ({activeFiltersCount})
                    </h3>
                    {/* Tags de filtros activos con botón de eliminación */}
                    <div className="flex flex-wrap gap-2">
                      {/* Mostrar en pantalla filtros activos */}
                      {(() => {
                        const tags = [];
                        for (const key in filters) {
                          filters[key].forEach((value) => {
                            // Para kilometraje, mostrar valor formateado
                            const displayValue = key === 'kilometraje' 
                              ? kilometrajeDisplay[value] || value
                              : value;
                            
                            tags.push(
                              <span
                                key={`${key}-${value}`}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-paleta1-blue text-white text-xs rounded-full"
                              >
                                {getFilterLabel(key)}: {displayValue}
                                <button
                                  onClick={() => handleCheckboxChange(key, value)}
                                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            );
                          });
                        }
                        return tags;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* === FOOTER CON ACCIONES === */}
              {/* Usa fondos limpios sin beige */}
              <div className="flex items-center justify-between p-6 border-t border-paleta1-blue-light bg-gray-50">
                {/* Botón para limpiar todos los filtros */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-paleta1-blue hover:text-paleta1-blue/80 font-medium transition-colors text-sm border border-paleta1-blue-light rounded-lg hover:bg-blue-50"
                >
                  Limpiar Filtros
                </button>
                {/* Botones de acción principales */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 border border-paleta1-blue-light text-paleta1-blue rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-paleta1-blue/90 transition-colors shadow-md text-sm font-medium"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Filter;