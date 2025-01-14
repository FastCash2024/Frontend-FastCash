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
import TableReporteDiario from "@/components/TableReporteDiario";

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
import FormAddApplication from "@/components/formModals/FormAddApplication";
import FormDistributionCases from "@/components/formModals/FormDistributionCases";
import FormAsignarAsesor from "@/components/formModals/FormAsignarAsesor";
import TableTools from "@/components/TableTools";
import TableReporteDiarioVerificacion from "@/components/TableReporteDiarioVerificacion";
import Alert from "@/components/Alert";
import TableTracking from "@/components/TableTracking";

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
  encabezadoGestionDeAccesosPersonales,
  encabezadoDeAplicaciones,
} from "@/constants/TableHeaders.jsx";
import { Paginator } from "./Paginator";

export default function Home() {
  const [selectedLeft, setSelectedLeft] = useState(-1);
  const [selectedRight, setSelectedRight] = useState(-1);

  const {
    user,
    userDB,
    setUserProfile,
    users,
    alerta,
    setAlerta,
    modal,
    setModal,
    loader,
    setLoader,
    setUsers,
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
    setDestinatario,
    itemSelected,
    setItemSelected,
  } = useAppContext();
  const refFirst = useRef(null);
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");

  const [trabajo, setTrabajo] = useState([])
  
      async function handlerFetch(startDate = '', endDate = '') {
          const local = 'http://localhost:3000/api/attendance';
      
          const urlParams = new URLSearchParams(window.location.search);
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
      
          const dataParams = [];
          if (startDate) dataParams.push(`startDate=${startDate}`);
          if (endDate) dataParams.push(`endDate=${endDate}`);
          const dataParamsString = dataParams.join('&');
      
          const urlLocal = stg
              ? `${local}?${stg}${dataParamsString ? `&${dataParamsString}` : ''}`
              : `${local}${dataParamsString ? `?${dataParamsString}` : ''}`;
      
          console.log("url local solicitada: ", urlLocal);
      
          const res = await fetch(urlLocal);
      
          const result = await res.json();
          console.log("resultado: ", result);
      
          setTrabajo(result);
      }
      
      
      useEffect(() => {
        if (item === "Asistencia") {
          handlerFetch();
        }
      }, []);
      console.log("trabajo: ", trabajo);
      console.log("item: ", item);

  let menu = user?.rol
    ? menuArray[user.rol].filter((i) => i.hash === seccion)
    : "";

  const prev = () => {
    requestAnimationFrame(() => {
      if (refFirst.current) {
        const scrollLeft = refFirst.current.scrollLeft;
        // console.log(scrollLeft);
        const itemWidth = screen.width - 50;
        refFirst.current.scrollLeft = scrollLeft - itemWidth;
      }
    });
  };
  const next = () => {
    requestAnimationFrame(() => {
      if (refFirst.current) {
        const scrollLeft = refFirst.current.scrollLeft;
        // console.log(scrollLeft);
        const itemWidth = screen.width - 50;
        // console.log(itemWidth);
        refFirst.current.scrollLeft = scrollLeft + itemWidth;
      }
    });
  };

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  function getDay(dias) {
    var dt = new Date();

    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    // // console.log('Fecha Actual: ' + dt);
    //restando los dias deseados
    const dat = dt.setDate(dt.getDate() + dias);
    const index = new Date(dat).getDay();
    //mostrando el resultado
    return { val: formatDate(dt), day: diasSemana[index] };
  }

  function formatDateToISO(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

  console.log(formatDateToISO(getDay(-2).val));
  

  const getBackgroundClass = (estado) => {
    switch (estado) {
      case "Operando":
        return "bg-green-400";
      case "Atraso-1":
        return "bg-yellow-400";
      case "Aatraso-2":
        return "bg-orange-400";
      case "Falta":
        return "bg-red-500";
      case "Libre":
        return "bg-gray-300";
      default:
        return "";
    }
  };

  

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trabajo.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleReload = () => {};

  console.log("filtro_1", filtro_1);
  

  return (
    <div className="overflow-x-auto">
      <main className={` h-full pt-[20px] `}>
        {/* <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-30 lg:left-[8px]' onClick={prev}>{'<'}</button>
                <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-30 lg:right-[8px]' onClick={next}>{'>'}</button>
                */}
        {/* --------------------------------- TABLAS FASTCASH--------------------------------- */}

        <div className="overflow-x-auto shadow-2xl">
          {user?.rol && (
            <div
              className="max-h-[calc(100vh-40px)] pb-2 overflow-y-auto relative scroll-smooth  "
              ref={refFirst}
            >
              {/* ---------------------------------COLECCION DE CASOS--------------------------------- */}
              {item === "Casos de Cobranza" && (
                <Table
                  access={true}
                  headArray={encabezadoCasosDeCobranza}
                  dataArray={[""]}
                  dataFilter={(i) => true}
                  local={
                    "http://localhost:3000/api/verification?estadoDeCredito=Dispersado"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/verification?estadoDeCredito=Dispersado"
                  }
                />
              )}
              {item === "Flujo de Clientes" && (
                <>
                  <div className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth">
                    <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                      <thead className="text-[10px] text-gray-700 uppercase bg-slate-200  sticky top-[0px] z-20">
                        <tr className="">
                          <th
                            scope="col"
                            className="w-[50px] px-3 py-1 text-gray-700"
                          >
                            Solicitud
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(-6).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(-5).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(-4).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(-3).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(-2).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(-1).val}
                          </th>
                        </tr>
                        <tr className="">
                          <th
                            scope="col"
                            className="w-[50px] px-3 py-1 text-gray-700"
                          >
                            Desembolso
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(0).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(1).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(2).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(3).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(4).val}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(5).val}
                          </th>
                        </tr>
                        <tr className="">
                          <th
                            scope="col"
                            className="w-[50px] px-3 py-1 text-gray-700"
                          >
                            Dia
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(0).day}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(1).day}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(2).day}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(3).day}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(4).day}
                          </th>
                          <th
                            scope="col"
                            className=" px-3 py-1 text-gray-700 text-center"
                          >
                            {getDay(5).day}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtro_1.map(
                          (item, index) =>
                            item !== "Todo" && (
                              <tr
                                key={index}
                                className={`text-[12px] border-b bg-slate-50`}
                              >
                                <td className="px-3 py-2">{item}</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    {item === "Flujo de Clientes" && (
                      <Paginator
                        totalItems={item.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        onReload={handleReload}
                      />
                    )}
                  </div>
                </>
              )}
              {item === "Gestion de aplicaciones" && (
                <Table
                  access={true}
                  headArray={encabezadoDeAplicaciones}
                  dataArray={[""]}
                  dataFilter={(i) => i}
                  local={
                    "http://localhost:3000/api/applications/getApplications"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/applications/getApplications"
                  }
                />
              )}
              {item === "Incurrir en una estación de trabajo" && (
                <Table
                  access={true}
                  headArray={encabezadoIncurrirEnUnaEstaciónDeTrabajo}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {item === "Gestión de cuentas de Colección" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeCuentasDeColección}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {/* numero de prestamo, apodo de usuario, codigo de producto = arl fac, codico de operacion, contenido (descripcion), resultado de la operacion (true , false reporte actual), fecha */}
              {item === "Registro de SMS" && (
                <Table
                  access={true}
                  headArray={encabezadoRegistroDeSMS}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {(user?.rol === "Admin" ||
                user.rol === "Super Admin" ||
                user?.rol === "Recursos Humanos" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Auditoria" ||
                user.rol === "Manager de Verificación") &&
                seccion === "coleccion" &&
                item === "Reporte diario" && <TableReporteDiario />}
              {item === "Cobro y valance" && (
                <Table
                  access={true}
                  headArray={encabezadoCobroYValance}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {/* --------------------------------- AUDITORIA Y CONTROL DE CALIDAD --------------------------------- */}
              {item === "Registro Histórico" && (
                <TableTracking
                  access={true}
                  headArray={encabezadoRegistroHistorico}
                  dataArray={[""]}
                  dataFilter={(i) => true}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {item === "Monitoreo de Transacciones" && (
                <Table
                  access={true}
                  headArray={encabezadoMonitoreoDeTransacciones}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {item === "Control de Cumplimiento" && (
                <Table
                  access={true}
                  headArray={encabezadoControlDeCumplimiento}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {item === "Auditoria Periodica" && (
                <Table
                  access={true}
                  headArray={encabezadoAuditoriaPeriodica}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3000/api/verification"}
                  server={"https://api.fastcash-mx.com/api/verification"}
                />
              )}
              {/* --------------------------------- VERIFICACION DE CREDITOS --------------------------------- */}
              {item === "Recolección y Validación de Datos" && (
                <Table
                  access={true}
                  headArray={encabezadoCasosDeVerificacion}
                  dataArray={[""]}
                  dataFilter={(i) => true}
                  local={
                    "http://localhost:3000/api/verification?estadoDeCredito=Pendiente"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/verification?estadoDeCredito=Aprobado,Pendiente"
                  }
                />
              )}
              {(user?.rol === "Admin" ||
                user.rol === "Super Admin" ||
                user?.rol === "Recursos Humanos" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Auditoria" ||
                user.rol === "Manager de Verificación") &&
                seccion === "Verificacion" &&
                item === "Reporte diario" && <TableReporteDiarioVerificacion />}
              {item === "Lista final" && (
                <Table
                  access={true}
                  headArray={encabezadoCasosDeVerificacion}
                  dataFilter={(i) => true}
                  local={
                    "http://localhost:3000/api/verification?estadoDeCredito=Aprobado,Reprobado"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/verification?estadoDeCredito=Aprobado,Reprobado"
                  }
                />
              )}
              {/* --------------------------------- GESTION DE ACCESOS --------------------------------- */}
              {item === "Gestión de administradores" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) => i.tipoDeGrupo === "Admin"}
                  local={"http://localhost:3000/api/auth/users"}
                  server={"https://api.fastcash-mx.com/api/auth/users"}
                />
              )}
              {item === "Gestión de RH" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) =>
                    i?.tipoDeGrupo?.toLowerCase().includes("recursos humanos")
                  }
                  local={"http://localhost:3000/api/auth/users"}
                  server={"https://api.fastcash-mx.com/api/auth/users"}
                />
              )}
              {item === "Gestión de managers" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) =>
                    i?.tipoDeGrupo?.toLowerCase().includes("manager")
                  }
                  local={"http://localhost:3000/api/auth/users"}
                  server={"https://api.fastcash-mx.com/api/auth/users"}
                />
              )}
              {item === "Gestión de asesores" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) => true}
                  // local={'http://localhost:3000/api/auth/users?tipoDeGrupo=Asesor'}
                  local={
                    "http://localhost:3000/api/auth/users?tipoDeGrupo=Asesor"
                  }
                  server={"https://api.fastcash-mx.com/api/auth/users"}
                />
              )}
              {item === "Gestión de cuentas personales" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesosPersonales}
                  dataFilter={(i) => true}
                  local={"http://localhost:3000/api/auth/personalAccounts"}
                  server={
                    "https://api.fastcash-mx.com/api/auth/personalAccounts"
                  }
                />
              )}
              {/* --------------------------------- TABLAS EN MAS DE DOS SECCIONES --------------------------------- */}
              {(user?.rol === "Admin" ||
                user.rol === "Super Admin" ||
                user?.rol === "Recursos Humanos" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Auditoria" ||
                user.rol === "Manager de Verificación") &&
                item === "Asistencia" && (
                  <table className="w-full min-w-[1000px] bg-white text-[14px] text-left text-gray-500 border-t-4  shadow">
                    <thead className="text-[10px] text-gray-700 uppercase bg-slate-200 sticky top-[0px] z-20">
                      <tr>
                        <th className="px-3 py-2 border-y"></th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400 border-b-0"
                        ></th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          LUNES
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          MARTES
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          MIÉRCOLES
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          JUEVES
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          VIERNES
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          SÁBADO
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border border-gray-400"
                        >
                          DOMINGO
                        </th>
                      </tr>
                      <tr>
                        <th className="px-3 py-2 border border-gray-400">
                          <input type="checkbox" />
                        </th>
                        <th
                          colSpan="1"
                          className="px-4 py-2 text-gray-700 text-center border-b-0 border-t-white"
                        >
                          USUARIOS
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(-5).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(-4).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(-3).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(-2).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(-1).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(0).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(1).val}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((cobrador, index) => (
                        <tr key={index} className="text-[12px]">
                          <td
                            className={`px-3 py-2 text-[12px] border-b bg-white ${
                              selectedLeft === 1 ? "sticky left-0 z-10" : ""
                            }`}
                          >
                            <input type="checkbox" />
                          </td>
                          <td className="px-4 py-2 border border-gray-400 bg-white">
                            {cobrador.usuario}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(-5).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(-5).val)]}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(-4).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(-4).val)]}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(-3).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(-3).val)]}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(-2).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(-2).val)]}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(-1).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(-1).val)]}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(0).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(0).val)]}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.asistencias[formatDateToISO(getDay(1).val)]
                            )}`}
                          >
                            {cobrador.asistencias[formatDateToISO(getDay(1).val)]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          )}
          {trabajo.length > 0 && item === "Asistencia" && (
            <Paginator
              totalItems={trabajo.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onReload={handleReload}
            />
          )}
        </div>
      </main>
    </div>
  );
}
