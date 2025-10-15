import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const UsuarioPublicaciones = () => {
  const { user } = useContext(AuthContext);
  const token = authService.getToken();
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const URLPublicaciones = `http://localhost:4002/api/publicaciones/usuario/${user?.idUsuario}`;
    
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    fetch(URLPublicaciones, { method: "GET", headers: headers })
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener publicaciones");
        return response.json();
      })
      .then((data) => setPublicaciones(data))
      .catch((error) => console.error("Error: ", error));
  }, [user?.idUsuario, token]);

  const handleClick = (idPublicacion) => {
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <div className="bg-[#f5efe6] min-h-screen py-10 px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
        <button
          onClick={() => navigate('/perfil')}
          className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
        >
          Volver al Perfil
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicaciones.map((publicacion) => (
          <div
            key={publicacion.idPublicacion}
            className="bg-white border border-[#cbdceb] shadow-md rounded-2xl p-4 flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleClick(publicacion.idPublicacion)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {publicacion.titulo}
            </h3>
            <p className="text-[#6c94c4] font-medium mb-4">
              ${publicacion.precio}
            </p>
            <p className="text-sm text-gray-600">
              {publicacion.descripcion || "Sin descripción"}
            </p>
            <div className="mt-3 text-sm text-gray-400">
              {publicacion.fechaPublicacion}
            </div>
          </div>
        ))}
      </div>
      
      {publicaciones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tienes publicaciones aún</p>
          <button
            onClick={() => navigate('/crear-publicacion')}
            className="px-6 py-3 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Crear Primera Publicación
          </button>
        </div>
      )}
    </div>
  );
};

export default UsuarioPublicaciones;