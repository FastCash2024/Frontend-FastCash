import {
  CircleStackIcon as OutlineCircleStackIcon,
  PresentationChartLineIcon as OutlinePresentationChartLineIcon,
  DocumentCheckIcon as OutlineDocumentCheckIcon,
  IdentificationIcon as OutlineIdentificationIcon,
  UsersIcon as OutlineUsersIcon,
  ArchiveBoxIcon as OutlineArchiveBoxIcon,
  OfficeBuildingIcon as OutlineOfficeBuildingIcon,
  UserGroupIcon as OutlineUserGroupIcon,
  CheckCircleIcon as OutlineCheckCircleIcon,
  DocumentTextIcon as OutlineDocumentTextIcon
} from '@heroicons/react/24/outline';
import {

  ArchiveBoxIcon,
  OfficeBuildingIcon,
  UserGroupIcon,
  CheckCircleIcon,
  DocumentTextIcon, MoonIcon, SunIcon, WindowIcon, CircleStackIcon, IdentificationIcon, DocumentCheckIcon, PresentationChartLineIcon, NumberedListIcon, AdjustmentsHorizontalIcon, ChartBarIcon, CalendarDaysIcon, UsersIcon
} from '@heroicons/react/24/solid';



const refunds = [
  {
    contactos: "+1234567810",
    numeroDePrestamo: "LN021",
    idDeSubFactura: "INV021",
    estadoDeReembolso: "no pagado",
    nombreDelCliente: "Alice Walker",
    numeroDeTelefonoMovil: "+0987654341",
    clientesNuevos: true,
    importeReembolsableRp: 180.00,
    importePagadoRp: 90.00,
    registroDeNotas: "Pendiente de revisión",
    nombreDelProducto: "BEC",
    fechaDeReembolso: "2024-09-20",
    diasVencidos: 5,
    fechaDeCancelacionACuenta: "N/A",
    fechaDeCreacionDeLaTarea: "2024-09-01",
    fechaDeTramitacionDelCaso: "2024-09-05",
    nombreDeLaEmpresa: "ElectroGoods",
    apodoDeUsuarioDeCobro: "alice.w",
    operar: "Procesar"
  },

]









const menuArray = {

  // ['Usuario de Verificación']: [
  //   {
  //     icon: <CircleStackIcon className="h-6 w-6" />,
  //     hash: 'coleccion',
  //     title: "Colección de casos",
  //     options: [
  //       { subtitle: "Casos de Cobranza", icon: <NumberedListIcon className="h-5 w-5" /> },
  //       { subtitle: "Distribución de casos", icon: <AdjustmentsHorizontalIcon className="h-5 w-5" /> },
  //       { subtitle: "Incurrir en una estación de trabajo", icon: <OutlineUsersIcon className="h-5 w-5" /> },
  //       { subtitle: "Flujo de Clientes", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
  //       { subtitle: "Gestión de cuentas de Colección", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
  //       { subtitle: "Registro de SMS", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> }
  //     ],
  //     length: 'h-[245px]'
  //   },
  //   {
  //     icon: <PresentationChartLineIcon className="h-6 w-6" />,
  //     hash: 'auditoria',
  //     title: "Auditoría y control de calidad",
  //     options: [
  //       { subtitle: "Registro Histórico", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
  //       { subtitle: "Monitoreo de Transacciones", icon: <OutlinePresentationChartLineIcon className="h-5 w-5" /> },
  //       { subtitle: "Control de Cumplimiento", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
  //       { subtitle: "Auditoria Periódica", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
  //       
  //       { subtitle: "Atención al Cliente", icon: <OutlineUsersIcon className="h-5 w-5" /> }
  //     ],
  //     length: 'h-[230px] overflow-auto'
  //   },
  //   {
  //     icon: <DocumentCheckIcon className="h-6 w-6" />,
  //     hash: '#Verificacion',
  //     title: "Verificación de Créditos",
  //     options: [
  //       { subtitle: "Recolección y Validación de Datos", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
  //       { subtitle: "Lista final", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
  //     ],
  //     length: 'h-[100px]'
  //   },
  //   {
  //     icon: <IdentificationIcon className="h-6 w-6" />,
  //     hash: '#',
  //     title: "Usuario de Cobranza",
  //     options: [],
  //     length: 'h-[0px]'
  //   }
  // ],

  ['Cuenta Personal']: [
    {
      icon: <IdentificationIcon className="h-6 w-6" />,
      hash: 'Centro',
      title: "Centro de notificaciones",
      options: [
        { subtitle: "Control de casos", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestion de auditoria", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Comision", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
        { subtitle: "Informacion personal", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },

      ],
      length: 'h-[0px]'
    }
  ],




  ['Super Admin']: [
    {
      icon: <CircleStackIcon className="h-6 w-6" />,
      hash: 'coleccion',
      title: "Colección de casos",
      options: [
        { subtitle: "Casos de Cobranza", icon: <NumberedListIcon className="h-5 w-5" /> },
        { subtitle: "Incurrir en una estación de trabajo", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Flujo de Clientes", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de cuentas de Colección", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Registro de SMS", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Cobro y valance", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Gestion de aplicaciones", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }

      ],
      length: 'h-[390px]'
    },
    {
      icon: <PresentationChartLineIcon className="h-6 w-6" />,
      hash: 'auditoria',
      title: "Auditoría y control de calidad",
      options: [
        { subtitle: "Registro Histórico", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Monitoreo de Transacciones", icon: <OutlinePresentationChartLineIcon className="h-5 w-5" /> },
        { subtitle: "Control de Cumplimiento", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Auditoria Periodica", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Atención al Cliente", icon: <OutlineUsersIcon className="h-5 w-5" /> }
      ],
      length: 'h-[230px] overflow-auto'
    },
    {
      icon: <DocumentCheckIcon className="h-6 w-6" />,
      hash: 'Verificacion',
      title: "Verificación de Créditos",
      options: [
        { subtitle: "Recolección y Validación de Datos", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Lista final", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[140px]'
    },
    {
      icon: <IdentificationIcon className="h-6 w-6" />,
      hash: 'accesos',
      title: "Gestión de accesos",
      options: [
        { subtitle: "Gestión de RH", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de administradores", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de managers", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de asesores", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de cuentas personales", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
      ],
      length: 'h-[0px]'
    },
    
  ],
  ['Recursos Humanos']: [
    {
      icon: <CircleStackIcon className="h-6 w-6" />,
      hash: 'coleccion',
      title: "Colección de casos",
      options: [
        { subtitle: "Casos de Cobranza", icon: <NumberedListIcon className="h-5 w-5" /> },
        { subtitle: "Distribución de casos", icon: <AdjustmentsHorizontalIcon className="h-5 w-5" /> },
        { subtitle: "Incurrir en una estación de trabajo", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Flujo de Clientes", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
        // { subtitle: "Gestión de cuentas de Colección", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Registro de SMS", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[380px]'
    },
    {
      icon: <PresentationChartLineIcon className="h-6 w-6" />,
      hash: 'auditoria',
      title: "Auditoría y control de calidad",
      options: [
        { subtitle: "Registro Histórico", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Monitoreo de Transacciones", icon: <OutlinePresentationChartLineIcon className="h-5 w-5" /> },
        { subtitle: "Control de Cumplimiento", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Auditoria Periódica", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        
        { subtitle: "Atención al Cliente", icon: <OutlineUsersIcon className="h-5 w-5" /> }
      ],
      length: 'h-[230px] overflow-auto'
    },
    {
      icon: <DocumentCheckIcon className="h-6 w-6" />,
      hash: '#Verificacion',
      title: "Verificación de Créditos",
      options: [
        { subtitle: "Recolección y Validación de Datos", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Lista final", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[100px]'
    },
    {
      icon: <IdentificationIcon className="h-6 w-6" />,
      hash: '#',
      title: "Gestión de accesos",
      options: [
        { subtitle: "Gestión de administradores", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de managers", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de asesores", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
      ],
      length: 'h-[0px]'
    }
  ],
  ['Admin']: [
    {
      icon: <CircleStackIcon className="h-6 w-6" />,
      hash: 'coleccion',
      title: "Colección de casos",
      options: [
        { subtitle: "Casos de Cobranza", icon: <NumberedListIcon className="h-5 w-5" /> },
        { subtitle: "Distribución de casos", icon: <AdjustmentsHorizontalIcon className="h-5 w-5" /> },
        { subtitle: "Incurrir en una estación de trabajo", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Flujo de Clientes", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
        // { subtitle: "Gestión de cuentas de Colección", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Registro de SMS", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[380px]'
    },
    {
      icon: <PresentationChartLineIcon className="h-6 w-6" />,
      hash: 'auditoria',
      title: "Auditoría y control de calidad",
      options: [
        { subtitle: "Registro Histórico", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Monitoreo de Transacciones", icon: <OutlinePresentationChartLineIcon className="h-5 w-5" /> },
        { subtitle: "Control de Cumplimiento", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Auditoria Periódica", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        
        { subtitle: "Atención al Cliente", icon: <OutlineUsersIcon className="h-5 w-5" /> }
      ],
      length: 'h-[230px] overflow-auto'
    },
    {
      icon: <DocumentCheckIcon className="h-6 w-6" />,
      hash: 'Verificacion',
      title: "Verificación de Créditos",
      options: [
        { subtitle: "Recolección y Validación de Datos", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Lista final", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[100px]'
    },
    {
      icon: <IdentificationIcon className="h-6 w-6" />,
      hash: '',
      title: "Gestión de accesos",
      options: [
        { subtitle: "Gestión de managers", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Gestión de asesores", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
      ],
      length: 'h-[0px]'
    }
  ],
  ['Manager de Auditoria']: [

    {
      icon: <PresentationChartLineIcon className="h-6 w-6" />,
      hash: 'auditoria',
      title: "Auditoría y control de calidad",
      options: [
        { subtitle: "Registro Histórico", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Monitoreo de Transacciones", icon: <OutlinePresentationChartLineIcon className="h-5 w-5" /> },
        { subtitle: "Control de Cumplimiento", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Auditoria Periódica", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Atención al Cliente", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Usuarios de Auditoria", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }

      ],
      length: 'h-[230px] overflow-auto'
    },

  ],
  ['Manager de Cobranza']: [

    {
      icon: <CircleStackIcon className="h-6 w-6" />,
      hash: 'coleccion',
      title: "Colección de casos",
      options: [
        { subtitle: "Casos de Cobranza", icon: <NumberedListIcon className="h-5 w-5" /> },
        { subtitle: "Incurrir en una estación de trabajo", icon: <OutlineUsersIcon className="h-5 w-5" /> },
        { subtitle: "Flujo de Clientes", icon: <OutlineUserGroupIcon className="h-5 w-5" /> },
        { subtitle: "Usuarios de Cobranza", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }


      ],
      length: 'h-[50px]'
    }

  ],
  ['Manager de Verificación']: [


    {
      icon: <DocumentCheckIcon className="h-6 w-6" />,
      hash: 'Verificacion',
      title: "Verificación de Créditos",
      options: [
        { subtitle: "Recolección y Validación de Datos", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Lista final", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Usuarios de verificación", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Reporte diario", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Asistencia", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[100px]'
    },

  ],
  ['Asesor de Auditoria']: [

    {
      icon: <PresentationChartLineIcon className="h-6 w-6" />,
      hash: 'auditoria',
      title: "Auditoría y control de calidad",
      options: [
        { subtitle: "Monitoreo de Transacciones", icon: <OutlinePresentationChartLineIcon className="h-5 w-5" /> },
        { subtitle: "Control de Cumplimiento", icon: <OutlineCheckCircleIcon className="h-5 w-5" /> },
        { subtitle: "Auditoria Periódica", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> },
        { subtitle: "Atención al Cliente", icon: <OutlineUsersIcon className="h-5 w-5" /> }
      ],
      length: 'h-[230px] overflow-auto'
    },
  ],
  ['Asesor de Cobranza']: [
    {
      icon: <CircleStackIcon className="h-6 w-6" />,
      hash: 'coleccion',
      title: "Colección de casos",
      options: [
        { subtitle: "Casos de Cobranza", icon: <NumberedListIcon className="h-5 w-5" /> },
      ],
      length: 'h-[50px]'
    }
  ],
  ['Asesor de Verificación']: [
    {
      icon: <DocumentCheckIcon className="h-6 w-6" />,
      hash: 'verificacion',
      title: "Verificación de Créditos",
      options: [
        { subtitle: "Recolección y Validación de Datos", icon: <OutlineDocumentTextIcon className="h-5 w-5" /> },
        { subtitle: "Lista final", icon: <OutlineDocumentCheckIcon className="h-5 w-5" /> }
      ],
      length: 'h-[150px]'
    },
  ],
}









const filtro_1 = [
  'Todo',
  'Fast Cash',
  'Arrow Loan',
  'Eazy Money',
  'Will Cash',
  'Clean Ticket',
]
const rangesArray = [
  'D1(-1,-1)',
  'D2(-2,-2)',
  'D0(0,0)',
  'S1(1,7)',
  'S2(8,15)',
  'S3(16,30)',
  'S4(31,60)',
  'S5(61,999)'
];
const cobrador = [
  'Elige por favor',
  'Por asignar',
  'Mine',
];
const filterCliente = [
  'Por favor elige',
  'Cliente nuevo',
  'Cliente antiguo']

const factura = [
  'No', 'Si', 'Todo'
]

const Jumlah = [
  'Por favor elige',
  '1',
  '2'
]

const estadoRembolso = [
  'Por favor elige',
  'Pagado',
  'No pagado'

]

const estado = ['En verficación', 'Transfiriendo', 'Exitoso', 'Rechazado']


const historial = [
  {
    "descripcionExcepcion": "94830213",
    "apodoUsuario": "X4-zeus-admin2",
    "aplicarCodigo": "XYZ",
    "codigoProducto": "2003",
    "codigoOperacion": "网页使用【Windows NT 10.0; Win64; x64】设备登录，登录IP：192.168.1.1",
    "contenidoOperacion": "true",
    "resultadosOperacion": "true",
    "tiempoOperacion": "2024-08-27 10:23:45"
  },
  {
    "descripcionExcepcion": "50382947",
    "apodoUsuario": "P7-athena-user1",
    "aplicarCodigo": "LMN",
    "codigoProducto": "3002",
    "codigoOperacion": "网页使用【Mac OS X 10_15_7】设备登录，登录IP：172.16.254.1",
    "contenidoOperacion": "false",
    "resultadosOperacion": "false",
    "tiempoOperacion": "2024-08-26 15:40:32"
  },
  {
    "descripcionExcepcion": "19283746",
    "apodoUsuario": "Q1-hades-admin3",
    "aplicarCodigo": "ABC",
    "codigoProducto": "4001",
    "codigoOperacion": "网页使用【Linux x86_64】设备登录，登录IP：203.0.113.42",
    "contenidoOperacion": "true",
    "resultadosOperacion": "true",
    "tiempoOperacion": "2024-08-25 11:15:22"
  },
  {
    "descripcionExcepcion": "38475692",
    "apodoUsuario": "Y9-hermes-user4",
    "aplicarCodigo": "DEF",
    "codigoProducto": "5004",
    "codigoOperacion": "网页使用【Windows NT 10.0; Win64; x64】设备登录，登录IP：198.51.100.1",
    "contenidoOperacion": "false",
    "resultadosOperacion": "false",
    "tiempoOperacion": "2024-08-24 18:52:19"
  },
  {
    "descripcionExcepcion": "20495832",
    "apodoUsuario": "T6-hera-admin5",
    "aplicarCodigo": "GHI",
    "codigoProducto": "6003",
    "codigoOperacion": "网页使用【iPhone; CPU iPhone OS 14_0】设备登录，登录IP：203.0.113.55",
    "contenidoOperacion": "true",
    "resultadosOperacion": "true",
    "tiempoOperacion": "2024-08-23 22:10:08"
  },
  {
    "descripcionExcepcion": "76482903",
    "apodoUsuario": "F5-apollo-user6",
    "aplicarCodigo": "JKL",
    "codigoProducto": "7005",
    "codigoOperacion": "网页使用【Android 11】设备登录，登录IP：192.0.2.25",
    "contenidoOperacion": "true",
    "resultadosOperacion": "true",
    "tiempoOperacion": "2024-08-22 14:36:54"
  },
  {
    "descripcionExcepcion": "39485721",
    "apodoUsuario": "N8-artemis-admin7",
    "aplicarCodigo": "MNO",
    "codigoProducto": "8002",
    "codigoOperacion": "网页使用【Windows NT 10.0; Win64; x64】设备登录，登录IP：198.51.100.42",
    "contenidoOperacion": "false",
    "resultadosOperacion": "false",
    "tiempoOperacion": "2024-08-21 17:05:33"
  },
  {
    "descripcionExcepcion": "58473926",
    "apodoUsuario": "K3-dionysus-user8",
    "aplicarCodigo": "PQR",
    "codigoProducto": "9004",
    "codigoOperacion": "网页使用【Linux x86_64】设备登录，登录IP：203.0.113.77",
    "contenidoOperacion": "true",
    "resultadosOperacion": "true",
    "tiempoOperacion": "2024-08-20 12:47:41"
  },
  {
    "descripcionExcepcion": "29384756",
    "apodoUsuario": "V4-ares-admin9",
    "aplicarCodigo": "STU",
    "codigoProducto": "1001",
    "codigoOperacion": "网页使用【Mac OS X 10_15_7】设备登录，登录IP：192.0.2.30",
    "contenidoOperacion": "false",
    "resultadosOperacion": "false",
    "tiempoOperacion": "2024-08-19 08:29:15"
  },
  {
    "descripcionExcepcion": "48392017",
    "apodoUsuario": "W7-zephyr-user10",
    "aplicarCodigo": "VWX",
    "codigoProducto": "1103",
    "codigoOperacion": "网页使用【Windows NT 10.0; Win64; x64】设备登录，登录IP：198.51.100.75",
    "contenidoOperacion": "true",
    "resultadosOperacion": "true",
    "tiempoOperacion": "2024-08-18 16:12:27"
  }
]

export {
  refunds,
  estado, menuArray,
  filtro_1, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso, historial
}






