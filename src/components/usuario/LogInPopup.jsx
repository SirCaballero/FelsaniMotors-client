import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LogInPopup = ({ close, openSignIn }) => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useContext(AuthContext);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(close, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password)
      .then((result) => {
        if (result.success) {
          handleClose();
        }
      });
  };

  return (
    <>
      {/* Fondo translúcido */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      ></div>

      {/* Contenedor del popup */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className={`bg-[#e8decb] rounded-md shadow-md w-[360px] p-6 relative border border-gray-200 transform transition-all duration-300 ${
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
            Iniciar sesión
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c94c4]"
                placeholder="contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6c94c4] text-white py-2 rounded hover:bg-[#4e78a5] transition"
            >
              Continuar
            </button>
          </form>

          {/* Botón adicional */}
          <button
            className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
            onClick={() => {
              handleClose();
              setTimeout(openSignIn, 200);
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
