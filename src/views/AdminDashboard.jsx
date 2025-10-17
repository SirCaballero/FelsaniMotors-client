import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
                    <p className="text-gray-600">Bienvenido, {user?.nombre} {user?.apellido}</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    
                    {/* Gestión de Usuarios */}
                    <Link 
                        to="/admin/usuarios" 
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold ml-3 text-gray-800">Usuarios</h2>
                        </div>
                        <p className="text-gray-600">Ver todos los usuarios, sus datos completos, publicaciones y eliminar usuarios</p>
                        <div className="mt-4 flex items-center text-blue-600 font-semibold">
                            <span>Gestionar Usuarios</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Gestión de Publicaciones */}
                    <Link 
                        to="/admin/publicaciones" 
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold ml-3 text-gray-800">Publicaciones</h2>
                        </div>
                        <p className="text-gray-600">Ver todas las publicaciones del sistema y eliminar las que sean necesarias</p>
                        <div className="mt-4 flex items-center text-green-600 font-semibold">
                            <span>Gestionar Publicaciones</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Gestión de Comentarios */}
                    <Link 
                        to="/admin/comentarios" 
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-purple-500"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold ml-3 text-gray-800">Comentarios</h2>
                        </div>
                        <p className="text-gray-600">Moderar y eliminar comentarios inapropiados de las publicaciones</p>
                        <div className="mt-4 flex items-center text-purple-600 font-semibold">
                            <span>Gestionar Comentarios</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
