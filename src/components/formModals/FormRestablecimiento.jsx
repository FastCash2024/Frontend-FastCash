'use client'
import { useAppContext } from '@/context/AppContext.js'
import { generarContrasena } from '@/utils'

import FormLayout from '@/components/formModals/FormLayout'

import Button from '@/components/Button'
export default function Modal({ children, funcion, alert, cancelText, successText, seccion }) {

    const { setAlerta, checkedArr, setModal, setLoader } = useAppContext()

    const realizarBackup = async (tipo) => {
        try {
            setLoader('Guardando...');

            const url = window?.location?.href?.includes('localhost')
                ? `http://localhost:3007/api/loansBuckup/getTodos?tipo=${tipo}`
                : `https://api.fastcash-mx.com/api/loansBuckup/getTodos?tipo=${tipo}`;

            console.log("url seccion: ", url);

            const response = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            const data = await response.json();

            if (data.status) {
                setAlerta(`Backup realizado con éxito. Guardados: ${data.registrosGuardados}, Actualizados: ${data.registrosActualizados}`);
            } else {
                setAlerta('No se encontraron registros para guardar.');
            }

            setModal('');
            setLoader('');
        } catch (error) {
            setLoader('');
            setAlerta('Ocurrió un error al realizar el backup.');
            console.error(error);
        }
    };

    const restabecimientoTotal = () => {

        checkedArr.map(async (i, index) => {
            try {
                setLoader('Guardando...')
                //GENERACION DE NUEVA CONTRASEÑA
                let password = generarContrasena()
                const response = await fetch(
                    window?.location?.href?.includes('localhost')
                        ? `http://localhost:3002/api/authSystem/register/${i._id}`
                        : `https://api.fastcash-mx.com/api/authSystem/register/${i._id}`, {
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
                    index + 1 === checkedArr.length && setAlerta('Operación exitosa!')
                    index + 1 === checkedArr.length && setModal('')
                    index + 1 === checkedArr.length && setLoader('')
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
        })


    };
    const restablecimientoIndividual = async () => {
        try {
            setLoader('Guardando...')
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
        seccion === "verificacion individual" && restablecimientoIndividual()
        seccion === "verificacion total" && restabecimientoTotal()
        seccion === "verificacion total" && restabecimientoTotal()
        seccion === "cobro" && realizarBackup(seccion)
        seccion === "verificacion" && realizarBackup(seccion)
    }

    return (
        <FormLayout>
            <div className="p-6 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div className='text-[12px]'>
                    {
                        seccion === "verificacion individual" && `Esta por restablecer la asignacion de cuenta personal a la cuenta operativa: ${checkedArr[0].cuenta}`
                    }
                    {
                        seccion === "verificacion total" && 'Esta por restablecer todas las asignaciones de cuentas personales a cuentas operativas'
                    }
                    {
                        seccion === "cobro" && 'Esta por realizar un backoup todas las asignaciones de cuentas personales a cuentas operativas'
                    }
                    {
                        seccion === "verificacion" && 'Esta por realizar un backoup todas las asignaciones de cuentas personales a cuentas operativas'
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

