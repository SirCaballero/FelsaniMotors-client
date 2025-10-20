import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const UsuarioActualizacion = () => {
  const { user } = useContext(AuthContext);
  const token = authService.getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.activo) {
      alert("Tu cuenta está inactiva. No puedes modificar tu perfil.");
      navigate('/perfil');
    }
  }, [user, navigate]);

  const [modUsuarioData, setModUsuarioData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModUsuarioData({ ...modUsuarioData, [name]: value });
  };

  const handleActualizacion = (e) => {
    e.preventDefault();
    
    const URLModificarUsuario = `http://localhost:4002/api/usuarios/${user?.idUsuario}`;
    
    
    const dataToUpdate = {};
    if (modUsuarioData.nombre.trim() !== "") {
      dataToUpdate.nombre = modUsuarioData.nombre;
    }
    if (modUsuarioData.apellido.trim() !== "") {
      dataToUpdate.apellido = modUsuarioData.apellido;
    }
    if (modUsuarioData.telefono.trim() !== "") {
      dataToUpdate.telefono = modUsuarioData.telefono;
    }

    
    if (Object.keys(dataToUpdate).length === 0) {
      alert("No has ingresado ningún campo para actualizar");
      return;
    }
    
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    fetch(URLModificarUsuario, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(dataToUpdate),
    })
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo actualizar el usuario.");
        return response.json();
      })
      .then(() => {
        alert("Perfil actualizado correctamente");
        navigate('/perfil');
      })
      .catch(() => {});
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-start py-10">
      <form
        onSubmit={handleActualizacion}
        className="bg-white border border-[#cbdceb] rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-1">
          Actualiza tu información
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Deja en blanco lo que no quieras cambiar
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nombre</label>
            <input
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={modUsuarioData.nombre}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Apellido</label>
            <input
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={modUsuarioData.apellido}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Teléfono</label>
            <input
              name="telefono"
              type="tel"
              placeholder="1122334455"
              value={modUsuarioData.telefono}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioActualizacion;