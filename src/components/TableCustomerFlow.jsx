import { useAppContext } from '@/context/AppContext';
import { getDateSixDaysAgo, getDay, getDays, getDayWeek, getDayWeekCustom, getMondayOfCurrentWeek, getTodayDate } from '@/utils/getDates';
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

  const fetchCustomers = async (dates) => {
    const local = 'http://localhost:3003/api/loans/verification/customer';
    const server = 'https://api.fastcash-mx.com/api/loans/verification/customer';

    try {
      // Seleccionar la URL correcta
      const baseUrl = window?.location?.href?.includes("localhost") ? local : server;

      // Obtener los parámetros de la URL
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
            `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}` // Codificar clave=valor
        )
        .join("&"); // Unir con &

      if (stg.includes('fechaDeReembolso')) {
        const fechaDeReembolso = stg;
        const fechas = decodeURIComponent(fechaDeReembolso).split(", "); // Decodifica y separa
        const segundaFecha = fechas[1];
        setBaseDate(segundaFecha);
      } else {
        setBaseDate(getTodayDate());
      }

      // Si hay 'fechaDeReembolso' en la URL, extraemos ese parámetro
      let urlFechaDeReembolso = stg.includes('fechaDeReembolso')
        ? filterParams['fechaDeReembolso'] // Usamos la fecha de reembolso de la URL
        : null;

      // Si no hay fechaDeReembolso en la URL, usamos el valor de 'dates' pasado como argumento
      if (!urlFechaDeReembolso) {
        urlFechaDeReembolso = dates;
      }

      // Verificar si 'urlFechaDeReembolso' es un array o una fecha individual
      if (Array.isArray(urlFechaDeReembolso)) {
        // Si 'urlFechaDeReembolso' es un array de fechas, hacemos la solicitud por cada una
        const results = await Promise.all(
          urlFechaDeReembolso.map(async (date) => {
            const response = await fetch(`${baseUrl}?fechaDeReembolso=${date}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error('Error en la solicitud');
            }

            const result = await response.json();
            return { date, data: result };
          })
        );

        // Combinamos los resultados
        const combinedResults = results.reduce((acc, { date, data }) => {
          acc[date] = data;
          return acc;
        }, {});

        console.log('Resultados combinados:', combinedResults);
        setFiltro_2(combinedResults);
      } else {
        // Si 'urlFechaDeReembolso' es una sola fecha (no un array), hacemos una sola solicitud
        const response = await fetch(`${baseUrl}?fechaDeReembolso=${urlFechaDeReembolso}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const result = await response.json();
        const groupedByFecha = Object.values(result).reduce((acc, item) => {
          const fecha = item.fechaDeReembolso; // Obtener la fecha de reembolso de cada item
          if (!acc[fecha]) {
            acc[fecha] = {}; // Si no existe, inicializamos el objeto vacío
          }
          acc[fecha][item.nombreDelProducto] = item; // Asignar el producto al objeto bajo la fecha
          return acc;
        }, {});

        console.log("resultado combinado", groupedByFecha);

        setFiltro_2(groupedByFecha);
      }
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

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

  const totalCobrado = dates.reduce((acc, date) => {
    const total = filtro_1.reduce((sum, item) => {
      return sum + (filtro_2[date]?.[item]?.totalCasosCobrados || 0);
    }, 0);
    acc[date] = total;
    return acc;
  }, {});

  const totalGeneral = dates.reduce((acc, date) => {
    const total = filtro_1.reduce((sum, item) => {
      return sum + (filtro_2[date]?.[item]?.total || 0);
    }, 0);
    acc[date] = total;
    return acc;
  }, {});

  console.log('getdata: ', filtro_2);

  const formattedDates = useMemo(() => {
    return [-6, -5, -1, -3, -2, -1, 0].map(offset => getDayWeek(baseDate, offset).val);
  }, [baseDate]);

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
                  <tr
                    key={index}
                    className={`text-[12px] border-b bg-slate-50`}
                  >
                    <td className="px-3 py-2">{item}</td>
                    {formattedDates.map((formattedDate, idx) => (
                      <td key={idx} className="px-3 py-2 text-center">
                        {filtro_2[formattedDate]?.[item]?.totalCasosCobrados}/{filtro_2[formattedDate]?.[item]?.total}
                      </td>
                    ))}
                  </tr>
                )
            )}
            <tr className="text-[12px] border-t bg-slate-100">
              <td className="px-3 py-2 font-bold">Total</td>
              
              {formattedDates.map((formattedDate, idx) => (
                <td key={idx} className="px-3 py-2 text-center font-bold">
                  {totalCobrado[formattedDate]}/{totalGeneral[formattedDate]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
