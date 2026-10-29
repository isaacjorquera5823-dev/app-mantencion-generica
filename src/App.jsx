import { useEffect, useState } from "react";
import { AMBIENTE, MODO_PRUEBA } from "./ambiente.js";

const CLAVE_TEMA = "appre_tema";

function temaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === "claro" || guardado === "oscuro") return guardado;
  } catch (e) {
    console.warn("No se pudo leer el tema guardado:", e);
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
}

function IconoSol() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export default function App() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    try {
      localStorage.setItem(CLAVE_TEMA, tema);
    } catch (e) {
      console.warn("No se pudo guardar el tema:", e);
    }
  }, [tema]);

  const oscuro = tema === "oscuro";

  return (
    <div className="pagina">
      <header className="barra">
        <div className="marca">
          Appre<span>.</span>
        </div>
        <button
          className="boton-icono"
          onClick={() => setTema(oscuro ? "claro" : "oscuro")}
          aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {oscuro ? <IconoSol /> : <IconoLuna />}
        </button>
      </header>

      <section className="tarjeta">
        <h1>Informes de inspección en terreno</h1>
        <p>App en construcción. Aquí vas a iniciar sesión y hacer tus informes desde el celular.</p>
        <div className="fila">
          <span className="badge">Ambiente {AMBIENTE}</span>
          {MODO_PRUEBA && <span className="badge prueba">Modo prueba</span>}
        </div>
      </section>
    </div>
  );
}
