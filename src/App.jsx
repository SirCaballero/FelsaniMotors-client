import React from 'react'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import PublicacionList from './components/publicaciones/PublicacionList'
import PublicacionForm from './components/publicaciones/PublicacionForm'
import ComentarioList from './components/comentarios/ComentarioList'
// import TailwindMockTest from './views/TailwindMockTest'

function App() {
  return (
    <>
      {/* Cambia entre ComponentsDemo y TailwindMockTest según necesites */}
      {/*<ComponentsDemo />*/}
      {/* <TailwindMockTest /> */}
      <Navbar />
      <PublicacionList />
      <PublicacionForm />
      <ComentarioList idPublicacion={1} />
      <Footer />
    </>
  )
}

export default App
