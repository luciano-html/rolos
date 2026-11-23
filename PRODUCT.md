# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Trabajadores de shopping, oficinas y comercios** con descansos breves (30 a 45 minutos) que enfrentan opciones costosas (`> $10.000`) que no satisfacen el apetito ni ofrecen comida casera rápida.
- **Estudiantes universitarios (UNL / UTN, zona Junín y Pje. San Martín)** y vecinos en Santa Fe Capital (y futura escala a Santo Tomé) con presupuesto acotado que buscan resolver almuerzos o cenas semanales sin cocinar ni lavar platos.

## Product Purpose

Permitir a los clientes conocer la propuesta **"Fast Good"** de Rolo's (almuerzo completo, nutritivo, estandarizado y congelable), combinar sabores en packs semanales (*Trío de Turno* x3 / *Semana Resuelta* x5) con descuento automático por volumen y enviar su reserva estructurada directamente por WhatsApp para el lote semanal. El sitio web funciona como destino central desde WhatsApp e Instagram.

## Positioning

- **Categoría propia ("Rolo" en lugar de "burrito")**: Posicionamiento como epónimo en el *Top of Mind* y como solución *"Fast Good"* frente al fast food tradicional y a competidores de salón/take-away como *La Canaca* (`$19.300` por unidad frente a la Facultad de Ingeniería), ahorrando más del 50% al bolsillo con mayor saciedad real.
- **Hero Product estandarizado (~340g)**: **"La Tapa Protagonista"** (tortilla casera de 110g saborizada en el amasado que queda dorada al sellar) + 200g de relleno cocinado lento (`60%` proteína / `40%` cebolla caramelizada) + núcleo fundente de 30g de queso cremoso.
- **Ergonomía Cero Platos y formato 100% *freeze-friendly***: Packaging primario de 40 cm de papel aluminio + film plástico como aislante térmico y barrera higiénica, pensado para stockear en el freezer (*"Take for Plans"*) y regenerar en minutos.
- **Dos momentos de consumo**: Una pausa de descanso personal (*"tu descanso no se negocia"*) o un punto de encuentro grupal.

## Operating Context

- **Fase 1 — Batch Cooking y Preventa por Lotes (Actual)**: Toma de reservas los martes y miércoles (con countdown al cierre del miércoles 23:59hs), producción intermedia sin desperdicio ni sobrestock, y entregas concentradas los viernes y sábados en Santa Fe Capital (Facultades, Shopping/Peatonal San Martín, Bulevar Gálvez/Pellegrini o envío a domicilio, sin cargo en esta primera etapa).
- **Canal de adquisición y cierre**: Difusión orgánica por WhatsApp e Instagram (nexo hacia la web) y cierre directo en WhatsApp (`5493425516258`) con mensaje estructurado (modalidad, sabores, total, nombre, zona, dirección opcional y medio de pago: Transferencia/Alias o Efectivo al recibir).
- **Horizonte Fase 2 (Escala futura, no implementada aún)**: Puntos de paso físicos (*Pocket Stores* Grab & Go sin mesas en corredores peatonales de Santa Fe Capital y Santo Tomé) desacoplados de una *Dark Kitchen* dedicada a plataformas digitales.

## Capabilities and Constraints

- **Stack técnico fijo**: HTML, CSS y JavaScript vanilla puros, sin build step ni frameworks, en español rioplatense.
- **Arquitectura SPA de 3 vistas por hash**: `#inicio` (portada), `#menu` (flujo de pedido Desktop `#carta-diner` en `>= 768px`, flujo Mobile `#app-neobrutalista` en `< 768px`, y guía `#como-calentar`) y `#afiches` (galería de 4 flyers retro 70s con `<dialog closedby="any">`).
- **Catálogo activo cerrado de 2 sabores reales**:
  - *Rolo Clásico (Carne Ahumada y Queso)*: 60% cerdo magro braseado, 40% cebolla caramelizada sazonada con BBQ, 30g queso cremoso en masa casera de 110g.
  - *Pollo a la Mostaza con Verdeo*: suprema desmechada en salsa suave de mostaza gourmet, verdeo fresco y muzzarella.
  - *(Extensiones futuras documentadas en el Plan de Negocio, no activas en la carta actual: Cheese & Meat rotativos —Champignon, Teriyaki, Criollo—, Vegetables & Cheese, Green & Cheese y Plant-Based / Apto Intolerantes).*
- **Estructura de precios y promociones**:
  - Precio unidad base sin descuento: `1 Rolo = $6.000`.
  - Descuentos por volumen sobre base `$6.000`: Pack x3 *"Trío de Turno"* `= $16.500` (`$5.500 c/u`, antes `$18.000`), Pack x5 *"Semana Resuelta"* `= $25.000` (`$5.000 c/u`, antes `$30.000`).
  - Regla comercial de tope mayorista del Plan de Negocio: para pedidos mayores a 10 unidades, tope de 3 promos de Pack x5 y 3 promos de Pack x3 (compra unitaria sin límite).
- **Seguridad de regeneración**: Destacar siempre *"Cero aluminio en el microondas"* (retirar el aluminio antes de calentar en microondas; en sartén, horno, airfryer o tostadora sí conserva el aluminio).
- **Comportamiento preservado**: indicadores de tramo automáticos no clickeables, selectores `+`/`−` con animación flotante `+1`/`-1`, visor dinámico de mascota (individual o `.is-duo` al combinar sabores), aviso inteligente de ahorro, header único sticky con sub-barra de vista secundaria (`#viewSubbar`) y cortina roja de transición full-screen con el logo `ROLO'S`.
- **Editor auxiliar de campaña**: `flyer-octubre.html` (lienzo editable 1080×1080 para capturas de difusión).

## Brand Commitments

- **Nombre y eslóganes oficiales**: `Rolo's` — *"Rolo's que resuelve"*, *"Cocinar o descansar: el debate ya no existe"*, *"Tu descanso no se negocia"*, *"Guardá la esponja: hoy los platos quedan de adorno"*, *"Te segundeamos el turno de hoy (y el de mañana también)"*.
- **Identidad visual web vinculante**: Mix entre Retro Diner estilo Bitesized en Desktop (`>= 768px`) y Neo-Brutalismo táctil en Mobile (`< 768px`), con paleta crema diner, rojo diner, verde oscuro, amarillo/cian/lima neo-brutalistas y bordes negros marcados (`#121212`).
- **Identidad de marca matriz (Plan de Negocio)**: Dos variantes del personaje (2D animado para etiquetas/packaging y 3D realista para perfiles digitales/web) y logotipo/app-icon `R` coronada en textura metalizada **Terracota Tostado (`#B57A5B`)** y **Naranja Quemado (`#A83F0C`)** sobre fondo **Dorado Mostaza (`#DF9E23`)**.
- **Activos propios obligatorios**: Mascotas ilustradas (`assets/img/rolo_clasico.jpg`, `assets/img/rolo_pollo.jpg`), logo (`assets/img/logo_mascot.jpg`, `assets/img/titulo_rolos.jpg`), versión PNG recortada (`F:\Proyectos\rolos\documentacion\rolosvg.png`) y colección de 4 afiches retro 1970s (`flyer_octubre_v1_protagonista.jpg`, `flyer_relax.jpg`, `flyer_freezer.jpg`, `flyer_delivery.jpg`).
- **Transición de marca**: Cortina roja a pantalla completa (`.rolos-page-curtain`) con logo centrado al cambiar de vista.

## Evidence on Hand

- Sitio implementado en `index.html`, `assets/css/styles.css`, `assets/js/main.js` y `flyer-octubre.html`.
- Ilustraciones y flyers originales en `assets/img/`.
- Documentación de negocio y marca en `F:\Proyectos\rolos\documentacion\`:
  - `Rolo's - Plan de Negocio.pdf` (4P, estructura 340g, matriz de sabores futuros, branding 2D/3D, fases de escala y anexos de packaging).
  - `Rolo's - Plan de Negocio - Benchmarking e Investigación de Mercado.pdf` (benchmark contra *La Canaca* a `$19.300`, modelo de defensa y estrategia *Take for Plans*).
  - Activos maestros: `rolosvg.png`, `logotipo.jpeg`, `titulo.jpeg`, `watermarkpapeltapiz.jfif`.
- No hay reseñas de terceros ni métricas de ventas externas publicadas; no se deben inventar testimonios ni cifras adicionales.

## Product Principles

1. **Velocidad al menú de compra**: La portada (`#inicio`) funciona como rampa directa hacia `#menu`, con una única acción primaria dominante (*Ir al Menú y Pedir*) y accesos secundarios subordinados para eliminar fricción en la decisión.
2. **Claridad antes que adorno**: El cliente debe entender en segundos qué es un Rolo (340g, 3 minutos), cuánto ahorra en pack y cuándo lo recibe.
3. **Cero fricción hasta WhatsApp**: Sin registro, sin buscadores innecesarios ni ruido de red social; elegir cantidades, completar nombre/zona y enviar.
4. **Transparencia del lote semanal**: Las fechas de reserva (Mar/Mié), entrega (Viernes) y el cierre del lote siempre visibles junto al resumen de compra.
5. **Personalidad lúdica con disciplina técnica**: El carácter retro diner y neo-brutalista nunca compromete el contraste, los objetivos táctiles ni la accesibilidad por teclado.

## Accessibility & Inclusion

- Cumplimiento WCAG AA en contraste de texto y controles (`>= 4.5:1` texto normal, `>= 3:1` titulares grandes).
- Navegación completa por teclado (`skip-link`, `:focus-visible`, tarjetas de afiches como `<button>`, `<dialog>` modal con light-dismiss y `Esc`).
- Sincronización accesible de validación de formularios (`aria-invalid`, `aria-describedby` dinámico y región `aria-live="polite"`).
- Respeto estricto a `prefers-reduced-motion` (desactivando la cortina y las animaciones de desplazamiento).
