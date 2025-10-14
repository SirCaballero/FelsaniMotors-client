//Nico
import SearchBar from './SearchBar';
import { useState, useContext } from 'react';
import LogInPopup from '../usuario/LogInPopup';
import SignInPopup from '../usuario/SignInPopup';
import { AuthContext } from '../../context/AuthContext';
import cartService from '../../services/cartService';
import Cart from './Cart';

const Navbar = () => {
  const [visibleLogIn, setVisibleLogIn] = useState(false);
  const [visibleSignIn, setVisibleSignIn] = useState(false);
  const [cartVisible, setCartVisible] = useState(false); // Estado para mostrar/ocultar carrito
  const [cartCount, setCartCount] = useState(0); // Estado para el contador del carrito

    const [visibleLogIn, setVisibleLogIn] = useState(false)
    const [visibleSignIn, setVisibleSignIn] = useState(false)
    const { isAuthenticated, user, logout } = useContext(AuthContext);

  const openSignIn = () => {
    setVisibleLogIn(false);
    setVisibleSignIn(true);
  };

  const openLogIn = () => {
    setVisibleSignIn(false);
    setVisibleLogIn(true);
  };

    const handleLogout = () => {
        logout();
    }

    return(
        <header className="bg-paleta1-blue">

            {/** Division de componentes*/}
            <nav className="flex gap-5 px-8">

                {/** Logo */}
                <div className='hover:cursor-pointer self-center '>
                    <img src='/src/assets/Logo_Felsani_Motors_Page.png' className="h-28"/>
                </div>

          {/* SearchBar */}
          <div className="grow ">
            <SearchBar />   
          </div>

          <div className='flex items-center gap-3'>

                    {/** CrearPublicacion */}
                    <div className="relative group">
                        <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                            <button className='text-white hover:cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Crear Publicación
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>

                    {/** Publicaciones del usuario */}
                    <div className="relative group">
                        <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                            <button className="text-white hover:cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                            </button>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Mis Publicaciones
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>

            {/* Carrito de compras */}
            <div className="relative group">
              <div 
                className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out relative"
                onClick={toggleCart} 
              >
                <button className="text-white hover:cursor-pointer relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {/* Badge con contador */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Carrito ({cartCount})
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>

            {/* Perfil */}
            {!isAuthenticated ? (
              // Si NO está autenticado, mostrar botón de login
              <div className="relative group" onClick={() => { setVisibleLogIn(true); }}>
                <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                  <button className="text-white hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </button>
                </div>
                {visibleLogIn && <LogInPopup 
                  close={() => { setVisibleLogIn(false); }} 
                  openSignIn={() => { openSignIn(); }}
                />}
                {visibleSignIn && <SignInPopup 
                  close={() => { setVisibleSignIn(false); }}
                  openLogIn={() => { openLogIn(); }}
                />}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Iniciar Sesión
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            ) : (
              // Si SÍ está autenticado, mostrar nombre y logout
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">
                  Hola, {user?.firstname || user?.email}
                </span>
                <div className="relative group">
                  <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                    <button 
                      className="text-white hover:cursor-pointer"
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                    </button>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Cerrar Sesión
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Render del modal del carrito */}
      <Cart 
        isOpen={cartVisible} 
        onClose={() => setCartVisible(false)} 
        updateCartCount={updateCartCount} 
      />
    </>
  );
};

export default Navbar;
