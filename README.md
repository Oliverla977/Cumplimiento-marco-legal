
# Sistema de Cumplimiento Marco Legal

  

## Información del Proyecto

  

Este proyecto fue desarrollado por:

-  **Denilson Antonio Hi Ordoñez**

-  **José Humberto Chiquitá Cordero**

-  **Klelia Marianne Stewart de León**

-  **Luis René Quiñonez Gaitán**

-  **Oliver Eduardo López Arenas**

  

Para el curso de **Marco Legal y Regulatorio** de la **FACULTAD DE INGENIERÍA EN SISTEMAS DE INFORMACIÓN** - **PROGRAMA DE POSGRADOS** - **MAESTRÍA EN SEGURIDAD INFORMATÍCA**

  

Ingeniera a cargo: **Inga. Evelyn Yesenia Lobos Barrera**

  

---

  

## Descripción del Sistema

  

El Sistema de Cumplimiento Marco Legal es una sistema web construido con Angular 20 que implementa una arquitectura híbrida moderna para la gestión de cumplimiento normativo. La aplicación integra Firebase para autenticación y almacenamiento de evidencias, MySQL para datos estructurados, y Express.js para la lógica de negocio mediante procedimientos almacenados.

  

### Características Principales

  

-  **Autenticación Segura**: Sistema de login con email y contraseña mediante Firebase Authentication

-  **Gestión de Evidencias**: Almacenamiento seguro de archivos de cumplimiento en Firebase Storage

-  **API RESTful**: Backend Express.js con integración a base de datos MySQL

-  **Interfaz Moderna**: Diseño responsivo basado en CoreUI

-  **Arquitectura Escalable**: Separación clara de responsabilidades entre frontend, backend y servicios en la nube

  

---

  

## Arquitectura del Sistema

  

La aplicación utiliza una arquitectura híbrida que combina:

  

-  **Frontend**: Angular 20 + CoreUI

-  **Autenticación**: Firebase Authentication

-  **Almacenamiento**: Firebase Storage (evidencias) + MySQL (datos principales)

-  **Backend**: Express.js con procedimientos almacenados

-  **Base de Datos**: MySQL con stored procedures

  

Esta arquitectura permite escalabilidad automática en los servicios de Firebase mientras mantiene control completo sobre la lógica de negocio y datos críticos en el backend personalizado.

  

---

  

## Inicio Rápido

  

Clona el repositorio:

```bash

git  clone  https://github.com/Oliverla977/Cumplimiento-marco-legal.git

cd  Cumplimiento-marco-legal

```

  

## Requisitos del Sistema

  

### Requisitos Previos

  

Antes de comenzar, asegúrate de que tu entorno de desarrollo incluya las siguientes herramientas:

  

#### Node.js

[**Angular 20**](https://angular.io/guide/what-is-angular) requiere `Node.js` versión LTS `^20.19.0 || ^22.12.0 || ^24.0.0`.

  

- Para verificar tu versión actual: `node -v`

- Para obtener Node.js: [nodejs.org](https://nodejs.org/)

  

#### Angular CLI

Instala Angular CLI globalmente usando la terminal:

  

```bash

npm  install  -g  @angular/cli

```

  

#### Base de Datos MySQL
[**BD.sql**](https://github.com/Oliverla977/api-marco-legal/blob/main/BD.sql)
- MySQL versión 8.0 o superior

- Configuración de base de datos "Proyecto_Marco"

- Usuario con permisos para ejecutar procedimientos almacenados

  

#### Servicios Firebase

- Cuenta Firebase activa

- Proyecto configurado con Authentication habilitado

- Firebase Storage configurado

- Credenciales de configuración del proyecto

  

#### API y Variables de entorno
[**Repositorio de API**](https://github.com/Oliverla977/api-marco-legal)

La API Express requiere un archivo `.env` con las siguientes variables:

  

```env

DB_HOST=localhost

DB_USER=tu_usuario_mysql

DB_PASSWORD=tu_contraseña_mysql

DB_NAME=Proyecto_Marco

DB_PORT=3306

LOCAL_SERVER_URL=http://localhost:3000

PRODUCTION_SERVER_URL=tu_url_produccion

NODE_ENV=local

```

  
  

## Instalación

  

### 1. Instalación de Dependencias del Frontend

  

```bash

# Instalar dependencias del proyecto Angular

npm  install

  

# Actualizar dependencias a las versiones más recientes

npm  update

```

  

### 2. Configuración de Firebase

  

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)

2. Habilita Firebase Authentication con email/contraseña

3. Configura Firebase Storage con reglas de seguridad apropiadas

4. Obtén las credenciales de configuración y actualiza `src/environments/environment.ts`

  

### 3. Configuración de la Base de Datos

  

1. Instala MySQL 8.0+ en tu sistema

2. Crea la base de datos "Proyecto_Marco"

3. Ejecuta los scripts de creación de tablas y procedimientos almacenados

4. Configura las credenciales de acceso en el archivo `.env`

  
  

## Uso Básico

  

### Servidor de Desarrollo Frontend

  

```bash

# Servidor de desarrollo con recarga automática en http://localhost:4200

npm  start

  

# O alternativamente

ng  serve

```

  

Navega a [http://localhost:4200](http://localhost:4200). La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

  
  
  
  

## Desarrollo

  

### Servidor de Desarrollo

  

Para iniciar un servidor de desarrollo local:

  

```bash

ng  serve

```

  

Una vez que el servidor esté ejecutándose, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques cualquier archivo fuente.

  

### Generación de Código

  

Angular CLI incluye herramientas poderosas de scaffolding. Para generar un nuevo componente:

  

```bash

ng  generate  component  nombre-componente

```

  

Para ver la lista completa de esquemas disponibles (como `components`, `directives`, o `pipes`):

  

```bash

ng  generate  --help

```

  
  
  

## Construcción

  

Para construir el proyecto:

  

```bash

ng  build

```

  

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/`. Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

  

Para construcción con configuración específica:

  

```bash

# Construcción para desarrollo

ng  build  --configuration  development

  

# Construcción para producción

ng  build  --configuration  production

```

  

## Despliegue

  

### Frontend (Firebase Hosting)

  

```bash

# Instalar Firebase CLI

npm  install  -g  firebase-tools

  

# Inicializar Firebase en el proyecto

firebase  init  hosting

  

# Construir y desplegar

npm  run  build

firebase  deploy

```

  
  

---

  

## Seguridad

  

El sistema implementa múltiples capas de seguridad:

  

-  **Autenticación**: Tokens seguros mediante Firebase Authentication

-  **HTTPS Obligatorio**: Todas las comunicaciones encriptadas


-  **Procedimientos Almacenados**: Protección contra inyección SQL

-  **CORS Configurado**: Acceso restringido a dominios autorizados

  

---

  

## Licencia

  
Este proyecto fue desarrollado con fines académicos para el curso de Marco Legal y Regulatorio de la Facultad de Ingeniería en Sistemas de Información.