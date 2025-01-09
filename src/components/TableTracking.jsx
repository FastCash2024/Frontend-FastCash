'use client'
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext'
import { useSearchParams } from 'next/navigation'

import Link from 'next/link';
import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';

const Table = ({
    headArray,
    dataArray,
    dataFilter,
    access,
    local,
    server,
    query
}) => {
    const { user, userDB, loader, setUserProfile, users, setLoader, setUsers, checkedArr, setCheckedArr, setModal, itemSelected, setItemSelected, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario } = useAppContext()
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [data, setData] = useState([])


    const toCamelCase = (str) => {
        let cleanedStr = str.toLowerCase();
        cleanedStr = cleanedStr.replace(/\([^)]*\)/g, '');
        cleanedStr = cleanedStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        cleanedStr = cleanedStr.replace(/-/g, ' ');
        return cleanedStr
            .replace(/[_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
            .replace(/^[A-Z]/, firstChar => firstChar.toLowerCase());
    };

    function handlerVerification(i) {
        setModal('Registrar Auditoria Tracking')
        setItemSelected(i)
    }
    function handlerAcount(mod, i) {
        setModal(mod)
        setCheckedArr([i])
    }
    // console.log(userDB)
    //     async function handlerFetch(queryURL) {
    // console.log(`${local}${queryURL}`)
    //         console.log(window?.location?.href?.includes('localhost') ? `${local}${queryURL}` : `${server}${queryURL}`)
    //         const res = await fetch(
    //             window?.location?.href?.includes('localhost') ? `${local}${queryURL}` : `${server}${queryURL}`
    //         )
    //         const data = await res.json()
    //         setData(data)
    //         setLoader(false)
    //     }
    console.log(userDB)
    async function handlerFetch(queryURL) {
        // Obtener los parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        // Filtrar solo las queries que comiencen con "filter["
        const filterParams = {};
        urlParams.forEach((value, key) => {
            if (key.startsWith("filter[") && value !== "Elije por favor" && value !== "Todo") {
                const fieldName = key.slice(7, -1); // Extraer el nombre de la clave dentro de "filter[]"
                filterParams[fieldName] = value;
            }
        });

        const stg = Object.keys(filterParams)
            .filter(key => filterParams[key] !== undefined && filterParams[key] !== null) // Filtrar valores nulos o indefinidos
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`) // Codificar clave=valor
            .join("&"); // Unir con &
        console.log(stg ? 'existen' : 'no existen')


        const roleQueries = {
            "Asesor de Verificación": `&cuentaVerificador=${userDB.cuenta}`,
            "Asesor de Cobranza": `&cuentaCobrador=${userDB.cuenta}`,
            "Asesor de Auditoria": `&cuentaAuditor=${userDB.cuenta}`,
        };

        const query2 = roleQueries[user?.rol] || '';

        console.log("query2", query2)
        const urlLocal = stg
            ? local.includes('?')
                ? `${local.split('?')[0]}?${stg}${query2}`
                : `${local}?${stg}${query2}`
            : `${local}${query2}`

        const urlServer = stg
            ? server.includes('?')
                ? `${server.split('?')[0]}?${stg}${query2}`
                : `${server}?${stg}${query2}`
            : `${server}${query2}`

        const res = await fetch(
            window?.location?.href?.includes('localhost') ? `${urlLocal}` : `${urlServer}`
        )
        const data = await res.json()
        setData(data)
        setLoader(false)
    }

    function handlerSelectCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            setCheckedArr([...checkedArr, i]);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr(checkedArr.filter(item => item._id !== i._id));
        }
    }
    function handlerSelectAllCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            const db = data.filter((i, index) => dataFilter(i))
            console.log(db)
            setCheckedArr(db);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr([]);
        }
    }
    console.log(data)
    useEffect(() => {
        handlerFetch()
    }, [loader, searchParams])

    useEffect(() => {
        setCheckedArr([])
    }, [])
    return (
        <table className="min-w-full shadow">
            <thead className="bg-gray-900 text-[10px] uppercase sticky top-[0px] z-20">
                <tr className="text-white min-w-[2500px]">
                    {headArray().map((i, index) => (
                        <th
                            scope="col"
                            key={index}
                            className={`w-[50px] px-3 py-3 text-white `}
                        // className={`w-[50px] px-3 py-3 text-white 
                        //     ${index < 10
                        //     ? (selectedLeft === index
                        //         ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900')
                        //     : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800'
                        //         : 'bg-gray-900')}
                        //         `}
                        // onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}
                        >
                            {i === "Seleccionar" ? <input type="checkbox" onClick={(e) => handlerSelectAllCheck(e, i)} /> : i}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data && data?.map((i, index) => {

                    return (
                        <tr key={index} className="text-[12px] border-b">
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                {i.numeroDePrestamo}
                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                <table>
                                    <tbody>
                                        {i.trackingDeOperaciones.map((i, index) => <tr key={index}>
                                            <td>
                                                {i.asesor}
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                <table>
                                    <tbody>
                                        {i.trackingDeOperaciones.map((i, index) => <tr key={index}>
                                            <td>
                                                {i.asesor}
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >

                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                <table>
                                    <tbody>
                                        {i.trackingDeOperaciones.map((i, index) => <tr key={index}>
                                            <td>
                                                {i.operacion}
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                <table>
                                    <tbody>
                                        {i.trackingDeOperaciones.map((i, index) => <tr key={index}>
                                            <td>
                                                {i.modificacion}
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                <table>
                                    <tbody>
                                        {i.trackingDeOperaciones.map((i, index) => <tr key={index}>
                                            <td>
                                                {i.fecha}
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </td>
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                <div className='flex justify-around'>
                                    <Link href={`/Home/Datos?caso=${i._id}&seccion=info`} className=''>
                                        <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>
                                    </Link>
                                    <span>
                                        <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => handlerVerification(i)}>Registrar</button>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    )
                })}

            </tbody>
        </table>
    );
};

export default Table;


