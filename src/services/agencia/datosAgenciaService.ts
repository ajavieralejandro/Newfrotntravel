import { DatosAgencia } from "../../interfaces/datosAgencia";
import { transformarAgenciaBackData } from "../../utils/transformers/transformarAgenciaBackData";
import { fetchDatosAgenciaReal } from "./fetchDatosAgenciaRealAux";
import type { AgenciaBackData } from "../../interfaces/AgenciaBackData";

export const fetchDatosAgencia = async (): Promise<DatosAgencia> => {
  const datosBack: AgenciaBackData = await fetchDatosAgenciaReal(); // <- ahora retorna RAW
  const transformado = transformarAgenciaBackData(datosBack);
  console.log("[AGENCIA][TRANSFORMED]", transformado);
  return transformado;
};
