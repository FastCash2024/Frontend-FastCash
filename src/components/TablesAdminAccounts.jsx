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
  // filtro_1,
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
  encabezadoDeAplicacion,
  encabezadoComision,
} from "@/constants/TableHeaders.jsx";
import { Paginator } from "./Paginator";
import TableAtencionAlCliente from "./TableAtencionAlCliente";
import TableControl from "./TableControl";
import TableCustomerFlow from "./TableCustomerFlow";
import { getDay } from "@/utils/getDates";
import TableAttendance from "./TableAttendance";
import TableReporteDiarioAuditoria from "./TableReporteDiarioAuditoria";

export default function Home() {

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
    setAttendance
  } = useAppContext();
  const refFirst = useRef(null);
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");
  const application = searchParams.get("application");
  const [trabajo] = useState([])

  console.log("id aplicacion: ", application);
  console.log("id aplicacion: ", item);
  // console.log("trabajo: ", trabajo);
  // console.log("item: ", item);
  // console.log("date: ", baseDate);
  // console.log("filtro_1: ", filtro_1);











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

  function formatDateToISO(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  console.log(formatDateToISO(getDay(-2).val));






  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleReload = () => { };

  console.log("userDB: ", userDB);
  console.log("user: ", user);


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
                    "http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado"
                  }
                />
              )}
              {item === "Flujo de Clientes" && (
                <TableCustomerFlow />
              )}
              {item === "Gestion de aplicaciones" && (
                <Table
                  access={true}
                  headArray={encabezadoDeAplicaciones}
                  dataArray={[""]}
                  dataFilter={(i) => i}
                  local={
                    "http://localhost:3006/api/users/applications/getApplications"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/users/applications/getApplications"
                  }
                />
              )}
              {item === "Gestion de aplicacion" && (
                <Table
                  access={true}
                  headArray={encabezadoDeAplicacion}
                  dataArray={[""]}
                  dataFilter={(i) => i}
                  local={
                    `http://localhost:3006/api/users/applications/aplicationbyid/${application}`
                  }
                  server={
                    `https://api.fastcash-mx.com/api/users/applications/aplicationbyid/${application}`
                  }
                />
              )}
              {item === "Incurrir en una estación de trabajo" && (
                <Table
                  access={true}
                  headArray={encabezadoIncurrirEnUnaEstaciónDeTrabajo}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "Dispersado"}
                  local={"http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado&"}
                  server={"https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado"}
                />
              )}
              {item === "Gestión de cuentas de Colección" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeCuentasDeColección}
                  // dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3002/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Cobranza"}
                  server={"https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Cobranza"}
                />
              )}
              {/* numero de prestamo, apodo de usuario, codigo de producto = arl fac, codico de operacion, contenido (descripcion), resultado de la operacion (true , false reporte actual), fecha */}
              {item === "Registro de SMS" && (
                <Table
                  access={true}
                  headArray={encabezadoRegistroDeSMS}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3005/api/notifications/sms/obtenersms"}
                  server={"https://api.fastcash-mx.com/api/notifications/sms/obtenersms"}
                />
              )}

              {(user?.rol === "Admin" ||
                user.rol === "Super Admin" ||
                user?.rol === "Recursos Humanos" ||
                user.rol === "Manager de Verificación" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Auditoria" ||
                user.rol === "Asesor de Cobranza") &&
                seccion === "coleccion" &&
                item === "Reporte diario" && <TableReporteDiario />}

              {item === "Cobro y balance" && (
                <Table
                  access={true}
                  headArray={encabezadoCobroYValance}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado"}
                  server={"https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado"}
                />
              )}
              {/* --------------------------------- AUDITORIA Y CONTROL DE CALIDAD --------------------------------- */}
              {/* {item === "Registro Histórico" && (
                <TableTracking
                  access={true}
                  headArray={encabezadoRegistroHistorico}
                  dataArray={[""]}
                  dataFilter={(i) => true}
                  local={"http://localhost:3000/api/loans/verification"}
                  server={"https://api.fastcash-mx.com/api/loans/verification"}
                />
              )} */}
              {item === "Registro Histórico" && (
                <Table
                  access={true}
                  headArray={encabezadoRegistroHistorico}
                  dataArray={[""]}
                  dataFilter={(i) => true}
                  local={"http://localhost:3006/api/users/trakingoperaciones"}
                  server={"https://api.fastcash-mx.com/api/users/trakingoperaciones"}
                />
              )}
              {item === "Monitoreo de Transacciones" && (
                <Table
                  access={true}
                  headArray={encabezadoMonitoreoDeTransacciones}
                  dataArray={[""]}
                  dataFilter={(i) => i?.estadoDeCredito === "pendiente"}
                  local={"http://localhost:3003/api/loans/verification?estadoDeCredito=Pagado,Dispersado"}
                  server={"https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Pagado,Dispersado"}
                />
              )}
              {item === "Control de Cumplimiento" && (
                <TableControl />
                // <Table
                //   access={true}
                //   headArray={encabezadoControlDeCumplimiento}
                //   dataArray={[""]}
                //   dataFilter={(i) => true}
                //   local={
                //     "http://localhost:3000/api/multas/multas"
                //   }
                //   server={"https://api.fastcash-mx.com/api/multas/multas"}
                // />
              )}
              {item?.toLowerCase().includes("auditoria")  && (
                <Table
                  access={true}
                  headArray={encabezadoControlDeCumplimiento}
                  dataArray={[""]}
                  dataFilter={(i) => i}
                  local={"http://localhost:3006/api/users/multas/multas"}
                  server={"https://api.fastcash-mx.com/api/users/multas/multas"}
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
                    "http://localhost:3003/api/loans/verification?estadoDeCredito=Pendiente"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Pendiente"
                  }
                />
              )}
              {(user?.rol === "Admin" ||
                user.rol === "Super Admin" ||
                user?.rol === "Recursos Humanos" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Auditoria" ||
                user.rol === "Manager de Verificación" ||
                user.rol === "Asesor de Verificación") &&
                (seccion === "Verificacion" || seccion === "verificacion") &&
                item === "Reporte diario" && <TableReporteDiarioVerificacion />}

              {(user?.rol === "Admin" ||
                user.rol === "Super Admin" ||
                user?.rol === "Recursos Humanos" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Cobranza" ||
                user.rol === "Manager de Auditoria" ||
                user.rol === "Manager de Verificación" ||
                user.rol === "Asesor de Verificación" ||
                user.rol === "Asesor de Auditoria"
              ) &&
                (seccion === "Auditoria" || seccion === "auditoria") &&
                item === "Reporte diario" && <TableReporteDiarioAuditoria />}

              {item === "Lista final" && (
                <Table
                  access={true}
                  headArray={encabezadoCasosDeVerificacion}
                  dataFilter={(i) => true}
                  local={
                    "http://localhost:3003/api/loans/verification?estadoDeCredito=Aprobado,Reprobado"
                  }
                  server={
                    "https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Aprobado,Reprobado"
                  }
                />
              )}
              {/* --------------------------------- GESTION DE ACCESOS --------------------------------- */}
              {item === "Gestión de administradores" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) => i.tipoDeGrupo === "Admin"}
                  local={"http://localhost:3002/api/authSystem/users?tipoGrupo=Admin"}
                  server={"https://api.fastcash-mx.com/api/authSystem/users?tipoGrupo=Admin"}
                />
              )}
              {item === "Gestión de RH" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) =>
                    i?.tipoDeGrupo?.toLowerCase().includes("recursos humanos")
                  }
                  local={"http://localhost:3002/api/authSystem/users?tipoDeGrupo=Recursos%20Humanos"}
                  server={"https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Recursos%20Humanos"}
                />
              )}
              {item === "Gestión de managers" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) =>
                    i?.tipoDeGrupo?.toLowerCase().includes("manager")
                  }
                  local={"http://localhost:3002/api/authSystem/users?tipoDeGrupo=Manager"}
                  server={"https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Manager"}
                />
              )}
              {item === "Gestión de asesores" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesos}
                  dataFilter={(i) => true}
                  // local={'http://localhost:3000/api/authSystem/users?tipoDeGrupo=Asesor'}
                  local={
                    "http://localhost:3002/api/authSystem/users?tipoDeGrupo=Asesor"
                  }
                  server={"https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor"}
                />
              )}
              {item === "Comisión" && (
                <Table
                  access={true}
                  headArray={encabezadoComision}
                  dataFilter={(i) => true}
                  // local={'http://localhost:3000/api/authSystem/users?tipoDeGrupo=Asesor'}
                  local={
                    "http://localhost:3006/api/users/comision"
                  }
                  server={"https://api.fastcash-mx.com/api/users/comision"}
                />
              )}
              {item === "Gestión de cuentas personales" && (
                <Table
                  access={true}
                  headArray={encabezadoGestionDeAccesosPersonales}
                  dataFilter={(i) => true}
                  local={"http://localhost:3002/api/authSystem/personalAccounts"}
                  server={
                    "https://api.fastcash-mx.com/api/authSystem/personalAccounts"
                  }
                />
              )}
              {item === "Atención al Cliente" && seccion === "auditoria" && (
                <TableAtencionAlCliente />
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
                  <TableAttendance />
                )}
            </div>
          )}
          {/* {trabajo.length > 0 && item === "Asistencia" && user.rol !== "Cuenta Personal" && (
            <Paginator
              totalItems={trabajo.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onReload={handleReload}
            />
          )} */}
        </div>
      </main>
    </div>
  );
}
