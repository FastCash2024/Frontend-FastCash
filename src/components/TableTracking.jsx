'use client'
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext'
import { useSearchParams } from 'next/navigation'

import Link from 'next/link';
import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { formatearFecha } from '@/utils';
import { Paginator } from './Paginator';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [expandedRows, setExpandedRows] = useState({});

    const handleRowClick = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

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
        setModal('Multar cuenta')
        setItemSelected(i)
    }

    console.log(userDB)
    async function handlerFetch(limit, page) {
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

        const defaultLimit = 5; // Valor predeterminado para limit
        const defaultPage = 1; // Valor predeterminado para page

        const finalLimit = limit || defaultLimit;
        const finalPage = page || defaultPage;

        const dataParams = `${stg || query2 || local.includes("?") ? "&" : "?"
            }limit=${finalLimit}&page=${finalPage}`;
        console.log("dataParamas: ", dataParams);
        const urlLocal = stg
            ? local.includes('?')
                ? `${local.split('?')[0]}?${stg}${query2}${dataParams}`
                : `${local}?${stg}${query2}${dataParams}`
            : `${local}${query2}${dataParams}`

        const urlServer = stg
            ? server.includes('?')
                ? `${server.split('?')[0]}?${stg}${query2}${dataParams}`
                : `${server}?${stg}${query2}${dataParams}`
            : `${server}${query2}${dataParams}`

        const res = await fetch(
            window?.location?.href?.includes('localhost') ? `${urlLocal}` : `${urlServer}`
        )
        const data = await res.json()
        setData(data)
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalDocuments(data.totalDocuments);
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

    useEffect(() => {
        handlerFetch(itemsPerPage, currentPage)
    }, [loader, searchParams, itemsPerPage, currentPage])

    useEffect(() => {
        setCheckedArr([])
    }, [])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
        setCurrentPage(1);
    };

    const handleReload = () => {
        handlerFetch(itemsPerPage, currentPage);
    }

    // console.log("data: tracking", data.data.length);
    // console.log("data: tracking", itemsPerPage);

    return (
        <>
            <table className="min-w-full shadow mt-2">
                <thead className="bg-gray-900 text-[10px] uppercase sticky top-[0px] z-20">
                    <tr className="text-white min-w-[2500px]">
                        {headArray().map((i, index) => (
                            <th
                                key={index}
                                scope="col"
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
                    {data && data?.data?.map((i, index) => (
                        <React.Fragment key={index}>
                            <tr className={`text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                <td className="px-3 py-2 text-gray-950">
                                    {i.numeroDePrestamo}
                                </td>
                                <td className="px-3 py-2 text-gray-950">
                                    {i.trackingDeOperaciones[i.trackingDeOperaciones.length - 1]?.cuenta}
                                </td>
                                <td className="px-3 py-2 text-gray-950">
                                    {i.trackingDeOperaciones[i.trackingDeOperaciones.length - 1]?.emailAsesor}
                                </td>
                                <td className="px-3 py-2 text-gray-950">
                                    {i.nombreDelProducto}
                                </td>
                                <td className="px-3 py-2 text-gray-950">
                                    {i.idDeSubFactura}
                                </td>
                                <td className="px-3 py-2 text-gray-950">
                                    {i.trackingDeOperaciones[i.trackingDeOperaciones.length - 1]?.operacion}
                                </td>
                                <td className="px-3 py-2 text-gray-950 cursor-pointer">
                                    {i.trackingDeOperaciones[i.trackingDeOperaciones.length - 1]?.modificacion}
                                </td>
                                <td className="px-3 py-2 text-gray-950 cursor-pointer">
                                    {formatearFecha(i.trackingDeOperaciones[i.trackingDeOperaciones.length - 1]?.fecha)}
                                </td>
                                <td className="px-3 py-2 text-[12px]">
                                    <div className='flex justify-around'>
                                        <Link href={`/Home/Datos?caso=${i._id}&seccion=info`} className=''>
                                            <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>
                                        </Link>
                                        <span>
                                            <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => handlerVerification(i.trackingDeOperaciones[i.trackingDeOperaciones.length - 1])}>Multar</button>
                                        </span>
                                        <span>
                                            <button type="button" className="w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => handleRowClick(index)}>Expandir</button>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            {expandedRows[index] && i.trackingDeOperaciones.slice().reverse().map((op, idx) => (
                                <tr key={idx} className="text-[12px] border-b border-t border-solid border-gray-400">
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {i.numeroDePrestamo}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {op.cuenta}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {op.emailAsesor}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {i.nombreDelProducto}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {i.idDeSubFactura}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {op.operacion}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {op.modificacion}
                                    </td>
                                    <td className="px-3 py-2 pl-6 text-gray-950">
                                        {formatearFecha(op.fecha)}
                                    </td>
                                    <td className="flex justify-center items-center px-3 py-2 pl-6 text-gray-950">
                                        <span>
                                            <button type="button" className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => handlerVerification(op)}>Multar</button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {item === "Registro Histórico" && user.rol !== "Cuenta Personal" && (
                <Paginator
                    totalItems={totalDocuments}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    onReload={handleReload}
                />
            )}
        </>
    );
}
export default Table;


