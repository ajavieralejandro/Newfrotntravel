import { Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import { ReactNode } from "react";

interface FiltroItemProps {
  label: string;
  icon: ReactNode;
  isSmallScreen: boolean;
  colorPrimario: string;
  colorTipografia: string;
  tipografia: string;
}

const FiltroItem = ({ 
  label, 
  icon, 
  isSmallScreen, 
  colorPrimario, 
  colorTipografia,
  tipografia
}: FiltroItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // Comportamiento diferente para mobile/desktop
  const shouldShowText = isSmallScreen ? true : (isHovered || isSelected);
  const buttonWidth = isSmallScreen ? "240px" : (isHovered || isSelected ? "240px" : "40px");

  // Estilos coherentes para selección en todos los dispositivos
  const getBackgroundColor = () => {
    if (isSelected) {
      return colorPrimario; // Color primario cuando está seleccionado
    }
    return isSmallScreen ? "rgba(245, 245, 245, 0.9)" : "transparent";
  };

  const getColor = () => {
    return isSelected ? colorTipografia : colorPrimario;
  };

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Button
      variant={isSelected ? "contained" : "outlined"}
      onMouseEnter={() => !isSmallScreen && setIsHovered(true)}
      onMouseLeave={() => !isSmallScreen && setIsHovered(false)}
      onClick={handleClick}
      disableRipple={isSmallScreen}
      sx={{
        backgroundColor: getBackgroundColor(),
        color: getColor(),
        borderColor: colorPrimario,
        borderRadius: "20px",
        padding: "8px 16px",
        textTransform: "none",
        fontFamily: tipografia,
        fontSize: "0.9rem",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: isSmallScreen ? "flex-start" : "center",
        gap: shouldShowText ? 1.5 : 0,
        minHeight: 40,
        width: buttonWidth,
        maxWidth: "240px",
        transition: isSmallScreen 
          ? "background-color 0.2s ease, transform 0.1s ease" 
          : "all 0.3s ease",
        "&:hover": {
          backgroundColor: !isSelected 
            ? (isSmallScreen ? "rgba(240, 240, 240, 0.9)" : `${colorPrimario}20`)
            : colorPrimario,
        },
        "&:active": {
          transform: isSmallScreen ? "scale(0.98)" : "none",
          backgroundColor: isSelected 
            ? colorPrimario 
            : isSmallScreen 
              ? "rgba(235, 235, 235, 0.9)" 
              : `${colorPrimario}30`,
        },
        overflow: "hidden",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
        // Sombra sutil cuando está seleccionado en mobile/tablet
        boxShadow: isSelected && isSmallScreen ? `0 2px 4px 0 ${colorPrimario}40` : 'none',
      }}
    >
      <Box sx={{ 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "24px",
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      
      {shouldShowText && (
        <Typography
          sx={{
            fontFamily: tipografia,
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "inherit",
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {label}
        </Typography>
      )}
    </Button>
  );
};

export default FiltroItem;