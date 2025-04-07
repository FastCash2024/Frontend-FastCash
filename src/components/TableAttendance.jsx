import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext';
import { getDayWeek, getMondayOfCurrentWeek, getStartAndEndOfWeek } from '@/utils/getDates';
import { useSearchParams } from 'next/navigation';
import { Paginator } from './Paginator';

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

export default function TableAttendance() {
    const { loader, setModal, setAttendance } = useAppContext();
    const searchParams = useSearchParams();
    const item = searchParams.get("item");
    const [baseDate, setBaseDate] = useState(getMondayOfCurrentWeek());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [trabajo, setTrabajo] = useState([])
    const [selectedLeft, setSelectedLeft] = useState(-1);

    // paginacion
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = trabajo.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
        setCurrentPage(1);
    };

    async function handlerFetch(startDate, endDate) {

        const { startDate: defaultStartDate, endDate: defaultEndDate } = getStartAndEndOfWeek();
        startDate = startDate || defaultStartDate;
        endDate = endDate || defaultEndDate;
        const local = 'http://localhost:3006/api/users/attendance';
        const server = 'https://api.fastcash-mx.com/api/users/attendance';

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

        console.log('stg: ', stg);

        const dataParams = [];
        if (!stg.includes(`startDate=`)) {
            dataParams.push(`startDate=${startDate}`)
            setBaseDate(startDate);
        } else {
            const params = new URLSearchParams(stg);
            const existingStartDate = params.get('startDate');
            setBaseDate(existingStartDate);
        };

        if (!stg.includes(`endDate=`)) dataParams.push(`endDate=${endDate}`);
        const dataParamsString = dataParams.join('&');
        console.log("dataParamsString: ", dataParamsString);

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
        console.log("resultado: ", result);
        setTrabajo(result);
    }

    useEffect(() => {
        if (item == "Asistencia") {
            handlerFetch();
        }
    }, [item, searchParams, loader]);

    const handleSelecAttendance = (selectModal, userId, date, status) => {
        setModal(selectModal);
        setAttendance({ userId, date, status });
    };

    const handleReload = () => {};
    console.log(baseDate);
    
    return (
        <>
            <table className="w-full min-w-[1000px] bg-white text-[14px] text-left text-gray-500 border-t-4  shadow">
                <thead className="text-[10px] text-gray-700 uppercase bg-slate-200 sticky top-[0px] z-20">
                    <tr>
                        <th className="px-3 py-2 border-y"></th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400 border-b-0"
                        ></th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            LUNES
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            MARTES
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            MIÉRCOLES
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            JUEVES
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            VIERNES
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            SÁBADO
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                            DOMINGO
                        </th>
                    </tr>
                    <tr>
                        <th className="px-3 py-2 border border-gray-400">
                            <input type="checkbox" />
                        </th>
                        <th
                            colSpan="1"
                            className="px-4 py-2 text-gray-700 text-center border-b-0 border-t-white"
                        >
                            USUARIOS
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 0).val}
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 1).val}
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 2).val}
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 3).val}
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 4).val}
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 5).val}
                        </th>
                        <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                            {getDayWeek(baseDate, 6).val}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((cobrador, index) => (
                        <tr key={index} className="text-[12px]">
                            <td
                                className={`px-3 py-2 text-[12px] border-b bg-white ${selectedLeft === 1 ? "sticky left-0 z-10" : ""
                                    }`}
                            >
                                <input type="checkbox" />
                            </td>
                            <td className="px-4 py-2 border border-gray-400 bg-white">
                                {cobrador.usuario}
                            </td>
                            {[...Array(7)].map((_, dayIndex) => {
                                const asistencia = cobrador.asistencias[getDayWeek(baseDate, dayIndex).val];
                                return (
                                    <td
                                        key={dayIndex}
                                        onClick={() =>
                                            (asistencia === "Libre" || asistencia === "Falta") &&
                                            handleSelecAttendance(
                                                "Asistencia",
                                                cobrador.id,
                                                getDayWeek(baseDate, dayIndex).val,
                                                asistencia
                                            )
                                        }
                                        className={`px-4 py-2 border border-gray-400 ${(asistencia === "Libre" || asistencia === "Falta") ? 'cursor-pointer' : ""} ${getBackgroundClass(
                                            asistencia
                                        )}`}
                                    >
                                        {asistencia}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>

            </table>
            {trabajo.length > 0 && (
                <Paginator
                    totalItems={trabajo.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    onReload={handleReload}
                />
            )}

        </>
    )
}
