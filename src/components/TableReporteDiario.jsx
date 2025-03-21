"use client";
import { useAppContext } from "@/context/AppContext";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import Loader from "@/components/Loader";
import SelectSimple from "@/components/SelectSimple";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";
import InputPass from "@/components/InputPass";
import Table from "@/components/Table";
// import Velocimetro from '@/components/Velocimetro'
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), {
  ssr: false,
});
import FormAddAccount from "@/components/formModals/FormAddAccount";
import FormAddMasiveAccounts from "@/components/formModals/FormAddMasiveAccounts";
import FormAddPersonalAccount from "@/components/formModals/FormAddPersonalAccount";
import FormAddPersonalData from "@/components/formModals/FormAddPersonalData";
import FormAddVerification from "@/components/formModals/FormAddVerification";
import FormAdminAccount from "@/components/formModals/FormAdminAccount";

import TableTools from "@/components/TableTools";

import Alert from "@/components/Alert";

import {
  refunds,
  historial,
  menuArray,
  filtro_1,
  rangesArray,
  cobrador,
  filterCliente,
  factura,
  Jumlah,
  estadoRembolso,
} from "@/constants/index";
import { useRouter } from "next/navigation";
import {
  ChatIcon,
  PhoneIcon,
  ClipboardDocumentCheckIcon,
  FolderPlusIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import Speedometer, {
  Background,
  Arc,
  DangerPath,
  Needle,
  Progress,
  Marks,
  Indicator,
} from "react-speedometer";
import {
  encabezadoCasosDeCobranza,
  encabezadoIncurrirEnUnaEstaciónDeTrabajo,
  encabezadoGestionDeCuentasDeColección,
  encabezadoRegistroDeSMS,
  encabezadoCobroYValance,
  encabezadoRegistroHistorico,
  encabezadoMonitoreoDeTransacciones,
  encabezadoControlDeCumplimiento,
  encabezadoAuditoriaPeriodica,
  encabezadoCasosDeVerificacion,
  encabezadoListaFinal,
  encabezadoGestionDeAccesos,
} from "@/constants/TableHeaders.jsx";
import { Paginator } from "./Paginator";
import { obtenerSegmento } from "@/utils";
import { today } from "@/utils/getDates";

export default function Home() {
  const [selectedLeft, setSelectedLeft] = useState(-1);
  const [selectedRight, setSelectedRight] = useState(-1);

  const router = useRouter();
  const [texto, setTexto] = useState("");
  const {
    user,
    checkedArr,
    setCheckedArr,
    loader,
    setLoader,
  } = useAppContext();
  const [filter, setFilter] = useState({
    nombreProducto: "Todo",
    ["Minimo dias vencido"]: 0,
    ["Maximo dias vencido"]: 10000000000,
    ["Estado de reembolso"]: "",
    ["Cliente nuevo"]: "",
    ["Nombre del cliente"]: "",
    ["Número de teléfono"]: "",
  });
  const [filter2, setFilter2] = useState({
    nombreProducto: "Todo",
    ["Minimo dias vencido"]: 0,
    ["Maximo dias vencido"]: 10000000000,
    ["Estado de reembolso"]: "",
    ["Cliente nuevo"]: "",
    ["Nombre del cliente"]: "",
    ["Número de teléfono"]: "",
  });
  const [state, setState] = useState({});
  const [editItem, setEditItem] = useState(undefined);
  const [remesasDB, setRemesasDB] = useState(undefined);
  const refFirst = useRef(null);
  const [cases, setCases] = useState([]);
  const searchParams = useSearchParams();
  const item = searchParams.get("item");
  const seccion = searchParams.get("seccion");
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();
  let menu = user?.rol
    ? menuArray[user.rol].filter((i) => i.hash === seccion)
    : "";
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [details, setDetails] = useState([])
  const [totales, setTotales] = useState({})

  function sortArray(x, y) {
    if (
      x["translation"]["spa"]["common"].toLowerCase() <
      y["translation"]["spa"]["common"].toLowerCase()
    ) {
      return -1;
    }
    if (
      x["translation"]["spa"]["common"].toLowerCase() >
      y["translation"]["spa"]["common"].toLowerCase()
    ) {
      return 1;
    }
    return 0;
  }
  function handlerSelect(name, i, uuid) {
    setState({ ...state, [uuid]: { [name]: i } });
  }

  function handlerSelected(position, index) {
    if (position === "LEFT") {
      selectedLeft === index ? setSelectedLeft(-1) : setSelectedLeft(index);
    }
    if (position === "RIGHT") {
      selectedLeft === index ? setSelectedRight(-1) : setSelectedRight(index);
    }
  }

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
        ? `http://localhost:3002/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Cobranza&limit=${limit}&page=${page}`
        : `https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Cobranza&limit=${limit}&page=${page}`
    );
    const result = await res.json();
    console.log("data: ", result);
    setData(result);
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

    console.log("query String: ", queryString);
    const baseUrl = window?.location?.href?.includes("localhost")
      ? `http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado,Pagado&limit=1000${queryString ? `&${queryString}` : `&fechaDeTramitacionDeCobro=${today}`
      }`
      : `https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado,Pagado&limit=1000${queryString ? `&${queryString}` : `&fechaDeTramitacionDeCobro=${today}`
      }`;

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

    const baseUrl = window?.location?.href?.includes("localhost")
      ? "http://localhost:3003/api/loans/verification/totalreportecobro"
      : "https://api.fastcash-mx.com/api/loans/verification/totalreportecobro";

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("Final URL:", url);

    const res = await fetch(url)
    const data = await res.json()
    setTotales(data.totales)
  }

  useEffect(() => {
    handlerFetchTotales()
    handlerFetch(itemsPerPage, currentPage);
    handlerFetchVerification();
  }, [loader, itemsPerPage, currentPage, searchParams]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

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
    
    const baseUrl = window?.location?.href?.includes('localhost')
    ? 'http://localhost:3003/api/loans/verification/reportecobrados'
    : 'https://api.fastcash-mx.com/api/loans/verification/reportecobrados'

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("url reporte cobrado: ", url);
    
    const res = await fetch(url)
    const data = await res.json()
    console.log("data detalle: ", data)
    setDetails(data.data)
  }

  useEffect(() => {
    handlerFetchDetails();
    setCheckedArr([]);
  }, [loader, itemsPerPage, currentPage, searchParams]);

  const handleReload = () => {
    handlerFetch(itemsPerPage, currentPage);
  }

  return (
    <>
      <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
        <table className="w-full min-w-[2000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[10px] text-white uppercase bg-slate-200 sticky top-[0px] z-20">
            <tr className=" bg-slate-200">
              <th className="px-3 py-2">{/* <input type="checkbox" /> */}</th>
              <th className="px-4 py-2 text-gray-700">SEGMENTO</th>
              <th className="px-4 py-2 text-gray-700">Nombres</th>

              <th className="px-4 py-2 text-gray-700">Cuenta</th>

              <th className="px-4 py-2 text-gray-700">CASOS FUERA DE HORARIO</th>
              <th className="px-4 py-2 text-gray-700">CASOS</th>

              <th className="px-4 py-2 text-yellow-500 ">PAGOS 10:00 am</th>
              <th className="px-4 py-2 text-gray-700">PTP 10:00 am</th>
              <th className="px-4 py-2 text-gray-700">
                Tasa de recuperación
              </th>

              <th className="px-4 py-2 text-yellow-500 ">PAGOS 12:00 am</th>
              <th className="px-4 py-2 text-gray-700">PTP 12:00 am</th>
              <th className="px-4 py-2 text-gray-700">
                Tasa de recuperación
              </th>

              <th className="px-4 py-2 text-yellow-500 ">PAGOS 2:00 pm</th>
              <th className="px-4 py-2 text-gray-700">PTP 2:00 pm</th>
              <th className="px-4 py-2 text-gray-700">
                Tasa de recuperación
              </th>

              <th className="px-4 py-2 text-yellow-500 ">PAGOS 4:00 pm</th>
              <th className="px-4 py-2 text-gray-700">PTP 4:00 pm</th>
              <th className="px-4 py-2 text-gray-700">
                Tasa de recuperación
              </th>

              <th className="px-4 py-2 text-yellow-500 ">PAGOS 6:00 pm</th>
              <th className="px-4 py-2 text-gray-700">PTP 6:00 pm</th>
              <th className="px-4 py-2 text-gray-700">
                Tasa de recuperación
              </th>

              <th className="px-4 py-2 text-yellow-500">Pagos total</th>
              <th className="px-4 py-2 text-gray-700">
                Tasa de recuperación
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((i, index) => (
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
                <td className="px-4 py-2">{obtenerSegmento(i.cuenta)}</td>
                <td className="px-4 py-2">{i.nombrePersonal}</td>
                <td className="px-4 py-2">{i.cuenta}</td>

                <td className="px-4 py-2">{details[i.cuenta]?.casosFueraDeHorario}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.casosTotales}</td>
                {/* <td className="px-4 py-2">{i.llamadasRealizadas}</td> */}
                <td className="px-4 py-2  bg-yellow-400">{details[i.cuenta]?.pagos10am}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.ptp10am}</td>
                <td className="px-4 py-2">{(details[i.cuenta]?.tasaRecuperacion10am)?.toFixed(2)}%</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.pagos12am}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.ptp12am}</td>
                <td className="px-4 py-2">{(details[i.cuenta]?.tasaRecuperacion12am)?.toFixed(2)}%</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.pagos2pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.ptp2pm}</td>
                <td className="px-4 py-2">{(details[i.cuenta]?.tasaRecuperacion2pm)?.toFixed(2)}%</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.pagos4pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.ptp4pm}</td>
                <td className="px-4 py-2">{(details[i.cuenta]?.tasaRecuperacion4pm)?.toFixed(2)}%</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.pagos6pm}</td>
                <td className="px-4 py-2">{details[i.cuenta]?.ptp6pm}</td>
                <td className="px-4 py-2">{(details[i.cuenta]?.tasaRecuperacion6pm)?.toFixed(2)}%</td>
                <td className="px-4 py-2 bg-yellow-400">{details[i.cuenta]?.pagosTotal}</td>

                <td className="px-4 py-2">{(details[i.cuenta]?.tasaRecuperacionTotal)?.toFixed(2)}%</td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className='px-4 py-2'>Totales</td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'></td>
              <td className='px-4 py-2'>{totales?.casosFueraDeHorario}</td>
              <td className='px-4 py-2'>{totales?.totalesConAsesor}</td>
              {/* <td className='px-4 py-2'></td> */}
              <td className="px-4 py-2  bg-yellow-400">{totales?.pagos10am}</td>
              <td className="px-4 py-2">{totales?.ptp10am}</td>
              <td className="px-4 py-2">{(totales?.tasaRecuperacion10am)?.toFixed(2)}%</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.pagos12am}</td>
              <td className="px-4 py-2">{totales?.ptp12am}</td>
              <td className="px-4 py-2">{(totales?.tasaRecuperacion12am)?.toFixed(2)}%</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.pagos2pm}</td>
              <td className="px-4 py-2">{totales?.ptp2pm}</td>
              <td className="px-4 py-2">{(totales?.tasaRecuperacion2pm)?.toFixed(2)}%</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.pagos4pm}</td>
              <td className="px-4 py-2">{totales?.ptp4pm}</td>
              <td className="px-4 py-2">{(totales?.tasaRecuperacion4pm)?.toFixed(2)}%</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.pagos6pm}</td>
              <td className="px-4 py-2">{totales?.ptp6pm}</td>
              <td className="px-4 py-2">{(totales?.tasaRecuperacion6pm)?.toFixed(2)}%</td>
              <td className="px-4 py-2 bg-yellow-400">{totales?.pagosTotal}</td>
              <td className="px-4 py-2">{(totales?.tasaRecuperacionTotal)?.toFixed(2)}%</td>
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
