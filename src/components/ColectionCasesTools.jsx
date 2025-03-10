'use client'
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext'
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import Velocimetro from '@/components/Velocimetro'
import Button from '@/components/Button'
import Link from 'next/link';
import SearchInput from "@/components/SearchInput";
import MultipleInput from '@/components/MultipleInput';

import {
    refunds, historial,
    menuArray, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso
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
    const [filtro_1, setFiltro_1] = useState([]);

    function onChangeHandler(e) {
        const db = { ...filter, [e.target.name]: e.target.value }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    function onChangeHandlerDate(e) {
        const { name, value } = e.target;
    
        setFilter((prevFilter) => {
            const prevValue = prevFilter[name] ? prevFilter[name].split(", ") : [];
            
            let updatedValues;
            if (prevValue.length >= 2) {
                updatedValues = [prevValue[0], value];
            } else {
                updatedValues = [...prevValue, value];
            }
    
            const updatedFilter = { ...prevFilter, [name]: updatedValues.join(", ") };
            setQuery(objectToQueryString(updatedFilter));
            return updatedFilter;
        });
    }
    

    function handlerSelectClick(name, i, uuid) {
        const db = { ...filter, [name]: i }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    console.log('query:', setQuery);
    

    function objectToQueryString(obj) {
        if (!obj || typeof obj !== "object") {
            throw new Error("La entrada debe ser un objeto.");
        }
        return Object.keys(obj)
            .filter(key => obj[key] !== undefined && obj[key] !== null) // Filtrar valores nulos o indefinidos
            .map(key => `filter[${encodeURIComponent(key)}]=${encodeURIComponent(obj[key])}`) // Codificar clave=valor
            .join("&"); // Unir con &
    }

    function resetFilter() {
        setFilter({});
        setQuery('');
    }

    // function objectToQueryString(obj) {
    //     if (!obj || typeof obj !== "object") {
    //         throw new Error("La entrada debe ser un objeto.");
    //     }
    //     return Object.keys(obj)
    //         .filter(key => obj[key] !== undefined && obj[key] !== null) // Filtrar valores nulos o indefinidos
    //         .map(key => {
    //             const createQueryString = useCallback(
    //                 (name, value) => {
    //                     const params = new URLSearchParams(searchParams.toString())
    //                     params.set(name, value)

    //                     return params.toString()
    //                 },
    //                 [searchParams]
    //             )
    //         }) // Codificar clave=valor
    // }

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair

    const fetchCustomersFlow = async () => {
        const local = 'http://localhost:3006/api/users/applications/customers';
        const server = 'https://api.fastcash-mx.com/api/users/applications/customers';
        
        try {
            // Seleccionar la URL correcta
            const url = window?.location?.href?.includes("localhost") ? local : server;
    
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
    
            const result = await response.json();
            console.log('Clientes:', result);
            
            setFiltro_1(result);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    useEffect(() => {
      if (item === "Casos de Cobranza" || item === "Cobro y balance") {
        void fetchCustomersFlow();
      }
    }, [item])


    function handlerFetch() {
        setLoader(true)
    }
    return (
        <div>
            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}
            <div>
                <div className="w-full   relative  scroll-smooth mb-2 ">
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Codigo del producto:
                                </label>
                                <SelectSimple arr={filtro_1} name='nombreDelProducto' click={handlerSelectClick} defaultValue={filter['nombreDelProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Clientes nuevos y antiguos:
                                </label>
                                <SelectSimple arr={['Elije por favor', 'Si', 'No']} name='clienteNuevo' click={handlerSelectClick} defaultValue={filter['Cliente nuevo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Estado de reembolso:
                                </label>
                                <SelectSimple arr={['Elije por favor', 'Pendiente', 'Aprobado', 'Reprobado', 'Dispersado']} name='estadoDeCredito' click={handlerSelectClick} defaultValue={filter['estadoDeCredito']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <SearchInput
                                    label="Número de páginas:"
                                    name="numeroDePaginas"
                                    value={filter['numeroDePaginas'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    type="number"
                                    placeholder="Buscar por numero de páginas"
                                    required
                            />
                        </div> 
                        <div className='w-[300px] space-y-2'>
                            <MultipleInput
                                key={query}
                                defaultValue1={filter['fechaDeReembolso'] ? filter['fechaDeReembolso'].split(", ")[0] : ""}
                                defaultValue2={filter['fechaDeReembolso'] ? filter['fechaDeReembolso'].split(", ")[1] : ""}
                                handlerSelectClick={onChangeHandlerDate}
                                handlerSelectClick2={onChangeHandlerDate}
                                name1="fechaDeReembolso"
                                name2="fechaDeReembolso"
                                label="Fecha de Reembolso: "
                            />
                            <div className='flex gap-2 space-x-3'>
                                <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                    <Button type="button" theme={'Success'} >Consultar</Button>
                                </Link>
                                <Link href={`?seccion=${seccion}&item=${item}`}>
                                    <Button type="button" theme={'MiniPrimary'} click={resetFilter} >Restablecer</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {item === "Casos de Cobranza" && (

                        <div className='grid grid-cols-3 gap-x-0 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                                <Button type="button" theme={'Success'} click={() => setModal('Distribuir Casos')}>Distribuir</Button>
                                <Button type="button" theme={checkedArr.length > 0 ? 'Success' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Asignar Cuenta Cobrador')}>Asignar cuenta</Button>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                                <Button type="button" theme={'Success'} click={() => setModal('Distribuir Casos Segmento')}>Distribucion por segmento</Button>
                                <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Restablecimiento Masivo Cuenta')}>Restablecimiento Masivo</Button>
                            </div>
                        </div>
                        {/* <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between flex space-x-3'>
                            </div>
                            </div> */}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert;
