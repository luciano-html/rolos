---
name: Rolo's
description: Mix Retro Diner (Desktop Bitesized) + Neo-Brutalismo táctil (Mobile) para comida casera al paso en Santa Fe.
colors:
  diner-red: "#EA4925"
  diner-red-text: "#B82E10"
  diner-red-dark: "#9E260C"
  diner-green: "#1B432C"
  diner-green-dark: "#112C1D"
  diner-cream: "#F6EEDB"
  diner-cream-light: "#FFFDF7"
  diner-booth-yellow: "#F5A618"
  nb-black: "#121212"
  nb-card-bg: "#FAF4EE"
  nb-mustard-bg: "#FFC700"
  nb-yellow-btn: "#FFE135"
  nb-cyan-btn: "#7AD4EB"
  nb-lime: "#D2F065"
  nb-red-accent: "#D93829"
  rolo-terracotta: "#8B2C1A"
typography:
  display:
    fontFamily: "Anton, Bowlby One SC, Impact, sans-serif"
    fontSize: "4.6rem"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.03em"
  retro:
    fontFamily: "Bowlby One SC, Righteous, cursive, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.04em"
  script:
    fontFamily: "Pacifico, Georgia, serif"
    fontSize: "1.45rem"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "0.04em"
rounded:
  sm: "10px"
  md: "14px"
  lg: "20px"
  frame: "28px"
  pill: "999px"
spacing:
  xs: "0.4rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3.75rem"
components:
  button-hero:
    backgroundColor: "{colors.nb-yellow-btn}"
    textColor: "{colors.nb-black}"
    rounded: "{rounded.md}"
    padding: "0.95rem 1.25rem"
  button-primary-red:
    backgroundColor: "{colors.diner-red-text}"
    textColor: "{colors.diner-cream-light}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.05rem"
  button-primary-red-hover:
    backgroundColor: "{colors.diner-red-dark}"
    textColor: "{colors.diner-cream-light}"
  button-secondary-cyan:
    backgroundColor: "{colors.nb-cyan-btn}"
    textColor: "{colors.nb-black}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.65rem"
  chip-lime:
    backgroundColor: "{colors.nb-lime}"
    textColor: "{colors.nb-black}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.55rem"
  card-sheet:
    backgroundColor: "{colors.nb-card-bg}"
    textColor: "{colors.nb-black}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  input-field:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.nb-black}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 0.8rem"
---

# Design System: Rolo's

## Overview

**Creative North Star: "Mostrador Diner 70s & App Táctil Neo-Brutalista"**

El sistema visual de Rolo's combina dos registros complementarios unidos por tinta negra sólida (`#121212`), bordes marcados y tipografía de afiche retro: en escritorio (`>= 768px`) despliega la calidez editorial de una carta diner inspirada en Bitesized —fondo crema cálido, rojo tomate vibrante, verde bosque y papel de carta con doble marco— mientras que en móvil (`< 768px`) pasa a una interfaz neo-brutalista directa, vibrante y táctil sobre mostaza punteada, amarillo eléctrico, cian y lima pensada para pedir en segundos con el pulgar.

La personalidad es cercana, hambrienta y resolutiva, nunca corporativa ni genérica. Cada bloque visual cumple un rol operativo en la compra: destacar tramos de ahorro, hacer visible la mascota del sabor elegido y llevar sin rodeos al botón de WhatsApp.

**Key Characteristics:**
- Bordes negros sólidos (`2px` a `3.5px`) y sombras desplazadas sin desenfoque (`0px blur`) como lenguaje estructural compartido entre desktop y mobile.
- Doble escenario adaptativo: carta diner de 2 columnas sobre retícula roja en escritorio (`#carta-diner`) y shell neo-brutalista compacto sobre trama punteada mostaza en móvil (`#app-neobrutalista`).
- Contraste AA verificado: el rojo brillante de marca se reserva a titulares grandes y fondos decorativos, mientras los botones y textos funcionales usan su variante profunda (`diner-red-text`).
- Movimiento enérgico pero disciplinado: cortina roja de marca entre vistas y micro-pop de cifras con desaceleración exponencial, totalmente desactivables bajo `prefers-reduced-motion`.

## Colors

Una paleta cálida de diner clásico enriquecida con acentos saturados neo-brutalistas para estados activos, precios y llamadas a la acción.

### Primary
- **Rojo Diner Display** (`diner-red`): Titulares display gigantes (`>= 36px`), fondo de la cortina de transición, retícula de la sección menú desktop y líneas decorativas.
- **Rojo Diner Accesible** (`diner-red-text`): Botones CTA rojos con texto crema claro (`.nav-cta-pill`, `.nb-btn-red`, `.m-back-bar`, `.sticky-checkout-btn`), nombres de platos, precios de pack y estados activos de navegación para garantizar contraste WCAG AA (`>= 4.5:1`).
- **Rojo Diner Profundo** (`diner-red-dark`): Estado `:hover` de botones rojos y énfasis de ingredientes sobre fondo claro.

### Secondary
- **Verde Diner** (`diner-green`): Wordmark `ROLO'S`, navegación principal, precios finales de fila y subtítulos de barra secundaria.
- **Verde Bosque Oscuro** (`diner-green-dark`): Fondo del footer de 3 columnas, líneas de la retícula del menú desktop y subtítulos de precio unitario en packs móviles.
- **Amarillo Botón Neo-Brutalista** (`nb-yellow-btn`): CTA principal de portada, botón `+` de los steppers, tarjetas de pack activas, caja de resumen/ticket y globo de diálogo de la mascota.
- **Mostaza App Mobile** (`nb-mustard-bg`): Superficie de fondo con puntos negros en la sección de pedido móvil (`< 768px`).

### Tertiary
- **Cian Táctil** (`nb-cyan-btn`): Acciones secundarias de exploración (*Ver Afiches*, *Ver Rolo*, selector de pollo).
- **Lima Estado / Ahorro** (`nb-lime`): Píldoras de estado, badge de carrito móvil, barra de upsell de ahorro, enlace activo en navegación móvil y pestaña activa del dock inferior.
- **Amarillo Booth** (`diner-booth-yellow`): Franja decorativa retro 70s en la portada.
- **Terracota Rolo 70s** (`rolo-terracotta`): Referencia cromática de los afiches ilustrados y del editor de flyer.

### Neutral
- **Tinta Neo-Brutalista** (`nb-black`): Texto principal, todos los bordes (`2px`–`4px`) y todas las sombras desplazadas.
- **Crema Diner** (`diner-cream`): Fondo base del documento, header sticky, portada y sección *Cómo Calentar*.
- **Crema Clara** (`diner-cream-light`): Hoja de menú desktop, vista de galería de afiches, texto sobre rojo diner y botones secundarios claros.
- **Papel Tarjeta** (`nb-card-bg`): Superficie de tarjetas informativas, marco móvil, mostrador sticky desktop, dock inferior y modal `<dialog>`.

### Named Rules
**The Accessible Red Split Rule.** `diner-red` (`#EA4925`) nunca se usa para texto normal ni fondo de botones con texto blanco; esos contextos usan obligatoriamente `diner-red-text` (`#B82E10`) o `diner-red-dark` (`#9E260C`).
**The Hard Ink Anchor Rule.** Ningún contenedor interactivo ni tarjeta flota sin su borde en `nb-black`; el contorno negro unifica los colores saturados y evita vibración cromática.

## Typography

**Display Font:** `Anton` (fallback `Bowlby One SC, Impact, sans-serif`)
**Retro Wordmark Font:** `Bowlby One SC` (fallback `Righteous, cursive, sans-serif`)
**Script Accent Font:** `Pacifico` (fallback `Georgia, serif`)
**Body / UI Font:** `Plus Jakarta Sans` (fallback `system-ui, -apple-system, sans-serif`)

**Character:** Combina titulares condensados de cartel callejero y lettering redondeado de los años 70 con una sans geométrica de pesos altos (`600`–`900`) para que precios, ingredientes y formularios se escaneen de un vistazo en móvil y desktop.

### Hierarchy
- **Display** (400, `clamp(2.15rem, 5.8vw, 4.6rem)` en portada / `clamp(4rem, 7vw, 6.2rem)` en `MENU`, `line-height: 0.88–0.98`): Titulares de portada, encabezado de la carta y títulos de sección, siempre en mayúsculas y con `text-wrap: balance`.
- **Retro Wordmark** (400, `1.9rem` en header / `clamp(2.4rem, 7vw, 3.6rem)` en cortina, `line-height: 1–1.1`): Marca `ROLO'S` en navbar, cortina y cierre del footer.
- **Script Accent** (400, `1.45rem`, `line-height: 1.25`): Separador manuscrito *"Armá tu Pedido en 2 Pasos"* en la carta desktop.
- **Title** (400 Anton / 800–900 Jakarta, `1.12rem`–`1.85rem`, `line-height: 1.05–1.15`): Nombres de sabores, precios grandes, títulos de tarjetas y subtítulo de vista (`#viewSubbarLabel`).
- **Body** (600–700, `0.85rem`–`1rem`, `line-height: 1.45–1.5`): Descripciones de ingredientes, pasos de cocción y textos del footer.
- **Label** (800–900, `0.75rem`–`0.82rem`, `letter-spacing: 0.04em`, mayúsculas): Etiquetas de formulario, pills de ahorro, badges de paso y pestañas del dock móvil.

### Named Rules
**The 12px Functional Floor Rule.** Ningún texto interactivo, precio tachado, badge de pack o meta de lote baja de `0.75rem` (`12px`).
**The Tabular Numerals Rule.** Todos los precios, cantidades del stepper y dígitos del countdown aplican `font-variant-numeric: tabular-nums` para evitar saltos horizontales al actualizar el pedido.

## Layout

- **Arquitectura SPA por hash**: `#appViews` ocupa el alto restante del viewport (`min-height: 100dvh`) entre `.site-sticky-header` (arriba) y `.diner-footer` (abajo), mostrando una sola vista activa (`[hidden]` en el resto).
- **Breakpoints normativos**:
  - `< 768px` (Mobile): se muestra `#app-neobrutalista` + `.mobile-sticky-dock` flotante inferior (`padding-bottom` compensado en `body.is-menu-view` + `env(safe-area-inset-bottom)`).
  - `>= 768px` (Desktop): se oculta la app móvil y aparece `.desktop-kiosk-grid` (`1.22fr 0.78fr`, colapsando a `1fr` en `<= 1024px`).
  - `>= 860px`: la navegación móvil de fila secundaria (`.mobile-header-links`) y el botón `.mobile-nav-cta` ceden paso a los grupos laterales `.diner-nav-group`.
  - `>= 900px`: el footer pasa de columna apilada a grilla de 3 columnas (`1.25fr 1fr 0.95fr`).
- **Ritmo de espaciado**: Contenedores con margen fluido `clamp(1rem, 3vw, 2.5rem)`, separación generosa entre secciones (`3rem`–`3.75rem`) y agrupación compacta dentro de tarjetas (`0.65rem`–`1.25rem`). `scroll-padding-top` y `scroll-margin-top` compensan siempre el alto del header sticky + sub-barra.

## Elevation & Depth

El sistema utiliza **elevación gráfica dura (neo-brutalista)** sin desenfoque (`0px blur`) combinada con desplazamiento táctil al presionar: cuando un botón o tarjeta se activa, la superficie se desplaza hacia abajo/derecha y su sombra se reduce en la misma proporción, simulando un botón físico que se hunde sobre el mostrador.

### Shadow Vocabulary
- **Shadow SM** (`box-shadow: 2.5px 2.5px 0 var(--nb-black)` a `3px 3px 0 var(--nb-black)`): Chips, inputs, steppers, botones secundarios y badges.
- **Shadow MD** (`box-shadow: 5px 5px 0 var(--nb-black)`): Botón CTA principal, tarjetas informativas, tarjetas de afiches y avatar de cortina.
- **Shadow LG** (`box-shadow: 8px 8px 0 var(--nb-black)` a `12px 12px 0 var(--nb-black)`): Hoja de menú desktop, estado hover de afiches y modal `<dialog>`.

### Named Rules
**The Physical Press Rule.** En `:hover` y `:active`, los botones se trasladan hacia la sombra (`translate(2px, 2px)`) reduciendo el offset de `box-shadow` de forma proporcional para dar respuesta mecánica inmediata.

## Shapes

- **Controles y campos**: Esquinas redondeadas firmes (`10px` en inputs, steppers y botones móviles; `12px`–`16px` en botones de portada y tarjetas internas).
- **Contenedores principales**: Radios generosos (`20px` en tarjetas de 3 minutos y afiches, `24px` en `<dialog>`, `28px` en `.sepidy-phone-frame`).
- **Píldoras y avatares**: `999px` en botones CTA de header, badges, dock inferior móvil y sticker `.is-duo`; `50%` en avatares de mascota y botones circulares de utilidad.
- **Bordes**: `2px` en controles internos y campos, `2.5px` en botones principales y `3px`–`4px` en marcos estructurales y divisores de sección.

## Components

### Buttons
Botones táctiles con contorno negro y presión mecánica.
- **Shape:** Redondeado firme (`12px`–`16px`) o píldora (`999px`) en header y dock.
- **Primary Hero:** Fondo `nb-yellow-btn` (`#FFE135`), texto `nb-black`, borde `3px`, sombra `5px 5px 0`, alto mínimo `60px`, con badge interno de precio en `diner-red-text`.
- **Primary Submit / Nav CTA:** Fondo `diner-red-text` (`#B82E10`), texto `diner-cream-light`, borde `2.5px`, hover en `diner-red-dark`.
- **Secondary:** Fondo `nb-cyan-btn` (`#7AD4EB`) o `diner-cream-light` con texto `nb-black` y alto mínimo `44px`–`46px`.
- **Hover / Focus:** Desplazamiento físico hacia la sombra en hover/active, `touch-action: manipulation` en táctil y anillo `:focus-visible` de `3px solid diner-red-text`.

### Chips & Pack Indicators
Indicadores de estado y tramos de ahorro de lectura rápida.
- **Style:** Fondo `nb-lime` o blanco con borde `1.5px`–`2px solid nb-black`.
- **State:** Los indicadores de pack (`1 Rolo`, `Pack x3`, `Pack x5`) no son clickeables; cambian a fondo `nb-yellow-btn` automáticamente cuando la suma del carrito alcanza cada tramo.

### Cards / Containers
Contenedores enmarcados que separan información operativa.
- **Corner Style:** `16px`–`20px` en tarjetas de contenido, `0px` con doble marco en la hoja de menú desktop (`.bitesized-menu-sheet`).
- **Background:** `nb-card-bg`, `diner-cream-light` o `#FFFFFF`.
- **Shadow Strategy:** Sombra dura `3px` a `12px` según jerarquía.
- **Border:** `2px` a `4px solid nb-black`.

### Inputs / Fields
Campos de formulario de alta legibilidad pensados para no provocar zoom en iOS (`font-size: max(1rem, 1em)`).
- **Style:** Fondo `#FFFFFF`, borde `2px solid nb-black`, radio `10px`, alto mínimo `48px`, sombra `2.5px 2.5px 0`.
- **Focus:** `outline: 3px solid var(--diner-red-text); outline-offset: 2px;`.
- **Error:** Sincronización de `:user-invalid` y `[aria-invalid="true"]` con borde `nb-red-accent`, tinte `#FFF5F5` y mensaje vinculado dinámicamente por `aria-describedby`.

### Navigation
- **Header sticky único (`.site-sticky-header`)**: Fondo `diner-cream`, borde inferior `3px solid nb-black`, brand centrado y sub-barra `#viewSubbar` visible solo en vistas secundarias. Oculta el CTA `Pedir` cuando el usuario ya está en `#menu`.
- **Dock inferior móvil (`.mobile-sticky-dock`)**: Píldora flotante fija en la base con pestañas `Pedido` / `Ver Rolo` (objetivo táctil `>= 44px`, estado activo con mancha orgánica `nb-lime`) y botón rojo `FINALIZAR` que desliza al formulario.

### Signature Components
- **Cortina de Transición (`.rolos-page-curtain`)**: Capa fija full-screen en `diner-red` con avatar circular y wordmark `rolo's` centrado que cubre el cambio entre vistas SPA (desactivada en `prefers-reduced-motion`).
- **Visor Dinámico de Mascota + Stepper con Badge Flotante**: Al sumar o restar sabores aparece un badge `+1` / `-1` flotante detrás del contador y el mostrador alterna entre mascota individual y dúo (`.is-duo`) con cantidades.
- **Lightbox Nativo (`<dialog closedby="any">`)**: Modal de afiches con cierre al clic fuera (más fallback JS), botón de cierre explícito y carga dinámica de la imagen en `#dialogImgSlot`.

## Do's and Don'ts

### Do:
- **Do** usar `diner-red-text` (`#B82E10`) para cualquier texto normal o fondo de botón rojo con texto claro.
- **Do** mantener objetivos táctiles de al menos `44px × 44px` en botones de acción, pestañas del dock y utilidades móviles, con `touch-action: manipulation`.
- **Do** usar `font-variant-numeric: tabular-nums` en precios, contadores y reloj countdown.
- **Do** respetar `prefers-reduced-motion` manteniendo las vistas siempre en `opacity: 1` sin cortina ni desplazamiento animado.
- **Do** preservar la separación entre el flujo Desktop (`>= 768px`, `#carta-diner`) y Mobile (`< 768px`, `#app-neobrutalista`) junto con la lógica de precios y WhatsApp.

### Don't:
- **Don't** usar `diner-red` (`#EA4925`) para texto pequeño ni como fondo de botones con texto blanco (no alcanza WCAG AA `4.5:1`).
- **Don't** agregar curvas `bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) ni animaciones que oculten secciones completas en `opacity: 0` al cargar.
- **Don't** introducir buscadores, ruido de red social ni pasos extra entre la selección de sabores y el envío por WhatsApp.
- **Don't** dejar imágenes `<img>` estáticas con `src=""` o sin `src` dentro de modales cerrados.
- **Don't** romper la jerarquía de encabezados (`h1` → `h2` → `h3`) ni hacer clickeables elementos `<article>`/`<div>` sin `<button>` nativo.
