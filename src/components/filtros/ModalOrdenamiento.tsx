import {
  Box,
  Modal,
  
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useEffect, useState } from "react";
import { useFiltrosYOrdenamiento } from "../../contextos/filtro/FiltrosYOrdenamientoContext";

type Criterio = "precio" | "salida" | "nombre" | "duracion";
type Orden = "asc" | "desc";

interface ModalOrdenamientoProps {
  open: boolean;
  onClose: () => void;
  colorPrimario: string;
  tipografia: string;
  onAplicar: (criterio: Criterio, orden: Orden) => void;
}

const criteriosLabels: Record<Criterio, string> = {
  precio: "Precio (doble, 1ª salida)",
  salida: "Fecha de salida (1ª salida / más cercana)",
  nombre: "Nombre",
  duracion: "Duración (noches, 1ª salida)",
};

const ModalOrdenamiento = ({
  open,
  onClose,
  colorPrimario,
  tipografia,
  onAplicar,
}: ModalOrdenamientoProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { ordenamientos, prioridadOrdenamientos } = useFiltrosYOrdenamiento();

  const pickActivo = (): { criterio: Criterio; orden: Orden } => {
    // mayor prioridad = último en la lista
    const ultimo = prioridadOrdenamientos.at(-1) as Criterio | undefined;
    if (ultimo && ordenamientos[ultimo]) {
      return { criterio: ultimo, orden: ordenamientos[ultimo] as Orden };
    }
    // si no hay prioridad, tomar el primero definido
    const fallback = (["precio", "salida", "nombre", "duracion"] as Criterio[]).find(
      (k) => ordenamientos[k]
    );
    if (fallback) return { criterio: fallback, orden: ordenamientos[fallback] as Orden };
    // default
    return { criterio: "precio", orden: "asc" };
    };

  const [criterio, setCriterio] = useState<Criterio>("precio");
  const [orden, setOrden] = useState<Orden>("asc");

  // Al abrir, sincronizar con el estado actual del contexto
  useEffect(() => {
    if (!open) return;
    const act = pickActivo();
    setCriterio(act.criterio);
    setOrden(act.orden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const aplicar = () => {
    onAplicar(criterio, orden);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="titulo-modal-orden">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: 600 },
          maxWidth: "100%",
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: { xs: "20px", sm: "35px" },
          overflow: "hidden",
        }}
      >
        {/* Banner Superior */}
        <Box
          id="titulo-modal-orden"
          sx={{
            backgroundColor: colorPrimario,
            color: "white",
            padding: { xs: "12px", sm: "15px" },
            textAlign: "center",
            fontFamily: tipografia,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            fontWeight: "bold",
          }}
        >
          Ordenar paquetes
        </Box>

        {/* Contenido */}
        <Box sx={{ padding: { xs: "15px", sm: "20px" } }}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {/* Criterio de orden */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Criterio</InputLabel>
                <Select
                  label="Criterio"
                  value={criterio}
                  onChange={(e) => setCriterio(e.target.value as Criterio)}
                  sx={{ fontFamily: tipografia }}
                >
                  {(Object.keys(criteriosLabels) as Criterio[]).map((k) => (
                    <MenuItem key={k} value={k}>
                      {criteriosLabels[k]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Orden asc/desc */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Orden</InputLabel>
                <Select
                  label="Orden"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                  sx={{ fontFamily: tipografia }}
                >
                  <MenuItem value="asc">Ascendente</MenuItem>
                  <MenuItem value="desc">Descendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Botón aplicar */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 2, sm: 3 } }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colorPrimario,
                color: "white",
                fontWeight: "bold",
                fontFamily: tipografia,
                minWidth: { xs: 150, sm: 200 },
                py: 1,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                borderRadius: "8px",
                "&:hover": { backgroundColor: `${colorPrimario}cc` },
              }}
              onClick={aplicar}
            >
              APLICAR <SortIcon sx={{ ml: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalOrdenamiento;
