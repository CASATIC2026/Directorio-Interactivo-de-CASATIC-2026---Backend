# Plan para ejecutar el backend correctamente

1. Navega a la carpeta backend desde la raíz del proyecto:
   ```powershell
   cd casatic-directorio\backend
   ```

2. Luego navega a la carpeta del proyecto API:
   ```powershell
   cd src\CasaticDirectorio.Api
   ```

3. Ejecuta el backend:
   ```powershell
   dotnet run
   ```

4. Verifica que el backend esté corriendo correctamente. Deberías ver un mensaje como:
   > 🚀 Directorio Interactivo CASATIC 2026 iniciado

5. Si hay errores de puerto en uso, libera el puerto 5000 antes de volver a intentar.

6. Una vez iniciado, prueba la API accediendo a http://localhost:5000 en tu navegador o usando Postman para confirmar que responde.

---

Este plan asegura que el backend .NET se ejecute desde la ruta correcta y esté listo para recibir peticiones del frontend.
