import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Paginator } from './Paginator';
import { getCurrentDate, obtenerSegmento } from '@/utils';

export default function TableControl() {
  const {
    checkedArr,
    setCheckedArr,
    loader,
    setModal,
    setItemSelected
  } = useAppContext();

  const [cases, setCases] = useState([]);
  const searchParams = useSearchParams();
  const date = getCurrentDate();
  const [data, setData] = useState([]); // Aquí solo debe almacenar el array de datos, no más propiedades
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);

  function handlerSelectCheck(e, item) {
    if (e.target.checked) {
      setCheckedArr([...checkedArr, item]);
    } else {
      setCheckedArr(checkedArr.filter(it => it.cuenta !== item.cuenta));
    }
  }

  async function handlerFetch(limit, page) {
    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `http://localhost:3000/api/auth/users?tipoDeGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=${limit}&page=${page}`
        : `https://api.fastcash-mx.com/api/auth/users?tipoDeGrupo=Asesor%20de%20Verificación,Asesor%20de%20Cobranza&limit=${limit}&page=${page}`
    );
    const result = await res.json();
    setData(result.data); // Solo almacena el array de datos
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

  useEffect(() => {
    setCheckedArr([]); // Asegurarse de que inicia vacío
  }, []);

  function handlerSelectAllCheck(e) {
    if (e.target.checked) {
      setCheckedArr(data); // Solo guarda el array de `data`
    } else {
      setCheckedArr([]); // Lo limpia
    }
  }

  function handlerEditCuenta(modal, item) {
    setItemSelected(item);
    setModal(modal);
  }

  console.log('data arr:', checkedArr);


  return (
    <>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
        <table className="w-full min-w-[200px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-slate-200 sticky top-[0px] z-20">
            <tr className="bg-slate-200">
              <th className='px-3 py-2'>
                <input type="checkbox" onClick={handlerSelectAllCheck} />
              </th>
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
            {data?.map((item, index) => (
              <tr key={index} className={`bg-gray-200 border-b text-[12px]`}>
                <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-white' : 'bg-white'}`}>
                  <input
                    type="checkbox"
                    checked={checkedArr.some(value => value._id === item._id)}
                    onChange={(e) => handlerSelectCheck(e, item)}
                  />
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">{obtenerSegmento(item.cuenta)}</td>
                <td className="px-4 py-2 bg-[#ffffff]">{item.nombrePersonal}</td>
                <td className="px-4 py-2 bg-[#ffffff]">{item.cuenta}</td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  {cases?.filter((it) => it.cuentaVerificador === item.cuenta || it.cuentaCobrador === item.cuenta).length || '0'}
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  {cases?.find((it) => it.cuentaVerificador === item.cuenta || it.cuentaCobrador === item.cuenta)?.nombreDelProducto || 'Sin nombre de producto'}
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  {cases?.find((it) => it.cuentaVerificador === item.cuenta || it.cuentaCobrador === item.cuenta)?.apodoDeUsuarioDeAuditoria || 'Sin auditor'}
                </td>
                <td className="px-4 py-2 bg-[#ffffff]">
                  <button
                    onClick={() => handlerEditCuenta('Multar cuenta', item)}
                    type="button"
                    className="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                  >
                    MULTAR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginator
        totalItems={totalDocuments}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        onReload={() => handlerFetch(itemsPerPage, currentPage)}
      />
    </>
  );
}
