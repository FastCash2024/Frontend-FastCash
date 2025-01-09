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
import FormAddAccount from "@/components/FormAddAccount";
import FormAddMasiveAccounts from "@/components/FormAddMasiveAccounts";
import FormAddPersonalAccount from "@/components/FormAddPersonalAccount";
import FormAddPersonalData from "@/components/FormAddPersonalData";
import FormAddVerification from "@/components/FormAddVerification";
import FormAdminAccount from "@/components/FormAdminAccount";
import FormAddApplication from "@/components/FormAddApplication";
import FormDistributionCases from "@/components/FormDistributionCases";
import FormAsignarAsesor from "@/components/FormAsignarAsesor";
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

  const getBackgroundClass = (estado) => {
    switch (estado) {
      case "operando":
        return "bg-green-400";
      case "atraso-1":
        return "bg-yellow-400";
      case "atraso-2":
        return "bg-orange-400";
      case "falta":
        return "bg-red-500";
      case "libre":
        return "bg-gray-300";
      default:
        return "";
    }
  };

  const trabajo = [
    {
      nombre: "taipe alejandro cristina magaly",
      lunes: "libre",
      martes: "operando",
      miercoles: "atraso-1",
      jueves: "libre",
      viernes: "falta",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "porozo aguirre brayan david",
      lunes: "libre",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "atraso-1",
      sabado: "falta",
      domingo: "atraso-2",
    },
    {
      nombre: "abad usiña jilson vladimir",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "atraso-2",
      jueves: "operando",
      viernes: "libre",
      sabado: "falta",
      domingo: "libre",
    },
    {
      nombre: "castillo armas brandon alexis",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "libre",
      jueves: "operando",
      viernes: "atraso-1",
      sabado: "libre",
      domingo: "falta",
    },
    {
      nombre: "benavides quiroz jazmín carolina",
      lunes: "operando",
      martes: "libre",
      miercoles: "atraso-1",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "leon cuchipe lady priscila",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "paucar alquinga andres steven",
      lunes: "atraso-2",
      martes: "operando",
      miercoles: "libre",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "arce mendez cristian santiago",
      lunes: "falta",
      martes: "libre",
      miercoles: "atraso-1",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "murillo jerez josselyne michelle",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "alvarez puente gabriela geomar",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "libre",
      domingo: "atraso-1",
    },
    {
      nombre: "cuaspud gallegos katherine dayana",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "bernal ceron tobias bryan",
      lunes: "libre",
      martes: "operando",
      miercoles: "libre",
      jueves: "atraso-1",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "jimenez espinoza byron andres",
      lunes: "libre",
      martes: "libre",
      miercoles: "atraso-2",
      jueves: "operando",
      viernes: "falta",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "ponce murillo yesika ariani",
      lunes: "atraso-2",
      martes: "falta",
      miercoles: "libre",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "quijia sotalin valeria paulina",
      lunes: "operando",
      martes: "libre",
      miercoles: "atraso-1",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "encalada quishpe david andres",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "sigcha palango tania selena",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "libre",
      jueves: "operando",
      viernes: "falta",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "carrasco ortega bryan josue",
      lunes: "libre",
      martes: "operando",
      miercoles: "atraso-1",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "montenegro villacis alan david",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "operando",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "andrango allauca erick fabricio",
      lunes: "falta",
      martes: "libre",
      miercoles: "atraso-2",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "blasio gonzalez tito jonathan",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "garnica robayo hernan garnica",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "libre",
      jueves: "operando",
      viernes: "falta",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "ramos sánchez janny joey",
      lunes: "libre",
      martes: "falta",
      miercoles: "atraso-1",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "lobo sanchez miguel eduardo",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-1",
    },
    {
      nombre: "andi andy silvana maritza",
      lunes: "libre",
      martes: "operando",
      miercoles: "falta",
      jueves: "libre",
      viernes: "atraso-1",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "pulupa cornejo katty pamela",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "lopez morales tifany gissell",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "riera monard dayana andrea",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "marquez ayala marcos jeremias",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "lizano arauz fernando daniel",
      lunes: "libre",
      martes: "operando",
      miercoles: "atraso-1",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "balderramo loor xavier sebastian",
      lunes: "atraso-2",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-1",
    },
    {
      nombre: "choque quinteros ariana mateo",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "sucari jara edward pablo",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "delgado barros rafael adrian",
      lunes: "falta",
      martes: "libre",
      miercoles: "atraso-1",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "guzman tovar eric adrian",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "velasco masi losy jazmin",
      lunes: "atraso-2",
      martes: "libre",
      miercoles: "operando",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "gonzales perez brayan diego",
      lunes: "libre",
      martes: "falta",
      miercoles: "libre",
      jueves: "operando",
      viernes: "atraso-1",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "carrasco salazar jaime roberto",
      lunes: "operando",
      martes: "atraso-1",
      miercoles: "falta",
      jueves: "libre",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "rivadeneira gonzalez laura",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-1",
    },
    {
      nombre: "campos villavicencio brayan alexander",
      lunes: "libre",
      martes: "operando",
      miercoles: "falta",
      jueves: "atraso-1",
      viernes: "libre",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "quebrada morales solymar",
      lunes: "atraso-2",
      martes: "libre",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "yucra ordonez jhonny erick",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "salazar rodriguez katherine vitory",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "operando",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "rodriguez lopez jhonnatthan",
      lunes: "falta",
      martes: "libre",
      miercoles: "atraso-1",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "aillón choque benjamin",
      lunes: "atraso-2",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "acosta ramirez emily",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "flores veintimilla jose luis",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
    {
      nombre: "toapanta tulcan nicole",
      lunes: "atraso-2",
      martes: "libre",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "moreno velasco milena",
      lunes: "falta",
      martes: "operando",
      miercoles: "libre",
      jueves: "atraso-1",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "verdugo lasso jhonny wilson",
      lunes: "atraso-1",
      martes: "libre",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "ingacochea haro eliana",
      lunes: "libre",
      martes: "atraso-2",
      miercoles: "operando",
      jueves: "falta",
      viernes: "libre",
      sabado: "atraso-1",
      domingo: "libre",
    },
    {
      nombre: "zapata aguilar cristian edward",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "falta",
      jueves: "operando",
      viernes: "libre",
      sabado: "atraso-2",
      domingo: "libre",
    },
    {
      nombre: "de la torre muñoz luis andres",
      lunes: "atraso-2",
      martes: "libre",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-1",
    },
    {
      nombre: "rios ávila diana carolina",
      lunes: "libre",
      martes: "atraso-1",
      miercoles: "operando",
      jueves: "libre",
      viernes: "falta",
      sabado: "libre",
      domingo: "atraso-2",
    },
  ];

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

  return (
    <div className="overflow-x-auto">
      <main className={` h-full pt-[20px] `}>
        {/* <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-30 lg:left-[8px]' onClick={prev}>{'<'}</button>
                <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-30 lg:right-[8px]' onClick={next}>{'>'}</button>
                */}
        {/* --------------------------------- TABLAS FASTCASH--------------------------------- */}

        <div className="overflow-x-auto">
          {user?.rol && (
            <div
              className="max-h-[calc(100vh-90px)] pb-2 overflow-y-auto relative scroll-smooth"
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
                          {getDay(-2).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(11).val}
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
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(2).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(3).val}
                        </th>
                        <th
                          scope="col"
                          className=" px-3 py-1 text-gray-700 text-center border border-gray-400"
                        >
                          {getDay(4).val}
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
                            {cobrador.nombre}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.lunes
                            )}`}
                          >
                            {cobrador.lunes}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.martes
                            )}`}
                          >
                            {cobrador.martes}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.miercoles
                            )}`}
                          >
                            {cobrador.miercoles}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.jueves
                            )}`}
                          >
                            {cobrador.jueves}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.viernes
                            )}`}
                          >
                            {cobrador.viernes}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.sabado
                            )}`}
                          >
                            {cobrador.sabado}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-400 ${getBackgroundClass(
                              cobrador.domingo
                            )}`}
                          >
                            {cobrador.domingo}
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
