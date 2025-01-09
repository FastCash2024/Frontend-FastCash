'use client'

import { useState, useEffect } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { generarContrasena } from '@/utils'
import { toast } from 'react-hot-toast';

import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';


export default function AddAccount() {
    const { user, userDB, setUserProfile, setAlerta, users, modal, setModal, checkedArr, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({})
    const [value1, setValue1] = useState('Por favor elige')
    const [value2, setValue2] = useState('Por favor elige')
    const [value3, setValue3] = useState('Por favor elige')
    const [showPassword, setShowPassword] = useState(false)
    const [filter, setFilter] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [filterArr, setFilterArr] = useState([])
    const [selectAccount, setSelectAccount] = useState(null);


    const searchParams = useSearchParams()


    const seccion = searchParams.get('seccion')

    const item = searchParams.get('item')
    const codificacionDeRoles = {
        'Recursos Humanos': ['Recursos Humanos'],
        'Admin': ['Admin'],
        'Manager de Auditoria': ['Manager de Auditoria'],
        'Manager de Cobranza': ['Manager de Cobranza'],
        'Manager de Verificación': ['Manager de Verificación'],
        'Usuario de Auditoria': ['Usuario de Auditoria'],
        'Usuario de Cobranza': [
            'D2 = 2 DIAS ANTES DE LA FECHA DE COBRO',
            'D1 = 1 DIA ANTES DE LA FECHA DE COBRO',
            'D0 = DIA DE LA FECHA DE COBRO',
            'S1 = 1 - 7 DIAS DE MORA EN EL SISTEMA',
            'S2 = 8 - 16 DIAS DE MORA EN EL SISTEMA'
        ],
        'Usuario de Verificación': ['Usuario de Verificación'],
        'Cuenta personal': ['Cuenta personal'],
    }
    function handleCheckboxChange(index) {
        setSelectedCheckbox(index);
    };
    function onChangeHandler(e) {
        // console.log(e.target.value)
        setFilter(e.target.value)
    }
    function handlerSelectClick2(name, i, uuid) {
        if (name === 'Origen de la cuenta') {
            setValue1(i)
        }
        if (name === 'Tipo de grupo') {
            setValue2(i)
            setValue3('Por favor elige')
        }
        if (name === 'Codificación de roles') {
            setValue3(i)
        }
    }


    function handlerSelectAccount(i) {
        setSelectAccount(i)
    }

    const saveAccount = (e) => {
        e.preventDefault();
        // console.log({
        //     cuentaVerificador: selectAccount.cuenta,
        //     nombreDeLaEmpresa: selectAccount.origenDeLaCuenta
        // })
        setLoader('Guardando...')

        checkedArr.map(async (i) => {
            if (selectAccount?.cuenta !== undefined, selectAccount?.origenDeLaCuenta !== undefined)
                try {
                    const response = await fetch(window?.location?.href?.includes('localhost')
                        ? `http://localhost:3000/api/verification/${i._id}`
                        : `https://api.fastcash-mx.com/api/verification/${i._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cuentaVerificador: selectAccount.cuenta,
                            nombreDeLaEmpresa: selectAccount.origenDeLaCuenta
                        }), // Datos a enviar en el cuerpo de la petición
                    });




                    if (response.ok) {
                        checkedArr.length && setAlerta('Operación exitosa!')
                        checkedArr.length && setModal('')
                        checkedArr.length && setLoader('')
                        // navigate('/dashboard');
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



    const fetchUsers = async () => {
        try {
            const response = await axios.get(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/auth/users'
                : 'https://api.fastcash-mx.com/api/auth/users', {
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
                <input
                    type='text'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    name='email' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>
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
                onClick={saveAccount}>Asignar Usuario</button>
        </div>

    </div>
}