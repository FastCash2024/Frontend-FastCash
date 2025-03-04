import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import SelectSimple from "@/components/SelectSimple";
import { domainToASCII } from "url";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import FormLayout from "@/components/formModals/FormLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { obtenerSegmento } from "@/utils";

export default function FormDistributtonCasesSegment() {
  const {
    user,
    setAlerta,
    setModal,
    setLoader,
  } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [maximoAsignacion, setMaximoAsignacion] = useState(2);
  const [usuariosConAsignacion, setusuariosConAsignacion] = useState([]);
  const [casosNoAsignados, setCasosNoAsignados] = useState([]);
  const [casosAsignados, setCasosAsignados] = useState([]);
  const [calculate, setCalculate] = useState(false);
  const [type, setType] = useState("");
  const [casosPorSegmento, setCasosPorSegmento] = useState({})

  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");

  const cuentaUpdate =
    seccion === "Verificacion"
      ? "cuentaVerificador"
      : seccion === "coleccion"
        ? "cuentaCobrador"
        : "cuentaAuditor";

  const tipoDeGrupo =
    seccion === "Verificacion"
      ? "Asesor de Verificación"
      : seccion === "coleccion"
        ? "Asesor de Cobranza"
        : "Asesor de Auditoria";

  const estadoDeCredito =
    seccion === "Verificacion"
      ? "Pendiente"
      : seccion === "coleccion"
        ? "Dispersado"
        : "Pendiente";

  const query =
    seccion === "Verificacion"
      ? "Asesor de Verificación"
      : seccion === "coleccion"
        ? "Asesor de Cobranza"
        : "Asesor de Auditoria";

  console.log(user);
  const countByItemsLength = (data) => {
    const counts = {};
    data.forEach((obj) => {
      const length = obj.idCasosAsignados.length;
      counts[length] = (counts[length] || 0) + 1;
    });
    return Object.entries(counts).map(([length, count]) => ({
      itemsCount: parseInt(length, 10),
      objectsCount: count,
    }));
  };

  //DIVISION para reparticion igualitaria maxima
  function dividir(a, b) {
    if (b === 0) {
      return "Error: No se puede dividir entre 0";
    }
    const cociente = Math.floor(a / b);
    const residuo = a % b;
    if (cociente === 0) {
      return "Error: toca a 0";
    }
    return cociente;
  }


  const abortAssignment = () => {
    setMaximoAsignacion(2);
    setusuariosConAsignacion([]);
    setCasosNoAsignados([]);
    setCalculate(false);
    setCasosPorSegmento({});
    setCasosAsignados([]);
  };

  function onChangeHandler(e) {
    setMaximoAsignacion(e.target.value);
  }
  //Gardar asignaciones
  async function saveAsignation() {
    console.log("Cantidad de usuarios asignados: ", casosAsignados);
    setLoader("Guardando...");

    try {
      const requests = casosAsignados.map(async (i) => {
        if (i?.cuenta !== undefined && i?.nombreDeLaEmpresa !== undefined) {
          let bodyData = {
            [cuentaUpdate]: i.cuenta,
            nombreDeLaEmpresa: i.nombreDeLaEmpresa,
          };

          // Agregar la fecha según el estado del caso
          if (i.estadoDeCredito === "Pendiente") {
            bodyData.fechaDeTramitacionDelCaso = i.fechaDeTramitacionDelCaso;
          } else if (i.estadoDeCredito === "Dispersado") {
            bodyData.fechaDeTramitacionDeCobro = i.fechaDeTramitacionDeCobro;
          }

          const url = window?.location?.href?.includes("localhost")
            ? `http://localhost:3000/api/verification/${i._id}`
            : `https://api.fastcash-mx.com/api/verification/${i._id}`;

          const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
          });

          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }

          const result = await response.json();
          console.log("Actualización exitosa:", result);
          return result;
        }
      });

      // Esperar que todas las peticiones finalicen
      await Promise.all(requests);

      // Actualizar estado después de completar todas las solicitudes
      setAlerta("Operación exitosa!");
      setModal("");
      setLoader("");
    } catch (error) {
      setLoader("");
      setAlerta("Error de datos!");
    }
  }
  const assignCasesBySegment = async () => {
    setCalculate(true);
    setType("BySegment");

    const resUsers = await fetch(`https://api.fastcash-mx.com/api/auth/users?tipoDeGrupo=${query}&limit=1000`);
    const dataUsers = await resUsers.json();
    const verificadores = dataUsers.data.filter(i => i.tipoDeGrupo === tipoDeGrupo);

    const usuarios = verificadores.map(user => ({
      ...user,
      idCasosAsignados: []
    }));

    const resCases = await fetch("https://api.fastcash-mx.com/api/verification?&limit=1000");
    const dataVerification = await resCases.json();

    const casosPorSegmento = {
      D0: [], D1: [], D2: [], S1: [], S2: []
    };

    const fechaActual = new Date();

    dataVerification.data.forEach(caso => {
      console.log("fecha de reembolso: ", caso.fechaDeReembolso);
      
      const fechaReembolso = new Date(caso.fechaDeReembolso);
      const diferenciaDias = Math.floor((fechaReembolso - fechaActual) / (1000 * 60 * 60 * 24));
      console.log("fecha de reembolso dias: ", diferenciaDias);

      if (diferenciaDias === 0) {
        casosPorSegmento.D0.push(caso);
      } else if (diferenciaDias === 1) {
        casosPorSegmento.D1.push(caso);
      } else if (diferenciaDias === 2) {
        casosPorSegmento.D2.push(caso);
      } else if (diferenciaDias > 2 && diferenciaDias <= 7) {
        casosPorSegmento.S1.push(caso);
      } else if (diferenciaDias > 7) {
        casosPorSegmento.S2.push(caso);
      }
    });

    const asignacionesFinales = [];

    Object.keys(casosPorSegmento).forEach(segmento => {
      const casos = casosPorSegmento[segmento];
      const usuariosSegmento = usuarios.filter(user => obtenerSegmento(user.cuenta) === segmento);



      let usuarioIndex = 0;

      casos.forEach(caso => {
        if (usuariosSegmento.length > 0) {
          const usuario = usuariosSegmento[usuarioIndex];
          usuario.idCasosAsignados.push(caso.numeroDePrestamo);

          asignacionesFinales.push({
            ...caso,
            cuenta: usuario.cuenta,
            nombreDeLaEmpresa: usuario.origenDeLaCuenta,
            segmentoAsignado: segmento,
            fechaDeTramitacionDelCaso: caso.estadoDeCredito === "Pendiente" ? fechaActual.toISOString() : caso.fechaDeTramitacionDelCaso,
            fechaDeTramitacionDeCobro: caso.estadoDeCredito === "Dispersado" ? fechaActual.toISOString() : caso.fechaDeTramitacionDeCobro
          });

          usuarioIndex = (usuarioIndex + 1) % usuariosSegmento.length;
        }
      });
    });

    console.log("fecha de reembolso dias: ", asignacionesFinales);
    
    setusuariosConAsignacion(usuarios);
    setCasosAsignados(asignacionesFinales);
    setCasosPorSegmento(casosPorSegmento);
  };

  return (
    <FormLayout>
      <h4 className="text-gray-950">Distribuir Casos Masivos</h4>
      {!calculate && (
        <div className="flex justify-between items-center w-full">
          <label htmlFor="cantidadAsignacionIgualitaria" className="mr-5 text-sm text-gray-950">
            Cantidad:
          </label>
          <Input
            type="number"
            name="cantidadAsignacionIgualitaria"
            onChange={onChangeHandler}
            placeholder="5"
            value={maximoAsignacion}
            required
          />
          <Button theme="MiniPrimary" click={assignCasesBySegment}>Get</Button>
        </div>
      )}
      <div className="flex space-x-2 mt-4">
        {/* {!calculate && <Button theme="MiniPrimary" click={assignCasesEqually}>Asignación Igualitaria</Button>} */}
        {/* {!calculate && <Button theme="Success" click={assignCasesTotally}>Asignación Total</Button>} */}
        {!calculate && <Button theme="Info" click={assignCasesBySegment}>Asignación por Segmento</Button>}
      </div>
      <div className="mt-4">
        {Object.keys(casosPorSegmento).map(segmento => (
          <p key={segmento} className="text-sm text-gray-700">
            {segmento}: {casosPorSegmento[segmento].length} casos
          </p>
        ))}
      </div>
      <div className="mt-4">
        {calculate && (
          <>
            <button className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600" onClick={saveAsignation}>
              Confirmar guardar
            </button>
            <button className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600 ml-2" onClick={abortAssignment}>
              Abortar
            </button>
          </>
        )}
      </div>
    </FormLayout>
  );
}  