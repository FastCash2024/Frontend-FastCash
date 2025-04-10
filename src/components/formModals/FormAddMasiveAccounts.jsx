'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import Input from '@/components/Input'
import { useSearchParams } from 'next/navigation'

export default function AddAccount() {
    const {  setAlerta, setModal,setLoader } = useAppContext()
    const { theme } = useTheme();
    const [data, setData] = useState({})
    const [value1, setValue1] = useState('Por favor elige')
    const [value2, setValue2] = useState('Por favor elige')
    const [value3, setValue3] = useState('Por favor elige')
    const [newAccounts, setNewAccounts] = useState([])

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
                    ? 'http://localhost:3002/api/authSystem/register'
                    : 'https://api.fastcash-mx.com/api/authSystem/register', {
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

            await response.json();

            const counterName = value2 === 'Asesor de Cobranza' ? nameDocument[value3.split(' ')[0]] : nameDocument[value3]

            const res = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3003/api/loans/counter/${counterName}`
                    : `https://api.fastcash-mx.com/api/loans/counter/${counterName}`);

            if (res.ok) {
                const data = await res.json();
               
                const response = await fetch(
                    window?.location?.href?.includes('localhost')
                        ? `http://localhost:3003/api/loans/counter/${counterName}/increment`
                        : `https://api.fastcash-mx.com/api/loans/counter/${counterName}/increment`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ count: data.count + 1 * 1 }),
                });

                if (response.ok) {
                    await response.json();
                    
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
        ['Gestión de cuentas de Colección']: [
            'Asesor de Cobranza',
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
        let level = 1;
        const suffix = "1";
        let index = start;

        while (true) {
            const maxIndexAtLevel = Math.pow(26, level);

            if (index < maxIndexAtLevel) {
                for (let i = index; i < maxIndexAtLevel; i++) {
                    let seq = "";
                    let n = i;

                    for (let j = 0; j < level; j++) {
                        seq = alphabet[n % 26] + seq;
                        n = Math.floor(n / 26);
                    }

                    yield `${seq}${suffix}`;
                }

                index = 0;
            } else {
                index -= maxIndexAtLevel;
            }

            level += 1;
        }
    }


    async function generateCuentasMasivas() {
        try {
            const counterName = value2 === 'Asesor de Cobranza' 
                ? nameDocument[value3.split(' ')[0]] 
                : nameDocument[value3];
    
            // Obtener el contador desde la API
            const response = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3003/api/loans/counter/${counterName}`
                    : `https://api.fastcash-mx.com/api/loans/counter/${counterName}`
            );
    
            if (!response.ok) {
                console.error('Error al obtener el contador:', response.statusText);
                return;
            }
    
            const db = await response.json();
            const count = db.count;
            const code = value2 === 'Asesor de Cobranza' 
                ? codeAccount[value3.split(' ')[0]] 
                : codeAccount[value3];
            const generator = infiniteSequence(count);
    
            // Obtener lista de usuarios existentes para evitar duplicados
            const usersResponse = await fetch(
                window?.location?.href?.includes('localhost')
                    ? `http://localhost:3002/api/authSystem/users?limit=1000`
                    : `https://api.fastcash-mx.com/api/authSystem/users?limit=1000`
            );
    
            if (!usersResponse.ok) {
                console.error('Error al obtener la lista de usuarios:', usersResponse.statusText);
                return;
            }
    
            const usersData = await usersResponse.json();
            const existingAccounts = new Set(usersData.data.map(user => user.cuenta)); // Guardar en un Set para búsqueda rápida
    
            let arr = [];
            if (data?.cantidad && value1 !== 'Por favor elige' && value2 !== 'Por favor elige' && value3 !== 'Por favor elige') {
                while (arr.length < data.cantidad) {
                    let newAccount;
                    do {
                        newAccount = `${code}${generator.next().value}`;
                    } while (existingAccounts.has(newAccount)); // Generar hasta que no exista
    
                    arr.push(newAccount);
                    existingAccounts.add(newAccount); // Añadir a la lista para evitar duplicados en la misma ejecución
                }
            }
    
            setNewAccounts(arr);
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

            <div className='flex justify-between w-[300px]'>
                <label htmlFor="cantidad" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Cantidad:
                </label>
                <Input
                    type="cantidad"
                    name="cantidad"
                    onChange={onChangeHandler}
                    placeholder="0"
                    uuid='123'
                    required
                />
            </div>

            <div className='relative flex justify-between w-[300px] text-gray-950'>
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
            <div className='relative flex justify-between w-[300px] text-gray-950'>
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
            <div className='relative flex justify-between w-[300px] text-gray-950'>
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

            <div className="flex text-gray-950 space-x-2"><span className='text-[10px] pr-5'>Situacion laboral:</span>
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
