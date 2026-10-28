# Agromarket Backend

API REST para la plataforma web Agromarket, desarrollada con ASP.NET Core y PostgreSQL.

## Tecnologías

- ASP.NET Core .NET 10
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Swagger / OpenAPI

## Arquitectura

El backend está dividido en cuatro proyectos:

- `Agromarket.Api`: controladores, autenticación HTTP y configuración.
- `Agromarket.Application`: DTOs, interfaces y contratos de aplicación.
- `Agromarket.Domain`: entidades y reglas principales del dominio.
- `Agromarket.Infrastructure`: Entity Framework Core, PostgreSQL, autenticación y servicios.

## Requisitos

Para ejecutar el proyecto se necesita:

- .NET SDK 10
- PostgreSQL
- Git

## Base de datos

Crear una base PostgreSQL llamada:

`agromarket`

Configuración local recomendada:

- Host: localhost
- Port: 5432
- Database: agromarket
- Username: postgres

## Configuración de secretos

El proyecto utiliza .NET User Secrets para datos sensibles.

Inicializar:

```powershell
dotnet user-secrets init --project Agromarket.Api