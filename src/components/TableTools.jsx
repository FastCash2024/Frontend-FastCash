'use client'
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext'
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import Velocimetro from '@/components/Velocimetro'
import Button from '@/components/Button'
import VerificationTools from '@/components/VerificationTools'
import AccessTools from '@/components/AccessTools'
import ColectionCasesTools from '@/components/ColectionCasesTools'
import SearchInput from "@/components/SearchInput";
import MultipleInput from "@/components/MultipleInput";

import {
    refunds, historial,
    menuArray, tipoDeGrupo, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso
} from '@/constants/index'
import Link from 'next/link';
import SelectField from './SelectField';
import { getBackgroundClass } from '@/utils/colors';
import ControlCasesTools from './ControlCasesTools';
import { obtenerSegmento } from '@/utils';
const Alert = ({ children, type = 'success', duration = 5000, onClose }) => {
    const { user, userDB, setApplicationTipo, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const applicationId = searchParams.get('application');
    const [copied, setCopied] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [filter, setFilter] = useState({})
    const [dataApplication, setDataApplication] = useState(null)
    const [filtro_1, setFiltro_1] = useState([]);
    const [query, setQuery] = useState('')

    const [horaEntrada, setHoraEntrada] = useState(null);
    const [totalesVerification, setTotalesVerification] = useState({})
    const [totalesCobro, setTotalesCobro] = useState({})
    const [details, setDetails] = useState([])
    const [totales, setTotales] = useState({});


    const fetchCustomersFlow = async () => {
        const local = 'http://localhost:3000/api/users/applications/customers';
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

    const fetchDataApplication = async () => {
        const local = `http://localhost:3000/api/users/applications/aplicationbyid/${applicationId}`;
        const server = `https://api.fastcash-mx.com/api/users/applications/aplicationbyid/${applicationId}`;

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
            console.log('Data app:', result);

            setDataApplication(result);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    useEffect(() => {
        if (applicationId !== null || applicationId !== undefined) {
            void fetchDataApplication();
        }
    }, [applicationId])

    useEffect(() => {
        if (item === "Recolección y Validación de Datos" || item === "Incurrir en una estación de trabajo" || item === "comision") {
            void fetchCustomersFlow();
        }
    }, [item])

    const obtenerHoraEntrada = async () => {
        try {
            const endpoint = window?.location?.href.includes("localhost")
                ? "http://localhost:3000/api/entryhour/gethour"
                : "https://api.fastcash-mx.com/api/entryhour/gethour";

            const response = await fetch(endpoint, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Error al obtener la hora de entrada");
            }

            const responseData = await response.json();
            console.log("Respuesta API:", responseData);

            if (responseData?.data?.horaEntrada) {
                console.log("hora: ", responseData.data);

                setHoraEntrada(responseData.data);
            } else {
                const horaActual = new Date().toISOString().split("T")[1].slice(0, 5);
                setHoraEntrada(horaActual);
            }
        } catch (error) {
            console.error("Error al obtener la hora de entrada:", error);
            setHoraEntrada(""); // Limpia la hora en caso de error
        }
    };


    useEffect(() => {
        obtenerHoraEntrada();
    }, [loader]);


    function onChangeHandler(e) {
        const db = { ...filter, [e.target.name]: e.target.value }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    console.log("query: ", query);


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

    function handlerWeekChange(event) {
        const week = event.target.value;
        const year = parseInt(week.substring(0, 4));
        const weekNumber = parseInt(week.substring(6));

        // Calcula la fecha del primer día del año
        const firstDayOfYear = new Date(year, 0, 1);
        const daysOffset = (weekNumber - 1) * 7;
        const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));

        // Obtener el lunes de la semana seleccionada
        const monday = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const startDate = monday.toISOString().split('T')[0];
        const endDate = sunday.toISOString().split('T')[0];
        const db = { ...filter, startDate, endDate };
        setFilter(db);
        setQuery(objectToQueryString(db));

    }

    function handlerDateChange(event, name) {
        const date = event.target.value;
        const formattedDate = new Date(date).toISOString().split('T')[0]; // Formato YYYY-MM-DD

        const db = { ...filter, [name]: formattedDate }; // Usar el nombre variable
        setFilter(db);
        setQuery(objectToQueryString(db));

        console.log(`Fecha seleccionada (${name}):`, formattedDate);
    }
    console.log("datos filtrados: ", filter);
    console.log("datos query: ", query);

    const handlerApplication = () => {
        setModal('Modal Agregar Tipo Aplicaion');
        setApplicationTipo(dataApplication);
    }

    // Fetch totales
    async function handlerFetchCTotales() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/loans/verification/totalreportecobro'
                : 'https://api.fastcash-mx.com/api/loans/verification/totalreportecobro')
        const data = await res.json()
        setTotalesCobro(data.data)
    }

    async function handlerFetchVTotales() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/loans/verification/totalreporteverificacion'
                : 'https://api.fastcash-mx.com/api/loans/verification/totalreporteverificacion')
        const data = await res.json()
        setTotalesVerification(data.totalesGenerales)
    }

    async function handlerFetchDetails() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/loans/verification/reportecobrados?estadoDeCredito=Pagado'
                : 'https://api.fastcash-mx.com/api/loans/verification/reportecobrados?estadoDeCredito=Pagado')
        const data = await res.json()
        console.log("data detalle: ", data)
        setDetails(data.data)
    }



    const calcularTotalesPorSegmento = () => {
        const totalesPorSegmento = {};

        Object.keys(details).forEach((cuenta) => {
            const segmento = obtenerSegmento(cuenta);
            console.log(`Cuenta: ${cuenta}, Segmento: ${segmento}`); // <-- Verifica qué segmentos se generan

            if (!segmento) {
                console.log(`Segmento no encontrado para cuenta: ${cuenta}`);
            }

            if (!totalesPorSegmento[segmento]) {
                totalesPorSegmento[segmento] = 0;
            }
            totalesPorSegmento[segmento] += 1;
        });

        console.log("Totales por segmento:", totalesPorSegmento); // <-- Muestra el resultado final
        setTotales(totalesPorSegmento);
    };

    useEffect(() => {
        handlerFetchCTotales();
        handlerFetchVTotales();
        handlerFetchDetails();
        calcularTotalesPorSegmento();
    }, [loader]);


    return (
        <div className='pt-5'>
            {/* ---------------------------------'COLECCION DE CASOS' --------------------------------- */}
            {(item === 'Casos de Cobranza') && <ColectionCasesTools />}
            {(item === 'Control de Cumplimiento') && <ControlCasesTools />}
            {item === 'Casos de Cobranza hay q borrar' &&
                <div>
                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <SelectField
                                    label="Codigo del producto:"
                                    name="nombreProducto"
                                    arr={filtro_1}
                                    click={handlerSelectClick}
                                    defaultValue={filter['nombreProducto']}
                                    uuid="123"
                                    position="absolute left-0 top-[25px]"
                                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}
                                    theme={theme}
                                    required
                                />
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Cobrador:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <SelectSimple arr={rangesArray} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <SelectSimple arr={cobrador} name='Cobrador 2' click={handlerSelectClick} defaultValue={filter['Cobrador 2']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Dias vencidos:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Clientes nuevos y antiguos:
                                    </label>
                                    <SelectSimple arr={filterCliente} name='Clientes nuevos y antiguos' click={handlerSelectClick} defaultValue={filter['Cliente nuevo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Distribuir</button>

                            </div>
                            <div className='w-[300px] space-y-2'>
                                <SearchInput
                                    label="Número de teléfono:"
                                    name="numeroDeTelefonoMovil"
                                    value={filter['numeroDeTelefonoMovil'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="Buscar por numero de teléfono"
                                    required
                                />
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Número de teléfono:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Factura a plazos:
                                    </label>
                                    <SelectSimple arr={factura} name='Factura a plazos' click={handlerSelectClick} defaultValue={filter['Factura a plazos']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input
                                        className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px] 
                                         ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`}
                                        arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Jumiah periode:
                                    </label>
                                    <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de reembolso:
                                    </label>
                                    <SelectSimple arr={estadoRembolso} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Fecha de rembolso:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' onClick={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' onClick={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>

                                </div>



                                <div className='flex justify-between space-x-3'>
                                    <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar ahoraaaa</button>
                                    <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }
            {item === 'Incurrir en una estación de trabajo' &&
                <div>
                    <div className='flex flex-wrap justify-around relative top-[-25px]'>
                        <div className='px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de finalizacion hoy</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{totalesCobro.tasaRecuperacionTotal ?? 0} <br />El número de recordatorios en el dia que se asigna en el día.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{totalesCobro.pagosTotal ?? 0} <br />Añadir el número hoy.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de caso</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{totalesCobro.tasaRecuperacionTotal ?? 0} <br />Cobro de hoy.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{totalesCobro.pagosTotal ?? 0} <br /> Número total de casos.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de grupo</h4>
                            <div>
                                {Object.keys(totales).map((segmento) => (
                                    <div key={segmento} className="grid grid-cols-3 w-[300px]">
                                        <p
                                            className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '
                                                } dark:text-white`}
                                        >
                                            {segmento} <br /> Segmento.
                                        </p>
                                        <p
                                            className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '
                                                } dark:text-white`}
                                        >
                                            {totales[segmento] ?? 0} <br /> Número total de casos cobrados.
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* <h4 className='text-center text-[14px] text-green-600  m-0 p-0 pb-2'> <span className='bg-green-600 mr-2 w-[10px] h-[10px] inline-block'></span>Tasa de recuperación de grupos</h4> */}

                        </div>
                        <div className=' p-2 border my-5 flex flex-col justify-between'>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Ranking de hoy</h4>
                            <br />
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>NO.0</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Ranking Individual <br /> por Equipos</p>

                                </div>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>

                                </div>

                            </div>
                            <br />

                            <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>


                            <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>


                        </div>
                    </div>

                    <div className='flex space-x-12 w-full mb-0 p-5 bg-slate-100 shadow-xl'>

                        <div className='w-[350px] space-y-2'>
                            <div className='flex items-center justify-end '>
                                <label htmlFor="" className={`ql-align-right mr-2 text-[10px] text-right ${theme === 'light' ? '  text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Producto del proyecto:
                                </label>
                                <SelectSimple click={handlerSelectClick} arr={filtro_1} name='nombreDelProducto' defaultValue={filter['nombreDelProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <SearchInput
                                label="Número de teléfono:"
                                name="numeroDeTelefonoMovil"
                                value={filter['numeroDeTelefonoMovil'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar por numero de teléfono"
                                required
                            />
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`ql-align-right mr-2 text-[10px] ${theme === 'light' ? '  text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Estado de reembolso:
                                </label>
                                <SelectSimple arr={[...estadoRembolso, 'Reembolso Parcial']} name='estadoDeCredito' click={handlerSelectClick} defaultValue={filter['estadoDeCredito']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`ql-align-right mr-2 text-[10px] ${theme === 'light' ? '  text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Angsuran:
                                </label>
                                <SelectSimple arr={['Por favor elige', 'Si', 'No']} name='Clientes nuevos y antiguos' click={handlerSelectClick} defaultValue={filter['Clientes nuevos y antiguos']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-end space-x-3 p-4 pr-0'>
                                <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                    <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                </Link>
                                <Link href={`?seccion=${seccion}&item=${item}`}>
                                    <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </Link>
                            </div>
                        </div>
                        <div className='w-[350px] space-y-3'>
                            <SearchInput
                                label="Número de prestamo:"
                                name="numeroDePrestamo"
                                value={filter['numeroDePrestamo'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Número de prestamo"
                                required
                            />
                            <SearchInput
                                label="Nombre del Cliente:"
                                name="nombreDelCliente"
                                value={filter['nombreDelCliente'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Nombre del Cliente"
                                required
                            />
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
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Número de etapas:
                                </label>
                                <SelectSimple arr={['Por favor elige', '1', '2']} name='Número de etapas' click={handlerSelectClick} defaultValue={filter['Número de etapas']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[350px] space-y-2'>
                            <SearchInput
                                label="ID de sub-factura:"
                                name="idDeSubFactura"
                                value={filter['idDeSubFactura'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="ID de sub-factura"
                                required
                            />
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Dias vencidos:
                                </label>
                                <div className='grid grid-cols-2 gap-1'>
                                    <input className={`h-[25px] max-w-[173px] w-[84.5px] px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-white' : ' text-black bg-white'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input className={`h-[25px] max-w-[173px] w-[84.5px] px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-white' : ' text-black bg-white'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <MultipleInput
                                key={query}
                                defaultValue1={filter['fechaDeTramitacionDelCaso'] ? filter['fechaDeTramitacionDelCaso'].split(", ")[0] : ""}
                                defaultValue2={filter['fechaDeTramitacionDelCaso'] ? filter['fechaDeTramitacionDelCaso'].split(", ")[1] : ""}
                                handlerSelectClick={onChangeHandlerDate}
                                handlerSelectClick2={onChangeHandlerDate}
                                name1="fechaDeTramitacionDelCaso"
                                name2="fechaDeTramitacionDelCaso"
                                label="Fecha de asignación: "
                            />
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Collected employe ID:
                                </label>
                                <SelectSimple arr={['Opción 1', 'Opción 2']} name='Collected employee ID' click={handlerSelectClick} defaultValue={filter['Collected employee ID']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                        </div>
                    </div>
                </div>}
            {item === 'Gestión de cuentas de Colección' && <div>
                <AccessTools />
                {/* <div className='grid grid-cols-3 gap-x-[50px] gap-y-2 w-[950px]'>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Cuenta:"
                            name="cuenta"
                            value={filter['cuenta'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por cuenta"
                            required
                        />
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Situación laboral:
                            </label>
                            <SelectSimple arr={['Por favor elige', 'En el trabajo', 'Dimitir', 'Reposo']} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Nombre del cliente:"
                            name="apodo"
                            value={filter['apodo'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por nombre de cuenta "
                            required
                        />
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Tipo de agrupación:
                            </label>
                            <SelectSimple arr={['Agrupación vencida', 'Agrupación de recordatorios']} name='Fecha de cancelación a cuenta 1' click={handlerSelectClick} defaultValue={filter['Fecha de cancelación a cuenta 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Nombre del rol:
                            </label>
                            <SelectSimple arr={['Super Administrador', 'Manager', 'Lider', 'Agente de cobro', 'Auditor', 'Cliente']} name='ID de sub-factura' click={handlerSelectClick} defaultValue={filter['ID de sub-factura']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>

                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Lista de grupos:                            </label>
                            <SelectSimple arr={['Opción 1', 'Opción 2']} name='Collected employee ID' click={handlerSelectClick} defaultValue={filter['Collected employee ID']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                </div> */}





            </div>}
            {item === 'Registro Histórico' &&
                <div className="w-full   relative scroll-smooth mb-2 ">
                    <div className='flex space-x-12 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Producto del proyecto:
                                </label>
                                <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between items-center'>
                                <label htmlFor="" className={`-mr-9 ml-10 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Fecha de la consulta:
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                            </div>

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <SearchInput
                                label="Número de caso:"
                                name="caso"
                                value={filter['caso'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar por numero de caso"
                                required
                            />

                            <div className='flex justify-between space-x-2 ml-6'>
                                <div className='flex justify-center space-x-3'>
                                    <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                        <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                    </Link>
                                    <Link href={`?seccion=${seccion}&item=${item}`}>
                                        <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                        <div className='w-[300px] space-y-2'>

                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Nombre del cliente:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de ' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                    </div>
                </div>
            }
            {item === 'Reporte diario casos' && <div>
                <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Codigo del producto:
                                </label>
                                <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Clientes nuevos y antiguos:
                                </label>
                                <SelectSimple arr={filterCliente} name='Clientes nuevos y antiguos' click={handlerSelectClick} defaultValue={filter['Cliente nuevo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            {user?.rol === 'Manager de Verificación' && <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Distribuir</button>}

                            {checkedArr.length === 1 && <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2" onClick={() => setModal('Asignar Asesor')}>Asignar Asesor</button>}

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Número de teléfono:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Factura a plazos:
                                </label>
                                <SelectSimple arr={factura} name='Factura a plazos' click={handlerSelectClick} defaultValue={filter['Factura a plazos']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Numero de páginas:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Jumiah periode:
                                </label>
                                <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Estado de reembolso:
                                </label>
                                <SelectSimple arr={['Aprobado', 'Reprobado']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Fecha de rembolso:
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                            </div>
                            <div className='flex justify-between flex space-x-3'>
                                <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {item === 'Gestion de aplicaciones' && <div>

                <div className='grid grid-cols-3 gap-x-[50px] gap-y-4 w-[950px]'>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Aplicación:"
                            name="nombre"
                            value={filter['nombre'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por nombre"
                            required
                        />
                        <div className='flex justify-end items-center'>
                            <label htmlFor="" className={`ml-1 pr-0 mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Categoria:
                            </label>
                            <SelectSimple arr={['Libre', 'Estandar', 'Premium']} name='ID de sub-factura' click={handlerSelectClick} defaultValue={filter['ID de sub-factura']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-center space-x-3'>
                            <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                            </Link>
                            <Link href={`?seccion=${seccion}&item=${item}`}>
                                <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </Link>
                        </div>
                    </div>

                </div>
                <div className='pt-3 flex space-x-3'>
                    <Button type="button" theme="Success" click={() => setModal('Añadir aplicacion')}>
                        Añadir Aplicación
                    </Button>
                </div>
            </div>}

            {item === "Cobro y valance" && <div>

                <div className='grid grid-cols-3 gap-x-[50px] gap-y-4 w-[950px]'>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Numero de caso:"
                            name="numeroDePrestamo"
                            value={filter['numeroDePrestamo'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por numero de..."
                            required
                        />
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-center space-x-3'>
                            <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                            </Link>
                            <Link href={`?seccion=${seccion}&item=${item}`}>
                                <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </Link>
                        </div>
                    </div>

                </div>
                <div className='pt-3 flex space-x-3'>
                    <Button type="button" theme="Success" click={() => setModal('Añadir aplicacion')}>
                        Añadir Aplicación
                    </Button>
                </div>
            </div>}

            {item === 'Comisión' && <div>

                {/* <div className='grid grid-cols-3 gap-x-[50px] gap-y-4 w-[950px]'>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Aplicación:"
                            name="nombre"
                            value={filter['nombre'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por nombre"
                            required
                        />
                        <div className='flex justify-end items-center'>
                            <label htmlFor="" className={`ml-1 pr-0 mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Categoria:
                            </label>
                            <SelectSimple arr={['Libre', 'Estandar', 'Premium']} name='ID de sub-factura' click={handlerSelectClick} defaultValue={filter['ID de sub-factura']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-center space-x-3'>
                            <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                            </Link>
                            <Link href={`?seccion=${seccion}&item=${item}`}>
                                <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </Link>
                        </div>
                    </div>

                </div> */}
                <div className='pt-3 flex space-x-3 w-[20%]'>
                    <Button type="button" theme="MiniPrimary" click={() => setModal('Agregar comision')} >Generar Comisión</Button>
                </div>
            </div>}
            {item === 'Gestion de aplicacion' && <div className='flex flex-row justify-between items-center'>

                <div className="flex items-center gap-x-4 mb-6 w-[40%]">
                    <img
                        src={dataApplication?.icon}
                        alt="app"
                        width={80}
                        height={80}
                        className="ml-4" // Espacio a la izquierda
                    />
                    <p className="text-3xl font-bold text-black">{dataApplication?.nombre}</p>
                </div>
                <div className='pt-3 flex space-x-3 w-[30%] h-12'>
                    <Button type="button" theme="Success" click={handlerApplication}>
                        Añadir Aplicación
                    </Button>
                </div>
            </div>
            }
            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}
            {item === 'Recolección y Validación de Datos' && <VerificationTools filtro_1={filtro_1} />}


            {item === 'Reporte diario' && <div>
                <div className="w-full   relative  overflow-auto  scroll-smooth lg:overflow-hidden">

                    {/*-------- FILTERS */}
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Fecha de tramitacion de cobro:
                                </label>
                                <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='fechaDeTramitacionDeCobro' onChange={onChangeHandler} defaultValue={filter['fechaDeTramitacionDeCobro']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>

                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-center space-x-3'>
                                <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                    <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                </Link>
                                <Link href={`?seccion=${seccion}&item=${item}`}>
                                    <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/*-------- BUTTONS */}
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>

                            <div className='flex justify-between space-x-3'>
                                {/* {<Button type="button" theme={checkedArr.length === 1 ? 'Danger' : 'Disable'} click={() => checkedArr.length === 1 && setModal('Restablecer Asesor')}>Restablecer usuario</Button>} */}
                                {<Button type="button" theme={checkedArr.length === 1 ? 'Success' : 'Disable'} click={() => checkedArr.length === 1 && setModal('Asignar Asesor')}>Asignar Asesor</Button>}
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                                <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Restablecimiento Masivo')}>Restablecimiento Masivo</Button>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between space-x-3'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {item === 'Lista final' && <VerificationTools />}

            {/* ---------------------------------'GESTION DE ACCESOS' --------------------------------- */}
            {(item === 'Gestión de RH' || item === 'Gestión de administradores' || item === 'Gestión de managers' || item === 'Gestión de asesores') && <AccessTools />}

            {(item === 'Gestión de cuentas personales') &&
                <div>
                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <SearchInput
                                    label="Buscar Por Nombre:"
                                    name="nombreCompleto"
                                    value={filter['nombreCompleto'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="Juan Perez"
                                    required
                                />
                                <SearchInput
                                    label="Buscar Por DNI:"
                                    name="dni"
                                    value={filter['dni'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="3245641"
                                    required
                                />
                                <Button type="button" theme="MiniPrimary" click={() => setModal('Añadir cuenta personal')} >Crear Asesor</Button>
                            </div>
                            <div className='w-[300px] space-y-2'>
                                <SearchInput
                                    label="Buscar Por Número de teléfono:"
                                    name="numeroDeTelefonoMovil"
                                    value={filter['numeroDeTelefonoMovil'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="+5915646546"
                                    required
                                />
                                <SearchInput
                                    label="Número de páginas:"
                                    name="page"
                                    value={filter['page'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="5"
                                    required
                                />
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-start space-x-3'>
                                    <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                        <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                    </Link>
                                    <Link href={`?seccion=${seccion}&item=${item}`}>
                                        <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            }

            {(item === 'Atención al Cliente') &&
                <div>
                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <SearchInput
                                    label="Buscar Por Nombre:"
                                    name="nombreCompleto"
                                    value={filter['nombreCompleto'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="Juan Perez"
                                    required
                                />
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-start space-x-3'>
                                    <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                        <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                    </Link>
                                    <Link href={`?seccion=${seccion}&item=${item}`}>
                                        <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            }




            {/* ----------------------------------------------------------------------- */}
            {/* {(item === 'Usuarios de verificación' || item === 'Usuarios de Cobranza' || item === 'Usuarios de Auditoria') &&
                <div>
                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por Cuenta:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por nombre:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Crear Usuarios</button>

                            </div>
                            <div className='w-[300px] space-y-2'>
                                <SearchInput
                                    label="Número de teléfono:"
                                    name="numeroDeTelefonoMovil"
                                    value={filter['numeroDeTelefonoMovil'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="Buscar por numero de teléfono"
                                    required
                                />
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de Usuario:
                                    </label>
                                    <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            } */}

            {(user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Auditoria' || user.rol === 'Manager de Verificación') && item === 'Asistencia' &&
                <div>


                    <div className="w-full   relative  scroll-smooth mb-2 ">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>

                                <SearchInput
                                    label="Buscar por Usuario:"
                                    name="usuario"
                                    value={filter['usuario'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="Buscar por usuario"
                                    required
                                />
                                <SelectField
                                    label="Tipo de grupo:"
                                    name="Tipo de grupo"
                                    arr={tipoDeGrupo}
                                    click={handlerSelectClick}
                                    defaultValue={filter['tipoDeGrupo']}
                                    uuid="123"
                                    position="absolute left-0 top-[25px]"
                                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}
                                    theme={theme}
                                    required
                                />


                            </div>
                            <div className='w-[330px] space-y-2'>

                                <div className='flex justify-end items-center'>
                                    <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        buscar por Fecha :
                                    </label>
                                    <input type='week' id="week" className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px] text-gray-950" onChange={handlerWeekChange} required />
                                </div>

                                <SearchInput
                                    label="Buscar por Pagina:"
                                    name="page"
                                    value={filter['page'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="Buscar por numero de pagina"
                                    required
                                />

                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-center space-x-3'>
                                    <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                        <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                    </Link>
                                    <Link href={`?seccion=${seccion}&item=${item}`}>
                                        <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                    </Link>
                                </div>
                            </div>
                            <div className='flex flex-row w-[1000px] space-y-2'>
                                <div className='flex justify-center space-x-3'>
                                    <button
                                        type="button"
                                        onClick={() => setModal("Hora de Entrada")}
                                        className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                    >
                                        Registrar Hora de Entrada
                                    </button>
                                </div>

                                {/* Mostrar la hora de entrada con la fecha */}
                                {horaEntrada && (
                                    <>
                                        <div className="text-gray-950 dark:text-white mt-2">
                                            <p className="text-[12px]">Hora de entrada: {horaEntrada.horaEntrada}</p>
                                        </div>
                                        <div className="flex flex-row justify-center text-xs text-gray-950 dark:text-white mt-2">
                                            {horaEntrada.estadosDeAsistencia.map((estado, index) => (
                                                <p key={index} className={`px-4 pt-0 ${getBackgroundClass(estado.estado)}`}>
                                                    {estado.rango}: {estado.estado}
                                                </p>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                </div>}

        </div>
    );
};

export default Alert;
