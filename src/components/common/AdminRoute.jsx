import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { isAdmin } from '../../utils/roleUtils';

/**
 * Componente para proteger rutas que requieren rol de ADMIN
 * Redirige a home si no está autenticado o no es admin
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Si no está autenticado, redirigir al home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado pero no es admin, redirigir al home
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, mostrar el contenido
  return children;
};

export default AdminRoute;
