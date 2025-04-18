'use client'

import { useState, useEffect } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import Input from "@/components/Input";

import { UserCircleIcon } from '@heroicons/react/24/solid';


export default function AddAccount() {
    const { setAlerta, setModal, checkedArr, loader, setLoader } = useAppContext()
    const { theme } = useTheme();
    const [filter, setFilter] = useState('');
    const [filterArr, setFilterArr] = useState([])
    const [selectAccount, setSelectAccount] = useState(null);

    const searchParams = useSearchParams()

    const seccion = searchParams.get('seccion')

    const item = searchParams.get('item')
    
    function onChangeHandler(e) {
        setFilter(e.target.value)
    }

    function handlerSelectAccount(i) {
        setSelectAccount(i)
    }

    const saveAccount = (e) => {
        e.preventDefault();
       
        setLoader('Guardando...')

        checkedArr.map(async (i) => {
            if (selectAccount?.cuenta !== undefined, selectAccount?.origenDeLaCuenta !== undefined)
                try {
                    const response = await fetch(window?.location?.href?.includes('localhost')
                        ? `http://localhost:3003/api/loans/verification/${i._id}`
                        : `https://api.fastcash-mx.com/api/loans/verification/${i._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cuentaVerificador: selectAccount.cuenta,
                            nombreDeLaEmpresa: selectAccount.origenDeLaCuenta
                        }),
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
                    const result = await response.json();
                    return result;
                } catch (error) {
                    console.error("Error al realizar la solicitud:", error);
                }
        })
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3002/api/authSystem/users'
                : 'https://api.fastcash-mx.com/api/authSystem/users', {
                params: {
                    tipoDeGrupo: 'Asesor de Verificación'
                },
            }
            );
            setFilterArr(response.data); // Actualiza la lista de usuarios
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    console.log(filterArr)

    useEffect(() => {
        fetchUsers()
    }, [loader])

    return <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-40' onClick={() => setModal('')}>
        <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[450px] h-[450px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
            <button
                className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                onClick={() => setModal('')}
            >
                X
            </button>
            <h4 className='w-full text-center text-gray-950'>Asignar Cuenta</h4>
            <div className='flex justify-between w-full max-w-[300px]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Buscar cuenta:
                </label>
                <Input
                    type="email"
                    name="email"
                    onChange={onChangeHandler}
                    placeholder="example@gmail.com"
                    uuid='123'
                    required
                />            </div>
            <div className="bg-white h-[200px] w-full p-3 overflow-y-auto">
                {filterArr.map(i => i?.cuenta?.toLowerCase().includes(filter.toLowerCase()) && <div className={`border-b cursor-pointer flex items-center p-1  ${selectAccount?.cuenta === i.cuenta ? 'bg-cyan-500 ' : 'bg-white hover:bg-gray-100'}`} onClick={() => handlerSelectAccount(i)}>
                    <span className=" flex items-center w-[50%] text-[10px] ">
                        <UserCircleIcon className='h-4 w-4 inline-block fill-[#000000] cursor-pointer    mx-[5px]' />
                        {i.cuenta}
                    </span>
                </div>)}
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={saveAccount}>Asignar Asesor</button>
        </div>

    </div>
}