import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import carritoService from '../../services/carritoService';        

const Carrito = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = () => {
    const items = carritoService.getCart();
    setCartItems(items);
    setTotal(carritoService.calculateTotal());
  };

  const handleRemove = (idPublicacion) => {
    carritoService.removeFromCart(idPublicacion);
    loadCart();
  };

  const handleClear = () => {
    carritoService.clearCart();
    setCartItems([]);
    setTotal(0);
  };

  const handleCheckout = (idPublicacion) => {
    // Navegar a la página de compra individual
    navigate(`/comprar/${idPublicacion}`);
    onClose();
  };

  const handleCheckoutAll = () => {
    navigate('/comprar-carrito');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-paleta1-blue">Carrito de Compras</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg">El carrito está vacío</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Seguir explorando
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div 
                  key={item.idPublicacion} 
                  className="flex gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Imagen del auto */}
                  <div className="w-32 h-24 flex-shrink-0">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/150x100?text=Auto'}
                      alt={item.titulo}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-paleta1-blue mb-1">
                      {item.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.marcaAuto} {item.modeloAuto}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      ${item.precio?.toLocaleString()} <span className="text-sm font-normal text-gray-500">ARS</span>
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col justify-between">
                    <button
                      onClick={() => handleRemove(item.idPublicacion)}
                      className="text-red-500 hover:cursor-pointer hover:scale-110 transition-all duration-150 text-sm font-medium"
                      title="Eliminar del carrito"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleCheckout(item.idPublicacion)}
                      className="px-4 py-2 text-green-600 hover:cursor-pointer hover:scale-110 transition-all duration-150 rounded-lg text-sm font-medium"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con total y acciones */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total estimado:</span>
                <span className="text-2xl font-bold text-paleta1-blue">
                  ${total.toLocaleString()} <span className="text-sm font-normal text-gray-500">ARS</span>
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckoutAll}
                  className="flex-1 py-3 bg-paleta1-blue hover:bg-paleta1-blue-light text-white rounded-lg transition-all duration-300 font-medium cursor-pointer"
                >
                  Comprar Todo
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
              >
                Seguir Explorando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrito;