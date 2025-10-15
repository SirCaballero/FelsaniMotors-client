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

        // Usar endpoint específico del usuario
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
            }
        })
        .catch((error) => {
            console.error("Error buscando transacciones : ", error);
        });
    }, [user]);

    return(
        <div>
            <h2>Transacciones</h2>
            {transacciones.length === 0 ? (
                <p>No hay transacciones disponibles</p>
            ) : (
                transacciones.map(transaccion => (
                    <TransaccionCard 
                        key={transaccion.idTransaccion}
                        transaccion={transaccion}
                    />
                ))
            )}
        </div>
    );
}

export default TransaccionList;