import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from '../../services/authService';
import TransaccionCard from "./TransaccionCard";

const TransaccionList = () => {
    const { user } = useContext(AuthContext);
    const [transacciones, setTransacciones] = useState([]);

    useEffect(() => {
        if (!user?.idUsuario) {
            return;
        }

        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        // Obtener transacciones específicas del usuario
        const URL_TRANSACCIONES = `http://localhost:4002/api/transacciones/usuario/${user.idUsuario}`;

        fetch(URL_TRANSACCIONES, {
            method: "GET",
            headers: headers
        })
        .then((response) => {
            if (response.status === 204) {
                // No hay contenido - sin transacciones
                setTransacciones([]);
                return null;
            }
            if(!response.ok) throw new Error("Transacciones no encontradas");
            return response.json();
        })
        .then((data) => {
            if (data) {
                setTransacciones(data);
                console.log(`✅ Transacciones del usuario ${user.idUsuario}:`, data);
            }
        })
        .catch((error) => {
            console.error("Error buscando transacciones : ", error);
        });
    }, [user]);

    return(
        <div className="bg-paleta1-cream-light min-h-screen py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Mis Transacciones</h2>
                    <p className="text-gray-600">
                        {transacciones.length === 0 
                            ? 'No tienes transacciones registradas' 
                            : `Total: ${transacciones.length} transacción${transacciones.length > 1 ? 'es' : ''}`
                        }
                    </p>
                </div>

                {transacciones.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg 
                            className="w-24 h-24 mx-auto text-gray-300 mb-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                            />
                        </svg>
                        <p className="text-gray-500 text-xl mb-2">No hay transacciones disponibles</p>
                        <p className="text-gray-400">Cuando realices una compra, aparecerá aquí</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transacciones.map(transaccion => (
                            <TransaccionCard 
                                key={transaccion.idTransaccion}
                                transaccion={transaccion}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TransaccionList;