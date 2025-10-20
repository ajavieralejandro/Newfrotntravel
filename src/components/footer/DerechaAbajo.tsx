import { FunctionComponent, useCallback, useState } from "react";
import { Stack, Button, Box } from "@mui/material";
import { useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import BotonArrepentimientoModal, { FormData } from "./BotonArrepentimientoModal";

const DerechaAbajo: FunctionComponent = () => {
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();
  const [openModal, setOpenModal] = useState(false);

  const tipografia = footer?.tipografia || datosGenerales?.tipografiaAgencia || "inherit";
  const textoColor = "#9A9898"//footer?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";
  const colorHover = "#DBDBDC" //footer?.color?.secundario || datosGenerales?.color?.secundario;

  // 📨 función para enviar email
  const enviarCorreo = useCallback(async (data: FormData) => {
    //const agenciaEmail = datosGenerales?.emailAgencia || "agencia@ejemplo.com";

    const agenciaEmail = "agencia@ejemplo.com";
    const body = `
      Nombre: ${data.nombre}
      Apellido: ${data.apellido}
      Móvil: ${data.movil}
      Email: ${data.email}
      Producto: ${data.producto}
      Cantidad de pasajeros: ${data.cantidad}
      Fecha de compra: ${data.fechaCompra}
      Destino: ${data.destino}
      Motivo: ${data.motivo}

      Envío estas líneas para solicitar el desistimiento de mi compra online dentro de las 24 hs de haberla adquirida.
    `;

    try {
      await fetch("/api/enviar-arrepentimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: [agenciaEmail, data.email],
          subject: "Solicitud de desistimiento de compra",
          message: body,
        }),
      });

      alert("Tu solicitud fue enviada con éxito. Te llegará una copia al correo indicado.");
    } catch (e) {
      alert("Ocurrió un error al enviar la solicitud.");
    }
  }, [datosGenerales]);

  const menuItems = [
    {
      label: "Condiciones Generales",
      type: "download",
      onClick: () => window.open(datosGenerales?.terminosYCondiciones || "#", "_blank"),
    },
    {
      label: "Botón de Arrepentimiento",
      type: "modal",
      onClick: () => setOpenModal(true),
    },
  ];

  return (
    <Box sx={{ backgroundColor: "transparent", py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2, md: 0 }, width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        spacing={{ xs: 1, sm: 1.5, md: 2 }}
        justifyContent={{ xs: "center", md: "flex-end" }}
        alignItems={{ xs: "center", md: "center" }}
        textAlign="center"
        width="100%"
      >
        {menuItems.map((item, i) => (
          <Button
            key={i}
            variant="text"
            onClick={item.onClick}
            sx={{
              color: textoColor,
              fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
              fontFamily: tipografia,
              textTransform: "none",
              padding: "4px 8px",
              "&:hover": { color: colorHover },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      {/* Modal */}
      <BotonArrepentimientoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={enviarCorreo}
      />
    </Box>
  );
};

export default DerechaAbajo;
