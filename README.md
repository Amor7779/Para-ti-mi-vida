# Para ti 💌

Una página web personal: foto de fondo con respiración cinematográfica, nieve
animada, una carta con scroll propio, música con fade-in y un mensaje final
dorado. Lista para GitHub Pages.

## 1. Personalizar antes de publicar

| Qué cambiar | Dónde |
|---|---|
| La foto de fondo | Coloca tu imagen en `assets/foto.jpg` |
| La música | Coloca tu canción en `assets/musica.mp3` |
| El texto de la carta | Edita los `<p>` dentro de `index.html`, en la sección marcada `ESCRIBE AQUÍ TU CARTA` |
| Google Analytics | Reemplaza `G-XXXXXXXXXX` (aparece dos veces) en `index.html` por tu ID de medición de GA4 |
| El mensaje final | Busca `<div class="finale">` en `index.html` si quieres cambiar el texto "Te extraño mi vida" |

No necesitas tocar el CSS ni el JavaScript para nada de esto.

## 2. Crear el repositorio en GitHub

No pude crear el repositorio por ti directamente (este entorno no tiene
acceso a la red), pero son 5 minutos siguiendo estos pasos:

1. Entra a https://github.com/new
2. Ponle un nombre, por ejemplo `para-ti` (no importa si es público o
   privado; para GitHub Pages gratis necesita ser público, salvo que
   tengas GitHub Pro/Team).
3. No marques "Add a README" (ya tienes uno).
4. Haz clic en **Create repository**.

## 3. Subir estos archivos

Con Git instalado, desde la carpeta del proyecto:

```bash
cd carta-nieve
git init
git add .
git commit -m "Primera versión de la carta"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

Si prefieres no usar la terminal: en la página de tu nuevo repositorio,
usa el botón **Add file → Upload files** y arrastra toda la carpeta
`carta-nieve` (o su contenido).

## 4. Publicar con GitHub Pages (gratis)

1. En tu repositorio, ve a **Settings → Pages**.
2. En "Source", elige la rama `main` y la carpeta `/ (root)`.
3. Guarda. En 1-2 minutos tu sitio estará en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

## 5. Activar Google Analytics

1. Crea una propiedad en https://analytics.google.com (GA4).
2. Copia tu **ID de medición** (empieza con `G-`).
3. Reemplaza `G-XXXXXXXXXX` por ese ID en las dos líneas donde aparece
   dentro de `index.html`.

El sitio ya envía estos eventos automáticamente una vez configurado:

- `tiempo_en_pagina` — segundos que la persona permaneció en la página.
- `carta_completada` — se dispara cuando llega al final de la carta.
- `musica_iniciada` — se dispara al primer toque, cuando empieza la música.

## Estructura del proyecto

```
carta-nieve/
├── index.html          Estructura de la página y el texto de la carta
├── css/style.css        Todos los estilos
├── js/script.js         Nieve, música, scroll y eventos de analytics
├── assets/
│   ├── foto.jpg          (agrégala tú)
│   ├── musica.mp3        (agrégala tú)
│   └── LEEME.txt
└── README.md
```

## Notas técnicas

- Funciona en escritorio y en celular; en pantallas angostas la carta se
  convierte en una hoja inferior deslizable y la foto sigue fija detrás.
- La música empieza silenciosa y sube de volumen en ~2.4 s tras el primer
  toque (los navegadores no permiten reproducir audio con sonido antes de
  una interacción del usuario, así que la pantalla "Toca para comenzar"
  es necesaria).
- Respeta `prefers-reduced-motion` para personas sensibles al movimiento.
