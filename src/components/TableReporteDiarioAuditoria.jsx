import { useAppContext } from '@/context/AppContext'
import React, { useEffect, useState } from 'react'
import { obtenerSegmento } from '@/utils'
import { useSearchParams } from 'next/navigation'
import { Paginator } from './Paginator'
import { today } from '@/utils/getDates'

export default function TableReporteDiarioAuditoria() {
  const { loader, setCheckedArr, checkedArr, setLoader, user } = useAppContext()
  const [details, setDetails] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const searchParams = useSearchParams()
  const seccion = searchParams.get('seccion')
  const item = searchParams.get('item')
  const [selectedLeft, setSelectedLeft] = useState(-1);
  const [cases, setCases] = useState([]);
  const [totales, setTotales] = useState({})

  async function handlerFetch(limit, page) {

    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3002/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=${limit}&page=${page}`
        : `https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Auditoria&limit=${limit}&page=${page}`
    );
    const result = await res.json();
    console.log("data: ", result);
    setData(result);
    setCurrentPage(result.currentPage);
    setTotalPages(result.totalPages);
    setTotalDocuments(result.totalDocuments);
    setLoader(false)
  }

  async function handlerFetchVerification() {
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

    const baseUrl = window?.location?.href?.includes("localhost")
      ? `http://localhost:3002/api/authSystem/users?tipoGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=1000${queryString ? `&${queryString}` : `&fechaDeAuditoria=${today}`}`
      : `https://api.fastcash-mx.com/api/authSystem/users?tipoGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=1000${queryString ? `&${queryString}` : `&fechaDeAuditoria=${today}`}`;

    const finalURL = queryString ? `${baseUrl}&${queryString}` : baseUrl;
    console.log("url local solicitada: ", finalURL);
    try {
      const res = await fetch(finalURL);
      const result = await res.json();

      setCases(result.data);
    } catch (error) {
      console.error("Error al obtener datos: ", error)
      setLoader(false);
    }
  }

  async function handlerFetchDetails() {

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

    const baseUrl =
      window?.location?.href?.includes('localhost')
        ? 'http://localhost:3006/api/users/multas/reporte'
        : 'https://api.fastcash-mx.com/api/users/multas/reporte'

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("url reportes: ", url);

    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    setDetails(data.data)
    console.log("data details: ", details);

  }

  async function handlerFetchTotales() {
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

    const baseUrl = window?.location?.href?.includes('localhost')
      ? 'http://localhost:3006/api/users/multas/reporteTotales'
      : 'https://api.fastcash-mx.com/api/users/multas/reporteTotales'

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const res = await fetch(url)
    const data = await res.json()
    setTotales(data.totalesGenerales)
  }

  useEffect(() => {
    handlerFetchTotales()
    handlerFetch(itemsPerPage, currentPage);
    handlerFetchVerification();
    handlerFetchDetails()
  }, [loader, searchParams, itemsPerPage, currentPage])

  function handlerSelectCheck(e, item) {
    if (e.target.checked) {
      setCheckedArr([...checkedArr, item]);
    } else {
      setCheckedArr(checkedArr.filter(it => it.cuenta !== item.cuenta));
    }
  }


  function handlerSelectAllCheck(e) {
    if (e.target.checked) {
      // Si está marcado, agrega el índice al array
      setCheckedArr(data.data);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr([]);
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

  useEffect(() => {
    setCheckedArr([])
  }, [])

  return (
    <>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">

        <table className="w-full min-w-[2000px] border-[1px] bg-white shadow-2xl text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">

            <tr className=' bg-gray-800'>
              <th className='px-3 py-2'>
                <input type="checkbox" onClick={handlerSelectAllCheck} />
              </th>
              <th className="px-4 py-2 text-white">SEGMENTO</th>
              <th className="px-4 py-2 text-white">Nombres</th>

              <th className="px-4 py-2 text-white">Cuenta</th>
              <th className="px-4 py-2 text-white">Cuentas</th>

              <th className="px-4 py-2 text-green-400 ">MULTADOS 10:00 am</th>
              <th className="px-4 py-2 text-gray-100">SIN MULTA 10:00 pm</th>

              <th className="px-4 py-2 text-green-400 ">MULTADOS 12:00 am</th>
              <th className="px-4 py-2 text-gray-100">SIN MULTA 12:00 pm</th>

              <th className="px-4 py-2 text-green-400 ">MULTADOS 14:00 PM</th>
              <th className="px-4 py-2 text-gray-100">SIN MULTA 14:00 PM</th>

              <th className="px-4 py-2 text-green-400 ">MULTADOS 16:00 PM</th>

              <th className="px-4 py-2 text-gray-100">SIN MULTA 16:00 pm</th>

              <th className="px-4 py-2 text-green-400">MULTADOS TOTAL</th>
              <th className="px-4 py-2 text-gray-100">SIN MULTA TOTAL</th>

              {/* <th className="px-4 py-2 text-red-400">REPROBADOS TOTAL</th> */}

            </tr>
          </thead>
          <tbody>
            {data?.data?.map((i, index) => (
              <tr key={index} className={`bg-white border-b text-[12px] ${index % 2 === 0 ? 'bg-white' : 'bg-white'}`}>

                <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-white' : 'bg-white'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                  <input type="checkbox"
                    checked={checkedArr.some(value => value._id === i._id)}
                    onChange={(e) => handlerSelectCheck(e, i)} />
                </td>
                <td className="px-4 py-2">{obtenerSegmento(i.cuenta)}</td>
                <td className="px-4 py-2">{i.nombrePersonal}</td>
                <td className="px-4 py-2">{i.cuenta}</td>

                <td className="px-4 py-2">{cases?.filter(it => it.cuentaAuditor === i.cuenta).length}</td>

                <td className="px-4 py-2  bg-yellow-400">{details[i.cuenta]?.multados10am}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.multados10am}</td>

                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.multados12am}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.sinMulta12am}</td>

                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.multados14pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.sinMulta14pm}</td>

                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.multados16pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.sinMulta16pm}</td>

                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.multadosTotal}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.sinMultaTotal}</td>


              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className='px-4 py-2'>Totales</td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'>{cases?.filter(it => it.cuentaAuditor).length}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.multados10am}</td>
              <td className="px-4 py-2">{totales?.sinMulta10am}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.multados12am}</td>
              <td className="px-4 py-2">{totales?.sinMulta12am}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.multados14pm}</td>
              <td className="px-4 py-2">{totales?.sinMulta14pm}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.multados16pm}</td>
              <td className="px-4 py-2">{totales?.sinMulta16pm}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.multadosTotal}</td>
              <td className="px-4 py-2">{totales?.sinMultaTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className=''>

        {item === "Reporte diario" && seccion === "auditoria" && user.rol !== "Cuenta Personal" && (
          <Paginator
            totalItems={totalDocuments}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onReload={handleReload}
          />
        )}

      </div>

    </>
  )
}
