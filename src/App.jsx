import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import PublicacionList from './components/publicaciones/PublicacionList'
import PublicacionForm from './components/publicaciones/PublicacionForm'
import Publicacion from './components/publicaciones/Publicacion'
import TransaccionForm from './components/transacciones/TransaccionForm'
import TransaccionList from './components/transacciones/TransaccionList'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import UsuarioPerfil from './components/usuario/UsuarioPerfil'
import UsuarioActualizacion from './components/usuario/UsuarioActualizacion'
import CambioContraseña from './components/usuario/CambioContraseña'
import UsuarioPublicaciones from './components/usuario/UsuarioPublicaciones'
import UsuarioTransacciones from './components/usuario/UsuarioTransacciones'
import AdminDashboard from './views/AdminDashboard'
import UsuariosAdmin from './components/admin/UsuariosAdmin'
import PublicacionesAdmin from './components/admin/PublicacionesAdmin'
import TransaccionesAdmin from './components/admin/TransaccionesAdmin'
import AutosAdmin from './components/admin/AutosAdmin'
import ComentariosAdmin from './components/admin/ComentariosAdmin'

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<PublicacionList />} />
          <Route path="/publicaciones" element={<PublicacionList />} />
          <Route path="/publicacion/:id" element={<Publicacion />} />
          <Route path="/crear-publicacion" element={<PublicacionForm />} />
          <Route 
            path="/comprar/:id" 
            element={
              <ProtectedRoute>
                <TransaccionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comprar-carrito" 
            element={
              <ProtectedRoute>
                <TransaccionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mis-transacciones" 
            element={
              <ProtectedRoute>
                <TransaccionList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <UsuarioPerfil />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/actualizar" 
            element={
              <ProtectedRoute>
                <UsuarioActualizacion />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/cambiar-contraseña" 
            element={
              <ProtectedRoute>
                <CambioContraseña />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/publicaciones" 
            element={
              <ProtectedRoute>
                <UsuarioPublicaciones />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/transacciones" 
            element={
              <ProtectedRoute>
                <UsuarioTransacciones />
              </ProtectedRoute>
            } 
          />

          {/* Rutas de administración */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/usuarios" 
            element={
              <AdminRoute>
                <UsuariosAdmin />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/publicaciones" 
            element={
              <AdminRoute>
                <PublicacionesAdmin />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/transacciones" 
            element={
              <AdminRoute>
                <TransaccionesAdmin />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/autos" 
            element={
              <AdminRoute>
                <AutosAdmin />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/comentarios" 
            element={
              <AdminRoute>
                <ComentariosAdmin />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
