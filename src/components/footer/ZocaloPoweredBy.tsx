import { FunctionComponent } from "react";
import { Box, Typography, Stack } from "@mui/material";

const ZocaloPoweredBy: FunctionComponent = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#373939",
        py: 1,
        px: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#FFFFFF",
            fontFamily: "Ubuntu, sans-serif",
            fontSize: 14,
          }}
        >
          Powered by
        </Typography>
        <Box
          component="img"
          src="/travelconnectlogo.jpg"
          alt="TravelConnect logo"
          sx={{
            height: 20,
            objectFit: "contain",
            display: "block",
            mt: "-0.95cm", // ⬅️ ~1 centímetro arriba
          }}
        />
      </Stack>
    </Box>
  );
};

export default ZocaloPoweredBy;
