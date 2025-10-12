// components/paquetes/HotelesContent.tsx
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Hotel from "./Hotel";
import type { Hotel as HotelType } from "../../interfaces/Hotel";

type LegacyHotelItem = { hotel: HotelType };

interface HotelesContentProps {
  /** En PaqueteData puede venir objeto, array o null */
  hotel?: HotelType | HotelType[] | LegacyHotelItem[] | null;
  /** Legacy: aún podrían pasarte una lista */
  hoteles?: LegacyHotelItem[];
}

const HotelesContent: React.FC<HotelesContentProps> = ({ hotel, hoteles }) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("🧾 HotelesContent props:", { hotel, hoteles });
  }

  // Normalizamos SOLO para render (sin tocar estado global)
  const hotelesAmostrar: HotelType[] = (() => {
    if (Array.isArray(hotel)) {
      const arr = hotel as any[];
      if (arr.length > 0 && arr[0] && typeof arr[0] === "object" && "hotel" in arr[0]) {
        // Caso: hotel = [{ hotel: {...} }]
        return (arr as LegacyHotelItem[])
          .map((h) => h.hotel)
          .filter((x): x is HotelType => Boolean(x));
      }
      // Caso: hotel = [ {...}, {...} ] (HotelType[])
      return arr as HotelType[];
    }

    if (hotel) {
      // Caso: hotel = { ... } (HotelType)
      return [hotel as HotelType];
    }

    if (Array.isArray(hoteles) && hoteles.length > 0) {
      // Legacy prop
      return hoteles.map((h) => h.hotel).filter((x): x is HotelType => Boolean(x));
    }

    return [];
  })();

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("🏨 Hoteles a mostrar:", hotelesAmostrar);
  }

  if (hotelesAmostrar.length === 0) {
    return (
      <Box sx={{ mt: 2, px: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No hay hoteles disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Stack spacing={3}>
        {hotelesAmostrar.map((h, index) => (
          <motion.div
            key={String(h.id_hotel) || `hotel-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            style={{ borderRadius: 16 }}
          >
            <Hotel hotel={h} />
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default HotelesContent;
