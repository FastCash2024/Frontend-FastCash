'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import FormLayout from '@/components/formModals/FormLayout'
import Button from '@/components/Button'
import Input from "@/components/Input";

export default function AddAccount({query, estadoDeCredito,}) {
    const { setAlerta, setModal, setLoader } = useAppContext()
    const { theme } = useTheme();
    const [maximoAsignacion, setMaximoAsignacion] = useState(2);
    const [usuariosConAsignacion, setusuariosConAsignacion] = useState([]);
    const [casosNoAsignados, setCasosNoAsignados] = useState([]);
    const [casosAsignados, setCasosAsignados] = useState([]);
    const [calculate, setCalculate] = useState(false);
    const [type, setType] = useState('');

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
        const res = await fetch('https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Verificación')
        const verificadores = await res.json()
        const updatedUsers = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
        const resCases = await fetch('https://api.fastcash-mx.com/api/loans/verification/')
        const dataVerification = await resCases.json()
        const casesVerification = dataVerification.filter(i => i.estadoDeCredito === 'Pendiente')
        const resultado = dividir(casesVerification.length * 1, verificadores.data.length * 1);
        setMaximoAsignacion(resultado)
    }
    //Asignacion igualitaria
    const assignCasesEqually = async () => {
        setCalculate(true)
        setType('Equaly')
        const res = await fetch('https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Verificación')
        const data = await res.json()
        const verificadores = data.filter(i => i.tipoDeGrupo === 'Asesor de Verificación')
        const updatedUsers = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
        const resCases = await fetch('https://api.fastcash-mx.com/api/loans/verification/')
        const dataVerification = await resCases.json()
        const casesVerification = dataVerification.filter(i => i.estadoDeCredito === 'Pendiente')
        let unassignedCases = [...casesVerification];
        updatedUsers.forEach(user => {
            if (unassignedCases.length >= maximoAsignacion) {
                user.idCasosAsignados =
                    unassignedCases
                        .slice(0, maximoAsignacion)
                        .map(caso => caso.numeroDePrestamo)
                unassignedCases = unassignedCases.slice(maximoAsignacion);
            }
        });
        const updatedCases = casesVerification.map(caso => {
            const assignedUser = updatedUsers.find(user => user.idCasosAsignados.includes(caso.numeroDePrestamo));
            return assignedUser ? { ...caso, cuenta: assignedUser.cuenta, nombreDeLaEmpresa: assignedUser.origenDeLaCuenta } : caso;
        });
        setusuariosConAsignacion(updatedUsers)
        setCasosNoAsignados(unassignedCases)
        setCasosAsignados(updatedCases)
    }
    //Asignacion totalitaria
    async function assignCasesTotally() {
        setCalculate(true)
        setType('Totaly')
        const res = await fetch('https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Verificación')
        const data = await res.json()
        const verificadores = data.filter(i => i.tipoDeGrupo === 'Asesor de Verificación')
        const usuarios = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
        const resCases = await fetch('https://api.fastcash-mx.com/api/loans/verification/')
        const dataVerification = await resCases.json()
        const asignaciones = dataVerification.filter(i => i.estadoDeCredito === 'Pendiente')
        let usuarioIndex = 0; // Índice del usuario al que se asignará la siguiente tarea
        // Crear un mapa para rastrear las asignaciones por usuario
        const administracion = usuarios.map(usuario => ({ ...usuario, idCasosAsignados: [] }));
        // Actualizar las asignaciones con idUsuario y registrar en el mapa
        const asignacionesConUsuarios = asignaciones.map(asignacion => {
            const cuenta = usuarios[usuarioIndex].cuenta;
            const nombreDeLaEmpresa = usuarios[usuarioIndex].origenDeLaCuenta;
            // Agregar esta tarea al usuario correspondiente
            const usuario = administracion.find(admin => admin.cuenta === cuenta);
            usuario.idCasosAsignados.push(asignacion.numeroDePrestamo);
            // Avanzar al siguiente usuario (circular)
            usuarioIndex = (usuarioIndex + 1) % usuarios.length;
            // Retornar la asignación actualizada
            return { ...asignacion, cuenta, nombreDeLaEmpresa };
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
    function saveAsignation() {
        console.log(usuariosConAsignacion)
        setLoader('Guardando...')
        casosAsignados.map(async (i) => {
            if (i?.cuenta !== undefined, i?.nombreDeLaEmpresa !== undefined)
                try {
                    const response = await fetch(window?.location?.href?.includes('localhost')
                        ? `http://localhost:3003/api/loans/verification/${i._id}`
                        : `https://api.fastcash-mx.com/api/loans/verification/${i._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cuentaVerificador: i.cuenta,
                            nombreDeLaEmpresa: i.nombreDeLaEmpresa
                        }), // Datos a enviar en el cuerpo de la petición
                    });
                    if (response.ok) {
                        setAlerta('Operación exitosa!')
                        setModal('')
                        setLoader('')
                    } else {
                        setLoader('')
                        setAlerta('Error de datos!')
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }
                    const result = await response.json();
                    console.log("Actualización exitosa:", result);
                    return result;
                } catch (error) {
                    console.error("Error al realizar la solicitud:", error);
                }
            console.log({ cuenta: i.cuenta, nombreDeLaEmpresa: i.nombreDeLaEmpresa })
        })
    }
    return (
        <FormLayout>
            <h4 className="text-gray-950">Distribuir Casos Masivossssssssssss</h4>
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

