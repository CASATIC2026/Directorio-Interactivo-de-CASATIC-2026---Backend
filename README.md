# Directorio Interactivo CASATIC 2026

Sistema completo de directorio de socios para CASATIC con portal público, backoffice administrativo y reportería.

## Stack Tecnológico

| Capa            | Tecnología                                |
|-----------------|-------------------------------------------|
| Backend         | .NET 8 Web API (C#)                       |
| ORM             | Entity Framework Core 8                   |
| Base de datos   | PostgreSQL 16 (Full-Text Search + GIN)    |
| Frontend        | React 18 + Tailwind CSS + Lucide React    |
| Auth            | JWT Bearer Tokens                         |
| Logging         | Serilog (Console + File)                  |
| Documentación   | Swagger / OpenAPI                         |
| Contenedores    | Docker + docker-compose                   |

## Estructura del Proyecto

```
casatic-directorio/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── CasaticDirectorio.sln
│   ├── Dockerfile
│   └── src/
│       ├── CasaticDirectorio.Domain/          # Entidades, Enums, Interfaces
│       ├── CasaticDirectorio.Infrastructure/   # DbContext, Repositories, Seed
│       └── CasaticDirectorio.Api/             # Controllers, DTOs, Services
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── api/           # Cliente Axios
        ├── context/       # AuthContext (JWT)
        ├── components/    # Layouts
        └── pages/         # Public + Admin
```

## Instalación y Ejecución

### Opción 1: Docker Compose (recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd casatic-directorio

# Levantar todos los servicios
docker-compose up --build

# Acceder:
# Frontend: http://localhost:3000
# API:      http://localhost:5000
# Swagger:  http://localhost:5000/swagger
```

### Opción 2: Ejecución Local

#### Requisitos previos
- .NET 8 SDK
- Node.js 20+
- PostgreSQL 16+

#### Base de datos

```sql
CREATE USER casatic WITH PASSWORD 'casatic2026';
CREATE DATABASE casatic_directorio OWNER casatic;
```

#### Backend

```bash
cd backend/src/CasaticDirectorio.Api

# Restaurar paquetes
dotnet restore

# Aplicar migraciones (primera vez: crear migración inicial)
dotnet ef migrations add Init --project ../CasaticDirectorio.Infrastructure
dotnet ef database update --project ../CasaticDirectorio.Infrastructure

# Ejecutar
dotnet run
# API en: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo (proxy a localhost:5000)
npm run dev
# Frontend en: http://localhost:5173
```

## Credenciales de Prueba

| Rol   | Email              | Contraseña | Notas                    |
|-------|--------------------|------------|--------------------------|
| Admin | admin@casatic.org  | Admin123!  | Acceso total             |
| Socio | contacto@*         | Socio123!  | Primer login → cambiar   |

## Endpoints Principales (API)

### Públicos (sin auth)

| Método | Ruta                              | Descripción                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/api/directorio`                 | Buscar socios (paginado + FTS)       |
| GET    | `/api/directorio/socio/{slug}`    | Micro-sitio por slug                 |
| GET    | `/api/directorio/company/{id}`    | Micro-sitio por ID                   |
| GET    | `/api/directorio/especialidades`  | Listar especialidades únicas         |
| POST   | `/api/formulariocontacto/{socioId}` | Enviar formulario de contacto      |
| GET    | `/api/directorio/servicios`         | Listar servicios únicos             |

### Autenticación

| Método | Ruta                          | Descripción                          |
|--------|-------------------------------|--------------------------------------|
| POST   | `/api/auth/login`             | Login → JWT                          |
| POST   | `/api/auth/cambiar-password`  | Cambiar contraseña (primer login)    |
| GET    | `/api/auth/me`                | Perfil del usuario autenticado       |

### Admin (requiere JWT + rol Admin)

| Método | Ruta                                           | Descripción                  |
|--------|-------------------------------------------------|------------------------------|
| GET    | `/api/socios`                                  | Listar todos los socios       |
| POST   | `/api/socios`                                  | Crear socio                   |
| PUT    | `/api/socios/{id}`                             | Actualizar socio              |
| DELETE | `/api/socios/{id}`                             | Eliminar socio                |
| PATCH  | `/api/socios/{id}/toggle-habilitado`           | Toggle habilitado             |
| PATCH  | `/api/socios/{id}/estado-financiero?estado=X`  | Cambiar estado financiero     |
| GET    | `/api/usuarios`                                | Listar usuarios               |
| POST   | `/api/usuarios`                                | Crear usuario (pwd genérica)  |
| PATCH  | `/api/usuarios/{id}/toggle-activo`             | Toggle activo                 |
| GET    | `/api/reportes/dashboard`                      | Dashboard de métricas         |
| GET    | `/api/reportes/busquedas`                      | Historial de búsquedas        |
| GET    | `/api/reportes/formularios`                    | Formularios recibidos         |

### Socio (requiere JWT + rol Socio)

| Método | Ruta                  | Descripción                              |
|--------|----------------------|------------------------------------------|
| GET    | `/api/miempresa`     | Ver información de mi empresa             |
| PUT    | `/api/miempresa`     | Actualizar información de mi empresa      |

## Parámetros de Búsqueda (Directorio)

```
GET /api/directorio?query=cloud&especialidad=DevOps&servicio=Consultor%C3%ADa&page=1&pageSize=12
```

| Parámetro      | Tipo   | Descripción                                    |
|----------------|--------|------------------------------------------------|
| `query`        | string | Texto para Full-Text Search (PostgreSQL FTS)   |
| `especialidad` | string | Filtrar por especialidad exacta                |
| `servicio`     | string | Filtrar por servicio exacto                    |
| `page`         | int    | Número de página (default: 1)                  |
| `pageSize`     | int    | Resultados por página (default: 12)            |

## Funcionalidades Clave

### Primer Login
Los usuarios socio se crean con contraseña genérica `Socio123!`. Al iniciar sesión por primera vez, el sistema fuerza el cambio de contraseña.

### Estado Financiero y Habilitación
- Socios **en mora** se deshabilitan automáticamente.
- Un socio deshabilitado **no aparece** en el directorio público ni en su micro-sitio.

### Full-Text Search
PostgreSQL `tsvector` con índice GIN sobre `NombreEmpresa` y `Descripcion` usando el diccionario `spanish`.

### Logging de Actividad
Se registran: búsquedas, visitas a micro-sitios, logins, envío de formularios y operaciones CRUD.

### Marcas que Representa
Cada socio puede registrar las marcas que representa (máx. 50 palabras). Se muestra en el micro-sitio público.

### Validaciones de Contenido
- **Descripción**: máximo 150 palabras.
- **Especialidades**: máximo 10 palabras por especialidad.
- **Marcas que representa**: máximo 50 palabras.

### Gestión por Socio
Los usuarios con rol Socio pueden editar la información de su propia empresa a través del endpoint `/api/miempresa` y la sección "Mi Empresa" en el backoffice.

## Conventional Commits (ejemplos)

```
feat: agregar búsqueda por especialidad en directorio
fix: corregir validación de email en formulario de contacto
docs: actualizar README con endpoints de reportería
refactor: extraer lógica de JWT a servicio dedicado
chore: actualizar dependencias de EF Core a 8.0.11
```

## Gitflow

```
main          ← producción estable
  └── develop ← integración
       ├── feature/busqueda-fts
       ├── feature/dashboard-admin
       ├── fix/primer-login-redirect
       └── release/1.0.0
```

## Autores

| Integrante          | Rol                      |
|---------------------|--------------------------|
| [Nombre Integrante 1] | Backend Lead             |
| [Nombre Integrante 2] | Backend Lead             |
| [Nombre Integrante 3] | Frontend Admin/Web       |
| [Nombre Integrante 4] | Frontend Cliente/Móvil   |
| [Nombre Integrante 5] | DevOps & QA              |

## Licencia

Uso interno CASATIC © 2026
