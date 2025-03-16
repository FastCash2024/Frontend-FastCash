import { useEffect, useState } from "react";
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
import { getLocalISOString } from "@/utils/getDates";
import { diferenciaEnDias } from "@/utils/getDates";
import { ajustarFechaInicio, ajustarFechaFinal } from "@/utils";
import { obtenerFechaMexicoISO } from "@/utils/getDates";
export default function FormDistributtonCasesSegment() {
  const {
    user,
    setAlerta,
    setModal,
    setLoader,
  } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [maximoAsignacion, setMaximoAsignacion] = useState({
    D2: 2,
    D1: 2,
    D0: 1,
    S1: 2,
    S2: 2,
  });
  const [calculo, setCalculo] = useState({});


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

  const assignMaximEqualy = async () => {


    const resUsers = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=${query}&limit=1000`);
    const dataUsers = await resUsers.json();
    const verificadores = dataUsers.data.filter(i => i.tipoDeGrupo === tipoDeGrupo);


    const resCases = await fetch("https://api.fastcash-mx.com/api/loans/verification?&limit=1000");
    const dataVerification = await resCases.json();

    const casosPorSegmento = { D0: [], D1: [], D2: [], S1: [], S2: [] };
    const asesoresPorSegmento = { D0: [], D1: [], D2: [], S1: [], S2: [] };

    const fechaActual = new Date();

    dataVerification.data.filter(i => i.estadoDeCredito === estadoDeCredito).forEach(caso => {
      const fechaTramitacion = ajustarFechaInicio(caso.fechaDeTramitacionDelCaso)

      const fechaOriginal = new Date();
      fechaOriginal.setUTCDate(fechaOriginal.getUTCDate() + 7);

      const diferenciaDiasTramitacion = Math.round((new Date(fechaTramitacion) - fechaActual) * (-1) / (1000 * 60 * 60 * 24));

      // Validación: Si la fecha de tramitación es hoy, no se asigna
      if (diferenciaDiasTramitacion === 0) {
        console.log(`El caso ${caso.numeroDePrestamo} es reciente y no puede asignarse.`);
        return;
      }

      // Validación: Solo se asignan casos cuya fecha de tramitación tenga al menos 5 días
      if (diferenciaDiasTramitacion < 5) {
        console.log(`El caso ${caso.numeroDePrestamo} aún no puede asignarse. Se necesita esperar ${5 - diferenciaDiasTramitacion} días más.`);
        return;
      }


      if (diferenciaDiasTramitacion === 7) {
        casosPorSegmento.D0.push(caso);
      } else if (diferenciaDiasTramitacion === 6) {
        casosPorSegmento.D1.push(caso);
      } else if (diferenciaDiasTramitacion === 5) {
        casosPorSegmento.D2.push(caso);
      } else if (diferenciaDiasTramitacion > 7 && diferenciaDiasTramitacion < 15) {
        casosPorSegmento.S1.push(caso);
      } else if (diferenciaDiasTramitacion > 14 && diferenciaDiasTramitacion <= 22) {
        casosPorSegmento.S2.push(caso);
      }
    });


    verificadores.forEach(asesor => {

      if (asesor.cuenta.split('-')[2] === "D2") {
        asesoresPorSegmento.D2.push(asesor);
      } else if (asesor.cuenta.split('-')[2] === "D1") {
        asesoresPorSegmento.D1.push(asesor);
      } else if (asesor.cuenta.split('-')[2] === "D0") {
        asesoresPorSegmento.D0.push(asesor);
      } else if (asesor.cuenta.split('-')[2] === "S1") {
        asesoresPorSegmento.S1.push(asesor);
      } else if (asesor.cuenta.split('-')[2] === "S2") {
        asesoresPorSegmento.S2.push(asesor);
      }
    });
    console.log("verificadores", verificadores)

    console.log("asesoresPorSegmento", asesoresPorSegmento)
    const resultado = {};

    for (const segmento in casosPorSegmento) {
      const casosLength = casosPorSegmento[segmento].length;
      const asesoresLength = asesoresPorSegmento[segmento]?.length || 1; // Evitar división por 0

      resultado[segmento] = {
        dividendo: casosLength,
        divisor: asesoresLength,
        divisionExacta: Math.floor(casosLength / asesoresLength),
        residuo: casosLength % asesoresLength
      };
    }

    console.log(resultado);
    setCalculo(resultado)
  }

  const abortAssignment = () => {
    setusuariosConAsignacion([]);
    setCasosNoAsignados([]);
    setCalculate(false);
    setCasosPorSegmento({});
    setCasosAsignados([]);
  };

  function onChangeHandler(e, seg) {
    if (seg === "D2") setMaximoAsignacion({ ...maximoAsignacion, [seg]: e.target.value });
    if (seg === "D1") setMaximoAsignacion({ ...maximoAsignacion, [seg]: e.target.value });
    if (seg === "D0") setMaximoAsignacion({ ...maximoAsignacion, [seg]: e.target.value });
    if (seg === "S1") setMaximoAsignacion({ ...maximoAsignacion, [seg]: e.target.value });
    if (seg === "S2") setMaximoAsignacion({ ...maximoAsignacion, [seg]: e.target.value });

  }

  const assignCasesBySegment = async (mode) => {
    setCalculate(true);
    setType("BySegment");

    const resUsers = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=${query}&limit=1000`);
    const dataUsers = await resUsers.json();
    const verificadores = dataUsers.data.filter(i => i.tipoDeGrupo === tipoDeGrupo);

    const usuarios = verificadores.map(user => ({
      ...user,
      idCasosAsignados: []
    }));

    const resCases = await fetch("https://api.fastcash-mx.com/api/loans/verification?&limit=1000");
    const dataVerification = await resCases.json();

    const casosPorSegmento = { D0: [], D1: [], D2: [], S1: [], S2: [] };
    const fechaActual = new Date();

    dataVerification.data.filter(i => i.estadoDeCredito === estadoDeCredito).forEach(caso => {
      const fechaTramitacion = ajustarFechaInicio(caso.fechaDeTramitacionDelCaso)

      const fechaOriginal = new Date();
      fechaOriginal.setUTCDate(fechaOriginal.getUTCDate() + 7);

      const diferenciaDiasTramitacion = Math.round((new Date(fechaTramitacion) - fechaActual) * (-1) / (1000 * 60 * 60 * 24));

      // Validación: Si la fecha de tramitación es hoy, no se asigna
      if (diferenciaDiasTramitacion === 0) {
        console.log(`El caso ${caso.numeroDePrestamo} es reciente y no puede asignarse.`);
        return;
      }

      // Validación: Solo se asignan casos cuya fecha de tramitación tenga al menos 5 días
      if (diferenciaDiasTramitacion < 5) {
        console.log(`El caso ${caso.numeroDePrestamo} aún no puede asignarse. Se necesita esperar ${5 - diferenciaDiasTramitacion} días más.`);
        return;
      }


      if (diferenciaDiasTramitacion === 7) {
        casosPorSegmento.D0.push(caso);
      } else if (diferenciaDiasTramitacion === 6) {
        casosPorSegmento.D1.push(caso);
      } else if (diferenciaDiasTramitacion === 5) {
        casosPorSegmento.D2.push(caso);
      } else if (diferenciaDiasTramitacion > 7 && diferenciaDiasTramitacion < 15) {
        casosPorSegmento.S1.push(caso);
      } else if (diferenciaDiasTramitacion > 14 && diferenciaDiasTramitacion <= 22) {
        casosPorSegmento.S2.push(caso);
      }
    });


    console.log("casosPorSegmento", casosPorSegmento)

    mode !== "equaly"
      ? Object.keys(casosPorSegmento).map(segmento => {
        const cobradoresDeSegmento = verificadores.filter(i => i.cuenta.includes(`${segmento}-`))
        casosPorSegmento[segmento].length > 0 && cobradoresDeSegmento.length > 0 && assignCasesTotally(casosPorSegmento[segmento], segmento, cobradoresDeSegmento)
      })
      : Object.keys(casosPorSegmento).map(segmento => {
        const cobradoresDeSegmento = verificadores.filter(i => i.cuenta.includes(`${segmento}-`))
        casosPorSegmento[segmento].length > 0 && cobradoresDeSegmento.length > 0 && assignCasesEquallyBySegment(casosPorSegmento[segmento], segmento, cobradoresDeSegmento)
      });

    setCasosPorSegmento(casosPorSegmento);
  };

  let asignacionesFinales = []
  let casosSinAsignacion = [];
  let usuariosConCasos = [];
  function assignCasesTotally(asignaciones, tipoDeGrupo, verificadores) {
    setCalculate(true)
    setType('Totaly')

    const usuarios = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));

    let usuarioIndex = 0; // Índice del usuario al que se asignará la siguiente tarea
    // Crear un mapa para rastrear las asignaciones por usuario
    const administracion = usuarios.map(usuario => ({ ...usuario, idCasosAsignados: [] }));

    const fechaActual = obtenerFechaMexicoISO();

    // Actualizar las asignaciones con idUsuario y registrar en el mapa
    const asignacionesConUsuarios = asignaciones.map(asignacion => {
      const cuenta = usuarios[usuarioIndex]?.cuenta;
      const nombreDeLaEmpresa = usuarios[usuarioIndex]?.origenDeLaCuenta;
      // Agregar esta tarea al usuario correspondiente
      const usuario = administracion.find(admin => admin.cuenta === cuenta);
      usuario?.idCasosAsignados.push(asignacion.numeroDePrestamo);
      // Avanzar al siguiente usuario (circular)
      usuarioIndex = (usuarioIndex + 1) % usuarios.length;

      let fechaDeTramitacionDeCobro = fechaActual;
      // Retornar la asignación actualizada
      return { ...asignacion, cuentaCobrador: cuenta, nombreDeLaEmpresa, fechaDeTramitacionDeCobro };
    });

    console.log("casosAsignados", asignacionesConUsuarios)
    console.log("administracion", administracion)

    asignacionesFinales = [...asignacionesFinales, ...asignacionesConUsuarios]
    usuariosConCasos = [...usuariosConCasos, ...administracion]

    setusuariosConAsignacion(usuariosConCasos);
    setCasosAsignados(asignacionesFinales);

  }

  const assignCasesEquallyBySegment = async (casesVerification, tipoDeGrupo, verificadores) => {
    setCalculate(true)
    console.log("cases equally", casesVerification, verificadores)
    const updatedUsers = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));

    let unassignedCases = [...casesVerification];

    updatedUsers.forEach(user => {
      if (unassignedCases.length >= maximoAsignacion[tipoDeGrupo]) {
        user.idCasosAsignados =
          unassignedCases
            .slice(0, maximoAsignacion[tipoDeGrupo])
            .map(caso => caso.numeroDePrestamo)
        unassignedCases = unassignedCases.slice(maximoAsignacion[tipoDeGrupo]);
      }
    });

    const fechaActual = obtenerFechaMexicoISO();

    const updatedCases = casesVerification.map(caso => {
      const assignedUser = updatedUsers.find(user => user.idCasosAsignados.includes(caso.numeroDePrestamo));
      let fechaDeTramitacionDeCobro = fechaActual;

      return assignedUser ? { ...caso, cuentaCobrador: assignedUser.cuenta, nombreDeLaEmpresa: assignedUser.origenDeLaCuenta, fechaDeTramitacionDeCobro } : caso;
    });


    asignacionesFinales = [...asignacionesFinales, ...updatedCases]
    usuariosConCasos = [...usuariosConCasos, ...updatedUsers]
    casosSinAsignacion = [...casosSinAsignacion, ...unassignedCases]

    setusuariosConAsignacion(usuariosConCasos)
    setCasosNoAsignados(casosSinAsignacion)
    setCasosAsignados(updatedCases)
  }
  console.log("casosSinAsignacion:", casosNoAsignados)

  async function saveAsignation() {
    console.log("Cantidad de usuarios asignados: ", casosAsignados);

    setLoader("Guardando...");

    try {
      const requests = casosAsignados.map(async (i) => {
        if (i?.cuentaCobrador !== undefined && i?.nombreDeLaEmpresa !== undefined) {
          let bodyData = {
            cuentaCobrador: i.cuentaCobrador,
            nombreDeLaEmpresa: i.nombreDeLaEmpresa,
          };

          // Agregar la fecha según el estado del caso
          if (i.estadoDeCredito === "Pendiente") {
            bodyData.fechaDeTramitacionDelCaso = i.fechaDeTramitacionDelCaso;
          } else if (i.estadoDeCredito === "Dispersado") {
            bodyData.fechaDeTramitacionDeCobro = i.fechaDeTramitacionDeCobro;
          }

          const url = window?.location?.href?.includes("localhost")
            ? `http://localhost:3003/api/loans/verification/${i._id}`
            : `https://api.fastcash-mx.com/api/loans/verification/${i._id}`;

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



  const casosPorSegmentoSinAsignar = { D0: [], D1: [], D2: [], S1: [], S2: [] };


  function counterUnsignadedCases() {
    const fechaActual = new Date();

    casosNoAsignados.filter(i => i.estadoDeCredito === "Dispersado").forEach(caso => {
      const fechaTramitacion = ajustarFechaInicio(caso.fechaDeTramitacionDelCaso)

      const fechaOriginal = new Date();
      fechaOriginal.setUTCDate(fechaOriginal.getUTCDate() + 7);

      const diferenciaDiasTramitacion = Math.round((new Date(fechaTramitacion) - fechaActual) * (-1) / (1000 * 60 * 60 * 24));

      // Validación: Si la fecha de tramitación es hoy, no se asigna
      if (diferenciaDiasTramitacion === 0) {
        console.log(`El caso ${caso.numeroDePrestamo} es reciente y no puede asignarse.`);
        return;
      }

      // Validación: Solo se asignan casos cuya fecha de tramitación tenga al menos 5 días
      if (diferenciaDiasTramitacion < 5) {
        console.log(`El caso ${caso.numeroDePrestamo} aún no puede asignarse. Se necesita esperar ${5 - diferenciaDiasTramitacion} días más.`);
        return;
      }


      if (diferenciaDiasTramitacion === 7) {
        casosPorSegmentoSinAsignar.D0.push(caso);
      } else if (diferenciaDiasTramitacion === 6) {
        casosPorSegmentoSinAsignar.D1.push(caso);
      } else if (diferenciaDiasTramitacion === 5) {
        casosPorSegmentoSinAsignar.D2.push(caso);
      } else if (diferenciaDiasTramitacion > 7 && diferenciaDiasTramitacion < 15) {
        casosPorSegmentoSinAsignar.S1.push(caso);
      } else if (diferenciaDiasTramitacion > 14 && diferenciaDiasTramitacion <= 22) {
        casosPorSegmentoSinAsignar.S2.push(caso);
      }
    });

    return { ...casosPorSegmentoSinAsignar }
  }

  useEffect(() => {
    assignMaximEqualy()
  }, [])
  return (
    <FormLayout>
      <h4 className="text-gray-950">Distribuir Casos de Cobranza</h4>

     {!calculate && (  <div className="bg-gray-100 w-full p-3">


    
     
        <>
          <div className="flex italic text-[10px]">
            <span className="inline-block ml-5">Casos: {calculo?.D2?.dividendo}</span>
            <span className="inline-block ml-5">Asesores{calculo?.D2?.divisor}</span>
            <span className="inline-block ml-5">Igualitario: {calculo?.D2?.divisionExacta}</span>
            <span className="inline-block ml-5">Restante: {calculo?.D2?.residuo}</span>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <label htmlFor="cantidadAsignacionIgualitaria" className="mr-5 text-[10px] text-gray-950">
              D2:
            </label>
            <Input
              type="number"
              name="cantidadAsignacionIgualitaria"
              onChange={(e) => onChangeHandler(e, "D2")}
              placeholder={maximoAsignacion["D2"]}
              value={maximoAsignacion["D2"]}
              required
            />
          </div>
          <div className="flex italic  text-[10px]">
            <span className="inline-block ml-5">Casos: {calculo?.D1?.dividendo}</span>
            <span className="inline-block ml-5">Asesores{calculo?.D1?.divisor}</span>
            <span className="inline-block ml-5">Igualitario: {calculo?.D1?.divisionExacta}</span>
            <span className="inline-block ml-5">Restante: {calculo?.D1?.residuo}</span>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <label htmlFor="cantidadAsignacionIgualitaria" className="mr-5 text-[10px] text-gray-950">
              D1:
            </label>
            <Input
              type="number"
              name="cantidadAsignacionIgualitaria"
              onChange={(e) => onChangeHandler(e, "D1")}
              placeholder={maximoAsignacion["D1"]}
              value={maximoAsignacion["D1"]}
              required
            />
          </div>
          <div className="flex italic  text-[10px]">
            <span className="inline-block ml-5">Casos: {calculo?.D0?.dividendo}</span>
            <span className="inline-block ml-5">Asesores{calculo?.D0?.divisor}</span>
            <span className="inline-block ml-5">Igualitario: {calculo?.D0?.divisionExacta}</span>
            <span className="inline-block ml-5">Restante: {calculo?.D0?.residuo}</span>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <label htmlFor="cantidadAsignacionIgualitaria" className="mr-5 text-[10px] text-gray-950">
              D0:
            </label>
            <Input
              type="number"
              name="cantidadAsignacionIgualitaria"
              onChange={(e) => onChangeHandler(e, "D0")}
              placeholder={maximoAsignacion["D0"]}
              value={maximoAsignacion["D0"]}
              required
            />
          </div>
          <div className="flex italic  text-[10px]">
            <span className="inline-block ml-5">Casos: {calculo?.S1?.dividendo}</span>
            <span className="inline-block ml-5">Asesores{calculo?.S1?.divisor}</span>
            <span className="inline-block ml-5">Igualitario: {calculo?.S1?.divisionExacta}</span>
            <span className="inline-block ml-5">Restante: {calculo?.S1?.residuo}</span>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <label htmlFor="cantidadAsignacionIgualitaria" className="mr-5 text-[10px] text-gray-950">
              S1:
            </label>
            <Input
              type="number"
              name="cantidadAsignacionIgualitaria"
              onChange={(e) => onChangeHandler(e, "S1")}
              placeholder={maximoAsignacion["S1"]}
              value={maximoAsignacion["S1"]}
              required
            />
          </div>
          <div className="flex italic  text-[10px]">
            <span className="inline-block ml-5">Casos: {calculo?.S2?.dividendo}</span>
            <span className="inline-block ml-5">Asesores{calculo?.S2?.divisor}</span>
            <span className="inline-block ml-5">Igualitario: {calculo?.S2?.divisionExacta}</span>
            <span className="inline-block ml-5">Restante: {calculo?.S2?.residuo}</span>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <label htmlFor="cantidadAsignacionIgualitaria" className="mr-5 text-[10px] text-gray-950">
              S2:
            </label>
            <Input
              type="number"
              name="cantidadAsignacionIgualitaria"
              onChange={(e) => onChangeHandler(e, "S2")}
              placeholder={maximoAsignacion["S2"]}
              value={maximoAsignacion["S2"]}
              required
            />
          </div>
        </>


     
      <div className="flex w-full mt-4">
        {!calculate && <Button theme="MiniPrimary" click={() => assignCasesBySegment("equaly")}>Asignación Igualitaria</Button>}
        {!calculate && <Button theme="Success" click={() => assignCasesBySegment("totaly")}>Asignación Total</Button>}
        {/* {!calculate && <Button theme="Info" click={assignCasesBySegment}>Asignación Igualitaria</Button>} */}
      </div>

      </div> )}
      {Object.keys(casosPorSegmento).length > 0 && <div className="mt-4  border border-gray-300 py-4 px-10 flex flex-col items-center">
        <h4 className="text-semibold text-green-500 pb-5 text-[12px]"> Casos por segmento </h4>

        {Object.keys(casosPorSegmento).map(segmento => (
          <p key={segmento} className={`text-[12px] w-[100px] flex justify-between text-gray-700 ${casosPorSegmento[segmento].length > 0 && " bg-green-300"}`}>
            <span>{segmento}:</span> <span>→ </span>  <span className="">{casosPorSegmento[segmento].length} casos</span>
          </p>
        ))}
      </div>}
      {calculate && <div className="mt-4 space-x-2">
        <div className="w-[300px] min-h-[50px] max-h-[200px] overflow-y-auto bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-[10px] p-2">Segmento</th>
                <th className="text-[10px] p-2">Cuenta</th>
                <th className="text-[10px] p-2">Casos</th>

              </tr>
            </thead>
            <tbody>
              {usuariosConAsignacion.map((i, index) => (
                <tr key={index} className="bg-white">
                  <td className="text-center text-[10px] p-1">{i.cuenta.split("-")[2]}</td>
                  <td className="text-center text-[10px] p-1">{i.cuenta}</td>
                  <td className="text-center text-[10px] p-1">{i.idCasosAsignados.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* <div className="w-[300px] min-h-[50px] max-h-[200px] overflow-y-auto bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-[10px] p-2">Segmento</th>
                <th className="text-[10px] p-2">Sin asignar</th>

              </tr>
            </thead>
            <tbody>
              {console.log(counterUnsignadedCases())}
              {Object.keys(counterUnsignadedCases()).map((seg, index) => (
                <tr key={index} className="bg-white">
                  {console.log("SIN SG", counterUnsignadedCases[seg])}
                  <td className="text-center text-[10px] p-1">{seg}</td>
                  <td className="text-center text-[10px] p-1">{counterUnsignadedCases[seg]?.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        <br />

        <div className="text-center">

          <button
            className="bg-green-500 text-white px-2 py-1 text-[10px] rounded hover:bg-green-600"
            onClick={saveAsignation}
          >
            Confirmar guardar
          </button>
          <button
            className="ml-5 bg-red-500 text-white px-2 py-1 text-[10px] rounded hover:bg-red-600"
            onClick={abortAssignment}
          >
            Abortar
          </button>
        </div>

      </div>}
    </FormLayout >
  );
}  