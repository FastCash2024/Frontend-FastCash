
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext'
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import Velocimetro from '@/components/Velocimetro'
import Button from '@/components/Button'
import Link from 'next/link';

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


    function objectToQueryString(obj) {
        if (!obj || typeof obj !== "object") {
            throw new Error("La entrada debe ser un objeto.");
        }

        return Object.keys(obj)
            .filter(key => obj[key] !== undefined && obj[key] !== null) // Filtrar valores nulos o indefinidos
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`) // Codificar clave=valor
            .join("&"); // Unir con &
    }
    function handlerFetch() {
        setLoader(true)
    }
    return (
        <div>
            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}
           
                <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Buscar por Usuario:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Buscar por nombre:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Número de teléfono:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Numero de páginas:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Estado de Usuario:
                                </label>
                                <SelectSimple arr={['En el trabajo', 'Dimitir', 'Reposo']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between flex space-x-3'>
                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </div>
                        </div>
                    </div>
                    {/*-------- BUTTONS */}
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between flex space-x-3'>
                                <Button type="button" theme="Success" click={() => setModal('Añadir cuenta')} >Crear Usuarios</Button>
                                <Button type="button" theme="Success" click={() => setModal('Añadir cuenta masivas')} >Crear Usuarios Masivos</Button>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between flex space-x-3'>
                                <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Editar cuenta')}>Editar</Button>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between flex space-x-3'>
                            </div>
                        </div>
                    </div>


                </div>
            
        </div>
    );
};

export default Alert;
