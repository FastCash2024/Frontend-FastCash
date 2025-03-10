import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useSearchParams } from "next/navigation";
import FormLayout from "@/components/formModals/FormLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { obtenerSegmento } from "@/utils";
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
  const assignMaximEqualy = async () => {
    const res = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=1000`)
    const verificadores = await res.json()
    const updatedUsers = verificadores.data.map(user => ({ ...user, idCasosAsignados: [] }));
    const resCases = await fetch(`https://api.fastcash-mx.com/api/loans/verification?limit=1000`)
    const dataVerification = await resCases.json()
    // const casesVerification = dataVerification.data.filter(i => i.estadoDeCredito === estadoDeCredito)
    console.log("cantidad de casos: ", casesVerification);
    console.log("cantidad de verificadores: ", verificadores);

    const resultado = dividir(dataVerification.data.length * 1, verificadores.data.length * 1);
    setMaximoAsignacion(resultado)
  }
  //Asignacion igualitaria
  const assignCasesEqually = async () => {
    setCalculate(true)
    setType('Equaly')
    const res = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=1000`)
    const data = await res.json()

    const verificadores = data.data.filter(i => i.tipoDeGrupo === tipoDeGrupo);
    const updatedUsers = verificadores.filter(user => user.emailPersonal).map(user => ({ ...user, idCasosAsignados: [] }));
    // const updatedUsers = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
    const resCases = await fetch('https://api.fastcash-mx.com/api/loans/verification?&limit=1000')
    const dataVerification = await resCases.json()
    // const casesVerification = dataVerification.data.filter(i => i.estadoDeCredito === estadoDeCredito)
    let unassignedCases = [...dataVerification.data];

    updatedUsers.forEach(user => {
      if (unassignedCases.length >= maximoAsignacion) {
        user.idCasosAsignados =
          unassignedCases
            .slice(0, maximoAsignacion)
            .map(caso => caso.numeroDePrestamo)
        unassignedCases = unassignedCases.slice(maximoAsignacion);
      }
    });

    // const fechaActual = new Date().toISOString();

    const updatedCases = dataVerification.data.map(caso => {
      const assignedUser = updatedUsers.find(user => user.idCasosAsignados.includes(caso.numeroDePrestamo));
      console.log("users: caso: ", updatedUsers);
      
      
      // let fechaDeTramitacionDelCaso = caso.estadoDeCredito === "Pendiente" ? fechaActual : caso.fechaDeTramitacionDelCaso;
      // let fechaDeTramitacionDeCobro = caso.estadoDeCredito === "Dispersado" ? fechaActual : caso.fechaDeTramitacionDeCobro;

      return assignedUser ? { ...caso, cuenta: assignedUser.cuenta, apodoDeUsuarioDeAuditoria: assignedUser.emailPersonal /*nombreDeLaEmpresa: assignedUser.origenDeLaCuenta, fechaDeTramitacionDelCaso, fechaDeTramitacionDeCobro*/ } : caso;
    });
    setusuariosConAsignacion(updatedUsers)
    setCasosNoAsignados(unassignedCases)
    setCasosAsignados(updatedCases)
  }
  //Asignacion totalitaria
  async function assignCasesTotally() {
    setCalculate(true)
    setType('Totaly')
    const res = await fetch(`https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=1000`)
    const data = await res.json()
    const verificadores = data.data.filter(i => i.tipoDeGrupo === tipoDeGrupo)
    const usuarios = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
    const resCases = await fetch('https://api.fastcash-mx.com/api/loans/verification?&limit=1000')
    const dataVerification = await resCases.json()
    console.log("data verification: ", dataVerification);

    // const asignaciones = dataVerification.data.filter(i => i.estadoDeCredito === estadoDeCredito)
    let usuarioIndex = 0; // Índice del usuario al que se asignará la siguiente tarea
    // Crear un mapa para rastrear las asignaciones por usuario
    const administracion = usuarios.map(usuario => ({ ...usuario, idCasosAsignados: [] }));

    const usuariosValidos = usuarios.filter(user => user.emailPersonal);

    console.log("usuariosValidos casos: ", usuariosValidos);
    

    // Actualizar las asignaciones con idUsuario y registrar en el mapa
    const asignacionesConUsuarios = dataVerification.data.map(asignacion => {
      const cuenta = usuariosValidos[usuarioIndex].cuenta;
      const apodoDeUsuarioDeAuditoria = usuariosValidos[usuarioIndex].emailPersonal;
      // Agregar esta tarea al usuario correspondiente
      const usuario = administracion.find(admin => admin.cuenta === cuenta);
      usuario.idCasosAsignados.push(asignacion.numeroDePrestamo);
      // Avanzar al siguiente usuario (circular)
      usuarioIndex = (usuarioIndex + 1) % usuarios.length;

      console.log("asignacion caso: ", asignacion);
      
      // let fechaDeTramitacionDelCaso = asignacion.estadoDeCredito === "Pendiente" ? fechaActual : asignacion.fechaDeTramitacionDelCaso;
      // let fechaDeTramitacionDeCobro = asignacion.estadoDeCredito === "Dispersado" ? fechaActual : asignacion.fechaDeTramitacionDeCobro;
      // Retornar la asignación actualizada
      return { ...asignacion, cuenta, apodoDeUsuarioDeAuditoria/*nombreDeLaEmpresa, fechaDeTramitacionDelCaso, fechaDeTramitacionDeCobro*/ };
    });
    setusuariosConAsignacion(administracion)
    setCasosAsignados(asignacionesConUsuarios)
    // setCasosNoAsignados(unassignedCases)
    // console.log({ asignacionesConUsuarios, administracion })
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
    console.log("Cantidad de usuarios asignados: ", casosAsignados);
    setLoader('Guardando...');

    try {
      const requests = casosAsignados.map(async (i) => {
        
        // if (i?.apodoDeUsuarioDeAuditoria !== undefined && i?.cuentaAuditor !== undefined) {
        // }
        let bodyData = {
          [cuentaUpdate]: i.cuenta,
          apodoDeUsuarioDeAuditoria: i.apodoDeUsuarioDeAuditoria
        };
        console.log("caso bodyData: ", bodyData);


        const url = window?.location?.href?.includes('localhost')
          ? `http://localhost:3003/api/loans/verification/${i._id}`
          : `https://api.fastcash-mx.com/api/loans/verification/${i._id}`;

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
      <h4 className="text-gray-950">Distribuir Casos Masivoooos</h4>
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

