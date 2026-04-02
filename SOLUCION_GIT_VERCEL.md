# 🔧 SOLUCIÓN: Git con múltiples cuentas + Vercel

## El Problema
- Cuenta A (vieja): Hizo cambios (colores azules, modelo 3D)
- Cuenta B (nueva): Está configurada ahora en Git
- Vercel: Sigue sirviendo la versión vieja (colores marrones, sin modelo)

## Solución Paso a Paso

### PASO 1: Verificar que todo está sincronizado
```powershell
cd d:\WebMisJuegos
git status
git log --oneline -3
```

Si dice "nothing to commit, working tree clean" → Bien ✅

### PASO 2: Hacer un commit de verificación con la cuenta nueva
```powershell
git config user.name "BrunoEsq"
git config user.email "brunoesquiva12111@gmail.com"
git commit --allow-empty -m "Rebuild - Sincronización con cuenta correcta"
```

### PASO 3: Hacer un force push al remoto (Importante)
```powershell
git push origin main --force
```

> ⚠️ El `--force` solo es necesario si hubo conflictos. Si todo va bien, solo usa:
```powershell
git push origin main
```

### PASO 4: Forzar un redeploy en Vercel

**Opción A: Desde CLI (Recomendado)**
```powershell
npm install -g vercel
vercel env pull .env.local
vercel deploy --prod --force
```

**Opción B: Desde Dashboard Vercel**
1. Ve a https://vercel.com/dashboard
2. Selecciona proyecto "WebMisJuegos"
3. Click en **Deployments**
4. Click en los 3 puntos del deploy más reciente
5. Selecciona **Redeploy**

**Opción C: GitHub → Vercel (Automático)**
1. Haz el `git push origin main` (Paso 3)
2. Vercel se redeploy automáticamente en ~1-2 minutos

### PASO 5: Verificar que los cambios están en vivo
1. Abre https://tullamadodeldominio.com (tu sitio en Vercel)
2. Presiona `Ctrl + F5` para limpiar caché
3. Abre DevTools: `F12`
4. Ve a pestaña **Network**
5. Recarga la página
6. Busca `index.html`
7. Verifica el header `Cache-Control`: Debe decir `public, max-age=0, must-revalidate`

Si ves caché viejo (en rojo), significa que Vercel sigue sirviendo la versión vieja.

## 🆘 Si Aún No Funciona

### Opción 1: Reconectar el repositorio en Vercel
```powershell
git remote -v
```

Si ves algo diferente a `https://github.com/BrunoEsq/WebMisJuegos.git`, necesitas reconectar:

1. Ve a Vercel Dashboard
2. Selecciona el proyecto
3. **Settings** → **Git**
4. Desconecta el repo
5. Vuelve a conectarlo

### Opción 2: Forzar limpieza total
```bash
# Borrar caché local de vercel
rm -rf .vercel

# Hacer rebuild completo
vercel deploy --prod --force
```

### Opción 3: Ver logs de Vercel
```bash
vercel logs webmisjuegos.vercel.app --prod
```

## ✅ Checklist Final

- [ ] Ejecuté `git push origin main` (con la cuenta nueva)
- [ ] Verifiqué en GitHub que los commits están ahí
- [ ] Hice redeploy en Vercel (--force o desde dashboard)
- [ ] Limpié caché del navegador (`Ctrl + F5`)
- [ ] Verifico que `index.html` tiene `Cache-Control: max-age=0`
- [ ] Los cambios se ven en vivo (colores azules + modelo 3D)

## 📋 Comandos rápidos para copiar:

```powershell
# Todo junto:
cd d:\WebMisJuegos
git config user.name "BrunoEsq"
git config user.email "brunoesquiva12111@gmail.com"
git status
git push origin main
echo "Ahora ve a Vercel y haz redeploy"
```

---
**Nota**: Los cambios nuevo están aquí:
- Colors: `#0d2f3d`, `#0a4055`, `#00d4ff` (azules)
- Modelo 3D: Babylon.js cargado en `index.html`
