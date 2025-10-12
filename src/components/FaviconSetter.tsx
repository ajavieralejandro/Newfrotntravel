"use client";

import { useEffect } from "react";
import { useDatosGenerales } from "../contextos/agencia/DatosAgenciaContext";
import LogAgencia from "../../src/assets/Logo-1-Color.png";

export default function FaviconSetter() {
  const datosGenerales = useDatosGenerales();
  //const logoAgencia = datosGenerales?.logoAgencia; descomentar si el logo se agrega en datos generales
const logoAgencia = LogAgencia;
  useEffect(() => {
    if (!logoAgencia) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = logoAgencia;
  }, [logoAgencia]);

  return null;
}
