"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

import { CheckCircleIcon } from '@/icons_SVG';

import Link from "next/link";
import {
  ChatIcon,
  PhoneIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { Paginator } from "./Paginator";
import { formatearFecha } from "@/utils";
import { extraerCodigo, reestructurarArray, reestructurarArrayForBody } from "@/utils/tableTools";
import { getDescripcionDeExcepcion } from "@/utils/utility-tacking";
import { postTracking } from "@/app/service/TrackingApi/tracking.service";
import { obtenerFechaMexicoISO } from "@/utils/getDates";
import { diferenciaEnDias } from "@/utils/getDates";

const Table = ({ headArray, dataFilter, access, local, server, query }) => {
  const {
    user,
    userDB,
    loader,
    setUserProfile,
    users,
    setLoader,
    setUsers,
    checkedArr,
    setCheckedArr,
    setModal,
    itemSelected,
    setItemSelected,
    setUserSuccess,
    success,
    setUserData,
    postsIMG,
    setUserPostsIMG,
    divisas,
    setDivisas,
    exchange,
    setExchange,
    destinatario,
    setMulta,
    setDestinatario,
    setApplication,
    setApplicationTipo,
    theme, setAccount, setAppComision
  } = useAppContext();
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [operarCobro, setOperarCobro] = useState("");

  const toCamelCase = (str) => {
    let cleanedStr = str.toLowerCase();
    cleanedStr = cleanedStr.replace(/\([^)]*\)/g, "");
    cleanedStr = cleanedStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleanedStr = cleanedStr.replace(/-/g, " ");
    return cleanedStr
      .replace(/[_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^[A-Z]/, (firstChar) => firstChar.toLowerCase());
  };

  function handlerVerification(i, seccion) {
    if (seccion === "Verificacion") {
      setModal("Registrar Verificacion");
      setItemSelected(i);
    }
    if (seccion === "coleccion") {
      setModal("Registrar Cobranza");
      setItemSelected(i);
    }
  }

  const toggleMenu = (id) => {
    console.log("id: ", id);

    setActiveMenu(activeMenu === id ? null : id);
  };
  const toggleMenu2 = (id, tipo) => {
    console.log("id: ", id);

    setActiveMenu(activeMenu === id ? null : id);
    setOperarCobro(tipo)
  };

  function handlerCobroBalance(i) {
    setModal("Registrar Cobor y Blance");
    setItemSelected(i);
  }

  function handlerAcount(mod, i) {
    setModal(mod);
    setItemSelected(i);
  }
  function handlerAcountUser(mod, i) {
    setModal(mod);
    setCheckedArr(i);
  }

  function handlerItemPE(mod, i) {
    setModal(mod);
    setItemSelected(i);
  }


  async function handlerFetch(limit, page) {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    // Filtrar solo las queries que comiencen con "filter["
    const filterParams = {};
    urlParams.forEach((value, key) => {
      if (
        key.startsWith("filter[") &&
        value !== "Elije por favor" &&
        value !== "Todo"
      ) {
        const fieldName = key.slice(7, -1); // Extraer el nombre de la clave dentro de "filter[]"
        filterParams[fieldName] = value;
      }
    });
    console.log("filter params ", filterParams);

    const stg = Object.keys(filterParams)
      .filter(
        (key) => filterParams[key] !== undefined && filterParams[key] !== null
      ) // Filtrar valores nulos o indefinidos
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`
      ) // Codificar clave=valor
      .join("&"); // Unir con &
    console.log(stg ? "existen" : "no existen");
    console.log("stg: ", stg);

    const roleQueries = {
      "Asesor de Verificación": `&cuentaVerificador=${userDB.cuenta}`,
      "Asesor de Cobranza": `&cuentaCobrador=${userDB.cuenta}`,
      // "Asesor de Auditoria": `&cuentaAuditor=${userDB.cuenta}`,
    };

    const query2 = roleQueries[user?.rol] || "";
    console.log("query2", query2);

    const defaultLimit = 5; // Valor predeterminado para limit
    const defaultPage = 1; // Valor predeterminado para page

    const finalLimit = limit || defaultLimit;
    const finalPage = page || defaultPage;

    const dataParams = `${stg || query2 || local.includes("?") ? "&" : "?"
      }limit=${finalLimit}&page=${finalPage}`;
    console.log("dataParamas: ", dataParams);

    console.log("local: ", local);
    console.log("limit: ", limit);

    const urlLocal = stg
      ? local.includes("?")
        ? `${local.split("?")[0]}?${stg}${query2}${dataParams}`
        : `${local}?${stg}${query2}${dataParams}`
      : `${local}${query2}${dataParams}`;

    console.log("url local solicitada: ", urlLocal);

    const urlServer = stg
      ? server.includes("?")
        ? `${server.split("?")[0]}?${stg}${query2}${dataParams}`
        : `${server}?${stg}${query2}${dataParams}`
      : `${server}${query2}${dataParams}`;

    console.log("url servesolicitada: ", urlServer);

    const res = await fetch(
      window?.location?.href?.includes("localhost")
        ? `${urlLocal}`
        : `${urlServer}`
    );

    const result = await res.json();
    console.log("resultadoo: ", result);

    setData(result.data);
    setCurrentPage(result.currentPage);
    setTotalPages(result.totalPages);
    setTotalDocuments(result.totalDocuments);
    setLoader(false);
  }
  console.log("useeeeeeeeeeeeeeeer: ", user);

  function handlerSelectCheck(e, i) {
    if (e.target.checked) {
      console.log("seleccion: ", e.target.checked);
      // Si está marcado, agrega el índice al array
      setCheckedArr([...checkedArr, i]);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr(checkedArr.filter((item) => item._id !== i._id));
    }
  }

  function handlerMessage(i) {
    setModal("SMS");
    setDestinatario(i);
  }

  function handlerApplication(modal, i) {
    console.log("applicacion: ", i);

    setModal(modal);
    setApplication(i);
  }

  function handlerApplicationTipo(modal, i) {
    setModal(modal);
    setApplicationTipo(i);
  }

  function handlerEditCuenta(modal, i) {
    if (modal === "Editar cuenta" || modal === "Editar Multar cuenta") {
      setModal(modal);
      setMulta(i);

    }
    if (modal === "Editar comision" || modal === "Eliminar comision") {
      setAppComision(i);
      setModal(modal);
    }
  }

  function handlerSelectAllCheck(e, i) {
    if (e.target.checked) {
      // Si está marcado, agrega el índice al array
      const db = data.filter((i, index) => dataFilter(i));
      console.log(db);
      setCheckedArr(db);
    } else {
      // Si no está marcado, quita el índice del array
      setCheckedArr([]);
    }
  }
  // console.log("cantidad de registros: ", itemsPerPage);

  useEffect(() => {
    handlerFetch(itemsPerPage, currentPage);
  }, [loader, searchParams, itemsPerPage, currentPage]);

  useEffect(() => {
    setCheckedArr([]);
  }, []);

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

  console.log("data desde table: ", data);
  // console.log("data filter: ", data);

  const header = reestructurarArray(headArray);
  const headerBody = reestructurarArrayForBody(headArray);


  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipOpacity, setTooltipOpacity] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Añade este estado
  const [copiedText, setCopiedText] = useState('');

  // Modifica la función copyToClipboard
  const copyToClipboard = (text, event) => {
    navigator.clipboard.writeText(text).then(
      () => {
        const rect = event.target.getBoundingClientRect();
        setTooltipPosition({
          x: rect.x + rect.width / 2,
          y: rect.y - 25
        });

        setCopiedText(text); // Guarda el texto copiado
        setShowTooltip(true);
        setTooltipOpacity(1);

        setTimeout(() => {
          setTooltipOpacity(0);
          setTimeout(() => {
            setShowTooltip(false);
            setCopiedText(''); // Limpia el texto copiado
          }, 1000);
        }, 2000);
      },
      (err) => {
        console.error('Error al copiar: ', err);
      }
    );
  };

  const registerTracking = async (itemSelected) => {
    const data = {
      descripcionDeExcepcion: getDescripcionDeExcepcion(item),
      subID: itemSelected._id,
      cuentaOperadora: userDB.cuenta,
      cuentaPersonal: userDB.emailPersonal,
      codigoDeSistema: itemSelected.nombreDelProducto,
      codigoDeOperacion: seccion === 'verificacion' ? '00VE' : '00RE',
      contenidoDeOperacion: `El caso ${itemSelected.numeroDePrestamo} ha sido visitado.`,
      fechaDeOperacion: obtenerFechaMexicoISO(),
    }

    await postTracking(data);
  }

  return (
    access && (
      <>
        <div className="max-h-[calc(100vh-120px)] pb-2 overflow-y-auto relative scroll-smooth drop-shadow-2xl border">
          <table className="min-w-full shadow border-collapse drop-shadow-2xl ">
            <thead className="bg-[#e0e0e0] text-[10px] uppercase sticky top-[0px] z-10">
              <tr className="text-gray-700 min-w-[2500px]">
                {header.map((i, index) => (
                  <th
                    scope="col"
                    key={index}
                    className={`w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] 
                      ${index < 3
                        ? `sticky z-20 bg-[#e0e0e0] 
                        ${index == 0 && "left-0"}  
                        ${index == 1 && "left-[37px]"} 
                        ${index == 2 && "left-[125px]"} `
                        : ""
                      }
                      ${index >= headArray().length - 2
                        ? `sticky z-20 bg-[#e0e0e0] 
                        ${index == headArray().length - 2 && "right-[65px]"} 
                        ${index == headArray().length - 1 && "right-[0px]"} `
                        : ""
                      }
                    `}
                  >
                    {i === "Seleccionar" ? (
                      <input
                        type="checkbox"
                        onClick={(e) => handlerSelectAllCheck(e, i)}
                      />
                    ) : (
                      i
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((i, index) => {
                  return (
                    <tr key={index} className="text-[12px] border-b ">
                      {headerBody.map((it, index) => {
                        return (
                          <td
                            key={index}
                            className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black  ${it.toLowerCase().includes("número") ? "text-blue-600 cursor-pointer" : "text-gray-950"}  ${index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#ffffff]"
                              } 
                                ${index < 3
                                ? `sticky  bg-[#ffffff]
                                  ${index == 0 && "left-0"}  
                                  ${index == 1 && "left-[37px]"} 
                                  ${index == 2 && "left-[125px]"} `
                                : ""
                              }
                                ${index >= headArray().length - 2
                                ? `sticky  bg-[#ffffff]
                                  ${index == headArray().length - 2 &&
                                "right-[65px]"
                                } 
                                  ${index == headArray().length - 1 &&
                                "right-[0px]"
                                } `
                                : ""
                              }
                              text-center align-middle                             
                                `}

                          >
                            {it === "Seleccionar" && (
                              <input
                                type="checkbox"
                                checked={checkedArr.some(
                                  (value) => value._id === i._id
                                )}
                                onChange={(e) => handlerSelectCheck(e, i)}
                              />
                            )}

                            {/* Contactos */}
                            {it.toLowerCase() === "contactos" && (
                              <div className="flex justify-around items-center">
                                {/* {console.log( checkedArr.some(value => value._id === i._id))} */}
                                <a
                                  href={`https://wa.me/${i.numeroDeTelefonoMovil}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-green-500 hover:text-green-600"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 48 48"
                                  >
                                    <path
                                      fill="#fff"
                                      d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                                    ></path>
                                    <path
                                      fill="#fff"
                                      d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                                    ></path>
                                    <path
                                      fill="#cfd8dc"
                                      d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                                    ></path>
                                    <path
                                      fill="#40c351"
                                      d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                                    ></path>
                                    <path
                                      fill="#fff"
                                      fillRule="evenodd"
                                      d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </a>
                                <a
                                  href={`https://https://t.me/${i.numeroDeTelefonoMovil}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-green-500 hover:text-green-600"
                                >
                                  <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="16"
                                      cy="16"
                                      r="14"
                                      fill="url(#paint0_linear_87_7225)"
                                    />
                                    <path
                                      d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                                      fill="white"
                                    />
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_87_7225"
                                        x1="16"
                                        y1="2"
                                        x2="16"
                                        y2="30"
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stopColor="#37BBFE" />
                                        <stop offset="1" stopColor="#007DBB" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </a>
                              </div>
                            )}

                            {/* Operar Verficador */}
                            {
                              it.toLowerCase().includes("fecha") && (
                                formatearFecha(i[toCamelCase(it)])
                              )
                            }



                            {/* Icon */}
                            {it.toLowerCase() === "icon" &&
                              item?.toLowerCase().includes("aplicacion") && (
                                <div className="flex justify-center min-w-[60px]">
                                  <img
                                    src={i[toCamelCase(it)]}
                                    className="inline-block w-[70px] h-[70px] rounded-md"
                                    alt=""
                                  />
                                </div>
                              )}

                            {/* DIas vencidos */}
                            {it.toLowerCase() === "días vencidos" && (
                              <div className="flex justify-center min-w-[60px]">
                                {
                                  diferenciaEnDias(i.fechaDeTramitacionDelCaso, obtenerFechaMexicoISO())
                                }
                              </div>
                            )}

                            {/* Incurrir y casos de cobranzo */}
                            {(item == "Incurrir en una estación de trabajo" || item == "Casos de Cobranza") && it.toLowerCase() === "operar" && (
                              <div className="flex justify-between space-x-3">
                                <Link
                                  href={`/Home/Datos?caso=${i._id}&seccion=info&item=Verificacion`}
                                >
                                  <UserCircleIcon onClick={() => registerTracking(i)} className="h-6 w-6 fill-[#ebbb40]" />
                                </Link>
                                <ClipboardDocumentCheckIcon
                                  className="h-6 w-6 fill-[#ebbb40] cursor-pointer"
                                  onClick={() => handlerAcount("Registrar Cobranza", i)}
                                />
                                <ChatBubbleLeftEllipsisIcon
                                  className="h-6 w-6 fill-[#5bc0cf] cursor-pointer"
                                  onClick={() => handlerMessage(i)}
                                />

                                <div className="relative">
                                  <CurrencyDollarIcon
                                    className="h-6 w-6 fill-[#1ab418] cursor-pointer"
                                    onClick={() => toggleMenu(i._id)}
                                  />
                                  {activeMenu === i._id && (
                                    <div
                                      className="absolute w-[150px] z-50 right-[100px] top-[-5px]
                                             min-w-[100px] bg-white border rounded-lg shadow-lg"
                                    >
                                      <button
                                        className="relative px-4 py-1 text-gray-700 hover:bg-gray-100 w-full text-left z-50"
                                        onClick={() => handlerItemPE("Registrar Pago", i)}
                                      >
                                        Hacer Pago
                                      </button>
                                      <button
                                        className="relative px-4 py-1 text-gray-700 hover:bg-gray-100 w-full text-left z-50"
                                        onClick={() => handlerItemPE("Extension", i)}
                                      >
                                        Extensión
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Operar Verficador */}
                            {it.toLowerCase() === "operar" &&
                              seccion.toLowerCase() === "verificacion" &&
                              (item?.toLowerCase().includes("recolección") ||
                                item?.toLowerCase().includes("lista")) && (
                                <div className="flex justify-between space-x-3 ">
                                  <Link
                                    href={`/Home/Datos?caso=${i._id}&seccion=info&item=Verificacion`}
                                    className=""
                                  >
                                    <button
                                      onClick={() => registerTracking(i)}
                                      type="button"
                                      className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                    >
                                      Visitar
                                    </button>
                                  </Link>
                                  {
                                    !item?.toLowerCase().includes("lista") &&
                                    <button
                                      type="button"
                                      className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                      onClick={() =>
                                        handlerVerification(i, "Verificacion")
                                      }
                                    >
                                      Registrar
                                    </button>
                                  }
                                  {
                                    item?.toLowerCase().includes("lista") && !user?.rol.includes("Asesor") &&
                                    <button
                                      type="button"
                                      className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                      onClick={() =>
                                        handlerVerification(i, "Verificacion")
                                      }
                                    >
                                      Registrar
                                    </button>
                                  }
                                </div>
                              )}

                            {/* Operar Cobrador */}
                            {it.toLowerCase() === "operar" &&
                              seccion.toLowerCase() === "coleccion" &&
                              (item?.toLowerCase().includes("recolección") ||
                                item?.toLowerCase().includes("casos") ||
                                item?.toLowerCase().includes("lista")) && item !== "Casos de Cobranza" && (
                                <div className="flex justify-between space-x-3">
                                  <Link
                                    href={`/Home/Datos?caso=${i._id}&seccion=info&item=Cobranza`}
                                    className=""
                                  >
                                    <button
                                      onClick={() => registerTracking(i)}
                                      type="button"
                                      className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                    >
                                      Visitar
                                    </button>
                                  </Link>
                                  {
                                    !user?.rol.includes("Asesor") &&
                                    <button
                                      type="button"
                                      className="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                      onClick={() =>
                                        handlerVerification(i, "coleccion")
                                      }
                                    >
                                      Registrar
                                    </button>
                                  }
                                </div>
                              )}
                            {/* Operar balance */}
                            {it.toLowerCase() === "operar" &&
                              seccion.toLowerCase() === "coleccion" &&
                              (item?.toLowerCase().includes("cobro y balance")) && (
                                <div className="flex justify-between space-x-3">
                                  <Link
                                    href={`/Home/Datos?caso=${i._id}&seccion=info&item=Cobranza`}
                                    className=""
                                  >
                                    <button
                                      type="button"
                                      className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                    >
                                      Visitar
                                    </button>
                                  </Link>

                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="w-full flex text-white bg-gradient-to-br from-green-600 to-gr-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                      onClick={() => toggleMenu2(i._id, "liquidar")}
                                    >
                                      Liquidar pago
                                    </button>

                                    {operarCobro === "liquidar" && activeMenu === i._id && (
                                      <div
                                        className="absolute w-[150px] z-50 right-[100px] top-[-5px]
                                                  min-w-[100px] bg-white border rounded-lg shadow-lg"
                                      >
                                        <button
                                          className="relative px-4 py-1 text-gray-700 hover:bg-gray-100 w-full text-left z-50"
                                          onClick={() => handlerItemPE("Registro Pago", i)}
                                        >
                                          Hacer Pago
                                        </button>
                                        <button
                                          className="relative px-4 py-1 text-gray-700 hover:bg-gray-100 w-full text-left z-50"
                                          onClick={() => handlerItemPE("Registro Pago Extension", i)}
                                        >
                                          Extensión
                                        </button>
                                      </div>
                                    )}

                                  </div>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="w-full flex text-white bg-gradient-to-br from-green-600 to-gr-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                                      onClick={() => toggleMenu2(i._id, "liga")}
                                    >
                                      Liga de pago
                                    </button>
                                    {operarCobro === "liga" && activeMenu === i._id && (
                                      <div
                                        className="absolute w-[150px] z-50 right-[100px] top-[-5px]
                                                 min-w-[100px] bg-white border rounded-lg shadow-lg"
                                      >
                                        <button
                                          className="relative px-4 py-1 text-gray-700 hover:bg-gray-100 w-full text-left z-50"
                                          onClick={() => handlerItemPE("Registrar Pago", i)}
                                        >
                                          Hacer Pago
                                        </button>
                                        <button
                                          className="relative px-4 py-1 text-gray-700 hover:bg-gray-100 w-full text-left z-50"
                                          onClick={() => handlerItemPE("Extension", i)}
                                        >
                                          Extensión
                                        </button>
                                      </div>
                                    )}
                                  </div>


                                </div>
                              )}

                            {/* Operar aplicaciones */}
                            {item?.toLowerCase().includes("aplicaciones") &&
                              it.toLowerCase() === "operar" && (
                                <div className="relative flex pl-12 justify-center space-x-6">
                                  <button
                                    type="button"
                                    onClick={() => handlerApplication("Eliminar aplicacion", i)}
                                    className="w-full max-w-[70px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center inline-flex justify-center items-center me-2 mb-2"
                                  >
                                    Eliminar
                                  </button>
                                  <button
                                    onClick={() => handlerApplication("Actualizar aplicacion", i)}
                                    type="button"
                                    class="w-full max-w-[70px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Editar
                                  </button>
                                  <Link href={`/Home?seccion=coleccion&item=Gestion de aplicacion&application=${i._id}`}>
                                    <button
                                      type="button"
                                      className="w-full max-w-[70px] text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                    >
                                      Ver
                                    </button>
                                  </Link>
                                </div>
                              )}

                            {item === 'Gestion de aplicacion' &&
                              it.toLowerCase() === "operar" && (
                                <div className="flex justify-center space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => handlerApplicationTipo("Eliminar tipo aplicacion", i)}
                                    className="w-full max-w-[70px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center inline-flex justify-center items-center me-2 mb-2"
                                  >
                                    Eliminar
                                  </button>
                                  <button
                                    onClick={() => handlerApplicationTipo("Modal Editar Tipo Aplicaion", i)}
                                    type="button"
                                    className="w-full max-w-[70px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Editar
                                  </button>
                                </div>
                              )}

                            {/* Operar gestión de Accesos Personales*/}
                            {item?.toLowerCase().includes("gestión de") &&
                              item?.toLowerCase().includes("personales") &&
                              !item?.toLowerCase().includes("colección") &&
                              it.toLowerCase() === "operar" && (
                                <div className="flex justify-center space-x-3">
                                  <UserCircleIcon
                                    className="h-6 w-6 fill-[#ebbb40]"
                                    onClick={() =>
                                      handlerAcountUser("Administrar Asesor", i)
                                    }
                                  />
                                  {/* <ChatBubbleLeftEllipsisIcon
                                    className="h-6 w-6 fill-[#5bc0cf] cursor-pointer"
                                    onClick={() => setModal("SMS")}
                                  />
                                */}
                                </div>
                              )}


                            {/* Operar gestion de accesos cuentas operativas */}
                            {(item?.toLowerCase().includes("gestión de cuentas de colección") || item?.toLowerCase().includes("gestión de asesores") || item?.toLowerCase().includes("gestión de administradores") || item?.toLowerCase().includes("gestión de managers") || item?.toLowerCase().includes("gestión de rh")) &&
                              it.toLowerCase() === "operar" && (
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => handlerEditCuenta('Editar cuenta', i)}
                                    type="button"
                                    className="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Editar
                                  </button>
                                </div>
                              )}

                            {/* Operar registro histórico */}
                            {(item?.toLowerCase().includes("registro histórico")) &&
                              it.toLowerCase() === "operar" && (
                                <div className="flex justify-center gap-6">
                                  {/* <Link href={`/Home/Datos?caso=${i._id}&seccion=info`} className=''>
                                    <button type="button" className="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>
                                  </Link> */}
                                  {/* <button
                                    onClick={() => handlerItemPE('Multar cuenta', i)}
                                    type="button"
                                    className="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Multar
                                  </button> */}
                                </div>
                              )}

                            {(item === "Auditoria Periodica") &&
                              it.toLowerCase() === "operar" && (
                                <div className="relative flex max-w-[150px] justify-between space-x-3">
                                  <button
                                    onClick={() => handlerEditCuenta('Editar Multar cuenta', i)}
                                    type="button"
                                    className="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Editar
                                  </button>
                                </div>
                              )}

                            {(item === "Comisión") &&
                              it.toLowerCase() === "operar" && (
                                <div className="relative flex flex-row max-w-[100%] items-center justify-center space-x-3">
                                  <button
                                    onClick={() => handlerEditCuenta('Editar comision', i)}
                                    type="button"
                                    className="w-full max-w-[120px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handlerEditCuenta('Eliminar comision', i)}
                                    type="button"
                                    className="w-full max-w-[120px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}


                            {it.toLowerCase() === "número de préstamo" &&
                              <Link
                                href={`/Home/Datos?caso=${i._id}&seccion=info&item=Verificacion`}
                              >
                                {i[toCamelCase(it)]}
                              </Link>
                            }

                            {/* Los demas items */}
                            {it.toLowerCase() !== "operar" &&
                              it !== "Contactos" &&

                              it.toLowerCase() !== "número de préstamo" &&
                              it.toLowerCase() !== "icon" &&
                              !it.toLowerCase().includes("fecha") && (
                                <span
                                  className={it.toLowerCase().includes("número") ? "cursor-pointer hover:opacity-70 relative" : ""}
                                  onClick={(event) => {
                                    if (it.toLowerCase().includes("número")) {
                                      copyToClipboard(i[toCamelCase(it)], event);
                                    }
                                  }}
                                >
                                  {i[toCamelCase(it)]}
                                </span>
                              )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>

        </div>
        <div className="mt-2">
          <Paginator
            totalItems={totalDocuments}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onReload={handleReload}
          />
        </div>

        {showTooltip && (
          <div
            className="fixed border border-gray-100 bg-white px-3 py-2 rounded text-sm transform -translate-x-1/2 flex items-center gap-2"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transition: 'opacity 1s ease',
              opacity: tooltipOpacity,
            }}
          >
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            <span className="font-medium text-black">{copiedText}</span>
            <span className="text-red-600">: Copiado correctamente</span>
          </div>
        )}
      </>
    )

  );
};

export default Table;
