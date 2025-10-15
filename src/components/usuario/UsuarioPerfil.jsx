import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const UsuarioPerfil = () => {
  const { user } = useContext(AuthContext);
  const token = authService.getToken();
  const navigate = useNavigate();

  const [usuarioData, setUsuarioData] = useState({
    idUsuario: "",
    email: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rol: "",
    activo: "",
    cantidadPublicaciones: "",
    cantidadComentarios: "",
  });

  useEffect(() => {
    const URLUsuario = `http://localhost:4002/api/usuarios/${user?.idUsuario}`;
    
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    fetch(URLUsuario, { method: "GET", headers: headers })
      .then((response) => {
        if (!response.ok) throw new Error("No se encontro al usuario.");
        return response.json();
      })
      .then((data) => setUsuarioData(data))
      .catch((error) => console.error("Error: ", error));
  }, [user?.idUsuario, token]);

  return (
    <div className="bg-white flex justify-center items-start py-10">
      <div className="bg-white border border-[#cbdceb] shadow-md rounded-2xl p-6 max-w-3xl w-full">
        <div className="flex items-center justify-between mb-6 border-b border-[#cbdceb] pb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            {usuarioData.nombre} {usuarioData.apellido}
          </h3>
          <button
            onClick={() => navigate('/perfil/actualizar')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Modificar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">E-mail</p>
            <p className="font-medium">{usuarioData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{usuarioData.telefono}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rol</p>
            <p className="font-medium">{usuarioData.rol}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Activo</p>
            <p
              className={`font-medium ${
                usuarioData.activo ? "text-green-600" : "text-red-600"
              }`}
            >
              {usuarioData.activo ? "Sí" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate('/perfil/publicaciones')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Mis Publicaciones
          </button>
          <button
            onClick={() => navigate('/perfil/transacciones')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Mis Transacciones
          </button>
          <button
            onClick={() => navigate('/perfil/cambiar-contraseña')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioPerfil;