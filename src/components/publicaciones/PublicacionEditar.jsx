import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const PublicacionEditar = () => {
  
  // Parametros
  const { id } = useParams();
  const idPublicacion = parseInt(id);
  const navigate = useNavigate();

  const [imagenes, setImagenes] = useState([]) 
  const [publicacion, setPublicacion] = useState(null)
  const [imagenActual, setImagenActual] = useState(0);
  const [pubSeleccionadas, setPubSeleccionadas] = useState([]);
  const [principalId, setPrincipalId] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('Disponible')

  // Plantilla de los cambios
  const [cambios, setCambios] = useState({
    imgBorrar: [],
    imgAgregar: [],
    titulo: '',
    precio: '',
    ubicacion: '',
    descripcion: '',
    metodoDePago: '',
    estado: 'A',
    descuentoPorcentaje: 0
  });

  useEffect(() => {
    const token = authService.getToken();
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    if(token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    // obtener la informacion de la publicacion por idPublicacion
    const URL_GET_Publicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`
    fetch(URL_GET_Publicacion, {
      method: "GET",
      headers: headers
    })
      .then((response) => {
        if(!response.ok) throw new Error("No se encontro la publicacion.")
        return response.json()
      })
      .then((data) => {
        setPublicacion(data)
        setPrincipalId(data.idFotoPrincipal)
        
        // Inicializar cambios con datos de la publicación
        setCambios({
          imgBorrar: [],
          imgAgregar: [],
          titulo: data.titulo || '',
          precio: data.precio || '',
          ubicacion: data.ubicacion || '',
          descripcion: data.descripcion || '',
          metodoDePago: data.metodoDePago || '',
          estado: data.estado || 'A',
          descuentoPorcentaje: data.descuentoPorcentaje || 0
        });

        // Establecer estado visual
        if(data.estado === 'A') setNuevoEstado('Disponible')
        else if(data.estado === 'V') setNuevoEstado('Vendido')
        else if(data.estado === 'P') setNuevoEstado('Pausado')
      })
      .catch(() => {
        alert("Error al cargar la publicación")
        navigate('/')
      })

    // obtener las fotos por idPublicacion
    const URL_GET_Fotos = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`
    fetch(URL_GET_Fotos)
      .then(response => {
          if (!response.ok) { 
              throw new Error('No se encontraron imágenes')
          }
          return response.json();
      })
      .then(data => {
          if (data && data.length > 0) {
            const imagenesFormateadas = data.map(foto => ({
              idImg: foto.id,
              img: `data:image/jpeg;base64,${foto.file}`
            }))
            setImagenes(imagenesFormateadas)
          }
      })
      .catch(() => {
        // No hacer nada si no hay imágenes
      });

  }, [idPublicacion, navigate])


  const cantidad = imagenes.length;

  const siguienteImagen = () => {
    if (imagenActual < cantidad - 1) setImagenActual(imagenActual + 1);
  };

  const anteriorImagen = () => {
    if (imagenActual > 0) setImagenActual(imagenActual - 1);
  };

  // handles

  const onFotoClick = (url) => {
    if (pubSeleccionadas.some((pub) => url.img === pub.img)) {
      setPubSeleccionadas(pubSeleccionadas.filter((pub) => pub.img !== url.img));
    } else {
      setPubSeleccionadas([...pubSeleccionadas, url]);
    }
  };

  const handleEliminarClick = () => {
    if(pubSeleccionadas.length === 0) {
      alert("Selecciona al menos una imagen para eliminar");
      return;
    }
    
    if(imagenes.length === pubSeleccionadas.length) {
      alert("No puedes eliminar todas las imágenes. Debe quedar al menos una.");
      return;
    }

    setCambios({ ...cambios, imgBorrar: [...cambios.imgBorrar, ...pubSeleccionadas] });
    const resto = imagenes.filter((img) => !pubSeleccionadas.some((pub) => pub.img === img.img));
    setImagenes(resto);
    setPubSeleccionadas([]);
    
    // Ajustar imagen actual si es necesario
    if(imagenActual >= resto.length) {
      setImagenActual(resto.length > 0 ? resto.length - 1 : 0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCambios({ ...cambios, [name]: value });
  };

  const handleAñadirImagen = (e) => {
    const archivos = Array.from(e.target.files)
    const nuevasImagenes = archivos.map((file) => ({
      idImg: null,
      img: URL.createObjectURL(file),
      file: file
    }));
    setImagenes((prev) => [...prev, ...nuevasImagenes]);
    setCambios({
      ...cambios,
      imgAgregar: [...cambios.imgAgregar, ...archivos]
    });
  };

  const handleEstadoChange = (value) => {
    setNuevoEstado(value)
    let currentEstado = 'A'
    if(value === "Disponible") {
        currentEstado = "A"
      } else if(value === "Vendido") {
        currentEstado = "V"
      } else if(value === "Pausado") {
        currentEstado = "P"
      }
    setCambios({
      ...cambios,
      estado: currentEstado
    })
  }

  const handlePrincipalClick = () => {
    if(pubSeleccionadas.length !== 1) {
      alert("Selecciona exactamente una imagen para marcar como principal");
      return;
    }
    if(!pubSeleccionadas[0].idImg) {
      alert("Primero guarda los cambios para poder seleccionar una imagen nueva como principal");
      return;
    }
    setPrincipalId(pubSeleccionadas[0].idImg);
    alert("Imagen seleccionada como principal. Recuerda guardar los cambios.");
  };

  const handleCancelarClick = () => {
    navigate(`/publicacion/${idPublicacion}`)
  }

  const handleEliminarPublicacion = () => {
    if(!window.confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.')) {
      return;
    }

    const token = authService.getToken();
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`);

    const URL_DELETE_Publicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`
    
    fetch(URL_DELETE_Publicacion, {
      method: "DELETE",
      headers: headers
    })
    .then((response) => {
      if(!response.ok) throw new Error("Error al eliminar la publicación")
      alert("Publicación eliminada exitosamente")
      navigate('/')
    })
    .catch(() => {
      alert("Error al eliminar la publicación")
    })
  }

  const handleCambioClick = () => {
    // Validaciones
    if(!cambios.titulo || !cambios.titulo.trim()) {
      alert("El título no puede estar vacío");
      return;
    }
    if(!cambios.precio || isNaN(parseFloat(cambios.precio)) || parseFloat(cambios.precio) <= 0) {
      alert("El precio debe ser un número válido mayor a 0");
      return;
    }
    if(!cambios.ubicacion || !cambios.ubicacion.trim()) {
      alert("La ubicación no puede estar vacía");
      return;
    }

    const token = authService.getToken();
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);

    let hayError = false;

    // PASO 1: Eliminar fotos
    const eliminarFotos = () => {
      if(cambios.imgBorrar.length === 0) {
        agregarFotos();
        return;
      }

      let eliminadas = 0;
      cambios.imgBorrar.forEach((img) => {
        if(img.idImg) {
          const URL_DELETE_Foto = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos/${img.idImg}`
          fetch(URL_DELETE_Foto, {
            method: "DELETE",
            headers: headers
          })
          .then(() => {
            eliminadas++;
            if(eliminadas === cambios.imgBorrar.length) {
              agregarFotos();
            }
          })
          .catch(() => {
            hayError = true;
            eliminadas++;
            if(eliminadas === cambios.imgBorrar.length) {
              agregarFotos();
            }
          })
        } else {
          eliminadas++;
          if(eliminadas === cambios.imgBorrar.length) {
            agregarFotos();
          }
        }
      })
    };

    // PASO 2: Agregar fotos nuevas
    const agregarFotos = () => {
      if(cambios.imgAgregar.length === 0) {
        actualizarPublicacion();
        return;
      }

      const URL_POST_Foto = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos`
      let agregadas = 0;

      cambios.imgAgregar.forEach((file, index) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("esPrincipal", "false")
        formData.append("orden", index.toString())

        const headersFormData = new Headers()
        headersFormData.append('Authorization', `Bearer ${token}`);

        fetch(URL_POST_Foto, {
          method: "POST",
          headers: headersFormData,
          body: formData
        })
        .then(() => {
          agregadas++;
          if(agregadas === cambios.imgAgregar.length) {
            actualizarPublicacion();
          }
        })
        .catch(() => {
          hayError = true;
          agregadas++;
          if(agregadas === cambios.imgAgregar.length) {
            actualizarPublicacion();
          }
        })
      })
    };

    // PASO 3: Actualizar datos de la publicación
    const actualizarPublicacion = () => {
      const URL_PUT_Publicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`

      fetch(URL_PUT_Publicacion, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          titulo: cambios.titulo,
          descripcion: cambios.descripcion,
          ubicacion: cambios.ubicacion,
          precio: parseFloat(cambios.precio),
          metodoDePago: cambios.metodoDePago,
          descuentoPorcentaje: parseInt(cambios.descuentoPorcentaje) || 0
        })
      })
      .then((response) => {
        if(!response.ok) throw new Error("Error al actualizar la publicacion.")
        return response.json()
      })
      .then(() => {
        actualizarEstado();
      })
      .catch(() => {
        hayError = true;
        alert("Error al actualizar los datos de la publicación");
      })
    };

    // PASO 4: Actualizar estado
    const actualizarEstado = () => {
      const URL_PUT_Estado = `http://localhost:4002/api/publicaciones/${idPublicacion}/estado`

      fetch(URL_PUT_Estado, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ estado: cambios.estado })
      })
      .then((response) => {
        if(!response.ok) throw new Error("El estado no se actualizo correctamente.")
        return response.json()
      })
      .then(() => {
        actualizarImagenPrincipal();
      })
      .catch(() => {
        hayError = true;
        actualizarImagenPrincipal();
      })
    };

    // PASO 5: Actualizar imagen principal
    const actualizarImagenPrincipal = () => {
      if(principalId) {
        const URL_PUT_FotoPrincipal = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos/${principalId}/principal`

        fetch(URL_PUT_FotoPrincipal, {
          method: "PUT",
          headers: headers
        })
        .then((response) => {
          if(!response.ok) throw new Error("No se definio la imagen como principal.")
          finalizarActualizacion();
        })
        .catch(() => {
          hayError = true;
          finalizarActualizacion();
        })
      } else {
        finalizarActualizacion();
      }
    };

    // PASO 6: Finalizar
    const finalizarActualizacion = () => {
      if(hayError) {
        alert("Cambios guardados con algunos errores. Por favor, verifica la publicación.");
      } else {
        alert("Cambios guardados exitosamente");
      }
      navigate(`/publicacion/${idPublicacion}`)
    };

    // Iniciar el proceso
    eliminarFotos();
  }

  if(!publicacion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F5EFE6] py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 space-y-8 border border-[#CBDCEB]">
        <h1 className="text-2xl font-semibold text-center text-gray-700">Editar Publicación</h1>

        {/* "Formulario" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Título</label>
            <input
              type="text"
              name="titulo"
              value={cambios.titulo}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Precio</label>
            <input
              type="text"
              name="precio"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cambios.precio}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Descuento (%)
              <span className="text-xs text-gray-500 ml-2">
                {cambios.descuentoPorcentaje > 0 && (
                  <span className="text-green-600 font-semibold">
                    Precio con descuento: ${(cambios.precio - (cambios.precio * cambios.descuentoPorcentaje / 100)).toLocaleString()}
                  </span>
                )}
              </span>
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={cambios.descuentoPorcentaje}
              onChange={(e) => {
                const valor = parseInt(e.target.value) || 0;
                if(valor >= 0 && valor <= 99) {
                  setCambios({ ...cambios, descuentoPorcentaje: valor });
                }
              }}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
              placeholder="0-99"
            />
            {cambios.descuentoPorcentaje > 0 && (
              <p className="text-xs text-green-600 mt-1">
                🏷️ Descuento del {cambios.descuentoPorcentaje}% aplicado
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={cambios.ubicacion}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Descripción</label>
            <textarea
              name="descripcion"
              value={cambios.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          {/* Selector de estado */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Estado de la publicación</label>
            <select
              value={nuevoEstado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] bg-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            >
              <option value="Disponible">Disponible</option>
              <option value="Vendido">Vendido</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
        </div>

        {/* Carrusel */}
        {imagenes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Imágenes</h2>

            <div className="max-w-xl mx-auto overflow-hidden relative rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${imagenActual * 100}%)` }}
              >
                {imagenes.map((url, index) => {
                  const seleccionada = pubSeleccionadas.some((pub) => pub.img === url.img);
                  return (
                    <div
                      key={index}
                      className="w-full h-64 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer relative"
                      onClick={() => onFotoClick(url)}
                    >
                      <img
                        src={url.img}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      {seleccionada && (
                        <div className="absolute top-3 right-3 bg-[#CBDCEB] rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botones de navegación de imagenes*/}
              {imagenActual > 0 && (
                <button
                  onClick={anteriorImagen}
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#CBDCEB] text-white p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {imagenActual < cantidad - 1 && (
                <button
                  onClick={siguienteImagen}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-[#CBDCEB] text-white p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Botones acción */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleEliminarClick}
                disabled={pubSeleccionadas.length === 0}
                className={`font-medium px-4 py-2 rounded-md transition ${
                  pubSeleccionadas.length > 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Eliminar seleccionadas
              </button>

              <label className="bg-[#F5EFE6] border border-[#CBDCEB] text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-[#faf8f2] transition cursor-pointer">
                Añadir imagen
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAñadirImagen}
                  className="hidden"
                />
              </label>

              {/* Boton seleccion imagen principal */}
              <button
                onClick={handlePrincipalClick}
                disabled={pubSeleccionadas.length !== 1}
                className={`font-medium px-4 py-2 rounded-md transition ${
                  pubSeleccionadas.length === 1
                    ? "bg-[#CBDCEB] text-gray-700 hover:bg-[#b4cde2]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Seleccionar Principal
              </button>
            </div>
          </div>
        )}

        {/* Botones generales */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handleCambioClick}
            className="bg-[#CBDCEB] text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-[#b4cde2] transition">
            Guardar Cambios
          </button>
          <button 
            onClick={handleCancelarClick}
            className="bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-400 transition">
            Cancelar
          </button>
        </div>

        {/* Boton eliminar publicacion */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleEliminarPublicacion}
            className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition"
          >
            Eliminar Publicación
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicacionEditar;
