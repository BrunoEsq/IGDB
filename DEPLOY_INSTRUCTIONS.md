# 🚀 INSTRUCCIONES DE DEPLOY A VERCEL

## Para forzar un rebuild limpio sin caché:

### Opción 1: Desde la CLI de Vercel (Recomendado)
```bash
npm install -g vercel
vercel env pull .env.local
vercel deploy --prod --force
```

### Opción 2: Desde el Dashboard de Vercel
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Go to **Settings** → **Deployments**
4. Haz clic en los 3 puntos del último deploy
5. Selecciona **Redeploy** (esto hace un rebuild limpio)
6. O en **Git** → Haz un `git push` para que se redeploy automáticamente

### Opción 3: Limpiar caché del navegador
Presiona en tu navegador:
- **Chrome/Edge**: `Ctrl + Shift + Delete` (o `Cmd + Shift + Delete` en Mac)
- **Firefox**: `Ctrl + Shift + Delete`
- Selecciona "Todas las imágenes y archivos en caché"
- Confirma la eliminación

## 🔍 Verificar que los cambios se aplicarón:

### 1. Verificar versión en vivo
- Abre tu sitio en navegador
- Presiona `F12` → **Network**
- Recarga la página (`Ctrl + F5`)
- Verifica que los archivos no tengan `(from cache)` rojo
- Revisa el header `Cache-Control` en index.html

### 2. Ver logs de deploy
```bash
vercel logs <tu-dominio> --prod
```

## 📋 Checklist antes de hacer deploy:

- [ ] Los cambios están en `git` y pusheados
- [ ] Verificar archivos en Git: `git status`
- [ ] Verificar colores nuevos (azul/cian, no marrón)
- [ ] Verificar que el modelo 3D se carga (verifica consola: `F12`)
- [ ] Hacer un rebuild limpio con `--force`

## 🛠️ Si aún ves contenido viejo:

1. **Vaciar caché local de Vercel:**
   ```bash
   rm -rf .vercel
   vercel deploy --prod
   ```

2. **Purgar CDN global:**
   - Contacta a Vercel support
   - O espera 5-10 minutos a que se propague

3. **Forzar sin caché:**
   ```bash
   vercel env pull .env.local
   vercel deploy --prod --force --skip-build
   ```

## 📝 Cambios realizados en configuración:

✅ `vercel.json`: Headers de cache optimization agregados
✅ `.vercelignore`: Archivos innecesarios excluidos
✅ `index.html`: Sin caché (max-age=0) para forzar actualización

Todos los cambios están listos. ¡Solo haz deploy! 🎮
