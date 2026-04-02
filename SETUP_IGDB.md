# 🚀 NUEVO REPOSITORIO: IGDB

Lo he hecho. Ahora tienes:
- 📁 `d:\WebMisJuegos` → Repositorio original (intacto)
- 📁 `d:\IGDB` → Nuevo repositorio independiente

## ✅ Pasos para subir IGDB a GitHub

### PASO 1: Crear el repositorio en GitHub
1. Ve a https://github.com/new
2. Rellena:
   - **Repository name:** `IGDB`
   - **Description:** (opcional)
   - **Public:** Activo
   - **Initialize with README:** NO (deselecciona)
3. Haz clic en **Create repository**

### PASO 2: Hacer push del código
```powershell
cd d:\IGDB
git branch -M main
git push -u origin main
```

### PASO 3: Conectar con Vercel
1. Ve a https://vercel.com/new
2. **Import Git Repository**
3. Busca `IGDB` (el nuevo repo)
4. Configura como hiciste con WebMisJuegos
5. Deploy ✅

---

## 📋 Verificar que está todo bien

```powershell
# Ver el estado
cd d:\IGDB
git status
git remote -v
git log --oneline -5

# Ver estructura
dir
```

## 🔄 Diferencias entre los dos repos

| Aspecto | WebMisJuegos | IGDB |
|---------|-------------|------|
| Ruta | `d:\WebMisJuegos` | `d:\IGDB` |
| GitHub | BrunoEsq/WebMisJuegos | BrunoEsq/IGDB |
| Vercel | webmisjuegos.vercel.app | Tu elijirás nuevo dominio |
| Código | IGUAL (mismo contenido) | IGUAL (mismo contenido) |

---

## ⚠️ IMPORTANTE

El repositorio IGDB está listo localmente pero **aún no está en GitHub**. Necesitas:

1. ✅ Crear el repo vacío en GitHub (arriba)
2. ✅ Hacer `git push -u origin main` desde `d:\IGDB`
3. ✅ Luego conectarlo a Vercel

Si lo haces, tendrás dos proyectos independientes apuntando al mismo código.
