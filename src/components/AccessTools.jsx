
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext'
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';

const Alert = ({ children, type = 'success', duration = 5000, onClose }) => {
    const { user, checkedArr, setModal } = useAppContext()
    const searchParams = useSearchParams()
    const { theme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [filter, setFilter] = useState({})
    const [query, setQuery] = useState('')

    function onChangeHandler(e) {
        const db = { ...filter, [e.target.name]: e.target.value }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    function handlerSelectClick(name, i, uuid) {
        const db = { ...filter, [name]: i }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    function resetFilter() {
        setFilter({
            tipoDeGrupo: getDefaultTipoDeGrupo(item)
        });
        setQuery('');
    }
    
    
    function objectToQueryString(obj) {
        if (!obj || typeof obj !== "object") {
            throw new Error("La entrada debe ser un objeto.");
        }
        return Object.keys(obj)
            .filter(key => obj[key] !== undefined && obj[key] !== null) // Filtrar valores nulos o indefinidos
            .map(key => `filter[${encodeURIComponent(key)}]=${encodeURIComponent(obj[key])}`) // Codificar clave=valor
            .join("&"); // Unir con &
    }

    const getDefaultTipoDeGrupo = (item) => {
        return arrTipoDeGrupo[item]?.[0] || ''; // Toma el primer valor del array o una cadena vacía si no existe
    };

    // Cuando `item` cambia, actualizar el filtro
    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            tipoDeGrupo: getDefaultTipoDeGrupo(item),
        }));
    }, [item]);

    const arrTipoDeGrupo = {
        'Gestión de administradores': ['Admin'],
        'Gestión de cuentas de Colección': ['Asesor de Cobranza'],
        'Gestión de RH': ['Recursos Humanos'],
        'Gestión de managers': [
            'Manager',
            'Manager de Auditoria',
            'Manager de Cobranza',
            'Manager de Verificación',
        ],
        'Gestión de asesores': [
            'Asesor',
            'Asesor de Auditoria',
            'Asesor de Cobranza',
            'Asesor de Verificación',
        ],
        'Gestión de cuentas personales': ['Cuenta personal'],
    };

    return (
        <div>
            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}

            <div className="w-full   relative  scroll-smooth mb-2">
                <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                    <div className='w-[330px] space-y-2'>

                        <SearchInput
                            label="Buscar por cuenta:"
                            name="cuenta"
                            value={filter['cuenta'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="user123"
                            required
                        />
                        <SearchInput
                            label="Buscar por nombre:"
                            name="nombrePersonal"
                            value={filter['nombrePersonal'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Juan Perez"
                            required
                        />
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Número de páginas:"
                            name="page"
                            value={filter['page'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="5"
                            required
                        />
                        <div className='flex justify-end items-center'>
                            <label htmlFor="situacionLaboral" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Estado de Usuario:
                            </label>
                            <SelectSimple
                                arr={['Elige por favor', 'En el trabajo', 'Dimitir', 'Reposo']} name='situacionLaboral' click={handlerSelectClick} defaultValue={filter['situacionLaboral']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-end items-center'>
                            <label htmlFor="tipoDeGrupo" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Tipo de Usuario:
                            </label>
                            <SelectSimple
                                arr={arrTipoDeGrupo[item] || []}
                                name='tipoDeGrupo'
                                click={handlerSelectClick}
                                defaultValue={filter['tipoDeGrupo']}
                                uuid='123'
                                label='Filtro 1'
                                position='absolute left-0 top-[25px]'
                                bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}
                                required
                            />

                        </div>
                        <div className='flex justify-end space-x-3'>
                            <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                            </Link>
                            <Link href={`?seccion=${seccion}&item=${item}`}>
                                <button onClick={resetFilter} type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/*-------- BUTTONS */}
                {!user.rol.includes("Asesor") &&
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                                <Button type="button" theme="Success" click={() => setModal('Añadir cuenta')} >Crear Usuarios</Button>
                                {
                                    (item === 'Gestión de asesores' || item === 'Gestión de cuentas de Colección') &&
                                    <Button type="button" theme="Success" click={() => setModal('Añadir cuenta masivas')} >Crear Usuarios Masivos</Button>
                                }
                            </div>
                        </div>
                        <div className={`${(item === 'Gestión de asesores' || item === 'Gestión de cuentas de Colección') ? "w-[300px]" : "w-[480px]"}  space-y-2`}>
                            <div className='flex justify-between space-x-3'>
                                {(item !== 'Gestión de asesores' && item !== 'Gestión de cuentas de Colección') && (
                                    <Button
                                        type="button"
                                        theme={checkedArr.length > 0 ? 'Success' : 'Disable'}
                                        click={() => checkedArr.length > 0 && setModal('Asignar Asesor')}
                                    >
                                        Asignar Cuenta
                                    </Button>
                                )}

                                <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Editar cuenta')}>Restablecimiento masivo de contraseñas</Button>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Alert;
