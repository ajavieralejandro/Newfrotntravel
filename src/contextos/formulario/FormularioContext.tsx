import React, { createContext, useContext, useState } from "react";

// 🔹 Tipo personalizado para viajeros
export interface Viajeros {
  adultos: number;
  menores: number;
}

// 🔹 Interfaz para valores de UI (display values)
export interface FormularioUI {
  ciudadOrigenDisplay: string;
  destinoDisplay: string;
  fechaSalidaDisplay: string;
  viajerosDisplay: string;
}

interface FormularioContextProps {
  // Estados principales del formulario
  ciudadOrigen: string;
  destino: string;
  fechaSalida: Date | null;
  viajeros: Viajeros;
  
  // Estados de UI para sincronización
  uiValues: FormularioUI;
  
  // Setters principales
  setCiudadOrigen: (ciudad: string) => void;
  setDestino: (destino: string) => void;
  setFechaSalida: (fecha: Date | null) => void;
  setViajeros: (viajeros: Viajeros) => void;
  
  // Setters de UI
  setUIValues: (values: Partial<FormularioUI>) => void;
  
  // Validación
  errors: Record<string, string>;
  isValid: boolean;
  
  // Acciones
  enviarFormulario: () => boolean;
  resetFormulario: () => void;
  validateField: (field: string, value: any) => string | null;
}

const FormularioContext = createContext<FormularioContextProps | undefined>(undefined);

export const FormularioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados principales del formulario
  const [ciudadOrigen, setCiudadOrigen] = useState<string>("");
  const [destino, setDestino] = useState<string>("");
  const [fechaSalida, setFechaSalida] = useState<Date | null>(null);
  const [viajeros, setViajeros] = useState<Viajeros>({ adultos: 2, menores: 0 });
  
  // Estados de UI para sincronización
  const [uiValues, setUIValuesState] = useState<FormularioUI>({
    ciudadOrigenDisplay: "",
    destinoDisplay: "",
    fechaSalidaDisplay: "",
    viajerosDisplay: ""
  });
  
  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper para actualizar UI values
  const setUIValues = (values: Partial<FormularioUI>) => {
    setUIValuesState(prev => ({ ...prev, ...values }));
  };
  
  // Validación de campos
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'ciudadOrigen':
        // Solo validar formato si hay valor
        if (value && value.trim() !== '' && (!value.includes('(') || !value.includes(')'))) {
          return 'Seleccione una ciudad válida del menú';
        }
        return null;
      case 'destino':
        // Solo validar formato si hay valor
        if (value && value.trim() !== '' && (!value.includes('(') || !value.includes(')'))) {
          return 'Seleccione una ciudad válida del menú';
        }
        return null;
      case 'fechaSalida':
        // Solo validar fecha futura si hay valor
        if (value && new Date(value) < new Date()) {
          return 'La fecha debe ser futura';
        }
        return null;
      case 'viajeros':
        // Viajeros siempre válidos (pueden ser 0)
        return null;
      default:
        return null;
    }
  };
  
  // Formulario siempre válido - permitir envío con campos vacíos
  const isValid = true;
  
  const enviarFormulario = (): boolean => {
    // Validar solo formato de campos que tienen contenido
    const newErrors: Record<string, string> = {};
    
    const ciudadOrigenError = validateField('ciudadOrigen', ciudadOrigen);
    if (ciudadOrigenError) newErrors.ciudadOrigen = ciudadOrigenError;
    
    const destinoError = validateField('destino', destino);
    if (destinoError) newErrors.destino = destinoError;
    
    const fechaError = validateField('fechaSalida', fechaSalida);
    if (fechaError) newErrors.fechaSalida = fechaError;
    
    const viajerosError = validateField('viajeros', viajeros);
    if (viajerosError) newErrors.viajeros = viajerosError;
    
    setErrors(newErrors);
    
    // Siempre permitir envío, incluso con campos vacíos
    console.log("Formulario enviado:", { ciudadOrigen, destino, fechaSalida, viajeros });
    return true;
  };

  const resetFormulario = () => {
    // Reset de estados principales
    setCiudadOrigen("");
    setDestino("");
    setFechaSalida(null);
    setViajeros({ adultos: 2, menores: 0 });
    
    // Reset de UI values para sincronización
    setUIValues({
      ciudadOrigenDisplay: "",
      destinoDisplay: "",
      fechaSalidaDisplay: "",
      viajerosDisplay: ""
    });
    
    // Reset de errores
    setErrors({});
  };

  return (
    <FormularioContext.Provider
      value={{
        ciudadOrigen,
        destino,
        fechaSalida,
        viajeros,
        uiValues,
        setCiudadOrigen,
        setDestino,
        setFechaSalida,
        setViajeros,
        setUIValues,
        errors,
        isValid,
        enviarFormulario,
        resetFormulario,
        validateField,
      }}
    >
      {children}
    </FormularioContext.Provider>
  );
};

export const useFormulario = () => {
  const context = useContext(FormularioContext);
  if (!context) {
    throw new Error("useFormulario debe ser usado dentro de un FormularioProvider");
  }
  return context;
};
