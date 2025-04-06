'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect, useRef } from 'react'

import Loader from '@/components/Loader'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), { ssr: false, });
import FormAddPersonalData from '@/components/formModals/FormAddPersonalData'

import ViewPersonalInfo from '@/components/ViewPersonalInfo'
import { menuArray } from '@/constants/index'
import { useRouter } from 'next/navigation';
import TableComision from './TableComision'
import TableGestionDeAuditoria from './TableGestionDeAuditoria'
import TableComisionVerification from './TableComisionVerification'


export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const router = useRouter()
    const [texto, setTexto] = useState('');
    const { user, modal } = useAppContext()
    const [filter, setFilter] = useState({
        nombreProducto: 'Todo',
        ['Minimo dias vencido']: 0,
        ['Maximo dias vencido']: 10000000000,
        ['Estado de reembolso']: '',
        ['Cliente nuevo']: '',
        ['Nombre del cliente']: '',
        ['Número de teléfono']: ''
    })

    const [state, setState] = useState({})
    const refFirst = useRef(null);
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false);
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [trabajo, setTrabajo] = useState([])
    const [attendance, setAttendace] = useState({})

    async function handlerFetch(startDate = '', endDate = '') {
        const local = 'http://localhost:3006/api/users/attendance';

        const urlParams = new URLSearchParams(window.location.search);
        const filterParams = {};
        urlParams.forEach((value, key) => {
            if (
                key.startsWith("filter[") &&
                value !== "Elije por favor" &&
                value !== "Todo"
            ) {
                const fieldName = key.slice(7, -1); // Extraer el nombre de la clave dentro de "filter[]"
                filterParams[fieldName] = value;
            }
        });

        const stg = Object.keys(filterParams)
            .filter(
                (key) => filterParams[key] !== undefined && filterParams[key] !== null
            ) // Filtrar valores nulos o indefinidos
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`
            ) // Codificar clave=valor
            .join("&"); // Unir con &

        console.log(stg ? "existen" : "no existen");

        const dataParams = [];
        if (startDate) dataParams.push(`startDate=${startDate}`);
        if (endDate) dataParams.push(`endDate=${endDate}`);
        const dataParamsString = dataParams.join('&');

        const urlLocal = stg
            ? `${local}?${stg}${dataParamsString ? `&${dataParamsString}` : ''}`
            : `${local}${dataParamsString ? `?${dataParamsString}` : ''}`;

        console.log("url local solicitada: ", urlLocal);

        const res = await fetch(urlLocal);

        const result = await res.json();
        console.log("resultado: ", result);

        if (item === "Asistencia") {
            setTrabajo(result);
        }
    }

    console.log("user desde tables: ", user);


    async function handlerFetchPersonalAttendance(personId, limit = 52, page = 1) {
        const local = `http://localhost:3006/api/users/attendance/${personId}`;
        const server = `https://api.fastcash-mx.com/api/users/attendance/${personId}`;

        const urlParams = new URLSearchParams(window.location.search);
        const filterParams = {};
        urlParams.forEach((value, key) => {
            if (
                key.startsWith("filter[") &&
                value !== "Elije por favor" &&
                value !== "Todo"
            ) {
                const fieldName = key.slice(7, -1); // Extraer el nombre de la clave dentro de "filter[]"
                filterParams[fieldName] = value;
            }
        });

        const stg = Object.keys(filterParams)
            .filter(
                (key) => filterParams[key] !== undefined && filterParams[key] !== null
            ) // Filtrar valores nulos o indefinidos
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`
            ) // Codificar clave=valor
            .join("&"); // Unir con &

        console.log(stg ? "existen" : "no existen");

        const dataParams = [];
        if (limit) dataParams.push(`limit=${limit}`);
        if (page) dataParams.push(`page=${page}`);
        const dataParamsString = dataParams.join('&');

        const urlLocal = stg
            ? `${local}?${stg}${dataParamsString ? `&${dataParamsString}` : ''}`
            : `${local}${dataParamsString ? `?${dataParamsString}` : ''}`;

        const urlServer = stg
            ? `${server}?${stg}${dataParamsString ? `&${dataParamsString}` : ''}`
            : `${server}${dataParamsString ? `?${dataParamsString}` : ''}`;

        console.log("url local solicitada: ", urlLocal);

        const res = await fetch(
            window?.location?.href?.includes("localhost")
                ? `${urlLocal}`
                : `${urlServer}`
        );

        const result = await res.json();
        console.log("attendaceResult: ", result);

        setAttendace(result);
    }


    useEffect(() => {
        if (item === "Asistencia") {
            handlerFetchPersonalAttendance(user.id);
        }
    }, [item]);

    useEffect(() => {
        handlerFetch();
    }, []);

    let menu = user?.rol ? menuArray[user.rol].filter(i => i.hash === seccion) : ''

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    //fecha actual
    const [value, setValue] = useState({})

    const getBackgroundClass = (estado) => {
        switch (estado) {
            case "Operando":
                return "bg-green-400";
            case "Atraso-1":
                return "bg-yellow-400";
            case "Atraso-2":
                return "bg-orange-400";
            case "Falta":
                return "bg-red-500";
            case "Libre":
                return "bg-gray-300";
            default:
                return "";
        }
    };

    const [isMounted, setIsMounted] = useState(false);

    const cobradores = [
        {
            id: "S0",
            nombre: "Alvarez Puente Gabriela Geomar",
            usuario: "CobradorA1",
            telefono: "5215838160069",
            extension: "88136193",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 20,
            clientesSinResponder: 3,
            pagosHoy: 5,
            porcentajeHoy: "11.54%",
            ptp2pm: 7,
            ptp6pm: 5,
            porcentajePTP: "26.92%",
            llamadas3pm: 7,
            ptp10am: 6,
            porcentajeLlamadas: "26.92%",
            llamadasElDiaSiguiente: 8,
            llamadasFinales: 7,
            porcentajeFinal: "30.77%",
            tasaFinal: 12,
            porcentajeTasaFinal: "46.15%",
        },
        {
            id: "S0",
            nombre: "Benavides Quiroz Jazmín Carolina",
            usuario: "CobradorA8",
            telefono: "5215838160070",
            extension: "53828419",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 22,
            clientesSinResponder: 4,
            pagosHoy: 5,
            porcentajeHoy: "14.81%",
            ptp2pm: 6,
            ptp6pm: 5,
            porcentajePTP: "22.22%",
            llamadas3pm: 8,
            ptp10am: 5,
            porcentajeLlamadas: "29.63%",
            llamadasElDiaSiguiente: 8,
            llamadasFinales: 4,
            porcentajeFinal: "29.63%",
            tasaFinal: 10,
            porcentajeTasaFinal: "37.04%",
        },
        {
            id: "S0",
            nombre: "Sigcha Palango Tania Selena",
            usuario: "CobradorA9",
            telefono: "5215838160071",
            extension: "97187966",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 22,
            clientesSinResponder: 5,
            pagosHoy: 6,
            porcentajeHoy: "19.23%",
            ptp2pm: 9,
            ptp6pm: 6,
            porcentajePTP: "34.62%",
            llamadas3pm: 10,
            ptp10am: 3,
            porcentajeLlamadas: "38.46%",
            llamadasElDiaSiguiente: 11,
            llamadasFinales: 2,
            porcentajeFinal: "42.31%",
            tasaFinal: 12,
            porcentajeTasaFinal: "46.15%",
        },
        {
            id: "S0",
            nombre: "Jimenez Espinoza Byron Andres",
            usuario: "CobradorA10",
            telefono: "5215838160072",
            extension: "35625589",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 24,
            clientesSinResponder: 5,
            pagosHoy: 0,
            porcentajeHoy: "19.23%",
            ptp2pm: 11,
            ptp6pm: 0,
            porcentajePTP: "42.31%",
            llamadas3pm: 11,
            ptp10am: "",
            porcentajeLlamadas: "42.31%",
            llamadasElDiaSiguiente: 13,
            llamadasFinales: 0,
            porcentajeFinal: "50.00%",
            tasaFinal: 15,
            porcentajeTasaFinal: "57.69%",
        },
        {
            id: "S0",
            nombre: "Garnica Robayo Hernan Garnica",
            usuario: "CobradorA16",
            telefono: "5215838160084",
            extension: "68942789",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 19,
            clientesSinResponder: 0,
            pagosHoy: 4,
            porcentajeHoy: "0.00%",
            ptp2pm: 2,
            ptp6pm: 6,
            porcentajePTP: "7.41%",
            llamadas3pm: 4,
            ptp10am: 2,
            porcentajeLlamadas: "14.81%",
            llamadasElDiaSiguiente: 4,
            llamadasFinales: 6,
            porcentajeFinal: "14.81%",
            tasaFinal: 8,
            porcentajeTasaFinal: "29.63%",
        },
        {
            id: "S0",
            nombre: "Murillo Jerez Josselyne Michelle",
            usuario: "CobradorA17",
            telefono: "5215838160085",
            extension: "69544512",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 18,
            clientesSinResponder: 9,
            pagosHoy: 6,
            porcentajeHoy: "33.33%",
            ptp2pm: 10,
            ptp6pm: 9,
            porcentajePTP: "37.04%",
            llamadas3pm: 10,
            ptp10am: 7,
            porcentajeLlamadas: "37.04%",
            llamadasElDiaSiguiente: 11,
            llamadasFinales: 6,
            porcentajeFinal: "40.74%",
            tasaFinal: 12,
            porcentajeTasaFinal: "44.44%",
        },
        {
            id: "S0",
            nombre: "Lopez Morales Tifany Gissell",
            usuario: "CobradorA18",
            telefono: "5215838160086",
            extension: "62862435",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 21,
            clientesSinResponder: 2,
            pagosHoy: 3,
            porcentajeHoy: "7.41%",
            ptp2pm: 4,
            ptp6pm: 9,
            porcentajePTP: "14.81%",
            llamadas3pm: 6,
            ptp10am: 2,
            porcentajeLlamadas: "22.22%",
            llamadasElDiaSiguiente: 6,
            llamadasFinales: 6,
            porcentajeFinal: "22.22%",
            tasaFinal: 9,
            porcentajeTasaFinal: "33.33%",
        },
        {
            id: "S0",
            nombre: "Andi Andy Silvana Maritza",
            usuario: "CobradorA19",
            telefono: "5215838160087",
            extension: "71868466",
            casos: 21,
            llamadasRealizadas: 16,
            clientesContactados: 16,
            clientesSinResponder: 3,
            pagosHoy: 4,
            porcentajeHoy: "14.29%",
            ptp2pm: 5,
            ptp6pm: 4,
            porcentajePTP: "23.81%",
            llamadas3pm: 6,
            ptp10am: 4,
            porcentajeLlamadas: "28.57%",
            llamadasElDiaSiguiente: 7,
            llamadasFinales: 6,
            porcentajeFinal: "33.33%",
            tasaFinal: 10,
            porcentajeTasaFinal: "47.62%",
        },
        {
            id: "S0",
            nombre: "Carrasco Ortega Bryan Josue",
            usuario: "CobradorA20",
            telefono: "5215838160088",
            extension: "46712168",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 24,
            clientesSinResponder: 1,
            pagosHoy: 6,
            porcentajeHoy: "3.70%",
            ptp2pm: 5,
            ptp6pm: 9,
            porcentajePTP: "18.52%",
            llamadas3pm: 7,
            ptp10am: 6,
            porcentajeLlamadas: "43.75%",
            llamadasElDiaSiguiente: 7,
            llamadasFinales: 5,
            porcentajeFinal: "25.93%",
            tasaFinal: 10,
            porcentajeTasaFinal: "37.04%",
        }
    ];


    // console.log(modal)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        user === undefined && router.push('/')
    }, [])

    return (
        user?.rol && <main className={` h-full pt-[20px] `}>

            {modal === 'Guardando...' && <Loader> {modal} </Loader>}

            {user?.rol === 'Cuenta Personal' && item === 'Comision' && <TableComision />}
            {user?.rol === 'Cuenta Personal' && item === 'Comision Verificacion' && <TableComisionVerification />}

            {/* ---------------------------------TABLAS--------------------------------- */}

            <div className="overflow-x-auto">
                {isMounted && user?.rol && <div className="max-h-[calc(100vh-90px)] pb-[70px] overflow-y-auto relative scroll-smooth" ref={refFirst}>
                    {/* ---------------------------------COLECCION DE CASOS--------------------------------- */}

                    {user?.rol === 'Cuenta Personal' && !user?.nombreCompleto && <FormAddPersonalData />}
                    {user?.rol === 'Cuenta Personal' && item === 'Control de casos' && <table className="w-full min-w-[1500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">

                            <tr className=' bg-gray-800'>
                                <th className='px-3 py-2'> <input type="checkbox" /></th>
                                <th className="px-4 py-2 text-white">Segmento</th>
                                <th className="px-4 py-2 text-white">Nombre</th>
                                <th className="px-4 py-2 text-white">Usuario asignado</th>
                                <th className="px-4 py-2 text-white">Cantidad de casos</th>
                                <th className="px-4 py-2 text-white">Porcentaje a alcanzar</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 10:00 aM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 2:00 PM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 4:00 PM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2 text-white">Pagos alcanzados</th>
                                <th className="px-4 py-2 text-white">Taza de recuperacion</th>
                            </tr>

                        </thead>
                        <tbody>
                            {cobradores.map((cobrador, index) => (
                                <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2">{cobrador.id}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>
                                    <td className="px-4 py-2">{cobrador.usuario}</td>
                                    <td className="px-4 py-2">{cobrador.casos}</td>

                                    <td className="px-4 py-2">{cobrador.pagosHoy}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.ptp2pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp6pm}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadas3pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp10am}</td>
                                    <td className="px-4 py-2">{cobrador.llamadasElDiaSiguiente}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadasFinales}</td>
                                    <td className="px-4 py-2">{cobrador.tasaFinal}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.porcentajeTasaFinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    {user?.rol === 'Cuenta Personal' && item === 'Asistencia' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">


                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">
                            <tr>

                                <th colSpan="1" className="px-4 py-2 text-white text-center">SEMANA</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.data?.map((item, index) => (
                                <tr key={index} className='text-[12px]'>
                                    <td className="px-4 py-2 border border-gray-200 bg-gray-300">{item.semana} {item.startWeek} - {item.endWeek}</td>
                                    {Object.keys(item.asistencias).map((date, idx) => (
                                        <td key={idx} className={`px-4 py-2 border border-gray-200 bg-gray-300 ${getBackgroundClass(item.asistencias[date])}`}>{item.asistencias[date]}</td>
                                    ))
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    {user?.rol === 'Cuenta Personal' && item === 'Gestion de auditoria' && <TableGestionDeAuditoria />}
                    {user?.rol === 'Cuenta Personal' && item === 'Informacion personal' && <ViewPersonalInfo></ViewPersonalInfo>}
                </div>}
            </div>
        </main>
    )
}