import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import { AuthContext } from './context/AuthContext'
import PublicacionList from './components/publicaciones/PublicacionList'
import PublicacionForm from './components/publicaciones/PublicacionForm'
import Publicacion from './components/publicaciones/Publicacion'
import PublicacionEditar from './components/publicaciones/PublicacionEditar'
import TransaccionForm from './components/transacciones/TransaccionForm'
import TransaccionList from './components/transacciones/TransaccionList'
import UsuarioPerfil from './components/usuario/UsuarioPerfil'
import UsuarioActualizacion from './components/usuario/UsuarioActualizacion'
import CambioContraseña from './components/usuario/CambioContraseña'
import UsuarioPublicaciones from './components/usuario/UsuarioPublicaciones'
import UsuarioTransacciones from './components/usuario/UsuarioTransacciones'
import AdminDashboard from './components/admin/AdminDashboard'
import UsuariosAdmin from './components/admin/UsuariosAdmin'
import PublicacionesAdmin from './components/admin/PublicacionesAdmin'
import ComentariosAdmin from './components/admin/ComentariosAdmin'
import FAQ from './components/common/FAQ'

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  const protectedElement = (element) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  const adminElement = (element) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    if (user?.rol !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <Routes>

          {/* Rutas any */}
          <Route path="/" element={<PublicacionList />} />
          <Route path="/publicaciones" element={<PublicacionList />} />
          <Route path="/publicacion/:id" element={<Publicacion />} />
          <Route path="/crear-publicacion" element={<PublicacionForm />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Rutas de user */}
          <Route path="/editar-publicacion/:id" element={protectedElement(<PublicacionEditar />)} />
          <Route path="/comprar-carrito" element={protectedElement(<TransaccionForm />)} />
          <Route path="/mis-transacciones" element={protectedElement(<TransaccionList />)} />
          <Route path="/perfil" element={protectedElement(<UsuarioPerfil />)} />
          <Route path="/perfil/actualizar" element={protectedElement(<UsuarioActualizacion />)} />
          <Route path="/perfil/cambiar-contraseña" element={protectedElement(<CambioContraseña />)} />
          <Route path="/perfil/publicaciones" element={protectedElement(<UsuarioPublicaciones />)} />
          <Route path="/perfil/transacciones" element={protectedElement(<UsuarioTransacciones />)} />

          {/* Rutas de admin */}
          <Route path="/admin" element={adminElement(<AdminDashboard />)} />
          <Route path="/admin/usuarios" element={adminElement(<UsuariosAdmin />)} />
          <Route path="/admin/publicaciones" element={adminElement(<PublicacionesAdmin />)} />
          <Route path="/admin/comentarios" element={adminElement(<ComentariosAdmin />)} />
          
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
