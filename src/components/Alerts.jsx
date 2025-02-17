"use client";
import { useAppContext } from "@/context/AppContext";
import Loader from "@/components/Loader";
import Alert from "@/components/Alert";

export default function Home() {
  const { alerta, setAlerta, modal, loader } = useAppContext();

  return (
    <>
      {(alerta === "Operación exitosa!" ||
        alerta === "Cuenta creada!" ||
        alerta === "Cambios realizados correctamente!"||
        alerta ==="Asignado correctamente!"    
    ) && (
        <Alert
          type={"success"}
          duration={5000}
          textColor={"text-black"}
          onClose={() => setAlerta("")}
        >
          {alerta}
        </Alert>
      )}
      {(alerta === "Error de datos!" || alerta === "Usuario existente!"|| alerta === "Error al asignar!") && (
        <Alert
          type={"error"}
          textColor={"text-gray-950"}
          duration={5000}
          onClose={() => setAlerta("")}
        >
          {alerta}
        </Alert>
      )}
      {loader === "Guardando..." && <Loader>Guardando...</Loader>}
      {modal === "Guardando..." && <Loader> {modal} </Loader>}
    </>
  );
}
