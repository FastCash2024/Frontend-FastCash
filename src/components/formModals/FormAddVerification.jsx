'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import { getDescripcionDeExcepcion } from "@/utils/utility-tacking";
import { getLocalISOString } from "@/utils/getDates";

export default function AddAccount() {
    const { user, userDB, setAlerta, setModal, setLoader, itemSelected } = useAppContext()
    const { theme } = useTheme();
    const [data, setData] = useState({})
    const [value, setValue] = useState('Por favor elige')

    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')


    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    function handlerSelectClick2(name, i, uuid) {
        setValue(i);
        setData((prevData) => ({
            ...prevData,
            estadoDeCredito: i,
        }));
    }

    async function updateUser() {
        if (!data.acotacionVerificador) {
            setAlerta('Falta acotación!')
            return
        }
        if (value === 'Por favor elige') {
            setAlerta('Falta estado de verificación!')
            return
        }
        const upadateData = {
            estadoDeCredito: value,

            descripcionDeExcepcion: getDescripcionDeExcepcion(item),
            subID: itemSelected._id,
            cuentaOperadora: userDB.cuenta,
            cuentaPersonal: userDB.emailPersonal,
            codigoDeSistema: itemSelected.nombreDelProducto,
            codigoDeOperacion: seccion === 'verificacion' ? '00VE' : '00RE',
            contenidoDeOperacion: `Credito ${itemSelected.numeroDePrestamo} ${value} con exito.`,
            fechaDeOperacion: getLocalISOString()
        }

        try {
            setLoader('Guardando...')
            const response = await fetch(window?.location?.href.includes('localhost')
                ? `http://localhost:3003/api/loans/verification/creditoaprobado/${itemSelected._id}`
                : `https://api.fastcash-mx.com/api/loans/verification/creditoaprobado/${itemSelected._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(upadateData),
            });

            console.log("respuesta dispersion: ", response);

            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }

            if (response.ok) {
                setAlerta('Operación exitosa!')
                setModal('')
                setLoader('')
            } else {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')
            throw new Error('Registration failed');
        }
    }

    return (
        <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-30' onClick={() => setModal('')}>
            <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal('')}
                >
                    X
                </button>
                <h4 className="text-gray-950">Registro de Verificación</h4>
                <div className='relative flex justify-between w-[300px] text-gray-950'>
                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                        Estado de Verificación:
                    </label>
                    <SelectSimple arr={['Aprobado', 'Reprobado']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'
                        bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                </div>
                <div className='relative flex justify-between w-[300px] text-gray-950'>
                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                        Acotación:
                    </label>
                    <textarea name="acotacionVerificador" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id="" onChange={onChangeHandler}></textarea>
                </div>
                <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={updateUser}>Registrar</button>
            </div>
        </div>
    )
}