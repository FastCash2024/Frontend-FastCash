"use client";
import { useAppContext } from "@/context/AppContext";
import Loader from "@/components/Loader";
import Alert from "@/components/Alert";

import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@/icons_SVG';

export default function Home() {
  const { alerta, setAlerta, modal, loader } = useAppContext();

  const [showUrlCopied, setShowUrlCopied] = useState(false);

  useEffect(() => {
    if (alerta === "Operación exitosa!") {
      setShowUrlCopied(true);
      setTimeout(() => {
        setShowUrlCopied(false);
      }, 3000);
    }
  }, [alerta]);

  return (
    <>
    {showUrlCopied && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-gray-200">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="text-red-600">URL-copiado</span>
          </div>
        </div>
      )}
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