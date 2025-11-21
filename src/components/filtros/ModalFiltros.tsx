import {
  Box,
  Modal,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTarjetas } from "../../contextos/agencia/DatosAgenciaContext";
import FiltroRango from "./FiltroRango";
import FiltroMultiple from "./FiltroMultiple";
import FiltroBooleano from "./FiltroBooleano";

import {
  Filtros,
  filtrosIniciales,
  useFiltrosYOrdenamiento,
} from "../../contextos/filtro/FiltrosYOrdenamientoContext";
import { useState, useEffect, useMemo } from "react";

// --- utils locales ---
const toNumber = (v: any): number => {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(",", ".").trim());
  return Number.isNaN(n) ? NaN : n;
};

const parseDDMMYYYY = (s?: string | null): number | null => {
  if (!s) return null;
  const [dd, mm, yyyy] = s.split("-");
  const d = Number(dd),
    m = Number(mm),
    y = Number(yyyy);
  if (!d || !m || !y) return null;
  const t = new Date(y, m - 1, d).getTime();
  return Number.isNaN(t) ? null : t;
};

const nightsFromFirstSalida = (p: any): number | null => {
  const s0 = Array.isArray(p?.salidas) ? p.salidas[0] : undefined;
  if (!s0) return null;

  const ini =
    parseDDMMYYYY(s0?.fecha_desde) ?? parseDDMMYYYY(s0?.ida_origen_fecha);
  const fin =
    parseDDMMYYYY(s0?.fecha_hasta) ?? parseDDMMYYYY(s0?.vuelta_destino_fecha);

  if (ini != null && fin != null) {
    const MS = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((fin - ini) / MS));
  }

  if (typeof p?.cant_noches === "number") return p.cant_noches;
  return null;
};

const firstSalidaPrecioDoble = (p: any): number | null => {
  const s0 = Array.isArray(p?.salidas) ? p.salidas[0] : undefined;
  if (!s0) return null;
  const precio = toNumber(s0?.doble_precio);
  return Number.isNaN(precio) ? null : precio;
};

const hotelesFromPaquete = (p: any): string[] => {
  const h = p?.hotel;
  if (!h) return [];
  const arr = Array.isArray(h) ? h : [h];
  return arr
    .map((x) => String(x?.nombre ?? "").trim())
    .filter(Boolean);
};

// --------------------------------

interface ModalFiltrosProps {
  open: boolean;
  onClose: () => void;
}

const ModalFiltros = ({ open, onClose }: ModalFiltrosProps) => {
  const tarjetas = useTarjetas();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tipografia = tarjetas?.tipografia || "Verdana, sans-serif";
  const colorPrimario = tarjetas?.color?.primario || "#1976d2";

  const { filtros: filtrosGlobal, setFiltros } = useFiltrosYOrdenamiento();
  const [filtrosLocales, setFiltrosLocales] = useState<Filtros>(filtrosIniciales);

  // Dataset base: resultados guardados en localStorage (o vacío si no hay)
  const paquetes = useMemo(() => {
    try {
      const raw = localStorage.getItem("resultadosBusqueda");
      return raw ? (JSON.parse(raw) as any[]) : [];
    } catch {
      return [];
    }
  }, [open]); // recalcular cada vez que abrimos

  // Derivar opciones dinámicas desde dataset
  const {
    opcionesCiudades,
    opcionesHoteles,
    opcionesAerol,
    opcionesOrigen,
    opcionesDestino,
    opcionesMoneda,
    limitesPrecio,
    limitesDuracion,
    limitesEstrellas,
  } = useMemo(() => {
    const ciudades = new Set<string>();
    const hoteles = new Set<string>();
    const aerolineas = new Set<string>();
    const origenes = new Set<string>();
    const destinos = new Set<string>();
    const monedas = new Set<string>();

    const precios: number[] = [];
    const duraciones: number[] = [];
    const estrellasVals: number[] = [];

    for (const p of paquetes) {
      // listas
      //if (p?.ciudad) ciudades.add(String(p.ciudad).trim());

      for (const hn of hotelesFromPaquete(p)) hoteles.add(hn);

      if (Array.isArray(p?.salidas)) {
        for (const s of p.salidas) {
          const a1 = String(s?.ida_linea_aerea ?? "").trim();
          const a2 = String(s?.vuelta_linea_aerea ?? "").trim();
          if (a1) aerolineas.add(a1);
          if (a2) aerolineas.add(a2);

          const o1 = String(s?.ida_origen_ciudad ?? "").trim();
          const o2 = String(s?.vuelta_origen_ciudad ?? "").trim();
          if (o1) origenes.add(o1);
          if (o2) origenes.add(o2);

          const d1 = String(s?.ida_destino_ciudad ?? "").trim();
          const d2 = String(s?.vuelta_destino_ciudad ?? "").trim();
          if (d1) destinos.add(d1);
          if (d2) destinos.add(d2);
        }
      }

      if (p?.tipo_moneda) monedas.add(String(p.tipo_moneda).trim().toUpperCase());

      // rangos
      const precio = firstSalidaPrecioDoble(p);
      if (precio != null) precios.push(precio);

      const noches = nightsFromFirstSalida(p);
      if (noches != null) duraciones.push(noches);

      const hs = p?.hotel
        ? (Array.isArray(p.hotel) ? p.hotel : [p.hotel])
            .map((h: any) => toNumber(h?.categoria_hotel))
            .filter((n: number) => !Number.isNaN(n))
        : [];
      estrellasVals.push(...hs);
    }

    const sortAsc = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

    const precioMin = precios.length ? Math.min(...precios) : 0;
    const precioMax = precios.length ? Math.max(...precios) : 100000000;

    const durMin = duraciones.length ? Math.min(...duraciones) : 1;
    const durMax = duraciones.length ? Math.max(...duraciones) : 30;

    // Estrellas: por defecto 0–5; si el dataset tiene valores, ajustar dentro de [0,5]
    const estMinRaw = estrellasVals.length ? Math.min(...estrellasVals) : 0;
    const estMaxRaw = estrellasVals.length ? Math.max(...estrellasVals) : 5;
    const estMin = Math.max(0, Math.min(5, Math.floor(estMinRaw)));
    const estMax = Math.max(0, Math.min(5, Math.ceil(estMaxRaw)));

    return {
      opcionesCiudades: Array.from(ciudades).sort(sortAsc),
      opcionesHoteles: Array.from(hoteles).sort(sortAsc),
      opcionesAerol: Array.from(aerolineas).sort(sortAsc),
      opcionesOrigen: Array.from(origenes).sort(sortAsc),
      opcionesDestino: Array.from(destinos).sort(sortAsc),
      opcionesMoneda: Array.from(monedas).sort(sortAsc),
      limitesPrecio: [precioMin, precioMax] as [number, number],
      limitesDuracion: [durMin, durMax] as [number, number],
      limitesEstrellas: [estMin, estMax] as [number, number],
    };
  }, [paquetes]);

  // Al abrir el modal, sincronizar estado local con el contexto
  useEffect(() => {
    if (open) {
      setFiltrosLocales((prev) => ({
        ...filtrosIniciales,
        ...filtrosGlobal,
        // normalizamos rangos al dataset para evitar que queden fuera de rango
        precio:
          filtrosGlobal.precio ?? limitesPrecio,
        duracion:
          filtrosGlobal.duracion ?? limitesDuracion,
        estrellas:
          filtrosGlobal.estrellas ?? limitesEstrellas,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, limitesPrecio, limitesDuracion, limitesEstrellas]);

  const handleAplicarFiltros = () => {
    setFiltros(filtrosLocales);
    onClose();
  };

  const handleReiniciar = () => {
    setFiltrosLocales({
      ...filtrosIniciales,
      precio: limitesPrecio,
      duracion: limitesDuracion,
      estrellas: limitesEstrellas,
    });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="titulo-modal-filtros">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "700px" },
          maxWidth: { xs: "95vw", sm: "90vw" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            id="titulo-modal-filtros"
            variant="h6"
            sx={{ fontFamily: tipografia, fontWeight: "bold", color: "#333" }}
          >
            Filtrar Resultados
          </Typography>
          <IconButton onClick={onClose} sx={{ color: colorPrimario }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Filtros de rango */}
        <FiltroRango
          label="Precio (doble, 1ª salida)"
          campo="precio"
          min={limitesPrecio[0]}
          max={limitesPrecio[1]}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroRango
          label="Duración (noches, 1ª salida)"
          campo="duracion"
          min={limitesDuracion[0]}
          max={limitesDuracion[1]}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroRango
          label="Estrellas del hotel"
          campo="estrellas"
          min={0}
          max={5}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        {/* Filtros múltiples (opciones dinámicas) */}
        <FiltroMultiple
          label="Ciudades"
          campo="ciudades"
          opciones={opcionesCiudades}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroMultiple
          label="Hoteles"
          campo="hoteles"
          opciones={opcionesHoteles}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        {/* Eliminado: Régimen / Servicios incluidos (no soportados por el modelo actual) */}

        <FiltroMultiple
          label="Habitaciones"
          campo="habitaciones"
          opciones={["single", "doble", "triple", "cuadruple", "familia_1", "familia_2"]}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroMultiple
          label="Aerolíneas"
          campo="aerolineas"
          opciones={opcionesAerol}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroMultiple
          label="Ciudad Origen Vuelo"
          campo="ciudadesOrigenVuelo"
          opciones={opcionesOrigen}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroMultiple
          label="Ciudad Destino Vuelo"
          campo="ciudadesDestinoVuelo"
          opciones={opcionesDestino}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        <FiltroMultiple
          label="Tipo de moneda"
          campo="tipoMoneda"
          opciones={opcionesMoneda}
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        {/* Booleanos */}
        <FiltroBooleano
          label="Disponible para venta online"
          campo="ventaOnline"
          filtros={filtrosLocales}
          setFiltros={setFiltrosLocales}
        />

        {/* Botones */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Button 
            variant="outlined" 
            onClick={handleReiniciar}
            sx={{
              borderColor: colorPrimario,
              color: colorPrimario,
              fontWeight: "bold",
              fontFamily: tipografia,
              borderRadius: "50px",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.8, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              "&:hover": {
                borderColor: `${colorPrimario}cc`,
                backgroundColor: `${colorPrimario}14`,
              },
            }}
          >
            Reiniciar filtros
          </Button>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: colorPrimario,
              color: tarjetas?.tipografiaColor || "#fff",
              fontWeight: "bold",
              fontFamily: tipografia,
              borderRadius: "50px",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.8, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              "&:hover": {
                backgroundColor: `${colorPrimario}cc`,
              },
            }}
            onClick={handleAplicarFiltros}
          >
            Filtrar paquetes
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalFiltros;
