import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { DatosAgenciaProvider } from "./contextos/agencia/DatosAgenciaContext";
import { PaquetesProvider } from "./contextos/paquetes/PaquetesContext";
import { FormularioProvider } from "./contextos/formulario/FormularioContext";
import { FiltrosYOrdenamientoProvider } from "./contextos/filtro/FiltrosYOrdenamientoContext";

/** ---------- Debug helpers (sacalos cuando termines) ---------- */
class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any; info: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error: any, info: any) {
    this.setState({ error, info });
    console.error("[ErrorBoundary] Error capturado:", error);
    if (info?.componentStack) console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Ocurrió un error en la UI</h1>
          <pre style={{ whiteSpace: "pre-wrap", color: "#b91c1c" }}>{String(this.state.error)}</pre>
          {this.state.info?.componentStack && (
            <>
              <h2 style={{ marginTop: 12, fontSize: 16 }}>Component stack</h2>
              <pre style={{ whiteSpace: "pre-wrap", opacity: 0.8 }}>{this.state.info.componentStack}</pre>
            </>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Log global de errores
window.addEventListener("error", (e) => {
  console.error("[window.error]", e.message, e.error);
});
window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
  console.error("[unhandledrejection]", e.reason);
});

// Parchea createElement para detectar tipos inválidos (undefined/objeto)
(function patchCreateElementForDebug() {
  const orig = (React as any).createElement;
  (React as any).createElement = function (type: any, props: any, ...children: any[]) {
    const isValid =
      typeof type === "string" ||
      typeof type === "function" ||
      (type && typeof type === "object" && (type as any).$$typeof);
    if (!isValid) {
      console.error("[React] Tipo de elemento inválido:", { type, props });
      try {
        throw new Error("Elemento React inválido (type no es función/componente)");
      } catch (e) {
        console.error(e);
      }
    }
    return orig.apply(this, [type, props, ...children]);
  };
})();
/** ---------- /Debug helpers ---------- */

// Obtener el elemento root
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró el elemento con id 'root'. Asegúrate de que index.html contiene <div id='root'></div>.");
}

// Crear el root de React
const root = ReactDOM.createRoot(rootElement);

// Renderizar (sin StrictMode mientras debugueás)
root.render(
  <RootErrorBoundary>
    <DatosAgenciaProvider>
      <PaquetesProvider>
        <FormularioProvider>
          <FiltrosYOrdenamientoProvider>
            <App />
          </FiltrosYOrdenamientoProvider>
        </FormularioProvider>
      </PaquetesProvider>
    </DatosAgenciaProvider>
  </RootErrorBoundary>
);
