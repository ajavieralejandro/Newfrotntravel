import { FunctionComponent } from "react";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import { useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface IzquierdaArribaProps {
  logo: string | null | undefined;
}

const IzquierdaArriba: FunctionComponent<IzquierdaArribaProps> = ({ logo }) => {
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();

  const tipografia =
    footer?.tipografia || datosGenerales?.tipografiaAgencia || "inherit";
  const textoColor =
    footer?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";
  const textoFooter =
    footer?.texto || "© 2025 Citrus Energía - Todos los derechos reservados";

  // ✅ Construcción segura del link de WhatsApp
  const whatsappLink = footer?.redes?.whatsapp;
  const linkWhatsApp =
    whatsappLink && whatsappLink.trim().length >= 5
      ? whatsappLink.startsWith("http")
        ? whatsappLink.trim()
        : `https://wa.me/${whatsappLink.replace(/\D/g, "")}`
      : null;

  const redes = [
    { icon: <FacebookOutlinedIcon />, link: footer?.redes?.facebook?.trim() || null, label: "Facebook" },
    { icon: <TwitterIcon />, link: footer?.redes?.twitter?.trim() || null, label: "Twitter" },
    { icon: <InstagramIcon />, link: footer?.redes?.instagram?.trim() || null, label: "Instagram" },
    { icon: <WhatsAppIcon />, link: linkWhatsApp, label: "WhatsApp" },
  ];

  return (
    <Stack direction="column" spacing={4}> {/* 👈 separa los 2 bloques principales */}
      
      {/* 🟢 BLOQUE 1: Logo + Contacto + Redes */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing={{ xs: 2, sm: 4 }}
      >
        {logo && (
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: { xs: "50vw", sm: "35vw", md: "250px", lg: "300px" },
              maxWidth: "100%",
              maxHeight: 180,
              objectFit: "contain",
              mx: { xs: "auto", sm: 0 },
              mb: { xs: 2, sm: 0 },
              display: "block",
            }}
          />
        )}

        <Typography
          variant="h6"
          sx={{
            color: textoColor,
            fontFamily: tipografia,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          Contacto
          {redes
            .filter((r) => r.link && r.link.trim().length >= 5)
            .map(({ icon, link, label }, index) => (
              <IconButton
                key={index}
                component="a"
                href={link!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  color: textoColor,
                  backgroundColor: "transparent",
                  border: `1px solid ${textoColor}`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  width: 40,
                  height: 40,
                }}
              >
                {icon}
              </IconButton>
            ))}
        </Typography>
      </Stack>

      {/* 🟡 BLOQUE 2: Texto footer + contacto */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 2, sm: 4 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: textoColor,
            fontFamily: tipografia,
            lineHeight: 1.6,
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
          }}
        >
          {textoFooter}
        </Typography>

        {/* Email */}
        {footer?.contacto.email && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <EmailIcon sx={{ color: textoColor }} />
            <Typography variant="body2" sx={{ color: textoColor, fontFamily: tipografia }}>
              {footer.contacto.email}
            </Typography>
          </Stack>
        )}

        {/* Teléfono */}
        {footer?.contacto.telefono && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <PhoneIcon sx={{ color: textoColor }} />
            <Typography variant="body2" sx={{ color: textoColor, fontFamily: tipografia }}>
              {footer.contacto.telefono}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default IzquierdaArriba;
