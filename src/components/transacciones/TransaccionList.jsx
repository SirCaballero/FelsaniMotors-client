import { useEffect, useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import TransaccionCard from "./TransaccionCard";

const TransaccionList = () => {
    const { user } = useContext(AuthContext);
    const [transacciones, setTransacciones] = useState([]);

    useEffect(() => {
        if (!user?.id) return;

        const URLTransacciones = `http://localhost:4002/api/transacciones/usuario/${user.id}`;
        
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        fetch(URLTransacciones, {
            method: "GET",
            headers: headers
        })
        .then((response) => {
            if(!response.ok) throw new Error("Transacciones no encontradas");
            return response.json();
        })
        .then((data) => setTransacciones(data))
        .catch((error) => console.error("Error buscando transacciones : ", error));
    }, [user?.id]);

    return(
        <div>
            <h2>Transacciones</h2>
            {transacciones.length === 0 ? (
                <p>No hay transacciones disponibles</p>
            ) : (
                transacciones.map(transaccion => (
                    <TransaccionCard 
                        key={transaccion.idTransaccion}
                        idTransaccion={transaccion.idTransaccion}
                    />
                ))
            )}
        </div>
    );
}

export default TransaccionList;