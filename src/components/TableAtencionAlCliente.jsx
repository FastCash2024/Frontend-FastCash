"use client";
import { useAppContext } from "@/context/AppContext";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Paginator } from "./Paginator";
import Link from "next/link";

export default function TableAtencionAlCliente() {
  const { checkedArr, setCheckedArr, loader, setLoader } = useAppContext();
  
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const searchParams = useSearchParams();

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
    const urlParams = new URLSearchParams(window.location.search);

    const filterParams = {};
    urlParams.forEach((value, key) => {
      if (key.startsWith("filter[") && value !== "Elije por favor" && value !== "Todo") {
        const fieldName = key.slice(7, -1); // Extraer el nombre de la clave dentro de "filter[]"
        filterParams[fieldName] = value;
      }
    });
    const queryString = Object.keys(filterParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`)
      .join("&");

    const baseURL = window.location.href.includes("localhost")
      ? "http://localhost:3004/api/authApk/userschat"
      : "https://api.fastcash-mx.com/api/authApk/userschat";

    const finalURL = queryString ? `${baseURL}?${queryString}` : baseURL;
    console.log("url local solicitada: ", finalURL);
    try {
      const res = await fetch(finalURL);
      const result = await res.json();
      setData(result.data);
      setTotalDocuments(result.totalDocuments);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setLoader(false);
    }

  }

  useEffect(() => {
    handlerFetch(itemsPerPage, currentPage);
  }, [loader, searchParams, itemsPerPage, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };


  const handleReload = () => {
    handlerFetch(itemsPerPage, currentPage);
  };

  console.log("data Client: ", data);
  

  return (
    <>
      <div className="pb-2 overflow-visible relative scroll-smooth">
        <table className="w-full border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-gray-200 sticky top-[0px] z-20">
            <tr className=" bg-gray-200">
              <th className="px-3 py-2">{/* <input type="checkbox" /> */}</th>
              <th className="px-4 py-2 text-gray-700">Nombre Completo</th>
              <th className="px-4 py-2 text-gray-700">Número de Teléfono</th>
              <th className="px-4 py-2 text-gray-700">Cantidad de Mensajes</th>
              <th className="px-4 py-2 text-gray-700">Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((i, index) => (
              <tr
                key={i._id}
                className={`border-b text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <td className={`px-3 py-2 text-[12px] border-b bg-gray-100`}>
                  <input
                    type="checkbox"
                    onClick={(e) => handlerSelectCheck(e, i)}
                  />
                </td>
                <td className="px-4 py-2">{i.nombreCompleto}</td>
                <td className="px-4 py-2">{i.contacto}</td>
                <td className="px-4 py-2">{i.cantidadSms}</td>
                <td className="flex justify-center items-center px-4 py-2">
                  <Link
                    href={`/Home/Chat?caso=${i._id}&seccion=chat`}
                    className=""
                  >
                    <button
                      type="button"
                      className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                    >
                      Visitar
                    </button>
                  </Link>
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
  );
}  
