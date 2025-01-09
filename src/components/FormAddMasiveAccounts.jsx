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
    const [newAccounts, setNewAccounts] = useState([])

    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState('En el trabajo');


    const searchParams = useSearchParams()


    const seccion = searchParams.get('seccion')

    const item = searchParams.get('item')
    const codificacionDeRoles = {
        'Recursos Humanos': ['Recursos Humanos'],
        'Admin': ['Admin'],
        'Manager de Auditoria': ['Manager de Auditoria'],
        'Manager de Cobranza': ['Manager de Cobranza'],
        'Manager de Verificación': ['Manager de Verificación'],
        'Asesor de Auditoria': ['Asesor de Auditoria'],
        'Asesor de Cobranza': [
            'D2 = 2 DIAS ANTES DE LA FECHA DE COBRO',
            'D1 = 1 DIA ANTES DE LA FECHA DE COBRO',
            'D0 = DIA DE LA FECHA DE COBRO',
            'S1 = 1 - 7 DIAS DE MORA EN EL SISTEMA',
            'S2 = 8 - 16 DIAS DE MORA EN EL SISTEMA'
        ],
        'Asesor de Verificación': ['Asesor de Verificación'],
        'Cuenta personal': ['Cuenta personal'],
    }

    const codeAccount = {
        'Recursos Humanos': 'TDF-RH-',
        'Admin': 'TDF-ADMIN-',
        'Manager de Auditoria': 'TDF-MANAGER-AOR-',
        'Manager de Cobranza': 'TDF-MANAGER-CDC-',
        'Manager de Verificación': 'TDF-MANAGER-VFN-',
        'Asesor de Auditoria': 'TDC-AOR-',
        'D2': 'TDF-CDC-D2-',
        'D1': 'TDF-CDC-D1-',
        'D0': 'TDF-CDC-D0-',
        'S1': 'TDF-CDC-S1-',
        'S2': 'TDF-CDC-S2-',
        'Asesor de Verificación': 'TDC-VFN-',
        'Cuenta personal': 'TDC-PER-',
    }


    const nameDocument = {
        'Recursos Humanos': 'recursosHumanos',
        'Admin': 'admin',
        'Manager de Auditoria': 'managerDeAuditoria',
        'Manager de Cobranza': 'managerDeCobranza',
        'Manager de Verificación': 'managerDeVerificacion-',
        'Asesor de Auditoria': 'asesorDeAuditoria',
        'D2': 'asesorDeCobranzaD2',
        'D1': 'asesorDeCobranzaD1',
        'D0': 'asesorDeCobranzaD0',
        'S1': 'asesorDeCobranzaS1',
        'S2': 'asesorDeCobranzaS2',
        'Asesor de Verificación': 'asesorDeVerificacion',
        'Cuenta personal': 'cuentaPersonal',
    }

    function handleCheckboxChange(index) {
        setSelectedCheckbox(index);
    };
    function onChangeHandler(e) {
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
        return contrasenaGenerada

    };

    const saveAccount = async (cuenta, password, index) => {
        try {
            const db = {
                'situacionLaboral': selectedCheckbox,
                'origenDeLaCuenta': value1,
                'tipoDeGrupo': value2,
                'codificacionDeRoles': value3,
                cuenta,
                password,
                emailPersonal: `No asignado a ${cuenta}`
            };
            // console.log(db);

            const response = await fetch(
                window?.location?.href?.includes('localhost')
                    ? 'http://localhost:3000/api/auth/register'
                    : 'https://api.fastcash-mx.com/api/auth/register', {
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

            const counterName = value2 === 'Asesor de Cobranza' ? nameDocument[value3.split(' ')[0]] : nameDocument[value3]

            // Hacer la solicitud GET al servidor para obtener el contador
            const res = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3000/api/counter/${counterName}`
                    : `https://api.fastcash-mx.com/api/counter/${counterName}`);

            // Verificar si la respuesta fue exitosa (status 200)
            if (res.ok) {
                const data = await res.json();
                // console.log(`El valor del contador ${counterName} es:`, data.count);

                // Hacer la solicitud PUT al servidor para actualizar el contador
                const response = await fetch(
                    window?.location?.href?.includes('localhost')
                        ? `http://localhost:3000/api/counter/${counterName}/increment`
                        : `https://api.fastcash-mx.com/api/counter/${counterName}/increment`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ count: data.count + 1 * 1 }), // Enviar el nuevo valor
                });

                // Verificar si la respuesta fue exitosa (status 200)
                if (response.ok) {
                    const data = await response.json();
                    // console.log(`El contador ${counterName} se actualizó a:`, data.count);

                    index === newAccounts.length - 1 && setAlerta('Operación exitosa!')
                    index === newAccounts.length - 1 && setModal('')
                    index === newAccounts.length - 1 && setLoader('')

                } else {
                    // Si no fue exitosa, mostrar error
                    console.error('Error al actualizar el contador:', response.statusText);
                    return null;
                }
            } else {
                // Si no fue exitosa, mostrar error
                console.error('Error al obtener el contador:', response.statusText);
                return null;
            }
            // navigate('/dashboard');
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')

        }
    };

    function saveAccounts(e) {
        e.preventDefault();
        setLoader('Guardando...')
        newAccounts.map((cuenta, index) => {
            const password = generarContrasena()
            saveAccount(cuenta, password, index)
        })
    }



    const arrTipoDeGrupo = {

        ['Gestión de administradores']: [
            'Admin',
        ],
        ['Gestión de RH']: [
            'Recursos Humanos',
        ],
        ['Gestión de managers']: [
            'Por favor elige',
            'Manager de Auditoria',
            'Manager de Cobranza',
            'Manager de Verificación',
        ],
        ['Gestión de asesores']: [
            'Por favor elige',
            'Asesor de Auditoria',
            'Asesor de Cobranza',
            'Asesor de Verificación',
        ],
        ['Gestión de cuentas personales']: [
            'Cuenta personal'
        ],
    }





    function* infiniteSequence(start = 0) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let level = 1;  // Nivel de profundidad de la combinación de letras (A, AA, AAA, etc.)
        const suffix = "1";  // El sufijo constante que se añade a cada secuencia
        let index = start;  // Índice para comenzar desde la posición deseada

        while (true) {
            // Calcula el rango de combinaciones para el nivel actual
            const maxIndexAtLevel = Math.pow(26, level);

            // Si el índice de inicio está dentro del nivel actual, generar desde esa posición
            if (index < maxIndexAtLevel) {
                for (let i = index; i < maxIndexAtLevel; i++) {
                    let seq = "";
                    let n = i;

                    // Genera una combinación de letras de acuerdo al nivel actual
                    for (let j = 0; j < level; j++) {
                        seq = alphabet[n % 26] + seq;
                        n = Math.floor(n / 26);
                    }

                    yield `${seq}${suffix}`;
                }

                // Resetea el índice para comenzar desde el inicio en el próximo nivel
                index = 0;
            } else {
                // Resta el número de combinaciones en el nivel actual del índice inicial
                index -= maxIndexAtLevel;
            }

            // Aumenta el nivel de profundidad para el siguiente conjunto de combinaciones
            level += 1;
        }
    }


    async function generateCuentasMasivas() {


        try {
            const counterName = value2 === 'Asesor de Cobranza' ? nameDocument[value3.split(' ')[0]] : nameDocument[value3]
            // Realiza la solicitud GET al servidor para obtener el contador
            const response = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3000/api/counter/${counterName}`
                    : `https://api.fastcash-mx.com/api/counter/${counterName}`);

            // Si la respuesta es exitosa (status 200)
            if (response.ok) {
                const db = await response.json();
                // console.log(`El contador ${counterName} tiene el valor:`, db.count)
                const count = db.count;
                const code = value2 === 'Asesor de Cobranza' ? codeAccount[value3.split(' ')[0]] : codeAccount[value3]
                const generator = infiniteSequence(count);


                let arr = []
                if (data?.cantidad && value1 !== 'Por favor elige' && value2 !== 'Por favor elige' && value3 !== 'Por favor elige') {
                    for (let i = 0; i < data.cantidad; i++) {
                        arr.push(`${code}${generator.next().value}`)
                        // // console.log(`${code}${generator.next().value}`);
                    }
                }
                setNewAccounts(arr)
            } else {
                // Si la respuesta no es exitosa
                console.error('Error al obtener el contador:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }




    }



    return <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-40' onClick={() => setModal('')}>
        <div className='relative flex flex-col items-start justify-center bg-gray-200 w-[450px] h-[450px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
            <button
                className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                onClick={() => setModal('')}
            >
                X
            </button>
            <h4 className='w-full text-center text-gray-950'>Generar cuenta masivas</h4>


            <div className='flex justify-between'>
                <label htmlFor="" className={`mr-5 text-[10px] w-[200px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Cantidad:
                </label>
                <input
                    type='number'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-[#adadad] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    name='cantidad' onChange={onChangeHandler} placeholder='5' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>

            <div className='relative flex justify-between w-[300px]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Origen de las cuentas:
                </label>
                <SelectSimple
                    arr={[
                        'Por favor elige',
                        '通达富-EC',
                        '通达富-CO',
                        '通达富-EU',
                        '通达富-MX',
                    ]}
                    name='Origen de la cuenta'
                    click={handlerSelectClick2}
                    defaultValue={value1}
                    uuid='123'
                    label='Filtro 1'
                    position='absolute left-0 top-[25px]'
                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                    required />
            </div>
            <div className='relative flex justify-between w-[300px]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Tipo de grupo:
                </label>
                <SelectSimple
                    arr={arrTipoDeGrupo[item]}
                    name='Tipo de grupo'
                    click={handlerSelectClick2}
                    defaultValue={value2}
                    uuid='123'
                    label='Filtro 1'
                    position='absolute left-0 top-[25px]'
                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                    required />
            </div>
            <div className='relative flex justify-between w-[300px]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Codificación de roles:
                </label>
                <SelectSimple
                    arr={codificacionDeRoles[value2]
                        ? codificacionDeRoles[value2]
                        : []}
                    name='Codificación de roles'
                    click={handlerSelectClick2}
                    defaultValue={value3}
                    uuid='123'
                    label='Filtro 1'
                    position='absolute left-0 top-[25px]'
                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                    required />
            </div>

            <div className="flex  space-x-2"><span className='text-[10px] pr-5'>Situacion laboral:</span>
                {['En el trabajo', 'Dimitir', 'Reposo'].map((num, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input
                            name={num}
                            type="checkbox"
                            checked={selectedCheckbox === num}
                            onChange={() => handleCheckboxChange(num)}
                            className="form-checkbox h-3 w-3 text-blue-600"
                        />
                        <span className='text-[10px] '>{num}</span>
                    </label>
                ))}
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={generateCuentasMasivas}>
                {newAccounts.length > 0 ? 'Generar nuevamente' : 'Generar cuentas'}
            </button>
            {newAccounts.length > 0 && <div className="relative flex flex-col justify-center w-full text-green-400">
                <div className="text-[8px] h-[50px] bg-gray-800 rounded-[5px] p-5 overflow-y-auto">
                    {newAccounts.map(i => <span className="pr-2 text-green-400">{i},</span>)}
                </div>
                <button type="button"
                    class="w-[300px] relative left-0 right-0 mx-auto mt-3 text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                    onClick={saveAccounts}>
                    Añadir cuentas
                </button>
            </div>}



        </div>

    </div>
}