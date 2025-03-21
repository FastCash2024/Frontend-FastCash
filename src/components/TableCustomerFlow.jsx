import { getDay, getDays } from '@/utils/getDates';
import React, { useEffect, useState } from 'react'

export default function TableCustomerFlow() {
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

      const results = await Promise.all(
        dates.map(async (date) => {
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

      const combinedResults = results.reduce((acc, { date, data }) => {
        acc[date] = data;
        return acc;
      }, {});

      console.log('Resultados combinados:', combinedResults);
      setFiltro_2(combinedResults);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  useEffect(() => {
    const days = [-1, -2, -3, -4, -5, 0];
    const dates = getDays(days);
    fetchCustomers(dates);
  }, []);

  useEffect(() => {
    // fetchCustomers(formatDateToISO(getDay(0).val));
    fetchCustomersFlow();
  }, []);

  const dates = getDays([-1, -2, -3, -4, -5, 0]);

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
                {getDay(-12).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-11).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-10).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-9).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-8).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-7).val}
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
                {getDay(-5).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-4).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-3).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-2).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-1).val}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(0).val}
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
                {getDay(-5).day}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-4).day}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-3).day}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-2).day}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(-1).day}
              </th>
              <th
                scope="col"
                className=" px-3 py-1 text-gray-700 text-center"
              >
                {getDay(0).day}
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
                    {
                      dates.map((date, idx) => (
                        <td key={idx} className="px-3 py-2 text-center">
                          {filtro_2[date]?.[item]?.totalCasosCobrados}/{filtro_2[date]?.[item]?.total}
                        </td>
                      ))}
                  </tr>
                )
            )}
            <tr className="text-[12px] border-t bg-slate-100">
              <td className="px-3 py-2 font-bold">Total</td>
              {
                dates.map((date, idx) => (
                  <td key={idx} className="px-3 py-2 text-center font-bold">
                    {totalCobrado[date]}/{totalGeneral[date]}
                  </td>
                ))
              }
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
