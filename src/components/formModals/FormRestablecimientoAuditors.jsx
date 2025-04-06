import React from 'react'
import { useAppContext } from '@/context/AppContext.js'
import { generarContrasena } from '@/utils'

import FormLayout from '@/components/formModals/FormLayout'

import Button from '@/components/Button'

export default function FormRestablecimientoAuditors({ successText, seccion }) {
    const { setAlerta, checkedArr, setModal, setLoader } = useAppContext()

    const restabecimientoTotal = () => {

        checkedArr.map(async (i) => {

            try {
                const response = await fetch(window?.location?.href?.includes('localhost')
                    ? `http://localhost:3002/api/authSystem/register/${i._id}`
                    : `https://api.fastcash-mx.com/api/authSystem/register/${i._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cuentaAuditor: "no asignado",
                        cuentaPersonalAuditor: "no asignado",
                    }), // Datos a enviar en el cuerpo de la petición
                });

                if (response.ok) {
                    checkedArr.length && setAlerta('Operación exitosa!')
                    checkedArr.length && setModal('')
                    checkedArr.length && setLoader('')
                } else {
                    setLoader('')
                    setAlerta('Error de datos!')

                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                const result = await response.json(); // Si el servidor devuelve JSON
                console.log("Actualización exitosa:", result);
                return result;
            } catch (error) {
                console.error("Error al realizar la solicitud:", error);
            }
        })


    };
    const restablecimientoIndividual = async () => {
        try {
            //GENERACION DE NUEVA CONTRASEÑA
            let password = generarContrasena()
            const response = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3002/api/authSystem/register/${checkedArr[0]._id}`
                    : `https://api.fastcash-mx.com/api/authSystem/register/${checkedArr[0]._id}`, {
                method: 'PUT', // El método es PUT para actualizar
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si estás usando JWT
                },
                body: JSON.stringify({ nombrePersonal: "No asignado", emailPersonal: "No Asignado", password }), // Los datos que queremos actualizar
            });
            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
            // Verificar si la respuesta es exitosa
            if (response.ok) {
                setAlerta('Operación exitosa!')
                setModal('')
                setLoader('')
                // navigate('/dashboard');
            } else {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')
            console.log(error)
            throw new Error(error);
        }
        return
    };
    function save(e) {
        e.preventDefault();
        setLoader('Guardando...')

        seccion === "verificacion individual" && restablecimientoIndividual()
        seccion === "auditoria" && restabecimientoTotal()
    }

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
                        seccion === "auditoria" && 'Esta por restablecer todas las asignaciones de cuentas de auditores a casos de verificacion'
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
