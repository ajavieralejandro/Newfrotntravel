import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🟢 Agregar plugins de Dayjs (OBLIGATORIO para DD/MM/YYYY)
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// Contextos
import { DatosAgenciaProvider } from "./contextos/agencia/DatosAgenciaContext";
import { PaquetesProvider } from "./contextos/paquetes/PaquetesContext";
import { FormularioProvider } from "./contextos/formulario/FormularioContext";
import { FiltrosYOrdenamientoProvider } from "./contextos/filtro/FiltrosYOrdenamientoContext";

// Obtener el elemento root
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento con id 'root'.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <DatosAgenciaProvider>
      <PaquetesProvider>
        <FormularioProvider>
          <FiltrosYOrdenamientoProvider>
            <App />
          </FiltrosYOrdenamientoProvider>
        </FormularioProvider>
      </PaquetesProvider>
    </DatosAgenciaProvider>
  </React.StrictMode>
);
