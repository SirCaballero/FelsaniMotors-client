import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';

// Provider que envuelve la app y provee el estado de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la app, verificar si hay un token guardado
  useEffect(() => {
    const inicializarAuth = () => {
        const token = authService.getToken();
        const userData = authService.getUserData();
        if (token) {
            setIsAuthenticated(true);
            setUser(userData);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    inicializarAuth();
  }, []);

  // Función de login
  const login = (email, password) => {
    let authToken;
    
    return authService.login(email, password)
      .then((data) => {
        authToken = data.access_token;

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${authToken}`);
        
        return fetch('http://localhost:4002/api/usuarios/me', {
          method: 'GET',
          headers: headers }) })
      .then((response) => {
        if (!response.ok) { throw new Error('Error al obtener datos del usuario') }
        return response.json() })
      .then((userFromApi) => {
        // Crear objeto de usuario con los datos del backend
        const userData = {
          idUsuario: userFromApi.idUsuario,
          email: userFromApi.email,
          nombre: userFromApi.nombre,
          apellido: userFromApi.apellido,
          telefono: userFromApi.telefono,
          rol: userFromApi.rol
        };
        
        authService.setUserData(userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: userData };
      })
      .catch((error) => {
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, error: error.message };
      });
  };

  // Función de registro
  const register = (email, password, firstname, lastname, telefono, role = 'USER') => {
    let authToken;
    
    return authService.register(email, password, firstname, lastname, telefono, role)
      .then((data) => {
        // Guardar el token
        authToken = data.access_token;
        
        // Hacer segundo request para obtener datos del usuario autenticado
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${authToken}`);
        
        return fetch('http://localhost:4002/api/usuarios/me', {
          method: 'GET',
          headers: headers
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }
        return response.json();
      })
      .then((userFromApi) => {
        // Crear objeto de usuario con los datos del backend
        const userData = {
          idUsuario: userFromApi.idUsuario,
          email: userFromApi.email,
          nombre: userFromApi.nombre,
          apellido: userFromApi.apellido,
          telefono: userFromApi.telefono,
          rol: userFromApi.rol
        };
        
        authService.setUserData(userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: userData };
      })
      .catch((error) => {
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, error: error.message };
      });
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Actualizar datos del usuario
  const updateUser = (userData) => {
    authService.setUserData(userData);
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
