'use client'

import { useState, useEffect } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { generarContrasena } from '@/utils'
import Input from "@/components/Input";

import { UserCircleIcon } from '@heroicons/react/24/solid';
import { obtenerFechaMexicoISO } from "@/utils/getDates";
import { postTracking } from "@/app/service/TrackingApi/tracking.service";


export default function AddAccount() {
    const { userDB, setAlerta, setModal, checkedArr, setLoader } = useAppContext()
    const { theme } = useTheme();
    const [data, setData] = useState({})
    const [filterArr, setFilterArr] = useState([])
    const [selectAccount, setSelectAccount] = useState(null);

    const searchParams = useSearchParams()

    const seccion = searchParams.get('seccion')

    const item = searchParams.get('item')
    
    function onChangeHandler(e) {
        // console.log(e.target.value)
        setData({ ...data, [e.target.name]: e.target.value })
    }

    function handlerSelectAccount(i) {
        setSelectAccount(i)
    }

    const saveAccount = async (e) => {
        e.preventDefault();
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
                body: JSON.stringify({ nombrePersonal: selectAccount.nombreCompleto, emailPersonal: selectAccount.email, password, fotoURL: selectAccount.fotoURL, numeroDeTelefonoMovil: selectAccount.numeroDeTelefonoMovil }), // Los datos que queremos actualizar
            });
            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }

            if (response.ok) {

                const res = await fetch(window?.location?.href?.includes('localhost')
                    ? 'http://localhost:3005/api/notifications/email/send'
                    : 'https://api.fastcash-mx.com/api/notifications/email/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: selectAccount.email,
                        subject: 'Credenciales FastCash',
                        html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="background-color: #4CAF50; color: #ffffff; text-align: center; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        <h1 style="margin: 0;">¡Bienvenido a FastCash-MX!</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; color: #333333;">
                        <p>Hola ${selectAccount.email},</p>
                        <p>Nos complace darte la bienvenida a FastCash-MX. A continuación, encontrarás tus credenciales de acceso para empezar a operar:</p>
                        <p style="font-size: 16px;">
                            <strong>User:</strong> <span style="color: #4CAF50;">${checkedArr[0].cuenta}</span><br>
                            <strong>Contraseña:</strong> <span style="color: #4CAF50;">${password}</span>
                        </p>
                        <p>Para iniciar sesión, haz clic en el siguiente enlace:</p>
                        <p style="text-align: center;">
                            <a href="https://collection.fastcash-mx.com/" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a>
                        </p>
                        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                        <p>Saludos,<br> de parte de Fast Cash LLC</p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #eeeeee; text-align: center; padding: 10px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; color: #666666; font-size: 12px;">
                        © 2024 Fast Cash LLC. Todos los derechos reservados.
                    </td>
                </tr>
            </table>
        </body>
        `
                    }),
                });

                const trackingData = {
                    descripcionDeExcepcion: "CC06",
                    cuentaOperadora: userDB?.cuenta,
                    cuentaPersonal: userDB?.emailPersonal,
                    codigoDeSistema: checkedArr[0].origenDeLaCuenta,
                    codigoDeOperacion: "CC01ASIG",
                    contenidoDeOperacion: `Se ha asignado la ceunta ${selectAccount.email} a la cuenta operativa ${checkedArr[0].cuenta}.`,
                    fechaDeOperacion: obtenerFechaMexicoISO(),
                };

                await postTracking(trackingData);

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
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3002/api/authSystem/usersFilter'
                : 'https://api.fastcash-mx.com/api/authSystem/usersFilter', {
                params: {
                    nombreCompleto: data.nombreCompleto,
                    email: data.email,
                },
            });
            setFilterArr(response.data.data); // Actualiza la lista de usuarios
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        if (data?.email?.length > 0 || data?.nombreCompleto?.length > 0) { fetchUsers() };
    }, [data]);

    return <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-40' onClick={() => setModal('')}>
        <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[450px] h-[450px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
            <button
                className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                onClick={() => setModal('')}
            >
                X
            </button>
            <h4 className='w-full text-center text-gray-950'>Asignar Cuenta Personal</h4>

            <div className='flex justify-between w-full max-w-[300px]'>
                <label htmlFor="email" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Buscar por Email:
                </label>
                <Input
                    type="email"
                    name="email"
                    onChange={onChangeHandler}
                    placeholder="example@gmail.com"
                    uuid='123'
                    required
                />
            </div>
            <div className='flex justify-between w-full max-w-[300px] '>
                <label htmlFor="nombreCompleto" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Buscar por nombre:
                </label>
                <Input
                    type="text"
                    name="nombreCompleto"
                    onChange={onChangeHandler}
                    placeholder="Pepe Arevalo Fuentes"
                    uuid='123'
                    required
                />
            </div>
            <div className="bg-white h-[200px] w-full p-3 overflow-y-auto">
                {filterArr.map(i => <div className={`border-b cursor-pointer flex items-center p-1  ${selectAccount?.email === i.email ? 'bg-cyan-500 ' : 'bg-white hover:bg-gray-100'}`} onClick={() => handlerSelectAccount(i)}>
                    <span className=" flex items-center w-[50%] text-[10px] text-black">
                        <UserCircleIcon className='h-4 w-4 inline-block fill-[#000000] cursor-pointer    mx-[5px]' />
                        {i.nombreCompleto}
                    </span>
                    <span className="flex items-center w-[50%] text-[10px]">{i.email}</span>
                </div>)}
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={saveAccount}>Asignar Asesor</button>
        </div>

    </div>
}