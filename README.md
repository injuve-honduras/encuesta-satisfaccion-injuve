# Encuesta de Satisfacción del Portal Único de Transparencia – INJUVE

Este proyecto conserva la identidad visual del formulario institucional anterior y contiene dos páginas independientes:

- `index.html`: formulario público de 9 preguntas.
- `resultados.html`: tablero público con conteos y porcentajes agregados.

## Importante: conectar el almacenamiento

El ZIP incluye el código de Google Apps Script en `google-apps-script/Code.gs`. Para que el formulario guarde respuestas y el tablero las muestre, primero debe configurarse el servicio:

1. Crear una hoja de cálculo de Google llamada `Encuesta de Satisfacción INJUVE`.
2. Mantenerla privada y crear una pestaña llamada exactamente `Respuestas`.
3. Copiar el ID de la hoja (el texto entre `/d/` y `/edit` en su URL).
4. Abrir [script.google.com](https://script.google.com), crear un proyecto y pegar el contenido de `Code.gs`.
5. Sustituir `PEGAR_ID_DE_LA_HOJA_DE_CALCULO` por el ID real de la hoja.
6. Guardar y desplegar como Aplicación web: ejecutar como la cuenta propietaria y acceso para cualquier usuario. La hoja no se comparte públicamente.
7. Copiar la URL terminada en `/exec` y reemplazar `https://script.google.com/macros/s/AKfycbzyKXzM-nLs5c52tVpJ90SRfM5Lyy5V9i_lOdRDbBW0lVfuzoaPVBPuuqaRvu1dgXvHAg/exec` en estos tres archivos:
   - `index.html` (atributo `action` del formulario)
   - `assets/js/app.js` (constante `API_URL`)
   - `assets/js/resultados.js` (constante `API_URL`)
8. Volver a desplegar una nueva versión del Apps Script después de cualquier cambio en el backend.

## Estructura de la hoja

La primera fila se crea automáticamente al recibir la primera respuesta. No crear columnas manualmente. El sistema guarda fecha de recepción y las 9 respuestas. No solicita nombres, correos ni teléfonos.

## Publicación

Subir el contenido de esta carpeta a un repositorio GitHub Pages (rama `main`, carpeta `/ (root)`). El portal de resultados se abre desde el enlace `Resultados públicos` del encabezado.

## Privacidad y transparencia

- La hoja de cálculo debe permanecer privada y con acceso limitado al personal autorizado.
- El tablero público solo presenta cantidades y porcentajes por opción; no publica filas individuales ni datos personales.
- La pregunta 9 permite seleccionar varias opciones; por eso el total de selecciones de esa pregunta puede ser mayor que el total de encuestas.
- Antes de recopilar respuestas reales, realizar pruebas de envío y revisión institucional de privacidad, retención y acceso.

## Nota de configuración

El proyecto está preparado visualmente y el backend está incluido, pero no puede conectarse a una hoja ni desplegarse sin que el propietario configure el ID y publique su propia aplicación web de Apps Script.
