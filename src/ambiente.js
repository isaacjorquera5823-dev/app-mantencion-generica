// En qué ambiente corre la app: DEV (npm run dev), QAS (build --mode qas) o PRD (build normal).
export const AMBIENTE = import.meta.env.DEV
  ? "DEV"
  : import.meta.env.MODE === "qas"
    ? "QAS"
    : "PRD";

// Modo prueba en DEV y QAS: los informes se numeran PRUEBA-XXXX sin consumir el contador real,
// y todo lo que se guarde lleva este sufijo para no mezclarse con los datos de PRD.
export const MODO_PRUEBA = AMBIENTE !== "PRD";
export const SUFIJO_PRUEBA = MODO_PRUEBA ? "_qas" : "";
