import { useNavigate } from "react-router-dom";

export const useIrADetallePaquete = () => {
  const navigate = useNavigate();

  const irADetallePaquete = (id: number | string) => {
    navigate(`/paquetes/${id}`);
  };

  return irADetallePaquete;
};
