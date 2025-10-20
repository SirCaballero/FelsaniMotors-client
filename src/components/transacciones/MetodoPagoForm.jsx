import { useState } from "react";

const MetodoPagoForm = ({ onMetodoPagoChange }) => {
    const [metodoPagoData, setMetodoPagoData] = useState({
        metodoPago: "Visa",
        numeroTarjeta: "",
        fechaCaducidad: "",
        codigoSeguridad: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = {
            ...metodoPagoData,
            [name]: value
        };
        setMetodoPagoData(newData);
        if (onMetodoPagoChange) {
            onMetodoPagoChange(newData);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Método de Pago</h3>
            <div className="space-y-5">
                <div>
                    <label htmlFor="metodoPago" className="block text-base font-semibold text-gray-700 mb-2">
                        Selecciona tu tarjeta
                    </label>
                    <select
                        id="metodoPago"
                        name="metodoPago"
                        value={metodoPagoData.metodoPago}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors cursor-pointer"
                    >
                        <option value="Visa">💳 Visa</option>
                        <option value="MasterCard">💳 MasterCard</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="numeroTarjeta" className="block text-base font-semibold text-gray-700 mb-2">
                        Número de Tarjeta <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="numeroTarjeta"
                        name="numeroTarjeta"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={metodoPagoData.numeroTarjeta}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                        maxLength="19"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fechaCaducidad" className="block text-base font-semibold text-gray-700 mb-2">
                            Vencimiento <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="fechaCaducidad"
                            name="fechaCaducidad"
                            type="text"
                            placeholder="MM/AA"
                            value={metodoPagoData.fechaCaducidad}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                            maxLength="5"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="codigoSeguridad" className="block text-base font-semibold text-gray-700 mb-2">
                            CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="codigoSeguridad"
                            name="codigoSeguridad"
                            type="text"
                            placeholder="123"
                            value={metodoPagoData.codigoSeguridad}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
                            maxLength="4"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetodoPagoForm;