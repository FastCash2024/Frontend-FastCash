import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useSearchParams } from "next/navigation";
import FormLayout from "@/components/formModals/FormLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { obtenerSegmento } from "@/utils";
import { getLocalISOString, today } from "@/utils/getDates";
export default function FormDistributionAuditors() {
  const { user, userDB, setUserProfile, setAlerta, users, modal, setModal, checkedArr, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
  const { theme, toggleTheme } = useTheme();
  const [maximoAsignacion, setMaximoAsignacion] = useState(2);
  const [usuariosConAsignacion, setusuariosConAsignacion] = useState([]);
  const [casosNoAsignados, setCasosNoAsignados] = useState([]);
  const [casosAsignados, setCasosAsignados] = useState([]);
  const [calculate, setCalculate] = useState(false);
  const [type, setType] = useState('');


  const searchParams = useSearchParams()
  const seccion = searchParams.get('seccion')
  const item = searchParams.get('item')



  const cuentaUpdate = seccion === 'auditoria'
    ? 'cuentaAuditor'
    : seccion === 'coleccion'
      ? 'cuentaCobrador'
      : 'cuentaAuditor'

  const tipoDeGrupo = seccion === 'auditoria'
    ? 'Asesor de Auditoria'
    : seccion === 'coleccion'
      ? 'Asesor de Cobranza'
      : 'Asesor de Auditoria'

  // const estadoDeCredito = seccion === 'Verificacion'
  //     ? 'Pendiente'
  //     : seccion === 'coleccion'
  //         ? 'Dispersado'
  //         : 'Pendiente'

  // const query = seccion === 'Verificacion'
  //     ? 'Asesor de Verificación'
  //     : seccion === 'coleccion'
  //         ? 'Asesor de Cobranza'
  //         : 'Asesor de Auditoria'

  console.log(user)
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

  // Asignacion igualitaria
  const assignMaximEqualy = async () => {
    const res = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=1000`)
    const verificadores = await res.json()

    
    const updatedUsers = verificadores.data.map(user => ({ ...user, idCasosAsignados: [] }));
    const resCases = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=1000`)
    const dataVerification = await resCases.json()
    // const casesVerification = dataVerification.data.filter(i => i.estadoDeCredito === estadoDeCredito)
    // console.log("cantidad de casos: ", casesVerification);
    console.log("cantidad de verificadores: ", verificadores);
    
    const resultado = dividir(dataVerification.data.length * 1, verificadores.data.length * 1);
    setMaximoAsignacion(resultado)
  }

  // Asignacion igualitaria
  const assignCasesEqually = async () => {
    setCalculate(true);
    setType('Equaly');
  
    // Obtener asesores de auditoría
    const res = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=1000`);
    const data = await res.json();
    
    // Filtrar solo los asesores con emailPersonal
    const auditores = data.data
      .filter(user => user.emailPersonal)
      .map(user => ({ ...user, idCasosAsignados: [] }));
  
    // Obtener los usuarios de verificación y cobranza
    const resCases = await fetch('https://api.fastcash-mx.com/api/authSystem/users?tipoGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=1000');
    const dataVerification = await resCases.json();
    let unassignedCases = [...dataVerification.data];
  
    if (auditores.length === 0 || unassignedCases.length === 0) {
      console.warn("No hay auditores o casos disponibles para asignar.");
      return;
    }
  
    // Calcular la cantidad de casos que se pueden asignar equitativamente
    const totalCasos = unassignedCases.length;
    const totalAuditores = auditores.length;
    const casosPorAuditor = Math.min(maximoAsignacion, Math.floor(totalCasos / totalAuditores));
    let casosSobrantes = totalCasos % totalAuditores; // Casos que sobran después de la distribución equitativa
  
    let index = 0;
    unassignedCases.forEach(caso => {
      if (auditores[index].idCasosAsignados.length < casosPorAuditor || (casosSobrantes > 0 && auditores[index].idCasosAsignados.length < maximoAsignacion)) {
        auditores[index].idCasosAsignados.push(caso.cuenta);
        caso.cuentaAuditor = auditores[index].cuenta;
        caso.apodoDeUsuarioDeAuditoria = auditores[index].emailPersonal;
  
        if (auditores[index].idCasosAsignados.length === casosPorAuditor + 1) {
          casosSobrantes--;
        }
      }
  
      index = (index + 1) % totalAuditores;
    });
  
    // Filtrar los casos no asignados
    // const casosNoAsignados = unassignedCases.filter(caso => !caso.cuentaAuditor);

    console.log("casos asignados: ", unassignedCases);
    
  
    setusuariosConAsignacion(auditores);
    setCasosAsignados(unassignedCases);
  };
  
  
  //Asignacion totalitaria
  async function assignCasesTotally() {
    setCalculate(true);
    setType('Totaly');

    // Obtener asesores de auditoría
    const resAuditores = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=1000`);
    const dataAuditores = await resAuditores.json();
    const auditores = dataAuditores.data.filter(i => i.tipoDeGrupo === tipoDeGrupo);

    // Crear estructura de usuarios auditores con array vacío de casos asignados
    const auditoresAsignados = auditores.map(user => ({ ...user, idCasosAsignados: [] }));

    // Obtener asesores de verificación y cobranza
    const resCases = await fetch('https://api.fastcash-mx.com/api/authSystem/users?tipoGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=1000');
    const dataVerification = await resCases.json();

    console.log("data verification: ", dataVerification);

    let auditorIndex = 0;
    const administracion = auditoresAsignados.map(auditor => ({ ...auditor, idCasosAsignados: [] }));

    // Filtrar solo usuarios válidos con emailPersonal
    const auditoresValidos = auditoresAsignados.filter(user => user.emailPersonal);

    // Asignar cada caso de verificación/cobranza a un auditor
    const asignacionesConAuditores = dataVerification.data.map(asignacion => {
        const auditorAsignado = auditoresValidos[auditorIndex]; // Seleccionamos un auditor de la lista
        const cuentaAuditor = auditorAsignado.cuenta;
        const apodoDeUsuarioDeAuditoria = auditorAsignado.emailPersonal;

        console.log("auditor asignado caso: ", auditorAsignado);
        
        const auditor = administracion.find(admin => admin.cuenta === cuentaAuditor);
        if (auditor) {
            auditor.idCasosAsignados.push(asignacion.numeroDePrestamo);
        }

        // Avanzar en el índice circularmente para la siguiente asignación
        auditorIndex = (auditorIndex + 1) % auditoresValidos.length;

        return { ...asignacion, cuentaAuditor, apodoDeUsuarioDeAuditoria };
    });
    console.log("casos asignados: ", asignacionesConAuditores);
    console.log("admin casos: ", administracion);
    setusuariosConAsignacion(administracion);
    setCasosAsignados(asignacionesConAuditores);
}


  const abortAssignment = () => {
    setMaximoAsignacion(2);
    setusuariosConAsignacion([]);
    setCasosNoAsignados([]);
    setCalculate(false);
  };

  function onChangeHandler(e) {
    setMaximoAsignacion(e.target.value)
  }

  //Gardar asignaciones
  async function saveAsignation() {
    // console.log("Cantidad de usuarios asignados: ", casosAsignados);
    setLoader('Guardando...');

    try {
      const requests = casosAsignados.map(async (i) => {
        
        // if (i?.apodoDeUsuarioDeAuditoria !== undefined && i?.cuentaAuditor !== undefined) {
        // }

        console.log("casos que se van a modificar bodyData: ", i);
        
        let bodyData = {
          cuentaAuditor: i.cuentaAuditor,
          cuentaPersonalAuditor: i.apodoDeUsuarioDeAuditoria,
          fechaDeAuditoria: getLocalISOString()
        };
        console.log("caso bodyData: ", bodyData);

        const url = window?.location?.href?.includes('localhost')
          ? `http://localhost:3002/api/authSystem/register/${i._id}`
          : `http://localhost:3002/api/authSystem/register/${i._id}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Actualización exitosa:", result);
        return result;
      });

      // Esperar que todas las peticiones finalicen
      await Promise.all(requests);

      // Actualizar estado después de completar todas las solicitudes
      setAlerta('Operación exitosa!');
      setModal('');
      setLoader('');
    } catch (error) {
      setLoader('');
      setAlerta('Error de datos!');
    }
  }

  return (
    <FormLayout>
      <h4 className="text-gray-950">Distribuir Casos Masivos Auditoria</h4>
      {!calculate &&
        <div className='flex justify-between items-center w-[100%] '>
          <label htmlFor="cantidadAsignacionIgualitaria" className={`mr-5 text-[11px]  ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
            Cantidad:
          </label>
          <Input
            type="number"
            name="cantidadAsignacionIgualitaria"
            onChange={onChangeHandler}
            placeholder="5"
            value={maximoAsignacion}
            uuid='123'
            required
          />
          <Button theme="MiniPrimary" click={assignMaximEqualy}> Get</Button>
        </div>
      }
      <div className="relative flex  w-full">
        {!calculate && <Button theme={'MiniPrimary'}
          click={assignCasesEqually}
        >
          Asignación Igualitaria
        </Button>}
        {!calculate && <Button
          theme={'Success'}
          click={assignCasesTotally}
        >
          Asignacion Total
        </Button>}

      </div>
      <div className="mt-4 space-x-2">
        {type !== 'Totaly'
          ? <div className=" rounded-[10px] my-5">
            {usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 === maximoAsignacion * 1).length !== 0 && <p className="text-[10px] text-green-900 bg-green-200 p-3 mb-3 border-[1px] border-green-900 font-medium rounded-md">
              {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 === maximoAsignacion * 1)).length} ASESORES SE ASIGNARAN CON {maximoAsignacion} CASOS
            </p>}
            {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 !== maximoAsignacion * 1)).length !== 0 && <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
              {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 !== maximoAsignacion * 1)).length} ASESORES NO SE ASIGNARAN CON {maximoAsignacion} CASOS
            </p>}
            {casosNoAsignados.length !== 0 && <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
              {casosNoAsignados.length} CASOS NO ASIGNADOS
            </p>}
          </div>
          : <div className=" rounded-[10px] my-5 ">
            {countByItemsLength(usuariosConAsignacion).map((row, index) => (
              row.itemsCount === 0
                ? <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
                  {row.objectsCount} usuarios tienen {row.itemsCount} casos asignados
                </p>
                : <p className="text-[10px] text-green-900 bg-green-200 p-3 mb-3 border-[1px] border-green-900 font-medium rounded-md">
                  {row.objectsCount} usuarios tienen {row.itemsCount} casos asignados
                </p>
            ))}
          </div>
        }
        {calculate && <button
          className="bg-green-500 text-white px-2 py-1 text-[10px] rounded hover:bg-green-600"
          onClick={saveAsignation}
        >
          Confirmar guardar
        </button>}
        {calculate && <button
          className="bg-red-500 text-white px-2 py-1 text-[10px] rounded hover:bg-red-600"
          onClick={abortAssignment}
        >
          Abortar
        </button>}
      </div>
    </FormLayout>)
}

