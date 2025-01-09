'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'

import { toast } from 'react-hot-toast';



export default function AddAccount() {
    const { user, userDB, setUserProfile, setAlerta, users, modal, setModal, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({})
    const [value1, setValue1] = useState('Por favor elige')
    const [value2, setValue2] = useState('Por favor elige')
    const [value3, setValue3] = useState('Por favor elige')
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);


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
        setData({ ...data, [e.target.name]: e.target.value })
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
    const generarContrasena = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let contrasenaGenerada = '';
        const longitud = 16; // Longitud de la contraseña

        for (let i = 0; i < longitud; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            contrasenaGenerada += caracteres[indice];
        }
        setData({ ...data, password: contrasenaGenerada })

    };

    const saveAccount = async (e) => {
        e.preventDefault();
        try {
            setLoader('Guardando...')
            const db = {
                'codificacionDeRoles': 'Cuenta Personal',
                ...data,
            };
            // console.log(db);

            const response = await fetch(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/auth/registerPersonal'
                : 'https://api.fastcash-mx.com/api/auth/registerPersonal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(db),
            });

            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }

            const result = await response.json();
            // console.log(result);



            const res = await fetch(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/email/send'
                : `https://api.fastcash-mx.com/api/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: db.email,
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
                <p>Hola ${db.email},</p>
                <p>Nos complace darte la bienvenida a FastCash-MX. A continuación, encontrarás tus credenciales de acceso a tu cuenta personal:</p>
                <p style="font-size: 16px;">
                    <strong>Email:</strong> <span style="color: #4CAF50;">${db.email}</span><br>
                    <strong>Contraseña:</strong> <span style="color: #4CAF50;">${db.password}</span>
                </p>
                <p>Para iniciar sesión, haz clic en el siguiente enlace:</p>
                <p style="text-align: center;">
                    <a href="https://collection.fastcash-mx.com/PersonalAccount" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a>
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

            setAlerta('Operación exitosa!')
            setModal('')
            setLoader('')
            // navigate('/dashboard');
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')

        }
    };




    return <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-40' onClick={() => setModal('')}>
        <div className='relative flex flex-col items-start justify-center bg-gray-200 w-[450px] h-[250px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
            <button
                className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                onClick={() => setModal('')}
            >
                X
            </button>
            <h4 className='w-full text-center text-gray-950'>Añadir cuenta personal</h4>

            <div className='flex justify-between'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Email:
                </label>
                <input
                    type='email'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    name='email' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>

            <div className='flex justify-between items-center space-x-2'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Contraseña:
                </label>
                <span className='relative inline-block '>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                        placeholder={'**********'}
                        required
                        value={data.password}
                        onChange={onChangeHandler}
                        name='password'
                    />
                    {<span className="flex items-center absolute cursor-pointer top-0 right-2 bottom-0  my-auto" onClick={() => setShowPassword(!showPassword)}>
                        <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.0833C13.1421 16.0833 16.5 12.6158 16.5 10.25C16.5 7.88417 13.1421 4.41667 9 4.41667C4.85792 4.41667 1.5 7.88667 1.5 10.25C1.5 12.6133 4.85792 16.0833 9 16.0833Z" stroke="#00000080" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M9 12.75C9.66304 12.75 10.2989 12.4866 10.7678 12.0178C11.2366 11.5489 11.5 10.913 11.5 10.25C11.5 9.58696 11.2366 8.95107 10.7678 8.48223C10.2989 8.01339 9.66304 7.75 9 7.75C8.33696 7.75 7.70107 8.01339 7.23223 8.48223C6.76339 8.95107 6.5 9.58696 6.5 10.25C6.5 10.913 6.76339 11.5489 7.23223 12.0178C7.70107 12.4866 8.33696 12.75 9 12.75Z" stroke="#00000080" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M4.52686 3.69417L5.60769 5.2025M13.8439 3.87917L12.7627 5.3875M9.00394 1.91667V4.41667" stroke="#00000080" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {showPassword == false && <span className='absolute bg-[#ffffff] border-x-[.5px] border-gray-50 right-[3px] transform rotate-45 w-[4px] h-[30px]'></span>}
                    </span>}
                </span>
                <button
                    onClick={generarContrasena}
                    class="w- text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center "
                >
                    Generar
                </button>
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={saveAccount}>Registrar cuenta Personal</button>
        </div>

    </div>
}