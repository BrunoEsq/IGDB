# 🎮 Game Tracker - Mi Colección de Juegos

Una aplicación web segura para gestionar y valorar tu colección de juegos. Completamente deployable en Vercel con protección de API keys.

## ✨ Características

- **Catálogo Seguro**: Busca juegos en IGDB sin exponer credentials
- **Sistema de Valoración**: Valora tus juegos del 0 al 10
- **Top 3 Histórico**: Ve tus mejores juegos completados
- **Almacenamiento Local**: Los datos se guardan en localStorage
- **Diseño Responsivo**: Interfaz moderna con Tailwind CSS

## 🔒 Seguridad

✅ **API Keys Protegidas**: Las credenciales IGDB están guardadas en el servidor, no en el cliente
✅ **Proxy Público Seguro**: Cualquiera puede usar el proxy, pero las API keys están encriptadas en Vercel
✅ **Validación Form**: Input sanitizado para prevenir inyecciones
✅ **CORS Abierto**: El proxy es público (pero seguro porque los secretos están en el servidor)
✅ **Headers de Seguridad**: Protección contra ataques comunes (XSS, clickjacking, etc.)

## 📋 Prerrequisitos

- Node.js 18.x o superior
- Cuenta en [Vercel](https://vercel.com)
- Credenciales IGDB (gratis en https://api.igdb.com/)

## 🚀 Setup Local

### 1. Clonar y configurar

```bash
git clone <tu-repo>
cd game-tracker
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y rellena tus credenciales:

```bash
cp .env.example .env.local
```

Abre `.env.local` y completa:

```env
# Ve a https://api.igdb.com/ para obtener estas credenciales
IGDB_CLIENT_ID=tu_client_id
IGDB_ACCESS_TOKEN=tu_access_token

# Dominios permitidos (localhost para desarrollo)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Estructura del Proyecto

```
.
├── api/
│   └── searchGames.js          # Vercel Function - Proxy IGDB
├── index.html                   # Frontend principal
├── package.json                 # Dependencias
├── .env.example                 # Variables de ejemplo
├── .env.local                   # Variables locales (NO COMMIT)
├── .gitignore                   # Archivos a ignorar
└── README.md                    # Este archivo
```

## 🌐 Deploy a Vercel

### 1. Push a GitHub

```bash
git add .
git commit -m "Initial commit: Game Tracker"
git push origin main
```

**⚠️ ASEGÚRATE que `.env.local` está en `.gitignore`** - Verifica que `git status` NO muestre ningún archivo `.env`

### 2. Importar en Vercel

1. Ve a https://vercel.com/dashboard
2. Click en **"Add New Project"**
3. Selecciona tu repositorio de GitHub
4. Click en **"Import"**

### 3. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings → Environment Variables** y añade:

```
IGDB_CLIENT_ID=tu_client_id
IGDB_ACCESS_TOKEN=tu_access_token
CORS_ALLOWED_ORIGINS=https://tudominio.vercel.app
```

### 4. Deploy

Vercel desplegará automáticamente. Una vez completado:
- Tu app está en `https://tuproyecto.vercel.app`
- Las API keys están seguras en Vercel
- El proxy valida todas las peticiones

## 🔑 Obtener Credenciales IGDB

1. Ve a https://api.igdb.com/
2. Haz login con Twitch (o crea cuenta)
3. En "Applications", crea una nueva aplicación
4. Copia el **Client ID** y genera un **Access Token**
5. ¡Listo! Usa esas credenciales en `.env.local` y Vercel

## 🛡️ Seguridad - Detalles Técnicos

### El Proxy (`api/searchGames.js`)

Cuando el frontend busca un juego:

1. **Envía** la búsqueda al proxy en `/api/searchGames`
2. **Valida** que el query sea seguro (max 100 chars, solo caracteres permitidos)
3. **Usa** las credenciales del servidor para consultar IGDB
4. **Limpia** los datos devueltos (ej: URLs seguras)
5. **Devuelve** solo lo necesario al frontend

Las API keys **nunca se exponen** al navegador.

### Protecciones Implementadas

| Protección | Detalle |
|-----------|--------|
| **CORS** | Solo tu dominio puede hacer peticiones |
| **Validación Form** | Input limitado a 100 chars, caracteres específicos |
| **Sanitización** | Datos procesados antes de devolver |
| **Headers HTTP** | X-Content-Type-Options, X-Frame-Options |
| **Cache** | 5 minutos para reducir carga en IGDB |
| **Rate Limiting** | Compatible con límites de IGDB (50 req/seg) |

## 🐛 Troubleshooting

### "Error: Server configuration error"
- Las variables de entorno no están configuradas en Vercel
- Ve a Settings → Environment Variables y añade `IGDB_CLIENT_ID` y `IGDB_ACCESS_TOKEN`

### "CORS not allowed"
- Tu dominio no está en `CORS_ALLOWED_ORIGINS`
- Actualiza la variable con tu dominio de Vercel

### "Query too long"
- El búsqueda tiene más de 100 caracteres
- El proxy lo rechaza para prevenir abuso

### La búsqueda no funciona en desarrollo
```bash
# Asegúrate que tienes las variables en .env.local
cat .env.local

# Reinicia el servidor de desarrollo
npm run dev
```

## 📝 Licencia

Proyecto personal. Siéntete libre de modificarlo.

## 📧 Contacto

Si tienes dudas sobre la seguridad o el deployment, consulta la [documentación de Vercel](https://vercel.com/docs).

---

**¡Disfruta gestionando tu colección de juegos de forma segura!** 🎮✨
