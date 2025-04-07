'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { obtenerSegmento } from '@/utils'
import { Paginator } from './Paginator';
import { today } from '@/utils/getDates'

export default function Home() {
  const [selectedLeft, setSelectedLeft] = useState(-1);

  const { user, checkedArr, setCheckedArr, loader, setLoader } = useAppContext()
  const [cases, setCases] = useState([])
  const [details, setDetails] = useState([])

  const searchParams = useSearchParams()
  const seccion = searchParams.get('seccion')
  const item = searchParams.get('item')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totales, setTotales] = useState({})

  useEffect(() => {
    setCheckedArr([])
  }, [])

  function handlerSelectCheck(e, i) {
    if (e.target.checked) {
      // Si está marcado, agrega el índice al array
      setCheckedArr([...checkedArr, i]);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr(checkedArr.filter(item => item.cuenta !== i.cuenta));
    }
  }

  async function handlerFetch(limit, page) {
    const res = await fetch(
      window?.location?.href?.includes('localhost')
        ? `http://localhost:3002/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Verificación&limit=${limit}&page=${page}`
        : `https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Verificación&limit=${limit}&page=${page}`)
    const result = await res.json()
    // console.log(data)
    setData(result)
    setCurrentPage(result.currentPage);
    setTotalPages(result.totalPages);
    setTotalDocuments(result.totalDocuments);
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
      ? `http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado,Aprobado,Reprobado,Pendiente&limit=1000${queryString ? `&${queryString}` : `&fechaDeTramitacionDelCaso=${today}`}`
      : `https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado,Aprobado,Reprobado,Pendiente&limit=1000${queryString ? `&${queryString}` : `&fechaDeTramitacionDelCaso=${today}`}`;

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
    // const result = await res.json();
    // console.log(data)
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
        ? 'http://localhost:3003/api/loans/verification/reporte'
        : 'https://api.fastcash-mx.com/api/loans/verification/reporte'

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    setDetails(data.data)
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

    const baseUrl =
      window?.location?.href?.includes('localhost')
        ? 'http://localhost:3003/api/loans/verification/totalreporteverificacion'
        : 'https://api.fastcash-mx.com/api/loans/verification/totalreporteverificacion';

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const res = await fetch(url)
    const data = await res.json()
    setTotales(data.totalesGenerales)
  }

  function handlerSelectAllCheck(e, i) {
    if (e.target.checked) {
      setCheckedArr(data.data);
    } else {
      setCheckedArr([]);
    }

  }
  useEffect(() => {
    handlerFetchTotales()
    handlerFetchDetails()
    handlerFetch(itemsPerPage, currentPage)
    handlerFetchVerification();
  }, [loader, itemsPerPage, currentPage, searchParams, item]);

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
      <div className='max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth'>

        <table className="w-full min-w-[2000px] border-[1px] bg-white shadow-2xl text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">

            <tr className=' bg-gray-800'>
              <th className='px-3 py-2'>
                <input type="checkbox" onClick={handlerSelectAllCheck} />
              </th>
              <th className="px-4 py-2 text-white">SEGMENTO</th>
              <th className="px-4 py-2 text-white">Nombres</th>

              <th className="px-4 py-2 text-white">Cuenta</th>

              <th className="px-4 py-2 text-white">CASOS</th>

              <th className="px-4 py-2 text-green-400 ">APROBADOS 10:00 am</th>
              <th className="px-4 py-2 text-red-400 ">REPROBADOS 10:00 am</th>

              <th className="px-4 py-2 text-green-400 ">APROBADOS 12:00 am</th>
              <th className="px-4 py-2 text-red-400 ">REPROBADOS 12:00 am</th>

              <th className="px-4 py-2 text-green-400 ">APROBADOS 14:00 am</th>
              <th className="px-4 py-2 text-red-400 ">REPROBADOS 14:00 am</th>

              <th className="px-4 py-2 text-green-400 ">APROBADOS 16:00 am</th>
              <th className="px-4 py-2 text-red-400 ">REPROBADOS 16:00 am</th>


              <th className="px-4 py-2 text-green-400">APROBADOS TOTAL</th>
              {
                !user?.rol.includes('Asesor') && (
                  <th className="px-4 py-2 text-red-400">OTROS TOTAL</th>
                )
              }
              <th className="px-4 py-2 text-red-400">REPROBADOS TOTAL</th>

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

                <td className="px-4 py-2">{cases?.filter(it => it.cuentaVerificador === i.cuenta).length}</td>

                <td className="px-4 py-2  bg-yellow-400">{details[i.cuenta]?.aprobados10am}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.reprobados10am}</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.aprobados12am}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.reprobados12am}</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.aprobados14pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.reprobados14pm}</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.aprobados16pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.reprobados16pm}</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.aprobadosTotal}</td>
                {!user?.rol.includes('Asesor') && (
                  <td className="px-4 py-2">{details[i.cuenta]?.otrosTotal}</td>
                )
                }
                <td className="px-4 py-2">{details[i.cuenta]?.reprobadosTotal}</td>

              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className='px-4 py-2'>Totales</td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'>{totales?.totalCasosConAsesor}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.aprobados10am}</td>
              <td className="px-4 py-2">{totales?.reprobados10am}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.aprobados12am}</td>
              <td className="px-4 py-2">{totales?.reprobados12am}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.aprobados14pm}</td>
              <td className="px-4 py-2">{totales?.reprobados14pm}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.aprobados16pm}</td>
              <td className="px-4 py-2">{totales?.reprobados16pm}</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.aprobadosTotal}</td>
              {
                !user?.rol.includes('Asesor') && (
                  <td className="px-4 py-2">{totales?.totalCasosConAsesorErrados}</td>
                )
              }
              <td className="px-4 py-2">{totales?.reprobadosTotal}</td>
            </tr>
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
