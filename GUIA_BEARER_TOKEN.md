# Guía de Implementación de Bearer Token

## Patrón a seguir en cada archivo

### 1. Importaciones necesarias

```javascript
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
```

### 2. Dentro del componente

```javascript
const MiComponente = () => {
    // Acceder al contexto para verificar autenticación (opcional)
    const { isAuthenticated, user } = useContext(AuthContext);

    // Función que hace fetch a endpoint protegido
    const hacerPeticion = () => {
        // Crear headers con Bearer token
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        // Hacer la petición
        fetch('http://localhost:4002/api/endpoint-protegido', {
            method: 'POST', // o GET, PUT, DELETE
            headers: headers,
            body: JSON.stringify(datos) // si es POST/PUT
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Éxito:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
};
```

---

## Ejemplos específicos por tipo de petición

### GET (Obtener datos protegidos)

```javascript
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const MisPublicaciones = () => {
    const { user } = useContext(AuthContext);

    const obtenerPublicaciones = () => {
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        fetch(`http://localhost:4002/api/usuarios/${user.id}/publicaciones`, {
            method: 'GET',
            headers: headers
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Publicaciones:', data);
        });
    };

    return <button onClick={obtenerPublicaciones}>Ver mis publicaciones</button>;
};
```

### POST (Crear recurso protegido)

```javascript
import authService from '../../services/authService';

const CrearAuto = () => {
    const crearAuto = (autoData) => {
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        fetch('http://localhost:4002/api/autos', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(autoData)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Auto creado:', data);
        });
    };

    return <button onClick={() => crearAuto({ marca: 'Ford', modelo: 'Fiesta' })}>Crear</button>;
};
```

### PUT (Actualizar recurso protegido)

```javascript
import authService from '../../services/authService';

const EditarPublicacion = () => {
    const actualizarPublicacion = (id, datosActualizados) => {
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        fetch(`http://localhost:4002/api/publicaciones/${id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(datosActualizados)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Publicación actualizada:', data);
        });
    };

    return <button onClick={() => actualizarPublicacion(1, { precio: 15000 })}>Actualizar</button>;
};
```

### DELETE (Eliminar recurso protegido)

```javascript
import authService from '../../services/authService';

const EliminarPublicacion = () => {
    const eliminarPublicacion = (id) => {
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        fetch(`http://localhost:4002/api/publicaciones/${id}`, {
            method: 'DELETE',
            headers: headers
        })
        .then((response) => {
            if (response.ok) {
                console.log('Publicación eliminada');
            }
        });
    };

    return <button onClick={() => eliminarPublicacion(1)}>Eliminar</button>;
};
```

### FormData (Subir archivos con autenticación)

```javascript
import authService from '../../services/authService';

const SubirFoto = () => {
    const subirFoto = (archivo) => {
        const formData = new FormData();
        formData.append('file', archivo);

        // IMPORTANTE: NO agregar Content-Type con FormData
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        // NO hacer: headers.append('Content-Type', 'multipart/form-data')

        fetch('http://localhost:4002/api/fotos', {
            method: 'POST',
            headers: headers,
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Foto subida:', data);
        });
    };

    return <input type="file" onChange={(e) => subirFoto(e.target.files[0])} />;
};
```

---

## Resumen - Checklist por archivo

### ✅ Paso 1: Importar authService
```javascript
import authService from '../../services/authService';
```

### ✅ Paso 2: (Opcional) Importar AuthContext si necesitas datos del usuario
```javascript
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
const { user, isAuthenticated } = useContext(AuthContext);
```

### ✅ Paso 3: Crear headers con Bearer token en cada fetch
```javascript
const token = authService.getToken();
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', `Bearer ${token}`);
```

### ✅ Paso 4: Usar los headers en fetch
```javascript
fetch(url, { 
    method: 'POST', 
    headers: headers, 
    body: JSON.stringify(data) 
})
```

---

## Notas importantes

🔴 **NO agregar Content-Type** cuando uses FormData (archivos)  
🟢 **SÍ agregar Content-Type: application/json** para JSON  
🟢 **Siempre agregar** `Authorization: Bearer ${token}` para endpoints protegidos

---

## Endpoints públicos vs protegidos

### Públicos (NO requieren Bearer token)
- `POST /api/v1/auth/authenticate` - Login
- `POST /api/v1/auth/register` - Registro
- `GET /api/publicaciones` - Ver todas las publicaciones (puede ser público)

### Protegidos (SÍ requieren Bearer token)
- `GET /api/usuarios/{id}/publicaciones` - Mis publicaciones
- `POST /api/autos` - Crear auto
- `POST /api/publicaciones` - Crear publicación
- `PUT /api/publicaciones/{id}` - Actualizar publicación
- `DELETE /api/publicaciones/{id}` - Eliminar publicación
- `POST /api/publicaciones/{id}/fotos` - Subir fotos

---

## Estructura del proyecto

```
src/
├── services/
│   └── authService.js          # Manejo de tokens y localStorage
├── context/
│   ├── AuthContext.js          # Definición del contexto
│   └── AuthContext.jsx         # Provider del contexto
├── components/
│   ├── usuario/
│   │   ├── LogInPopup.jsx      # Login (usa AuthContext)
│   │   └── SignInPopup.jsx     # Registro (usa AuthContext)
│   ├── common/
│   │   ├── Navbar.jsx          # Muestra estado auth (usa AuthContext)
│   │   └── ProtectedRoute.jsx  # Protege rutas (usa AuthContext)
│   └── publicaciones/
│       └── PublicacionForm.jsx # Crea publicación (usa authService)
└── main.jsx                    # Envuelve app con AuthProvider
```

---

## Flujo completo de autenticación

1. **Usuario hace login** → `LogInPopup.jsx`
2. **Backend devuelve token** → Guardado en `localStorage` vía `authService`
3. **AuthContext actualiza estado** → `isAuthenticated = true`, `user = userData`
4. **Navbar se actualiza** → Muestra nombre de usuario
5. **Peticiones protegidas** → Incluyen `Authorization: Bearer ${token}`
6. **Backend valida token** → Procesa la petición
7. **Usuario hace logout** → Token eliminado, estado reseteado
