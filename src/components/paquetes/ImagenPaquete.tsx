import { CardMedia, Skeleton } from "@mui/material";

interface ImagenPaqueteProps {
  imagen: string | null;
  cargando?: boolean;
}

const ImagenPaquete = ({ imagen, cargando = false }: ImagenPaqueteProps) => {
  const src = imagen || "/imagenes/default-image.jpg";

  return cargando ? (
    <Skeleton variant="rectangular" width="100%" height="100%" />
  ) : (
    <CardMedia
      component="img"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      image={src}
      alt="Imagen del paquete"
    />
  );
};

export default ImagenPaquete;
