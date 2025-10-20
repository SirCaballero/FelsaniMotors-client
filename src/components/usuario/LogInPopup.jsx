import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LogInPopup = ({ close, openSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext);

  const handleClose = () => {
    close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, ingresa un email válido (ejemplo: usuario@gmail.com)');
      return;
    }

    login(email, password).then((result) => {
      if (result.success) {
        handleClose();
      }
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600/40 z-40"
        onClick={handleClose}
      ></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="bg-[#e8decb] rounded-md shadow-md w-[360px] p-6 relative border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            onClick={handleClose}
          >
            ×
          </button>

          <h2 className="text-xl font-semibold text-center mb-6 text-[#6c94c4]">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="contraseña"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6c94c4] text-white py-2 rounded hover:bg-[#4e78a5]"
            >
              Continuar
            </button>
          </form>

          <button
            className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
            onClick={() => {
              handleClose();
              openSignIn();
            }}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </>
  );
};

export default LogInPopup;
