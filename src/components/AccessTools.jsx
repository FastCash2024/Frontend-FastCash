
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext'
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import Velocimetro from '@/components/Velocimetro'
import Button from '@/components/Button'
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';

import {
    refunds, historial,
    menuArray, filtro_1, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso
} from '@/constants/index'
const Alert = ({ children, type = 'success', duration = 5000, onClose }) => {
    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [filter, setFilter] = useState({})
    const [query, setQuery] = useState('')

    
    console.log("filter: ", filter);
    console.log("filter query: ", query);

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
        setFilter({});
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
    // function handlerFetch() {
    //     setLoader(true)
    // }

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
                                <SelectSimple arr={['En el trabajo', 'Dimitir', 'Reposo']} name='situacionLaboral' click={handlerSelectClick} defaultValue={filter['situacionLaboral']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="tipoDeGrupo" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Tipo de Usuario:
                                </label>
                                <SelectSimple arr={['Asesor de Verificación', 'Asesor de Cobranza']} name='tipoDeGrupo' click={handlerSelectClick} defaultValue={filter['tipoDeGrupo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
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
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                                <Button type="button" theme="Success" click={() => setModal('Añadir cuenta')} >Crear Usuarios</Button>
                                {
                                    (item === 'Gestión de asesores') &&
                                    <Button type="button" theme="Success" click={() => setModal('Añadir cuenta masivas')} >Crear Usuarios Masivos</Button>
                                }
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                                <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Editar cuenta')}>Restablecimiento masivo de contraseñas</Button>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Alert;
