import { useAppContext } from '@/context/AppContext';
import { getDateFromWeekNumber, getDateSixDaysAgo, getDay, getDays, getDayWeek, getDayWeekCustom, getMondayOfCurrentWeek, getTodayDate } from '@/utils/getDates';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'

export default function TableCustomerFlow() {
  const { loader, setModal, setAttendance } = useAppContext();
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const [baseDate, setBaseDate] = useState(getTodayDate());
  const item = searchParams.get("item");
  const [filtro_1, setFiltro_1] = useState([]);
  const [filtro_2, setFiltro_2] = useState({});

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

  async function fetchCustomers() {
    const urlParams = new URLSearchParams(window.location.search);

    const filterParams = {};
    let weekNumberFromParams = null; // <- Aquí vamos a capturar la semana si viene

    urlParams.forEach((value, key) => {
      if (key.startsWith("filter[") && value !== "Elije por favor" && value !== "Todo") {
        const fieldName = key.slice(7, -1);
        filterParams[fieldName] = value;

        // Si el filtro es por semana, guarda el número de semana
        if (fieldName === "semana") {
          weekNumberFromParams = value;
        }
      }
    });

    const queryString = Object.keys(filterParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`)
      .join("&");

    const baseUrl = window?.location?.href?.includes('localhost')
      ? 'http://localhost:3003/api/loans/verification/customer'
      : 'https://api.fastcash-mx.com/api/loans/verification/customer';

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("url reporte cobrado: ", url);

    // --- Aquí resolvemos la fecha base ---
    if (weekNumberFromParams) {
      // Si hay semana seleccionada, calcula la fecha base a partir del número de semana
      const year = new Date().getFullYear(); // o puedes capturar otro año si viene en los filtros
      const baseDateFromWeek = getDateFromWeekNumber(year, weekNumberFromParams);
      console.log("Fecha base desde semana:", baseDateFromWeek);
      setBaseDate(baseDateFromWeek);
    } else {
      // Si no hay semana, que sea hoy
      setBaseDate(getTodayDate());
    }

    // --- Luego hacemos el fetch ---
    const res = await fetch(url);
    const data = await res.json();
    console.log("data detalle: ", data);
    setFiltro_2(data);
  }


  useEffect(() => {
    const days = [-6, -5, -1, -3, -2, -1, 0];
    const dates = getDays(days);
    fetchCustomers(dates);
  }, [item, searchParams, loader]);

  useEffect(() => {
    // fetchCustomers(formatDateToISO(getDay(0).val));
    fetchCustomersFlow();
  }, []);

  const dates = getDays([-6, -5, -1, -3, -2, -1, 0]);

  const formattedDates = Object.keys(filtro_2).sort((a, b) => {
    // Convertir las fechas a objetos Date para compararlas correctamente
    return new Date(a) - new Date(b);
  });

  const getTotalByDate = (formattedDate) => {
    console.log("fecha format: ", formattedDate);

    let totalPagaron = 0;
    let totalGeneral = 0;

    // Sumar los valores de "pagaron" y "totalPagar" de cada item para la fecha dada
    filtro_1.forEach((item) => {
      totalPagaron += filtro_2[formattedDate]?.[item]?.pagaron ?? 0;
      totalGeneral += filtro_2[formattedDate]?.[item]?.totalPagar ?? 0;
    });

    return { totalPagaron, totalGeneral };
  };

  return (
    <>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
        <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
          <thead className="text-[10px] text-gray-700 uppercase bg-slate-200  sticky top-[0px] z-20">
            <tr className="">
              <th
                scope="col"
                className="w-[50px] px-3 py-1 text-gray-700"
              >
                Solicitud
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -13).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -12).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -11).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -10).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -9).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -8).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -7).val}
              </th>
            </tr>
            <tr className="">
              <th
                scope="col"
                className="w-[50px] px-3 py-1 text-gray-700"
              >
                Desembolso
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -6).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -5).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -4).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -3).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -2).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, -1).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeek(baseDate, 0).val}
              </th>
            </tr>
            <tr className="">
              <th
                scope="col"
                className="w-[50px] px-3 py-1 text-gray-700"
              >
                Dia
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, -5).val)}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, -4).val)}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, -3).val)}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, -2).val)}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, -1).val)}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, 0).val)}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDayWeekCustom(getDayWeek(baseDate, 1).val)}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtro_1.map(
              (item, index) =>
                item !== "Todo" && (
                  <tr key={index} className="text-[12px] border-b bg-slate-50">
                    <td className="px-3 py-2">{item}</td>
                    {formattedDates.map((formattedDate, idx) => (
                      <td key={idx} className="px-3 py-2 text-center">
                        {filtro_2[formattedDate]?.[item]?.pagaron ?? 0}/{filtro_2[formattedDate]?.[item]?.totalPagar ?? 0}
                      </td>
                    ))}
                  </tr>
                )
            )}
            <tr className="text-[12px] border-t bg-slate-100">
              <td className="px-3 py-2 font-bold">Total</td>

              {formattedDates.map((formattedDate, idx) => {
                const { totalPagaron, totalGeneral } = getTotalByDate(formattedDate);

                return (
                  <td key={idx} className="px-3 py-2 text-center font-bold">
                    {totalPagaron}/{totalGeneral}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
