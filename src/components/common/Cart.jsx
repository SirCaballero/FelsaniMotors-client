import { useState, useEffect } from 'react';
import cartService from '../../services/cartService';        

const Cart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const items = cartService.getCart();
      setCartItems(items);
      setTotal(cartService.calculateTotal());
    }

    const idOwnerConDescuento = 1;
      const DESCUENTO_OWNER = 0.10;

      const itemsConDescuento = items.map(item => {
        if (item.idOwner === idOwnerConDescuento) {
          return {
            ...item,
            precioConDescuento: item.precio - (item.precio * DESCUENTO_OWNER),
          };
        }
        return { ...item, precioConDescuento: item.precio };
      });

      setCartItems(itemsConDescuento);

      const totalCalculado = itemsConDescuento.reduce(
        (acc, item) => acc + (item.precioConDescuento * (item.quantity || 1)),
        0
      );
      setTotal(totalCalculado);
    

  }, [isOpen]);

  const handleRemove = (idPublicacion) => {
    const updatedCart = cartService.removeFromCart(idPublicacion);
    setCartItems(updatedCart);
    setTotal(cartService.calculateTotal());
  };

  const handleClear = () => {
    cartService.clearCart();
    setCartItems([]);
    setTotal(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Carrito de Compras</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">El carrito está vacío</p>
        ) : (
          <>
            <ul className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <li key={item.idPublicacion} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-sm text-gray-600">{item.marcaAuto} {item.modeloAuto}</p>
                    <p className="text-sm">
                      {item.precioConDescuento !== item.precio ? (
                        <>
                          <span className="line-through text-gray-500 mr-1">
                            ${item.precio}
                          </span>
                          <span className="text-green-700 font-semibold">
                            ${item.precioConDescuento} (-{Math.round(item.descuento * 100)}%)
                          </span>
                        </>
                      ) : (
                        <>${item.precio}</>
                      )}
                      {" "}ARS x {item.quantity || 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${(item.precio * (item.quantity || 1)).toLocaleString()}</span>
                    <button
                      onClick={() => handleRemove(item.idPublicacion)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4">
              <p className="text-lg font-bold">Total: ${total.toLocaleString()} ARS</p>
              <button
                onClick={handleClear}
                className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Vaciar Carrito
              </button>
              
              <button className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Proceder al Pago
              </button>
            </div>
            
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
