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
import { calcularFecha } from '@/utils/dates-filters';
import SelectSegment from './SelectSegment';
const Alert = ({ children, type = 'success', duration = 5000, onClose }) => {
    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [filter, setFilter] = useState({})
    const [query, setQuery] = useState('')
    const [filtro_1, setFiltro_1] = useState(["Elige por favor"]);

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

            setFiltro_1(["Elige por favor", ...result]);
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

    // seccion para obtener por segmento 
    const [selectedFecha, setSelectedFecha] = useState("Elije por favor");
    const options = ["Elige por favor", "D0", "D1", "D2", "S1", "S2"];

    const onChangeHandlerDateBySegment = (name, selectedValue, uuid) => {
        let fechaInicio, fechaFin;

        switch (selectedValue) {
            case "D0":
                fechaInicio = calcularFecha(0);
                fechaFin = null;
                break;
            case "D1":
                fechaInicio = calcularFecha(1);
                fechaFin = null;
                break;
            case "D2":
                fechaInicio = calcularFecha(2);
                fechaFin = null;
                break;
            case "S1":
                fechaInicio = calcularFecha(-15);
                fechaFin = calcularFecha(-3);
                break;
            case "S2":
                fechaInicio = calcularFecha(-22);
                fechaFin = calcularFecha(-15);
                break;
            default:
                fechaInicio = null;
                fechaFin = null;
                break;
        }

        // Guardamos el valor seleccionado en el select
        setSelectedFecha(selectedValue);

        // Actualizamos el filtro de la siguiente manera:
        setFilter((prevFilter) => {
            // Obtener el valor previo si existe (el valor de fechas anteriores)
            const prevValue = prevFilter[name] ? prevFilter[name].split(", ") : [];

            let updatedValues;
            if (fechaFin) {
                // Si tenemos fechaFin (rango), enviamos ambas fechas
                updatedValues = [fechaInicio, fechaFin];
            } else {
                // Si solo tenemos una fecha, enviamos solo fechaInicio
                updatedValues = [fechaInicio];
            }

            // Creamos el filtro actualizado
            const updatedFilter = { ...prevFilter, [name]: updatedValues.join(", ") };

            // Actualizamos la query con el nuevo filtro
            setQuery(objectToQueryString(updatedFilter));

            return updatedFilter;
        });

        console.log("Fecha de inicio:", fechaInicio);
        if (fechaFin) {
            console.log("Fecha de fin:", fechaFin);
        }
    };


    return (
        <div>
            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}
            <div>
                <div className="w-full   relative  scroll-smooth mb-2 ">
                    <div className='grid grid-cols-5 gap-x-5 gap-y-2 w-[1350px]'>
                        <div className='w-[260px] space-y-2'>
                            <SearchInput
                                label="Número de teléfono:"
                                name="numeroDeTelefonoMovil"
                                value={filter['numeroDeTelefonoMovil'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar por numero de teléfono"
                                required
                            />
                            <SearchInput
                                label="Número de prestamo:"
                                name="numeroDePrestamo"
                                value={filter['numeroDePrestamo'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Número de prestamo"
                                required
                            />
                        </div>
                        <div className='w-[260px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Codigo del producto:
                                </label>
                                <SelectSimple
                                    arr={filtro_1}
                                    name='nombreDelProducto'
                                    click={handlerSelectClick}
                                    defaultValue={filter['nombreDelProducto']}
                                    uuid='123'
                                    label='Filtro 1'
                                    position='absolute left-0 top-[25px]'
                                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}
                                    required />
                            </div>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Clientes nuevos y antiguos:
                                </label>
                                <SelectSimple arr={['Elije por favor', 'Si', 'No']} name='clienteNuevo' click={handlerSelectClick} defaultValue={filter['Cliente nuevo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[260px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Estado de credito:
                                </label>
                                <SelectSimple
                                    arr={['Dispersado', 'Pendiente', 'Aprobado', 'Reprobado']}
                                    name='estadoDeCredito'
                                    click={handlerSelectClick}
                                    defaultValue={filter['estadoDeCredito'] || (filter['estadoDeCredito'] = 'Dispersado')}
                                    uuid='123'
                                    label='Filtro 1'
                                    position='absolute left-0 top-[25px]'
                                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}
                                    required
                                />

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
                        <div className='w-[260px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Segmento:
                                </label>
                                <SelectSegment
                                    options={options}
                                    name="segmento"
                                    selectedValue={selectedFecha}
                                    onChangeHandler={onChangeHandlerDateBySegment}
                                    uuid="123"
                                />

                            </div>
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
                    {!user.rol.includes("Asesor") && item === "Casos de Cobranza" && (

                        <div className='grid grid-cols-3 gap-x-0 gap-y-2 w-[1050px] pt-1.5'>
                            <div className='w-[330px] space-y-2'>
                                <div className='flex justify-between space-x-3'>
                                    <Button type="button" theme={checkedArr.length > 0 ? 'Success' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Asignar Cuenta Cobrador')}>Asignar cuenta</Button>
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between space-x-3'>
                                    <Button type="button" theme={'Success'} click={() => setModal('Distribuir Casos Segmento')}>Distribucion por segmento</Button>
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between space-x-3'>
                                    <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Restablecimiento Masivo Cuenta')}>Restablecimiento Masivo</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert;
