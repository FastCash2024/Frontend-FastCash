import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Paginator } from './Paginator';
import { getCurrentDate } from '@/utils';

export default function TableControl() {
  const [selectedLeft, setSelectedLeft] = useState(-1);
  const {
    checkedArr,
    setCheckedArr,
    loader,
    setModal,
    setMulta
  } = useAppContext();

  const [cases, setCases] = useState([]);
  const [casesCobrador, setCasesCobrador] = useState([]);
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [details, setDetails] = useState([])
  const date = getCurrentDate();

  function handlerSelectCheck(e, i) {
    if (e.target.checked) {
      // Si está marcado, agrega el índice al array
      setCheckedArr([...checkedArr, i]);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr(checkedArr.filter((item) => item.usuario !== i.usuario));
    }
  }
  async function handlerFetch(limit, page) {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3000/api/multas/multas?limit=${limit}&page=${page}`
        : `https://api.fastcash-mx.com/api/multas/multas?limit=${limit}&page=${page}`
    );
    const result = await res.json();
    console.log("data users: ", result);
    setData(result);
    // setCases(result.data);
    setCurrentPage(result.currentPage);
    setTotalPages(result.totalPages);
    setTotalDocuments(result.totalDocuments);
  }

  async function handlerFetchVerification(date) {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3000/api/verification?estadoDeCredito=Reprobado,Dispersado&fechaDeTramitacionDelCaso=${date}`
        : "https://api.fastcash-mx.com/api/verification?estadoDeCredito=Reprobado,Dispersado&fechaDeTramitacionDelCaso=${date}"
    );
    const result = await res.json();
    setCases(result.data);
  }

  async function handlerFetchVerificationCobrador(date) {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3000/api/verification?estadoDeCredito=Pagado&fechaDeTramitacionDeCobro=${date}`
        : `https://api.fastcash-mx.com/api/verification?estadoDeCredito=Pagado&fechaDeTramitacionDeCobro=${date}`
    );
    const result = await res.json();
    setCasesCobrador(result.data);
  }

  useEffect(() => {
    handlerFetch(itemsPerPage, currentPage);
    handlerFetchVerification(date);
    handlerFetchVerificationCobrador(date);
  }, [loader, itemsPerPage, currentPage]);


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
  
  // async function handlerFetchDetails() {
  //   const res = await fetch(
  //     window?.location?.href?.includes('localhost')
  //       ? 'http://localhost:3000/api/verification/reportecobrados?estadoDeCredito=Pagado'
  //       : 'https://api.fastcash-mx.com/api/verification/reportecobrados?estadoDeCredito=Pagado')
  //   const data = await res.json()
  //   console.log("data detalle: ", data)
  //   setDetails(data.data)
  // }

  useEffect(() => {
    // handlerFetchDetails();
    setCheckedArr([]);
  }, []);


  function handlerEditCuenta(modal, i) {
    setMulta(i);
    setModal(modal);
  }
  
  return (
    <>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
        <table className="w-full min-w-[200px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-slate-200 sticky top-[0px] z-20">
            <tr className=" bg-slate-200">
              <th className="px-4 py-2 text-gray-700">CUENTA OPERATIVA</th>
              <th className="px-4 py-2 text-gray-700">CUENTA PERSONAL</th>
              <th className="px-4 py-2 text-gray-700">APROBADOS/REPROBADOS</th>
              <th className="px-4 py-2 text-gray-700">PAGADOS/PTP</th>
              <th className="px-4 py-2 text-gray-700">ACOTACION</th>
              <th className="px-4 py-2 text-gray-700">OPERACION</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((i, index) => (
              <tr
                key={index}
                className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"
                  }`}
              >

                <td className="px-4 py-2 bg-[#ffffff]">{i.cuentaOperativa}</td>
                <td className="px-4 py-2 bg-[#ffffff]">{i.cuentaPersonal}</td>

                <td className="px-4 py-2 bg-[#ffffff]">
                  {
                    cases?.filter((it) => it.cuentaVerificador === i.cuentaOperativa)
                      .length
                  }
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  {
                    casesCobrador?.filter((it) => it.cuentaCobrador === i.cuentaOperativa)
                    .length
                  }
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">{i.acotacion}</td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  <button
                    onClick={() => handlerEditCuenta('Editar Multar cuenta', i)}
                    type="button"
                    class="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                  >
                    EDITAR
                  </button>
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
