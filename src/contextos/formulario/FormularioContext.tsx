import React, { createContext, useContext, useState } from "react";
import { Dayjs } from "dayjs";

// -------------------- Tipos ----------------------

export interface Viajeros {
  adultos: number;
  menores: number;
}

export interface FormularioUI {
  ciudadOrigenDisplay: string;
  destinoDisplay: string;

  // Nuevos campos UI
  salidaDisplay: string;
  destinoHotelDisplay: string;
  fechaEntradaHotelDisplay: string;
  fechaSalidaHotelDisplay: string;
  pasajerosDisplay: string;
}

interface FormularioContextProps {
  // ----- Campos de vuelos / paquetes -------
  salida: string;
  destino: string;
  fechaSalidaVuelos: Dayjs | null;
  pasajeros: Viajeros;

  // ----- Campos de hoteles -------
  destinoHotel: string;
  fechaEntradaHotel: Dayjs | null;
  fechaSalidaHotel: Dayjs | null;
  noches: number | null;

  // ----- UI values -------
  uiValues: FormularioUI;

  // ----- Setters -------
  setSalida: (v: string) => void;
  setDestino: (v: string) => void;
  setFechaSalidaVuelos: (v: Dayjs | null) => void;
  setPasajeros: (v: Viajeros) => void;

  setDestinoHotel: (v: string) => void;
  setFechaEntradaHotel: (v: Dayjs | null) => void;
  setFechaSalidaHotel: (v: Dayjs | null) => void;
  setNoches: (v: number | null) => void;

  setUIValues: (v: Partial<FormularioUI>) => void;

  // Validación
  errors: Record<string, string>;
  validateField: (field: string, value: any) => string | null;

  // Acciones
  isValid: boolean;
  enviarFormulario: () => boolean;
  resetFormulario: () => void;
}

// -------------------------------------------------

const FormularioContext = createContext<FormularioContextProps | undefined>(undefined);

export const FormularioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // ---------- Estados vuelos / paquetes ----------
  const [salida, setSalida] = useState<string>("");
  const [destino, setDestino] = useState<string>("");
  const [fechaSalidaVuelos, setFechaSalidaVuelos] = useState<Dayjs | null>(null);
  const [pasajeros, setPasajeros] = useState<Viajeros>({ adultos: 1, menores: 0 });

  // ---------- Estados hoteles ----------
  const [destinoHotel, setDestinoHotel] = useState("");
  const [fechaEntradaHotel, setFechaEntradaHotel] = useState<Dayjs | null>(null);
  const [fechaSalidaHotel, setFechaSalidaHotel] = useState<Dayjs | null>(null);
  const [noches, setNoches] = useState<number | null>(null);

  // ---------- UI values ----------
  const [uiValues, setUIValuesState] = useState<FormularioUI>({
    ciudadOrigenDisplay: "",
    destinoDisplay: "",
    salidaDisplay: "",
    destinoHotelDisplay: "",
    fechaEntradaHotelDisplay: "",
    fechaSalidaHotelDisplay: "",
    pasajerosDisplay: "",
  });

  const setUIValues = (values: Partial<FormularioUI>) => {
    setUIValuesState(prev => ({ ...prev, ...values }));
  };

  // ---------- Validación ----------
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case "salida":
      case "destino":
      case "destinoHotel":
        if (value && !value.includes("(")) {
          return "Seleccione una ubicación válida";
        }
        return null;

      case "fechaEntradaHotel":
      case "fechaSalidaHotel":
      case "fechaSalidaVuelos":
        if (value && value.isBefore(Dayjs, "day")) {
          return "La fecha debe ser futura";
        }
        return null;

      default:
        return null;
    }
  };

  const isValid = true;

  const enviarFormulario = () => {
    setErrors({});
    return true;
  };

  const resetFormulario = () => {
    // Vuelos
    setSalida("");
    setDestino("");
    setFechaSalidaVuelos(null);
    setPasajeros({ adultos: 1, menores: 0 });

    // Hoteles
    setDestinoHotel("");
    setFechaEntradaHotel(null);
    setFechaSalidaHotel(null);
    setNoches(null);

    // UI
    setUIValues({
      ciudadOrigenDisplay: "",
      destinoDisplay: "",
      salidaDisplay: "",
      destinoHotelDisplay: "",
      fechaEntradaHotelDisplay: "",
      fechaSalidaHotelDisplay: "",
      pasajerosDisplay: "",
    });

    setErrors({});
  };

  return (
    <FormularioContext.Provider
      value={{
        salida,
        destino,
        fechaSalidaVuelos,
        pasajeros,

        destinoHotel,
        fechaEntradaHotel,
        fechaSalidaHotel,
        noches,

        uiValues,
        setSalida,
        setDestino,
        setFechaSalidaVuelos,
        setPasajeros,

        setDestinoHotel,
        setFechaEntradaHotel,
        setFechaSalidaHotel,
        setNoches,

        setUIValues,

        errors,
        validateField,
        isValid,
        enviarFormulario,
        resetFormulario,
      }}
    >
      {children}
    </FormularioContext.Provider>
  );
};

export const useFormulario = () => {
  const ctx = useContext(FormularioContext);
  if (!ctx) throw new Error("useFormulario debe ser usado dentro del FormularioProvider");
  return ctx;
};
