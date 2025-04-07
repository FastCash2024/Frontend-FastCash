"use client";
import { useAppContext } from "@/context/AppContext";
import React, { useRef } from "react";

import { useSearchParams } from "next/navigation";
import Table from "@/components/Table";
import TableReporteDiario from "@/components/TableReporteDiario";

import TableReporteDiarioVerificacion from "@/components/TableReporteDiarioVerificacion";

import ReporteDeAccesos from "@/components/ReporteDeAccesos";

import {
  encabezadoCasosDeCobranza,
  encabezadoIncurrirEnUnaEstaciónDeTrabajo,
  encabezadoGestionDeCuentasDeColección,
  encabezadoRegistroDeSMS,
  encabezadoCobroYValance,
  encabezadoRegistroHistorico,
  encabezadoMonitoreoDeTransacciones,
  encabezadoControlDeCumplimiento,
  encabezadoCasosDeVerificacion,
  encabezadoGestionDeAccesos,
  encabezadoGestionDeAccesosPersonales,
  encabezadoDeAplicaciones,
  encabezadoDeAplicacion,
  encabezadoComision,
} from "@/constants/TableHeaders.jsx";
import TableAtencionAlCliente from "./TableAtencionAlCliente";
import TableControl from "./TableControl";
import TableCustomerFlow from "./TableCustomerFlow";
import TableAttendance from "./TableAttendance";
import TableReporteDiarioAuditoria from "./TableReporteDiarioAuditoria";

export default function Home() {

  const {
    user
  } = useAppContext();
  const refFirst = useRef(null);
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");
  const item = searchParams.get("item");
  const application = searchParams.get("application");

  return (
    <div className="overflow-x-auto">
      <main className={` h-full pt-[10px] `}>

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
                  local={"http://localhost:3003/api/loans/verification?estadoDeCredito=Dispersado&numeroDePrestamo=klsklsd"}
                  server={"https://api.fastcash-mx.com/api/loans/verification?estadoDeCredito=Dispersado&numeroDePrestamo=klsklsd"}
                />
              )}
              {/* --------------------------------- AUDITORIA Y CONTROL DE CALIDAD --------------------------------- */}
          
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
              )}
              {item?.toLowerCase().includes("auditoria") && (
                <Table
                  access={true}
                  headArray={encabezadoControlDeCumplimiento}
                  dataArray={[""]}
                  dataFilter={(i) => user?.email === i?.cuentaPersonal}
                  local={"http://localhost:3006/api/users/multas/multas"}
                  server={"https://api.fastcash-mx.com/api/users/multas/multas"}
                />
              )
              }
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
                item === "Reporte diario" && <TableReporteDiarioAuditoria />
              }
              {item === "Atención al Cliente" && seccion === "auditoria" && (
                <TableAtencionAlCliente />
              )}

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


              {item === "Reporte de accesos" && (
                <ReporteDeAccesos />
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
<<<<<<< HEAD
=======
         
>>>>>>> 269401431350a970b1bd361ff08fc877b297110a
        </div>
      </main>
    </div>
  );
}
