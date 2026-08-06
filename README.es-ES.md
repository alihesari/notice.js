

# Notice.js

[![npm version](https://img.shields.io/npm/v/notice.js.svg)](https://www.npmjs.com/package/notice.js)
[![npm downloads](https://img.shields.io/npm/dm/notice.js.svg)](https://www.npmjs.com/package/notice.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/alihesaridev/notice.js.svg)](https://github.com/alihesaridev/notice.js/issues)
[![GitHub stars](https://img.shields.io/github/stars/alihesaridev/notice.js.svg)](https://github.com/alihesaridev/notice.js/stargazers)

> Una biblioteca de notificaciones hermosa y moderna, pero totalmente personalizable.

## 🎮 Pruébalo en Vivo

- **[Demo Interactiva](examples/demo.html)** - Demo completa con todas las características (abre `examples/demo.html` en tu navegador)
- **[Demo en Línea](https://alihesaridev.github.io/notice.js/examples/demo.html)** - Demo en vivo en GitHub Pages (si está habilitado)

## Características

- 🎨 Diseño hermoso y personalizable
- 📱 Responsive y amigable para móviles
- ⚡ Ligero y rápido
- 🎭 Soporte para animaciones CSS
- ⏱️ Auto-cierre con tiempo de espera configurable
- 📊 Indicador de barra de progreso
- 🎯 Múltiples posiciones (topLeft, topRight, bottomLeft, bottomRight, etc.)
- 🔔 Múltiples tipos de notificación (success, error, warning, info)
- 🌐 Soporte para idiomas RTL (derecha a izquierda)

## Instalación

### NPM

```bash
npm install notice.js --save
```

### Descarga Directa

Descarga desde [GitHub releases](https://github.com/alihesaridev/notice.js/releases) o [última instantánea](https://github.com/alihesaridev/notice.js/archive/master.zip)

## Inicio Rápido

### 1. Incluir Hoja de Estilos

```html
<link rel="stylesheet" href="node_modules/notice.js/dist/noticejs.css" />
<!-- o -->
<link rel="stylesheet" href="dist/noticejs.css" />
```

### 2. Incluir Script

```html
<script src="node_modules/notice.js/dist/notice.js"></script>
<!-- o -->
<script src="dist/notice.js"></script>
```

### 3. Uso Básico

```javascript
new NoticeJs({
    text: '¡Hola, Mundo!',
    position: 'topRight',
}).show();
```

## Ejemplos

### Notificación Básica

```javascript
new NoticeJs({
    text: '¡Operación completada exitosamente!',
    position: 'topRight',
    type: 'success'
}).show();
```

### Con Tiempo de Espera (Timeout)

La opción `timeout` controla cuánto tiempo (en milisegundos) permanece visible la notificación. Establece en `false` para deshabilitar el auto-cierre.

```javascript
// Auto-cerrar después de 5 segundos
new NoticeJs({
    text: 'Esto desaparecerá en 5 segundos',
    position: 'topRight',
    timeout: 5000  // 5 segundos
}).show();

// Deshabilitar auto-cierre
new NoticeJs({
    text: 'Esto permanece hasta que se cierre manualmente',
    position: 'topRight',
    timeout: false
}).show();
```

### Con Título

```javascript
new NoticeJs({
    title: 'Éxito',
    text: '¡Tus cambios han sido guardados!',
    position: 'topRight',
    type: 'success'
}).show();
```

### Con Animación

Notice.js admite animaciones CSS. Funciona genial con [Animate.css](https://animate.style/):

```javascript
new NoticeJs({
    text: 'Notificación con animación',
    position: 'topLeft',
    animation: {
        open: 'animated bounceInRight',
        close: 'animated bounceOutLeft'
    }
}).show();
```

### Con Barra de Progreso

```javascript
new NoticeJs({
    text: 'Cargando...',
    position: 'topRight',
    progressBar: true,
    timeout: 3000  // La barra de progreso muestra la cuenta regresiva
}).show();
```

### Diferentes Tipos

```javascript
// Éxito
new NoticeJs({
    text: '¡Operación exitosa!',
    type: 'success',
    position: 'topRight'
}).show();

// Error
new NoticeJs({
    text: '¡Algo salió mal!',
    type: 'error',
    position: 'topRight'
}).show();

// Advertencia
new NoticeJs({
    text: 'Por favor, verifica tu entrada',
    type: 'warning',
    position: 'topRight'
}).show();

// Información
new NoticeJs({
    text: 'Nueva actualización disponible',
    type: 'info',
    position: 'topRight'
}).show();
```

### Devoluciones de Llamada (Callbacks)

```javascript
new NoticeJs({
    text: 'Notificación con callbacks',
    position: 'topRight',
    callbacks: {
        onShow: function() {
            console.log('¡Notificación mostrada!');
        },
        onClose: function() {
            console.log('¡Notificación cerrada!');
        }
    }
}).show();
```

## Opciones de Configuración

| Opción | Tipo | Predeterminado | Descripción |
|-------|------|---------|-------------|
| `text` | string | `''` | Texto del mensaje de la notificación |
| `title` | string | `''` | Título de la notificación (opcional) |
| `type` | string | `'success'` | Tipo de notificación: `success`, `error`, `warning`, `info` |
| `position` | string | `'topRight'` | Posición: `topLeft`, `topRight`, `bottomLeft`, `bottomRight` |
| `timeout` | number/boolean | `30` | Tiempo de espera para auto-cierre en milisegundos. Establece en `false` para deshabilitar. |
| `progressBar` | boolean | `true` | Mostrar cuenta regresiva con barra de progreso |
| `closeWith` | array | `['button']` | Formas de cerrar: `['button']`, `['click']`, o ambos `['button', 'click']` |
| `animation` | object/null | `null` | Clases de animación: `{ open: 'class', close: 'class' }` |
| `newestOnTop` | boolean | `false` | Mostrar las notificaciones más nuevas arriba |
| `rtl` | boolean | `false` | Soporte para idiomas de derecha a izquierda |

## Posiciones

- `topLeft`
- `topRight`
- `bottomLeft`
- `bottomRight`

## Compatibilidad con Navegadores

Notice.js funciona en todos los navegadores modernos:
- Chrome (último)
- Firefox (último)
- Safari (último)
- Edge (último)
- IE11+ (con polyfills)

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, lee nuestra [Guía de Contribución](CONTRIBUTING.md) primero.

## Licencia

Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Pruebas y Ejemplos

Puedes probar notice.js localmente abriendo `examples/demo.html` en tu navegador:

```bash
# Después de construir el proyecto
npm run build

# Abrir examples/demo.html en tu navegador
open examples/demo.html  # macOS
# o simplemente haz doble clic en examples/demo.html
```

La demo incluye ejemplos interactivos de todas las características, incluyendo:
- Todos los tipos de notificación (éxito, error, advertencia, información)
- Diferentes posiciones
- Controles de tiempo de espera
- Barras de progreso
- Animaciones
- Devoluciones de llamada
- ¡Y más!

## Repositorio

- GitHub: [https://github.com/alihesaridev/notice.js](https://github.com/alihesaridev/notice.js)
- Problemas (Issues): [https://github.com/alihesaridev/notice.js/issues](https://github.com/alihesaridev/notice.js/issues)
- Demo: [examples/demo.html](examples/demo.html)
