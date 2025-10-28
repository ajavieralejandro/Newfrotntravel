import React from "react";
import { Box, Typography, Grid, IconButton, Skeleton, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import ModalCompartir from "./ModalCompartir";

interface InfoPaqueteProps {
  idPaquete: number; // ✅ coincide con PaqueteData.id
  titulo: string;
  fechaSalida: string;
  duracion: string;
  regimen: string;
  destinos: string;
  cargando?: boolean;
  subtitulo: string;
}

/** Decodifica entidades HTML comunes (sin tocar el DOM) */
function decodeEntities(input: string): string {
  if (!input) return "";
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };
  const base = input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (m) => map[m] || m);
  const withDec = base.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  const withHex = withDec.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return withHex;
}

/** Normaliza y reduce el título para mostrar y para tooltip/compartir */
function normalizarTituloPaquete(tituloRaw: string, maxLen = 70) {
  if (!tituloRaw || !tituloRaw.trim()) {
    return { displayTitle: "Paquete sin título", fullTitle: "Paquete sin título" };
  }

  // 1) sanitizar básico
  const full = decodeEntities(
    tituloRaw
      .replace(/<br\s*\/?>/gi, "\n") // br -> salto de línea
      .replace(/<[^>]+>/g, "") // quitar cualquier otra etiqueta
      .replace(/\s+/g, " ") // normalizar espacios
      .trim()
  );

  // 2) primera línea
  let firstLine = full.split(/\r?\n/)[0]?.trim() || full;

  // 3) si hay " - " y a la derecha hay ruido, recortamos
  const dashIdx = firstLine.indexOf(" - ");
  if (dashIdx > -1) {
    const left = firstLine.slice(0, dashIdx).trim();
    const right = firstLine.slice(dashIdx + 3).trim().toLowerCase();

    const ruido = /\b(cupo|cupos|confirmad[oa]s?|salida[s]?|fecha[s]?|aerol(í|i)neas|latam|jetsmart|flybondi|ar\b|all inclusive|ai\b)\b/i;
    if (ruido.test(right)) {
      firstLine = left;
    }
  }

  // 4) límite de longitud (conservar palabras si se puede)
  let display = firstLine;
  if (display.length > maxLen) {
    const slice = display.slice(0, maxLen);
    const lastSpace = slice.lastIndexOf(" ");
    display = (lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice).trim() + "…";
  }

  return { displayTitle: display, fullTitle: full };
}

const InfoPaquete: React.FC<InfoPaqueteProps> = ({
  idPaquete,
  titulo,
  duracion,
  regimen,
  destinos,
  cargando = false,
  subtitulo,
}) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const [openModalCompartir, setOpenModalCompartir] = React.useState(false);

  const tipografia =
    tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "Arial";
  const colorTipografia =
    tarjetas?.tipografiaColorContenido ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000";
  const colorFondo = "transparent";

  // ✅ Mostrar "Consultar" si no hay duración válida
  const duracionTexto =
    !duracion || duracion.trim() === "" ? "Consultar" : duracion;

  const { displayTitle, fullTitle } = React.useMemo(
    () => normalizarTituloPaquete(titulo, 50),
    [titulo]
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        pt: 4,
        px: 0,
        backgroundColor: "#197c84",
        flexGrow: 1,
      }}
    >
      {/* Título + acciones */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexGrow: 1,
          gap: 1.5,
          mb: 2,
        }}
      >
        {cargando ? (
          <Skeleton width="60%" height={30} />
        ) : (
          <>
          <Tooltip title={fullTitle} arrow enterDelay={700}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontFamily: tipografia,
                color: colorTipografia,
                mt: 1,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: { xs: 2, sm: 2, md: 1 }, // 2 líneas en mobile, 1 en desktop
              }}
            >
              {displayTitle}
            </Typography>
          </Tooltip>
      
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ fontFamily: tipografia, mt: 0.5 }}
      >
        {subtitulo}
      </Typography>
       </>
        )}

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => setOpenModalCompartir(true)}
            aria-label="Compartir paquete"
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Detalles */}
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: "400px",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          {cargando ? (
            <Skeleton width="80%" />
          ) : (
            <Typography
              variant="body2"
              sx={{ fontFamily: tipografia, color: colorTipografia }}
            >
              <b>Tipo Habitacion:</b> {regimen}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          {cargando ? (
            <Skeleton width="80%" />
          ) : (
            <Typography
              variant="body2"
              sx={{ fontFamily: tipografia, color: colorTipografia }}
            >
              <b>Politica:</b> {duracionTexto}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          {/**cargando ? (
            <Skeleton width="80%" />
          ) : (
            <Typography
              variant="body2"
              sx={{ fontFamily: tipografia, color: colorTipografia }}
            >
              <b>Destinos:</b> {destinos}
            </Typography>
          )**/}
        </Grid>
      </Grid>

      {/* Modal Compartir */}
      {openModalCompartir && (
        <ModalCompartir
          open={openModalCompartir}
          onClose={() => setOpenModalCompartir(false)}
          paqueteId={idPaquete}
        />
      )}
    </Box>
  );
};

export default InfoPaquete;
