import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Paginator } from './Paginator';
import { formatearFecha } from '@/utils';

export default function TableGestionDeAuditoria() {
  const { selectedLeft, user, loader, setLoader } = useAppContext();
  const searchParams = useSearchParams();
  const item = searchParams.get("item");
  const seccion = searchParams.get("seccion");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [dataMultas, setDataMultas] = useState([])

  async function handlerFetchMultas(limit, page) {
    const urlParams = new URLSearchParams(window.location.search);

    const filterParams = {};

    urlParams.forEach((value, key) => {
      if (key.startsWith("filter[") && value !== "Elije por favor" && value !== "Todo") {
        const fieldName = key.slice(7, -1);
        filterParams[fieldName] = value;
      }
    });

    const queryString = Object.keys(filterParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`)
      .join("&");

    // console.log("querys: ", urlParams);
    const baseUrl = window?.location?.href?.includes("localhost")
      ? `http://localhost:3006/api/users/multas/multas?cuentaPersonal=${user.email}`
      : `https://api.fastcash-mx.com/api/users/multas/multas?cuentaPersonal=${user.email}`;

    const paginationParams = `limit=${limit}&page=${page}`;
    const finalURL = queryString
      ? `${baseUrl}&${paginationParams}&${queryString}`
      : `${baseUrl}&${paginationParams}`;
    // console.log("url local solicitada: ", finalURL);
    try {
      const res = await fetch(finalURL);
      const result = await res.json();

      setDataMultas(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalDocuments(result.totalDocuments);
    } catch (error) {
      // console.error("Error al obtener datos: ", error)
      setLoader(false);
    }
    // const result = await res.json();
    // console.log(data)
  }

  console.log("USEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER", user)
  useEffect(() => {
    if (item === "Gestion de auditoria") {
      handlerFetchMultas(itemsPerPage, currentPage);
    }
  }, [loader, itemsPerPage, currentPage, searchParams]);

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

  return (
    <>
      {/* <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">

        <table className="w-full min-w-[1500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">


            <tr className=' bg-gray-800'>
              <th className='px-3 py-2'> <input type="checkbox" /></th>
              <th className="px-4 py-2 text-white">Cuenta Operativa Auditor</th>

              <th className="px-4 py-2 text-white">Nombre Personal Auditor</th>


              <th className="px-4 py-2 text-white">Usuario asignado</th>
              <th className="px-4 py-2 text-yellow-400">Observacion</th>
              <th className="px-4 py-2 text-white">Valor de multa</th>
              <th className="px-4 py-2 text-yellow-400">Estado de multa</th>
              <th className="px-4 py-2 text-white">Fecha de creacion</th>


            </tr>

          </thead>
          <tbody>
            {dataMultas.map((cobrador, index) => (
              <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2">{cobrador.cuentaAuditor}</td>
                <td className="px-4 py-2">{cobrador.nombreAuditor}</td>
                <td className="px-4 py-2">{cobrador.cuentaOperativa}</td>
                <td className="px-4 py-2 bg-yellow-400">{cobrador.observaciones}</td>

                <td className="px-4 py-2">${cobrador.importeMulta}</td>
                <td className="px-4 py-2 bg-yellow-400">{cobrador.estadoMulta}</td>
                <td className="px-4 py-2">{formatearFecha(cobrador.fechaDeAuditoria)}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Paginator
          totalItems={totalDocuments}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          onReload={handleReload}
        />
      </div> */}
    </>
  )
}
