import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

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
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Usuarios</h2>
                        <p className="text-gray-600">Ver todos los usuarios, sus datos completos, publicaciones y eliminar usuarios</p>
                        <div className="mt-4 text-paleta1-blue font-semibold">
                            Gestionar Usuarios →
                        </div>
                    </Link>

                    {/* Gestión de Publicaciones */}
                    <Link 
                        to="/admin/publicaciones" 
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Publicaciones</h2>
                        <p className="text-gray-600">Ver todas las publicaciones del sistema y eliminar las que sean necesarias</p>
                        <div className="mt-4 text-paleta1-blue font-semibold">
                            Gestionar Publicaciones →
                        </div>
                    </Link>

                    {/* Gestión de Comentarios */}
                    <Link 
                        to="/admin/comentarios" 
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Comentarios</h2>
                        <p className="text-gray-600">Moderar y eliminar comentarios inapropiados de las publicaciones</p>
                        <div className="mt-4 text-paleta1-blue font-semibold">
                            Gestionar Comentarios →
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
