import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SignInPopup = ({ close, openLogIn }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
  });

  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(formData.email)) {
      alert('Por favor, ingresa un email válido (ejemplo: usuario@gmail.com)');
      return;
    }

    if (!formData.nombre || !formData.apellido || !formData.password || !formData.telefono) {
      alert('Por favor, completa todos los campos');
      return;
    }

    register(
      formData.email,
      formData.password,
      formData.nombre,
      formData.apellido,
      parseInt(formData.telefono),
      'USER'
    ).then((result) => {
      if (result.success) {
        handleClose();
      }
    });
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-gray-600/40 z-40"
        onClick={handleClose}
      ></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="bg-[#e8decb] rounded-md shadow-md w-[380px] p-6 relative border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            onClick={handleClose}
          >
            ×
          </button>

          <h2 className="text-xl font-semibold text-center mb-6 text-[#6c94c4]">
            Crear cuenta
          </h2>

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
                  className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                  placeholder="Nombre"
                  required
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
                  className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                  placeholder="Apellido"
                  required
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
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="ejemplo@gmail.com"
                required
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
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="contraseña"
                required
                minLength="6"
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
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="1122334455"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6c94c4] text-white py-2 rounded hover:bg-[#4e78a5]"
            >
              Registrarse
            </button>
          </form>

          <button
            className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
            onClick={() => {
              handleClose();
              openLogIn();
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
