import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import TransaccionCard from "../transacciones/TransaccionCard";

const UsuarioTransacciones = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    if (!user?.idUsuario) {
      return;
    }

    const token = authService.getToken();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    // Obtener transacciones específicas del usuario
    const URL_TRANSACCIONES = `http://localhost:4002/api/transacciones/usuario/${user.idUsuario}`;

    fetch(URL_TRANSACCIONES, { method: "GET", headers: headers })
      .then((response) => {
        if (response.status === 204) {
          // No hay contenido - sin transacciones
          setTransacciones([]);
          return null;
        }
        if (!response.ok) throw new Error("Error al buscar transacciones");
        return response.json();
      })
      .then((data) => {
        if (data) {
          setTransacciones(data);
          console.log(`✅ Transacciones del usuario ${user.idUsuario}:`, data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar transacciones: ", error);
      });
  }, [user]);

  return (
    <div className="bg-[#f5efe6] min-h-screen py-10 px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mis Transacciones</h2>
        <button
          onClick={() => navigate('/perfil')}
          className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
        >
          Volver al Perfil
        </button>
      </div>

      {transacciones.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes transacciones aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transacciones.map((transaccion) => (
            <TransaccionCard 
              key={transaccion.idTransaccion}
              transaccion={transaccion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuarioTransacciones;    