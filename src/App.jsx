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

function App() {
  return (
    <>
      <Navbar />
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
          path="/mis-transacciones" 
          element={
            <ProtectedRoute>
              <TransaccionList />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
