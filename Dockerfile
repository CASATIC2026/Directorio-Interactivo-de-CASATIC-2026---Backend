# ── Build Stage ────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar solución y proyectos
COPY backend/CasaticDirectorio.sln .
COPY backend/src/CasaticDirectorio.Domain/CasaticDirectorio.Domain.csproj src/CasaticDirectorio.Domain/
COPY backend/src/CasaticDirectorio.Infrastructure/CasaticDirectorio.Infrastructure.csproj src/CasaticDirectorio.Infrastructure/
COPY backend/src/CasaticDirectorio.Api/CasaticDirectorio.Api.csproj src/CasaticDirectorio.Api/

RUN dotnet restore

COPY backend/src/ src/
WORKDIR /src/src/CasaticDirectorio.Api
RUN dotnet publish -c Release -o /app/publish

# ── Runtime Stage ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "CasaticDirectorio.Api.dll"]
