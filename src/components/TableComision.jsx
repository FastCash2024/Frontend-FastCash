import { useAppContext } from '@/context/AppContext';
import { formatearFecha, obtenerSegmento } from '@/utils';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Paginator } from './Paginator';

export default function TableComision() {
  const { user, userDB, loader, selectedLeft, setCheckedArr, checkedArr } = useAppContext();
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [filter_1, setFilter_1] = useState([])
  const [totalDocuments, setTotalDocuments] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  console.log("usuarioDB url: ", userDB);
  console.log("usuario url: ", user);


  async function handlerFetch(limit, page) {
    const baseUrl = window?.location?.href?.includes("localhost")
      ? `http://localhost:3007/api/loansBuckup/getcasos?email=${user.email}&limit=${limit}&page=${page}`
      : `https://api.fastcash-mx.com/api/loansBuckup/getcasos?email=${user.email}limit=${limit}&page=${page}`;

    const res = await fetch(baseUrl);
    const result = await res.json();
    setData(result);
    setCurrentPage(result.currentPage);
    setTotalPages(result.totalPages);
    setTotalDocuments(result.totalDocs);
  }

  async function handlerFetchComision() {

    const baseUrl =
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3006/api/users/comision?limit=1000`
        : `https://api.fastcash-mx.com/api/users/comision?limit=1000`

    const res = await fetch(baseUrl);

    const result = await res.json();
    console.log("url comision: ", result.data);
    setFilter_1(result.data);
  }

  console.log("data comision: ", filter_1);

  useEffect(() => {
    handlerFetch(itemsPerPage, currentPage);
    handlerFetchComision();
    // handlerFetchVerification()
  }, [loader, itemsPerPage, currentPage, searchParams]);

  function handlerSelectCheck(e, i) {
    if (e.target.checked) {
      // Si está marcado, agrega el índice al array
      setCheckedArr([...checkedArr, i]);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr(checkedArr.filter((item) => item.usuario !== i.usuario));
    }
  }

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
      <div className='flex w-full p-4 justify-between text-gray-950 items-center'>
        <p className='font-bold text-2xl'>Asesor: {user.nombreCompleto}</p>
      </div>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
        <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-slate-200 sticky top-[0px] z-20">
            <tr className=" bg-slate-200">
              <th className="px-3 py-2">{/* <input type="checkbox" /> */}</th>
              <th className="px-3 py-2 text-gray-700">FECHA</th>
              <th className="px-4 py-2 text-gray-700">CUENTA OPERATIVA</th>
              <th className="px-4 py-2 text-gray-700">SEGMENTO</th>

              <th className="px-4 py-2 text-gray-700">CASOS TOTALES</th>

              <th className="px-4 py-2 text-gray-700">PAGOS</th>
              <th className="px-4 py-2 text-gray-700">PORCENTAJE ALCANZADO</th>
              <th className="px-4 py-2 text-gray-700">COMISION POR CASO</th>
              <th className="px-4 py-2 text-gray-700">TOTAL DEL DIA</th>


            </tr>
          </thead>
          <tbody>
            {data.data?.map((i, index) => (
              <tr
                key={index}
                className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"
                  }`}
              >
                <td
                  className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"
                    } ${selectedLeft === 1 ? "sticky left-0 z-10" : ""}`}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => handlerSelectCheck(e, i)}
                  />
                </td>
                <td className="px-4 py-2">{formatearFecha(i.fechaBackup)}</td>
                <td className="px-4 py-2">{i.cuenta}</td>
                <td className="px-4 py-2">{obtenerSegmento(i.cuenta)}</td>
                <td className="px-4 py-2">{i.cantidadDeCasosAsignados}</td>

                <td className="px-4 py-2">
                  {i.cantidadCasosPagados}</td>
                <td className="px-4 py-2">
                  {i.cuenta.length > 0
                    ? ((i.cantidadCasosPagados / i.cantidadDeCasosAsignados) * 100).toFixed(2) + "%"
                    : "0%"}

                </td>
                <td className="px-4 py-2">
                  {filter_1?.find((it) => it.segmento === obtenerSegmento(i.cuenta))?.comisionPorCobro}
                </td>
                <td className="px-4 py-2">
                  {(filter_1?.find((it) => it.segmento === obtenerSegmento(i.cuenta))?.comisionPorCobro) * (i.cantidadCasosPagados)}
                </td>
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
      </div>
    </>
  )
}
