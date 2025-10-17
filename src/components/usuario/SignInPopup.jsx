import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SignInPopup = ({ close, openLogIn }) => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
  });
  
  const { register } = useContext(AuthContext);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(close, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    register(
      formData.email,
      formData.password,
      formData.nombre,
      formData.apellido,
      parseInt(formData.telefono),
      'USER'
    )
      .then((result) => {
        if (result.success) {
          handleClose();
        }
      });
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      ></div>

      {/* Contenedor del popup */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className={`bg-[#e8decb] rounded-md shadow-md w-[380px] p-6 relative border border-gray-200 transform transition-all duration-300 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            onClick={handleClose}
          >
            ×
          </button>

          {/* Título */}
          <h2 className="text-xl font-semibold text-center mb-6 text-[#6c94c4]">
            Crear cuenta
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c94c4]"
                  placeholder="Juan"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c94c4]"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c94c4]"
                placeholder="ejemplo@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c94c4]"
                placeholder="contraseña"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c94c4]"
                placeholder="1122334455"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6c94c4] text-white py-2 rounded hover:bg-[#4e78a5] transition"
            >
              Registrarse
            </button>
          </form>

          {/* Volver al login */}
          <button
            className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
            onClick={() => {
              handleClose();
              setTimeout(openLogIn, 200);
            }}
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPopup;
