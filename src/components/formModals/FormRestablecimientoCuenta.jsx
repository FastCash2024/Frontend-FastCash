'use client'
// import style from '../styles/Loader.module.css' 
import { useAppContext } from '@/context/AppContext.js'
import { generarContrasena } from '@/utils'

import FormLayout from '@/components/formModals/FormLayout'

import Button from '@/components/Button'
import { useSearchParams } from 'next/navigation'
import { postTracking } from '@/app/service/TrackingApi/tracking.service'
import { getLocalISOString } from '@/utils/getDates'
export default function Modal({ children, funcion, alert, cancelText, successText, seccion }) {

    const { setAlerta, checkedArr, setModal, loader, setLoader, userDB } = useAppContext()
    const searchParams = useSearchParams()
    const seccionParam = searchParams.get('seccion')
    const item = searchParams.get('item')

    const restabecimientoTotal = async () => {
        try {
            await Promise.all(checkedArr.map(async (i) => {
                const bodyData = item === 'Casos de Cobranza' ? {
                    cuentaCobrador: "no asignado",
                    nombreDeLaEmpresa: "no asignado",
                    fechaDeTramitacionDeCobro: null
                } : item === 'Recolección y Validación de Datos' ? {
                    cuentaVerificador: "no asignado",
                    nombreDeLaEmpresa: "no asignado",
                    fechaDeTramitacionDelCaso: null
                } : {};

                const response = await fetch(
                    window?.location?.href?.includes('localhost')
                        ? `http://localhost:3003/api/loans/verification/${i._id}`
                        : `https://api.fastcash-mx.com/api/loans/verification/${i._id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(bodyData),
                    }
                );

                if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
                console.log("Actualización exitosa:", await response.json());
            }));

            // ✅ Tracking después de todas las actualizaciones
            const trackingData = {
                descripcionDeExcepcion: "Restablecimiento total realizado",
                subID: checkedArr.map(i => i._id).join(", "),
                cuentaOperadora: "Sistema",
                cuentaPersonal: "Admin",
                codigoDeSistema: "GESTION",
                codigoDeOperacion: "CC01RMCAS",
                contenidoDeOperacion: `Se restablecieron ${checkedArr.length} cuentas.`,
                fechaDeOperacion: getLocalISOString(),
            };

            await postTracking(trackingData);

            setAlerta('Operación exitosa!');
            setModal('');
            setLoader('');

        } catch (error) {
            console.error("Error en la operación:", error);
            setLoader('');
            setAlerta('Error de datos!');
        }
    };

    const restablecimientoIndividual = async () => {
        try {
            let password = generarContrasena();
            const response = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3002/api/authSystem/register/${checkedArr[0]._id}`
                    : `https://api.fastcash-mx.com/api/authSystem/register/${checkedArr[0]._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ nombrePersonal: "No asignado", emailPersonal: "No Asignado", password }),
                }
            );

            if (!response.ok) throw new Error('Registration failed');

            const trackingData = {
                descripcionDeExcepcion: "Restablecimiento individual realizado",
                subID: checkedArr[0]._id,
                cuentaOperadora: "Sistema",
                cuentaPersonal: "Admin",
                codigoDeSistema: "GESTION",
                codigoDeOperacion: "CC01RMCAS",
                contenidoDeOperacion: `Se restableció los casos.`,
                fechaDeOperacion: getLocalISOString(),
            };

            await postTracking(trackingData);

            setAlerta('Operación exitosa!');
            setModal('');
            setLoader('');

        } catch (error) {
            console.error("Error en la operación:", error);
            setLoader('');
            setAlerta('Error de datos!');
        }
    };

    // Función principal
    const save = (e) => {
        e.preventDefault();
        setLoader('Guardando...');

        if (seccion === "verificacion individual") {
            restablecimientoIndividual();
        } else if (seccion === "verificacion total") {
            restabecimientoTotal();
        }
    };


    // function save(e) {
    //     e.preventDefault();
    //     setLoader('Guardando...')

    //     seccion === "verificacion individual" && restablecimientoIndividual()
    //     seccion === "verificacion total" && restabecimientoTotal()
    // }
    return (
        <FormLayout>
            <div className="p-6 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div className='text-[12px] text-black'>
                    {
                        seccion === "verificacion individual" && `Esta por restablecer la asignacion de cuenta personal a la cuenta operativa: ${checkedArr[0].cuenta}`
                    }
                    {
                        seccion === "verificacion total" && 'Esta por restablecer todas las asignaciones de cuentas operativas a casos de verificacion'
                    }
                </div>
                <br />
                <Button type="button" theme='Danger' className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg  inline-flex items-center px-5 py-4 text-center"
                    click={save}>
                    {successText ? successText : 'Si, confirmar.'}
                </Button>
            </div>
        </FormLayout>




    )
}
