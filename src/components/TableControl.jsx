import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Paginator } from './Paginator';
import { getCurrentDate, obtenerSegmento } from '@/utils';

export default function TableControl() {
  const [selectedLeft, setSelectedLeft] = useState(-1);
  const {
    checkedArr,
    setCheckedArr,
    loader,
    setModal,
    setItemSelected
  } = useAppContext();

  const [cases, setCases] = useState([]);
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
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
        ? `http://localhost:3000/api/auth/users?tipoDeGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=${limit}&page=${page}`
        : `https://api.fastcash-mx.com/api/auth/users?tipoDeGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=${limit}&page=${page}`
    );
    const result = await res.json();
    console.log("data: ", result);
    setData(result);
    setCurrentPage(result.currentPage);
    setTotalPages(result.totalPages);
    setTotalDocuments(result.totalDocuments);
  }

  async function handlerFetchVerification(date) {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3000/api/verification?limit=1000`
        : `https://api.fastcash-mx.com/api/verification?limit=1000`
    );
    const result = await res.json();
    setCases(result.data);
  }


  useEffect(() => {
    handlerFetch(itemsPerPage, currentPage);
    handlerFetchVerification(date);
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


  useEffect(() => {
    setCheckedArr([]);
  }, []);


  function handlerEditCuenta(modal, i) {
    setItemSelected(i);
    setModal(modal);
  }

  console.log("tabla data: ", data);
  console.log("tabla cases: ", cases);


  return (
    <>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
        <table className="w-full min-w-[200px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-slate-200 sticky top-[0px] z-20">
            <tr className=" bg-slate-200">
              <th className="px-3 py-2">{/* <input type="checkbox" /> */}</th>
              <th className="px-4 py-2 text-gray-700">SEGMENTO</th>
              <th className="px-4 py-2 text-gray-700">CUENTA OPERATIVA</th>
              <th className="px-4 py-2 text-gray-700">CUENTA PERSONAL</th>
              <th className="px-4 py-2 text-gray-700">NUMERO DE CASO</th>
              <th className="px-4 py-2 text-gray-700">NOMBRE DE LA EMPRESA</th>
              <th className="px-4 py-2 text-gray-700">CUENTA AUDITORA</th>
              <th className="px-4 py-2 text-gray-700">OPERACION</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((i, index) => (
              <tr
                key={index}
                className={`bg-gray-200 border-b text-[12px]}`}
              >
                <td
                  className={`px-3 py-2 text-[12px] border-b bg-[#ffffff]`}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => handlerSelectCheck(e, i)}
                  />
                </td>

                <td className="px-4 py-2 bg-[#ffffff]">{obtenerSegmento(i.cuenta)}</td>
                <td className="px-4 py-2 bg-[#ffffff]">{i.nombrePersonal}</td>
                <td className="px-4 py-2 bg-[#ffffff]">{i.cuenta}</td>

                <td className="px-4 py-2 bg-[#ffffff]">
                  {
                    cases?.find((it) => it.cuentaVerificador === i.cuenta || it.cuentaCobrador === i.cuenta)?.numeroDePrestamo || 'Sin numero de prestamo'
                  }
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  {
                    cases?.find((it) => it.cuentaVerificador === i.cuenta || it.cuentaCobrador === i.cuenta)?.nombreDelProducto || 'Sin nombre de producto'
                  }

                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  {
                    cases?.find((it) => it.cuentaVerificador === i.cuenta || it.cuentaCobrador === i.cuenta)?.apodoDeUsuarioDeAuditoria || 'Sin auditor'
                  }
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  <button
                    onClick={() => handlerEditCuenta('Multar cuenta', i)}
                    type="button"
                    className="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                  >
                    MULTAR
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
