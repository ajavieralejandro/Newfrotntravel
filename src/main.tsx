import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Contextos correctamente corregidos según estructura
import { DatosAgenciaProvider } from "./contextos/agencia/DatosAgenciaContext";
import { PaquetesProvider } from "./contextos/paquetes/PaquetesContext";
import { FormularioProvider } from "./contextos/formulario/FormularioContext";
import { FiltrosYOrdenamientoProvider } from "./contextos/filtro/FiltrosYOrdenamientoContext";

// Obtener el elemento root
const rootElement = document.getElementById("root");

// Verificar si el elemento root existe
if (!rootElement) {
  throw new Error("No se encontró el elemento con id 'root'. Asegúrate de que index.html contiene <div id='root'></div>.");
}

// Crear el root de React
const root = ReactDOM.createRoot(rootElement);

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <DatosAgenciaProvider> {/* ✅ Contexto de datos de la agencia */}
      <PaquetesProvider> {/* ✅ Contexto de paquetes */}
        <FormularioProvider> {/* ✅ Nuevo contexto de formulario */}
        <FiltrosYOrdenamientoProvider>
          <App />
        </FiltrosYOrdenamientoProvider>
        </FormularioProvider>
      </PaquetesProvider>
    </DatosAgenciaProvider>
  </React.StrictMode>
);