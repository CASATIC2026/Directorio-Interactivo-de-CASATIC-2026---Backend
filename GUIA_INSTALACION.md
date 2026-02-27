# Guía de Instalación — Directorio Interactivo CASATIC 2026

Pasos para que cualquier integrante del equipo pueda clonar y ejecutar el proyecto completo desde cero.

---

## Requisitos Previos

Instalar las siguientes herramientas antes de continuar:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|----------|
| Git | 2.x | https://git-scm.com/downloads |
| Docker Desktop | 4.x | https://www.docker.com/products/docker-desktop |

> **Importante:** Docker Desktop debe estar **corriendo** antes de ejecutar cualquier comando.  
> En Windows, verificar que aparezca el ícono de la ballena en la barra de tareas.

---

## Paso 1 — Clonar el Repositorio Principal

```bash
git clone https://github.com/CASATIC2026/Directorio-Interactivo-de-CASATIC-2026---Backend.git casatic-directorio
cd casatic-directorio
```

---

## Paso 2 — Obtener el Submódulo del Backend

El backend está configurado como submódulo de Git. Ejecutar:

```bash
git submodule update --init --recursive
```

Luego cambiar a la rama `desarrollo` dentro del backend:

```bash
cd backend
git checkout desarrollo
git pull origin desarrollo
cd ..
```

---

## Paso 3 — Verificar la Estructura de Carpetas

Asegurarse de que el proyecto tenga esta estructura antes de continuar:

```
casatic-directorio/
├── docker-compose.yml
├── GUIA_INSTALACION.md
├── README.md
├── backend/
│   ├── CasaticDirectorio.sln
│   ├── Dockerfile
│   └── src/
│       ├── CasaticDirectorio.Api/
│       ├── CasaticDirectorio.Domain/
│       └── CasaticDirectorio.Infrastructure/
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
```

Si la carpeta `backend/src/` está vacía, repetir el Paso 2.

---

## Paso 4 — Levantar Todo con Docker

Desde la carpeta raíz del proyecto (`casatic-directorio/`), ejecutar:

```bash
docker compose up --build -d
```

Este comando hace lo siguiente automáticamente:
- Descarga la imagen de **PostgreSQL 16**
- Compila y levanta la **API .NET**
- Compila y levanta el **Frontend React** con Nginx
- Crea la base de datos y aplica las migraciones

> La primera vez puede tardar **5 a 10 minutos** dependiendo de la conexión a internet.

---

## Paso 5 — Verificar que Todo Esté Corriendo

```bash
docker ps
```

Deberías ver los 3 contenedores activos:

```
NAMES               STATUS
casatic-frontend    Up X seconds
casatic-api         Up X seconds
casatic-db          Up X seconds (healthy)
```

Si algún contenedor no aparece, revisar los logs:

```bash
# Ver logs de la API
docker logs casatic-api --tail 50

# Ver logs del frontend
docker logs casatic-frontend --tail 30

# Ver logs de la base de datos
docker logs casatic-db --tail 30
```

---

## Paso 6 — Acceder a la Aplicación

| Servicio | URL |
|----------|-----|
| **Aplicación web** | http://localhost |
| **Swagger (documentación API)** | http://localhost:5000/swagger |
| **API directa** | http://localhost:5000/api |

---

## Credenciales por Defecto

Para ingresar al panel de administración (`http://localhost/admin`):

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `Admin123!` |

> Cambiar estas credenciales antes de desplegar en producción.

---

## Apagar el Proyecto

Para detener todos los contenedores sin eliminar los datos:

```bash
docker compose down
```

Para detener **y eliminar** la base de datos (datos perdidos):

```bash
docker compose down -v
```

---

## Actualizar el Código (cuando hay cambios nuevos)

```bash
# 1. Traer cambios del repositorio principal
git pull origin main

# 2. Actualizar el submódulo del backend
cd backend
git pull origin desarrollo
cd ..

# 3. Reconstruir y levantar
docker compose up --build -d
```

---

## Solución de Problemas Comunes

### Puerto 80 en uso
Otro programa está usando el puerto 80 (puede ser IIS, XAMPP, Skype, etc.).  
Detener ese servicio o cambiar el puerto en `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"   # Cambiar 80 por 8080 o cualquier puerto libre
```
Luego acceder en `http://localhost:8080`

### Puerto 5432 en uso
PostgreSQL local puede estar ocupando el puerto. Detenerlo con:
```bash
# Windows (PowerShell como Administrador)
Stop-Service -Name postgresql*
```

### Error "no space left on device"
Docker se quedó sin espacio. Limpiar imágenes y contenedores anteriores:
```bash
docker system prune -a
```

### La API no conecta a la base de datos
Esperar 20-30 segundos y reintentar. La API arranca antes de que PostgreSQL esté lista. Si el problema persiste:
```bash
docker compose restart api
```

### Cambios en el código no se reflejan
Reconstruir las imágenes forzando caché limpio:
```bash
docker compose up --build --force-recreate -d
```

---

## Contacto del Equipo

Para dudas técnicas, contactar al equipo de desarrollo del **Grupo B - CASATIC 2026**.
