# Vigilium Frontend

**Vigilium** es un sistema inteligente de monitoreo para dispositivos de seguridad y eventos críticos. Este repositorio contiene el frontend de la aplicación, desarrollado con **Next.js**, **Tailwind CSS** y **Heroicons**. También se utiliza **Cloudinary** para optimizar las imágenes de la landing page.

## 🚀 Tecnologías Utilizadas

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Cloudinary](https://cloudinary.com/)
- [Framer Motion](https://www.framer.com/motion/) – para animaciones fluidas
- `localStorage` – manejo del token JWT

## 📁 Estructura del Proyecto
├── components/ # Componentes reutilizables (Navbar, Cards, Forms, etc.) 
├── pages/ # Rutas del frontend (login, dashboard, etc.) 
├── public/ # Archivos estáticos (logo, iconos) 
├── styles/ # Archivos CSS globales (Tailwind) 
├── utils/ # Configuración global (auth, API URL, etc.) 
└── .env.local # Variables de entorno
## 🧠 Funcionalidades principales

- **Autenticación con JWT**
- **Redirección automática según rol** (`admin`, `técnico`, `monitorista`, `supervisor`)
- **Dashboard dinámico** con KPIs y alertas
- **Landing informativa** con misión, visión, valores e imágenes en Cloudinary
- **Gestión de usuarios, dispositivos, eventos, clientes y fallas**
- **Responsivo y optimizado para móvil**

## 🌐 Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

## env
NEXT_PUBLIC_API_URL=https://vigiliumbd-production.up.railway.app
Esta variable apunta al backend en Railway.

## ⚙️ Comandos disponibles
Comando	Descripción
npm install	Instala dependencias
npm run dev	Inicia el entorno de desarrollo (localhost:3000)
npm run build	Compila para producción
npm run start	Inicia el servidor en producción

## 🖼️ Imágenes
Todas las imágenes de la landing page se cargan desde Cloudinary para optimizar su tamaño y velocidad. Se usan componentes <Image /> de Next.js para mejorar el rendimiento.

## 🔐 Control de Acceso
El sistema restringe rutas según el rol del usuario.
El login es la única ruta pública (/login).
El componente withAuth protege las rutas privadas.

## ✍️ Autores
Desarrollado por el equipo de monitoreo y desarrollo de seguridad de Vigilium..

Colaboraciones por Sensei @KiraBelak.







