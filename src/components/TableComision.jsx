import { useAppContext } from '@/context/AppContext';
import { formatearFecha, obtenerSegmento } from '@/utils';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function TableComision() {
  const { user, loader, selectedLeft, setLoader, setCheckedArr, checkedArr } = useAppContext();
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");
  const [data, setData] = useState([]);
  const [filter_1, setFilter_1] = useState([])
  const [totalDocuments, setTotalDocuments] = useState(1);
  const [cases, setCases] = useState([]);

  async function handlerFetch() {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3003/api/loans/verification/reportcomision?nombreUsuario=${user.email}`
        : `https://api.fastcash-mx.com/api/loans/verification/reportcomision?nombreUsuario=${user.email}`
    );
    const result = await res.json();
    console.log("data: ", result);
    setData(result);
  }

  async function handlerFetchVerification(limit, page) {
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
      ? `http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado,Pagado&limit=${limit}`
      : `https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado,Pagado&limit=${limit}`;

    const finalURL = queryString ? `${baseUrl}&${queryString}` : baseUrl;
    console.log("url local solicitada: ", finalURL);
    try {
      const res = await fetch(finalURL);
      const result = await res.json();

      setCases(result.data);
      setTotalDocuments(result.totalDocuments);
    } catch (error) {
      console.error("Error al obtener datos: ", error)
      setLoader(false);
    }
    // const result = await res.json();
    // console.log(data)
  }
  console.log("DATA2 cases", cases);

  async function handlerFetchComision() {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3006/api/users/comision`
        : `https://api.fastcash-mx.com/api/users/comision`
    );

    const result = await res.json();
    console.log("data: ", result);
    setFilter_1(result);
  }

  console.log("data comision: ", filter_1);

  useEffect(() => {
    handlerFetch();
    handlerFetchComision();
    handlerFetchVerification(totalDocuments)
  }, [loader, searchParams, totalDocuments]);

  function handlerSelectCheck(e, i) {
    if (e.target.checked) {
      // Si está marcado, agrega el índice al array
      setCheckedArr([...checkedArr, i]);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr(checkedArr.filter((item) => item.usuario !== i.usuario));
    }
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
                <td className="px-4 py-2">{ formatearFecha(i.fecha)}</td>
                <td className="px-4 py-2">{i.cuentaOperativa}</td>
                <td className="px-4 py-2">{i.cuentaPersonal}</td>
                <td className="px-4 py-2">
                  {
                    cases?.filter((it) =>
                      it.cuentaCobrador === i.cuentaOperativa || it.cuentaVerificador === i.cuentaOperativa).length
                  }
                </td>

                <td className="px-4 py-2">
                  {i.totalCasos}</td>
                <td className="px-4 py-2">
                  {cases?.filter((it) =>
                    it.cuentaCobrador === i.cuentaOperativa || it.cuentaVerificador === i.cuentaOperativa
                  ).length > 0
                    ? ((i.totalCasos / cases?.filter((it) =>
                      it.cuentaCobrador === i.cuentaOperativa || it.cuentaVerificador === i.cuentaOperativa
                    ).length) * 100).toFixed(2) + "%"
                    : "0%"}
                </td>
                <td className="px-4 py-2">
                  {filter_1.data?.find((it) => it.segmento === obtenerSegmento(i.cuentaOperativa))?.comisionPorCobro}
                </td>
                <td className="px-4 py-2">
                  {(filter_1.data?.find((it) => it.segmento === obtenerSegmento(i.cuentaOperativa))?.comisionPorCobro) * (i.totalCasos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {/* <Paginator
              totalItems={totalDocuments}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onReload={handleReload}
            /> */}
      </div>
    </>
  )
}
