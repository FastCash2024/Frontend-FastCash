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
import ProgressBarComponent from "@/components/ProgressBar";
import { obtenerFechaMexicoISO } from "@/utils/getDates";

import { tipoDeGrupo, filterCliente, factura, Jumlah } from '@/constants/index'
import Link from 'next/link';
import SelectField from './SelectField';
import { getBackgroundClass } from '@/utils/colors';
import ControlCasesTools from './ControlCasesTools';
import { obtenerSegmento } from '@/utils';
const Alert = ({ children, type = 'success', duration = 5000, onClose }) => {
    const { user, setApplicationTipo, checkedArr, setModal, loader, setAppComisionVerification } = useAppContext()
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const applicationId = searchParams.get('application');
    const { theme } = useTheme();
    const [filter, setFilter] = useState({})
    const [dataApplication, setDataApplication] = useState(null)
    const [filtro_1, setFiltro_1] = useState([]);
    const [query, setQuery] = useState('')

    const [horaEntrada, setHoraEntrada] = useState(null);
    const [totalesVerification, setTotalesVerification] = useState({})
    const [totalesCobro, setTotalesCobro] = useState({})
    const [details, setDetails] = useState([])
    const [totales, setTotales] = useState({});
    const [comisionV, setComisionV] = useState({});


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

            setFiltro_1(["Elige porfavor", ...result]);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    const fetchDataApplication = async () => {
        const local = `http://localhost:3006/api/users/applications/aplicationbyid/${applicationId}`;
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
                ? "http://localhost:3006/api/users/entryhour/gethour"
                : "https://api.fastcash-mx.com/api/users/entryhour/gethour";

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
                const horaActual = obtenerFechaMexicoISO().split("T")[1].slice(0, 5);
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

    function handlerWeekChangeFlujo(event) {
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

        // Formatear las fechas a formato 'YYYY-MM-DD'
        const startDate = monday.toISOString().split('T')[0];
        const endDate = sunday.toISOString().split('T')[0];

        // Enviar el rango como fechaDeReembolso en formato 'startDate,endDate'
        const db = { ...filter, fechaDeReembolso: `${startDate}, ${endDate}` };

        // Actualizar el filtro y la query
        setFilter(db);
        setQuery(objectToQueryString(db));
    }

    const handlerApplication = () => {
        setModal('Modal Agregar Tipo Aplicaion');
        setApplicationTipo(dataApplication);
    }

    // Fetch totales
    async function handlerFetchCTotales() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3003/api/loans/verification/totalreportecobro'
                : 'https://api.fastcash-mx.com/api/loans/verification/totalreportecobro')
        const data = await res.json()
        setTotalesCobro(data.totales)
    }

    async function handlerFetchVTotales() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3003/api/loans/verification/totalreporteverificacion'
                : 'https://api.fastcash-mx.com/api/loans/verification/totalreporteverificacion')
        const data = await res.json()
        setTotalesVerification(data.totalesGenerales)
    }

    async function handlerFetchDetails() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3003/api/loans/verification/reportecobrados'
                : 'https://api.fastcash-mx.com/api/loans/verification/reportecobrados')
        const data = await res.json()
        console.log("data detalle: ", data)
        setDetails(data.data)
    }

    const calcularTotalesPorSegmento = () => {
        const totalesPorSegmento = {};
        const safeDetails = details || {};
        console.log("details: ", details);
        
        Object?.keys(safeDetails).forEach((cuenta) => {
            const segmento = obtenerSegmento(cuenta);
            if (!segmento) {
                console.log(`Segmento no encontrado para cuenta: ${cuenta}`);
                return;
            }

            const pagosTotal = details[cuenta]?.pagosTotal;
            const casosTotales = details[cuenta]?.casosTotales;
            const casosFueraDeHorario = details[cuenta]?.casosFueraDeHorario;

            if (!totalesPorSegmento[segmento]) {
                totalesPorSegmento[segmento] = {
                    casosPagados: 0,
                    casosTotal: 0,
                    casosFueraDeHorario: 0
                };
            }

            if (typeof pagosTotal === "number" && !isNaN(pagosTotal)) {
                totalesPorSegmento[segmento].casosPagados += pagosTotal;
            } else {
                console.log(`No se encontró pagos válidos para la cuenta: ${cuenta}`);
            }

            if (typeof casosTotales === "number" && !isNaN(casosTotales)) {
                totalesPorSegmento[segmento].casosTotal += casosTotales;
            } else {
                console.log(`No se encontró casos totales válidos para la cuenta: ${cuenta}`);
            }

            if (typeof casosFueraDeHorario === "number" && !isNaN(casosFueraDeHorario)) {
                totalesPorSegmento[segmento].casosFueraDeHorario += casosFueraDeHorario;
            }
        });

        const segmentosPosibles = ["D0", "D1", "D2", "S1", "S2"];

        segmentosPosibles.forEach((segmento) => {
            if (!totalesPorSegmento[segmento]) {
                totalesPorSegmento[segmento] = {
                    casosPagados: 0,
                    casosTotal: 0,
                    casosFueraDeHorario: 0,
                };
            }
        });

        const totalesFiltrados = Object.keys(totalesPorSegmento).reduce((obj, segmento) => {
            obj[segmento] = {
                casosPagados: totalesPorSegmento[segmento].casosPagados || 0,
                casosTotal: totalesPorSegmento[segmento].casosTotal || 0,
                casosFueraDeHorario: totalesPorSegmento[segmento].casosFueraDeHorario || 0,
            };
            return obj;
        }, {});

        setTotales(totalesFiltrados);
    };

    console.log("totales: ", totales)

    useEffect(() => {
        handlerFetchCTotales();
        handlerFetchVTotales();
        handlerFetchDetails();
        calcularTotalesPorSegmento();
    }, [loader, item]);

    const modalBackup = () => {
        if (seccion === "coleccion") {
            setModal("Realizar Backoup cobro")
        } else {
            setModal("Realizar Backoup verificacion")
        }
    }

    const comisionVerification = async () => {
        try {
            const res = await fetch(
                window?.location?.href?.includes('localhost')
                    ? 'http://localhost:3006/api/users/comisionVerification'
                    : 'https://api.fastcash-mx.com/api/users/comisionVerification'
            );

            if (!res.ok) throw new Error('Error al obtener la comisión');

            const data = await res.json();
            setComisionV(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        if (item === "Comisión") {
            comisionVerification();
        }
    }, [loader]);

    const handleComision = (i) => {
        setModal("Editar comision verificacion");
        setAppComisionVerification(i);
    }

    return (
        <div className='pt-5'>
            {/* ---------------------------------'COLECCION DE CASOS' --------------------------------- */}
            {(item === 'Casos de Cobranza') && <ColectionCasesTools />}

            {item === 'Incurrir en una estación de trabajo' &&
                <div className='flex '>
                    <div className='flex justify-start relative py-3  border shadow pr-12 bg-slate-100'>
                        <div className='text-center px-2 flex flex-col align-center'>
                            <Velocimetro value={(
                                (totalesCobro?.totalesConAsesor && totalesCobro?.totalesConAsesor !== 0)
                                    ? ((totalesCobro?.pagosTotal / totalesCobro?.totalesConAsesor) * 100).toFixed(2)
                                    : 0
                            )}></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 text-[#55abf1] `}>Tasa de recuperación de caso</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={` text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{totalesCobro?.pagosTotal ?? 0} <br />Cobro de hoy.</p>
                                <p className={` text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{totalesCobro?.casosFueraDeHorario ?? 0} <br /> Número casos fuera de horario.</p>
                                <p className={` text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>{(totalesCobro?.totalesConAsesor + totalesCobro?.casosFueraDeHorario) ?? 0} <br /> Número total de casos.</p>
                            </div>
                        </div>
                        <div className='pl-12 px-2'>
                            <div>
                                <h4
                                    className={`text-center text-[14px] m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1]'
                                        } dark:text-text-[#55abf1]`}
                                >
                                    Tasa de recuperación por grupo
                                </h4>

                                {Object.keys(totales).map((segmento) => {
                                    console.log("totalespor segmento: ", totales);

                                    const { casosPagados = 0, casosTotal = 0, casosFueraDeHorario = 0 } = totales[segmento] || {};

                                    const porcentaje = casosTotal > 0 ? (casosPagados / casosTotal) * 100 : 0;

                                    return (
                                        <div key={segmento} className="flex flex-row w-[500px] gap-6 mb-2">
                                            <div className="grid grid-cols-3 w-[200px]">
                                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} dark:text-white`}>
                                                    {segmento} <br /> Segmento.
                                                </p>
                                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} dark:text-white`}>
                                                    {casosPagados}/{casosTotal} <br /> C. Cobrados
                                                </p>
                                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} dark:text-white`}>
                                                    {casosFueraDeHorario}/{casosTotal} <br /> C. Cobrados FH
                                                </p>
                                            </div>
                                            <div className="flex-grow flex items-center justify-center">
                                                <div className="w-full max-w-[300px]">
                                                    <ProgressBarComponent value={porcentaje.toFixed(2)} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>

                    <div className='flex space-x-5 mb-0 '>

                        <div className='w-[350px] space-y-2'>
                            <div className='flex items-center justify-end '>
                                <label htmlFor="" className={`ql-align-right mr-2 text-[10px] text-right text-gray-950`}>
                                    Codigo del Producto:
                                </label>
                                <SelectSimple
                                    click={handlerSelectClick}
                                    arr={filtro_1}
                                    name='nombreDelProducto'
                                    defaultValue={filter['nombreDelProducto']}
                                    uuid='123'
                                    label='Filtro 1'

                                    position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
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
                                    Estado de credito:
                                </label>
                                <SelectSimple
                                    arr={['Dispersado', 'Pagado', 'Pagado con Extensión']}
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
                            <SearchInput
                                label="ID de sub-factura:"
                                name="idDeSubFactura"
                                value={filter['idDeSubFactura'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="ID de sub-factura"
                                required
                            />
                        </div>
                        <div className='w-[350px] space-y-3'>

                            <div className='flex justify-end items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    filtrar por  Dias vencidos:
                                </label>
                                <div className='grid grid-cols-2 gap-1'>
                                    <input className={`h-[25px] max-w-[173px] w-[84.5px] px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-white' : ' text-black bg-white'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input className={`h-[25px] max-w-[173px] w-[84.5px] px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-white' : ' text-black bg-white'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <MultipleInput
                                // key={query}
                                defaultValue1={filter['fechaDeReembolso'] ? filter['fechaDeReembolso'].split(", ")[0] : ""}
                                defaultValue2={filter['fechaDeReembolso'] ? filter['fechaDeReembolso'].split(", ")[1] : ""}
                                handlerSelectClick={onChangeHandlerDate}
                                handlerSelectClick2={onChangeHandlerDate}
                                name1="fechaDeReembolso"
                                name2="fechaDeReembolso"
                                label="Fecha de Reembolso: "
                            />

                            <MultipleInput
                                // key={query}
                                defaultValue1={filter['fechaDeCobro'] ? filter['fechaDeCobro'].split(", ")[0] : ""}
                                defaultValue2={filter['fechaDeCobro'] ? filter['fechaDeCobro'].split(", ")[1] : ""}
                                handlerSelectClick={onChangeHandlerDate}
                                handlerSelectClick2={onChangeHandlerDate}
                                name1="fechaDeCobro"
                                name2="fechaDeCobro"
                                label="Fecha de cobro: "
                            />
                            <MultipleInput
                                // key={query}
                                defaultValue1={filter['fechaDeDispersion'] ? filter['fechaDeDispersion'].split(", ")[0] : ""}
                                defaultValue2={filter['fechaDeDispersion'] ? filter['fechaDeDispersion'].split(", ")[1] : ""}
                                handlerSelectClick={onChangeHandlerDate}
                                handlerSelectClick2={onChangeHandlerDate}
                                name1="fechaDeDispersion"
                                name2="fechaDeDispersion"
                                label="Fecha de dispersión: "
                            />

                            <div className='flex justify-end space-x-3  pr-0'>
                                <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                    <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Consultar</button>
                                </Link>
                                <Link href={`?seccion=${seccion}&item=${item}`}>
                                    <button onClick={resetFilter} type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>}
            {item === 'Gestión de cuentas de Colección' && <div>
                <AccessTools />
            </div>}

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
                                    Estado de credito:
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
                            <div className='flex justify-between space-x-3'>
                                <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {item === 'Gestion de aplicaciones' && <div>

                <div className='grid grid-cols-3 gap-x-[50px] gap-y-4 w-[950px]'>
                    {/* <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Aplicación:"
                            name="nombre"
                            value={filter['nombre'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por nombre"
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
                    </div> */}
                    <div className='pt-3 flex space-x-3'>
                        <Button type="button" theme="Success" click={() => setModal('Añadir aplicacion')}>
                            Añadir Aplicación
                        </Button>
                    </div>
                </div>

            </div>}

            {item === 'Registro de SMS' && <div>

                <div className='grid grid-cols-3 gap-x-[50px] gap-y-4 w-[950px]'>
                    <div className='w-[300px] space-y-2'>
                        <SearchInput
                            label="Remitente:"
                            name="remitente"
                            value={filter['remitente'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por remitente"
                            required
                        />
                        <SearchInput
                            label="Receptor:"
                            name="receptor"
                            value={filter['receptor'] || ''}
                            onChange={onChangeHandler}
                            theme={theme}
                            placeholder="Buscar por receptor"
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

            </div>}

            {item === "Cobro y balance" && <div>

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
            {/* ---------------------------------'AUDITORIA DE CREDITOS' --------------------------------- */}
            {item === 'Registro Histórico' &&
                <div className="w-full   relative scroll-smooth mb-2 ">
                    <div className='flex space-x-12 w-[1050px]'>

                        <div className='w-[330px] space-y-2'>
                            <SearchInput
                                label="Cuenta operativa:"
                                name="cuentaOperadora"
                                value={filter['cuentaOperadora'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar cuenta op..."
                                required
                            />

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <SearchInput
                                label="Cuenta personal:"
                                name="cuentaPersonal"
                                value={filter['cuentaPersonal'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar cuenta per..."
                                required
                            />

                        </div>
                        <div className='w-[330px] space-y-2'>
                            <div className='w-[260px] space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Filtar por fecha:
                                    </label>
                                    <input
                                        type='date'
                                        className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]"
                                        name='fechaDeOperacion'
                                        onChange={onChangeHandler}
                                        value={filter['fechaDeOperacion'] || ''}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-[300px] space-y-2'>
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

                    </div>
                </div>
            }

            {(item === 'Auditoria Periodica' || item === "Auditoria Periódica") &&
                <div className="w-full relative scroll-smooth mb-2 ">
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <SearchInput
                                label="Cuenta Personal:"
                                name="cuentaPersonal"
                                value={filter['cuentaPersonal'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar por cuenta per...."
                                required
                            />
                            <SearchInput
                                label="Cuenta Operativa:"
                                name="cuentaOperativa"
                                value={filter['cuentaOperativa'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Cuenta opera.."
                                required
                            />

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <SearchInput
                                label="Cuenta Personal Auditor:"
                                name="cuentaPersonalAuditor"
                                value={filter['cuentaPersonalAuditor'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Cuenta audit...."
                                required
                            />
                            <SearchInput
                                label="Cuenta Auditor:"
                                name="cuentaAuditor"
                                value={filter['cuentaAuditor'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Cuenta audit...."
                                required
                            />

                        </div>
                        <div className='w-[300px] space-y-2'>
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
                </div>
            }

            {item === 'Monitoreo de Transacciones' &&
                <div className="w-full   relative scroll-smooth mb-2 ">
                    <div className='flex space-x-12 w-[1050px]'>

                        <div className='w-[330px] space-y-2'>
                            <SearchInput
                                label="Numero de prestamo:"
                                name="numeroDePrestamo"
                                value={filter['numeroDePrestamo'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar numero de pres..."
                                required
                            />

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <SearchInput
                                label="Id sub-factura:"
                                name="idDeSubFactura"
                                value={filter['idDeSubFactura'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Buscar cuenta sub-fact..."
                                required
                            />

                        </div>
                        <div className='w-[300px] space-y-2'>
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

                    </div>
                </div>
            }
            {(item === 'Control de Cumplimiento') && <ControlCasesTools />}



            {(item === 'Atención al Cliente') &&
                <div>
                    <div className="w-full relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
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

                                <input
                                    type='date'
                                    className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]"
                                    name='fecha'
                                    onChange={onChangeHandler}
                                    value={filter['fecha'] || ''}
                                    required
                                />

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
                    {!user.rol.includes("Asesor") && <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
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
                                <Button type="button" theme={'Danger'} click={() => setModal(modalBackup)}>Realizar el Backoup</Button>
                            </div>
                        </div>
                    </div>}
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
                                    label="Buscar por email:"
                                    name="page"
                                    value={filter['page'] || ''}
                                    onChange={onChangeHandler}
                                    theme={theme}
                                    placeholder="example@gmail.com"
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
                                <div className='flex justify-end space-x-3'>
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
            {/* ---------------------------------'CONTABILIDAD' --------------------------------- */}

            {item === 'Comisión' && <div>
                <div className='flex flex-row'>
                    <div className='pt-3 flex space-x-3 w-[20%]'>
                        <Button type="button" theme="MiniPrimary" click={() => setModal('Agregar comision')} >Generar Comisión</Button>
                    </div>
                    {
                        comisionV.length > 0 ?
                            <div className='pt-3 flex space-x-3 w-[30%]'>
                                <Button type="button" theme="MiniPrimary" click={() => handleComision(comisionV[0])} >Editar Comisión verificador</Button>
                            </div>
                            :
                            <div className='pt-3 flex space-x-3 w-[30%]'>
                                <Button type="button" theme="MiniPrimary" click={() => setModal('Agregar comision verificacion')} >Generar Comisión verificador</Button>
                            </div>
                    }
                    <div className='pt-3 pl-4 flex space-x-3 w-[30%] text-gray-950'>
                        <p>Comision verificador: <strong>{comisionV[0]?.comisionPorAprobacion}</strong></p>
                    </div>
                </div>
            </div>}

            {/* ----------------------------------------------------------------------- */}

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
            {(user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Auditoria' || user.rol === 'Manager de Verificación') && item === 'Flujo de Clientes' &&
                <div>


                    <div className="w-full   relative  scroll-smooth mb-2 ">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>

                                <div className='flex justify-end items-center'>
                                    <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        buscar por Fecha :
                                    </label>
                                    <input type='week' id="week" className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px] text-gray-950" onChange={handlerWeekChangeFlujo} required />
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

                    </div>

                </div>}

        </div>
    );
};

export default Alert;
