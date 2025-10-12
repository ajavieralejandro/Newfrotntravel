import { FunctionComponent, useCallback } from "react";
import { Stack, Button, Box } from "@mui/material";
import { useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

type MenuItem =
  | { type: "download"; label: string; href: string; disabled?: boolean }
  | { type: "link"; label: string; href: string; disabled?: boolean; external?: boolean };

const DerechaAbajo: FunctionComponent = () => {
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();

  const tipografia =
    footer?.tipografia || datosGenerales?.tipografiaAgencia || "inherit";
  const textoColor =
    footer?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";
  const colorHover =
    footer?.color?.secundario || datosGenerales?.color?.secundario;

  const terminosUrl: string =
    datosGenerales?.terminosYCondiciones && datosGenerales.terminosYCondiciones !== "#"
      ? datosGenerales.terminosYCondiciones
      : ""; // si no hay URL real, queda vacío

  const getFileNameFromUrl = (url: string) => {
    try {
      const u = new URL(url);
      const last = u.pathname.split("/").filter(Boolean).pop();
      if (last && last.includes(".")) return last;
    } catch {
      // ignore
    }
    return "terminos-y-condiciones.pdf";
  };

  const descargarArchivo = useCallback(async (url: string) => {
    try {
      const resp = await fetch(url, { mode: "cors" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = getFileNameFromUrl(url);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      // Fallback: abrir en nueva pestaña si no se pudo descargar
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const menuItems: MenuItem[] = [
    {
      type: "download",
      label: "Condiciones Generales",
      href: terminosUrl, // se maneja por onClick
      disabled: !terminosUrl, // deshabilita si no hay URL real
    },
    {
      type: "link",
      label: "Botón de Arrepentimiento",
      href: "#",            // reemplazar por URL real
      external: true,       // si luego apuntas a una URL real externa
      disabled: true,       // por ahora deshabilitado
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        py: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2, md: 0 },
        width: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        spacing={{ xs: 1, sm: 1.5, md: 2 }}
        justifyContent={{ xs: "center", md: "flex-end" }}
        alignItems={{ xs: "center", md: "center" }}
        textAlign="center"
        width="100%"
      >
        {menuItems.map((item, index) => {
          if (item.type === "download") {
            return (
              <Button
                key={index}
                variant="text"
                onClick={() => descargarArchivo(item.href)}
                disabled={!!item.disabled}
                sx={{
                  color: textoColor,
                  fontSize: { xs: "0.72rem", sm: "0.78rem", md: "0.82rem" },
                  fontFamily: tipografia,
                  textTransform: "none",
                  padding: "4px 8px",
                  minWidth: "auto",
                  maxWidth: { xs: "100%", md: "220px" },
                  width: { xs: "100%", md: "auto" },
                  whiteSpace: "nowrap",
                  "&:hover": {
                    color: colorHover,
                  },
                }}
              >
                {item.label}
              </Button>
            );
          }

          // LINK
          const hasRealHref = item.href && item.href !== "#";
          return (
            <Button
              key={index}
              variant="text"
              component="a"
              href={item.href} // siempre string
              target={hasRealHref && item.external ? "_blank" : undefined}
              rel={hasRealHref && item.external ? "noopener noreferrer" : undefined}
              disabled={!!item.disabled || !hasRealHref}
              sx={{
                color: textoColor,
                fontSize: { xs: "0.72rem", sm: "0.78rem", md: "0.82rem" },
                fontFamily: tipografia,
                textTransform: "none",
                padding: "4px 8px",
                minWidth: "auto",
                maxWidth: { xs: "100%", md: "220px" },
                width: { xs: "100%", md: "auto" },
                whiteSpace: "nowrap",
                "&:hover": {
                  color: colorHover,
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DerechaAbajo;
