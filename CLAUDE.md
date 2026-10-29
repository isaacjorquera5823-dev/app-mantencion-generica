# APPRE — CONTEXTO DEL PROYECTO

_Creado: 29-oct-2026 (traspaso desde el proyecto Brimahd)_

Este archivo se lee automáticamente al abrir Claude Code en esta carpeta. "Appre" es un nombre provisorio.

## Qué es esto
Una app genérica, **multiempresa**, para que cualquier negocio de mantención haga sus informes de inspección en terreno desde el celular (fotos, observaciones, criticidad, informe en PDF). Nace de la app Brimahd (inspección de tableros eléctricos, en producción desde 2026), pero es un **producto aparte**: repo, Firebase y URL propios.

## Quién es Isaac y cómo trabajar con él
- Isaac es el desarrollador y dueño del código/IP. **No es programador** y está aprendiendo a usar Claude Code: explicar en **español simple**, sin jerga sin explicar.
- Viene de SAP: hablarle en términos **DEV → QAS → PRD** (y "mandantes" para multiempresa).
- Quiere entender el porqué de cada decisión; corrige el enfoque activamente. Recomendar una opción, no listar todas.
- Prueba en **iPhone/Safari** antes de dar algo por hecho.
- Nunca cambios directos en `main`. Todo cambio significativo en rama aparte, probado en QAS, y **push/merge a `main` solo con confirmación explícita de Isaac**.
- Este PC es de la empresa (Hortifrut): no se pueden ejecutar scripts `.ps1` (política); el panel Terminal no siempre le toma el teclado a Isaac. Nunca pedirle contraseñas por el chat.
- Contenido para usuarios finales: corto y visual (tarjetas con capturas), nunca manuales largos.

## Decisiones ya tomadas (29-oct-2026)
- **Arquitectura B: una sola app con usuarios** (multiempresa). Cada técnico inicia sesión; cada empresa ve solo sus datos. Isaac eligió B sabiendo que A (copia por cliente) era más rápida — no reabrir esa discusión.
- **Rubro aún no definido** → producto genérico con **plantillas por rubro**. Primero una **demo** con una empresa ficticia y un rubro de ejemplo (ej. climatización).
- Sin cliente piloto todavía.
- **Proyecto Firebase nuevo y separado** del de Brimahd (`brimahd-inspeccion` NO se usa aquí). Idealmente también un Firebase aparte para QAS (en Brimahd se aprendió que compartir Firestore entre ambientes es un riesgo).
- Carpeta fuera de OneDrive a propósito (en Brimahd, OneDrive bloqueaba carpetas y peleaba con `node_modules`).
- **NO traer datos de Brimahd**: ni las sedes/contactos de DuocUC, ni la lista de 50 observaciones eléctricas (conocimiento de Emanuel Madrid, cliente de Brimahd), ni precios ni nada comercial de Brimahd. El código sí es de Isaac y se puede reutilizar.
- Ojo comercial: si algún día se apunta al rubro eléctrico, serían competidores de Emanuel (cliente fundador de Brimahd). Isaac lo decide conscientemente.

## Plan por etapas
| Etapa | Qué | Resultado visible |
|---|---|---|
| 0. Base | Repo nuevo, Firebase nuevo, React + Vite, GitHub Pages, ambientes DEV/QAS/PRD y modo prueba | App vacía publicada en su URL |
| 1. Usuarios y empresas | Firebase Auth (correo + contraseña), colección por empresa, roles **administrador / técnico**, **reglas de seguridad de Firestore** que impidan ver datos de otra empresa (lo más delicado) | Dos empresas de prueba que no se ven entre sí |
| 2. Plantillas | El administrador define qué se inspecciona (nombre del elemento: equipo, máquina…), campos, catálogo de observaciones con criticidad, clientes/sitios | Un rubro configurado desde la app, sin tocar código |
| 3. Informe | Llenado en terreno, fotos, autoguardado, vista previa, PDF con marca de cada empresa, numeración correlativa por empresa | Informe completo de punta a punta |
| 4. Demo | Empresa ficticia + rubro de ejemplo | Algo para mostrar a posibles clientes |
| 5. Después | Historial de informes, cobro/suspensión por empresa (kill switch por empresa, en modo "fail-open" ante error de config) | Producto vendible |

Pendiente para la etapa 0: Isaac debe crear el proyecto Firebase en la consola (guiarlo paso a paso) y el repo en GitHub (cuenta `isaacjorquera5823-dev`).

## Qué reutilizar de Brimahd (y dónde está)
Repo local: `C:\Users\ijorquera\OneDrive - Hortifrut Chile SA\Documentos\CCC\otros\Brimahd-inspeccion` (GitHub: `isaacjorquera5823-dev/Brimahd-inspeccion`). **Leer siempre de la rama `main`** (lo que está en producción), ej. `git -C "<ruta>" show main:src/App.jsx`. No modificar nada en ese repo desde aquí.

- `src/App.jsx`:
  - `comprimirImagen(file, 1600, 0.72)` + `parametrosCompresion()` — compresión de fotos, más agresiva sobre 50/100/200 fotos.
  - `crearMiniatura(foto)` — copias de 900px de a una (cache `WeakMap`) para la vista previa; sin esto Safari cierra la pestaña con informes grandes (220 MB → 5 MB).
  - `abrirDB` / `guardarBorradorDB` / `leerBorradorDB` / `borrarBorradorDB` — autoguardado en IndexedDB (debounce 1500 ms).
  - `MODO_PRUEBA` / `SUFIJO_PRUEBA` — modo prueba en DEV y QAS (`import.meta.env.DEV || MODE === "qas"`), numeración `PRUEBA-XXXX` sin consumir contador, almacenamiento con sufijo `_qas`.
  - `peekNextNumber` / `reserveNextNumber` — numeración correlativa atómica con transacción de Firestore (aquí pasa a ser por empresa).
  - `VistaPreviaInforme` + `generarHTMLInforme(inf, cfg, { fotoSrc })` — vista previa en `<iframe srcDoc>`.
  - `checkLicencia()` — kill switch remoto "fail-open".
- `src/pdfInforme.js` — PDF dibujado a mano con jsPDF (sin html2canvas, para no rasterizar fotos en memoria): portada, resumen, paginación que nunca deja un encabezado solo. `dibujarTablero` es específico de tableros: generalizar a "elemento inspeccionado".
- `src/theme.js` — paleta. Aquí cada empresa tendrá su marca, pero el PDF debe tener colores fijos (no seguir el modo oscuro).
- `.github/workflows/deploy.yml` — deploy a GitHub Pages en cada push a `main`. El QAS de Brimahd vive en el repo `isaacjorquera5823-dev/brimahd-qas` (workflow + archivo `RAMA`, build `vite build --mode qas --base /brimahd-qas/`, se niega a publicar si el build no tiene el sufijo `_qas`) — replicar la idea.

## Aprendizajes de Brimahd (no repetir estos errores)
- **localStorage no sirve para borradores** (~5 MB en Safari iOS); usar IndexedDB y mostrar los errores al usuario (nada de `catch {}` vacíos).
- **Memoria de Safari iOS**: toda foto se comprime antes de guardarse; la vista previa usa miniaturas y `loading="lazy"`; nunca acumular todas las fotos grandes en memoria a la vez.
- **El elemento en edición va en el autosave** (no solo los confirmados), para sobrevivir a un cierre de la pestaña.
- **Vista previa y documento final desde la misma función**, si no divergen.
- **Hooks de React nunca dentro de returns condicionales** (Error #310, pantalla en blanco en mobile).
- **Inputs a 16px** (evita el zoom automático de iOS); switches propios en vez de checkbox nativos.
- **Vite bloquea hosts desconocidos**: para probar por túnel (`cloudflared tunnel --url http://localhost:PUERTO`) agregar el host a `server.allowedHosts`.
- `navigator.share()` manda el mismo texto a todas las apps (Mail, WhatsApp…), no se puede personalizar por app.
- En Brimahd las reglas de Firestore eran públicas para unos pocos documentos; aquí, con varias empresas, **todo debe exigir usuario autenticado y pertenencia a la empresa**.

## Lenguaje visual
Moderna, elegante e intuitiva para técnicos en terreno con apuro o sol directo: alto contraste, elementos grandes y fáciles de tocar, tarjetas con esquinas redondeadas (14-16px) sin bordes marcados, íconos de línea delgada (nunca rellenos), badges con fondo suave del mismo tono del texto. Modo claro y oscuro con toggle, ambos igual de cuidados (oscuro en capas, nunca negro puro; texto ~#f0f0f0, nunca blanco puro). Un solo color de acento, configurable por empresa.
