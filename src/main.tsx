import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { DatosAgenciaProvider } from "./contextos/agencia/DatosAgenciaContext";
import { PaquetesProvider } from "./contextos/paquetes/PaquetesContext";
import { FormularioProvider } from "./contextos/formulario/FormularioContext";
import { FiltrosYOrdenamientoProvider } from "./contextos/filtro/FiltrosYOrdenamientoContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se encontró #root");

ReactDOM.createRoot(rootElement).render(
  <DatosAgenciaProvider>
    <PaquetesProvider>
      <FormularioProvider>
        <FiltrosYOrdenamientoProvider>
          <App />
        </FiltrosYOrdenamientoProvider>
      </FormularioProvider>
    </PaquetesProvider>
  </DatosAgenciaProvider>
);
