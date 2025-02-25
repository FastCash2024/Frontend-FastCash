import { useAppContext } from '@/context/AppContext'
export const encabezadoCasosDeCobranza = () => {
    const { user } = useAppContext();
    return !user?.rol?.includes('Usuario')
        ? [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito (rembolso)", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor Enviado" /*, Importe reembolsable (Rp)*/, "Importe pagado (Rp)",
            "Registro de notas", "Nombre del producto", "Fecha de reembolso",
            "Días Vencidos", "Fecha de cancelación a cuenta", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Nombre de la empresa", "Cuenta Cobrador (Asesor)",
            "Operar"
        ]
        : [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito (rembolso)", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor Enviado"/*"Importe reembolsable (Rp)"*/, "Importe pagado (Rp)",
            "Registro de notas", "nombreDelProducto", "Fecha de reembolso",
            "Días Vencidos", "Fecha de cancelación a cuenta", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Nombre de la empresa", "Operar"
        ];
};

export const encabezadoIncurrirEnUnaEstaciónDeTrabajo = () => [
    "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
    "Estado de credito (rembolso)", "Nombre del cliente", "Número de teléfono móvil",
    "Cliente nuevo", "valor solicitado (Importe adeudado MXN)", "Cantidad dispersada (Importe pagado MXN)", "fecha De Dispersion",
    "Registro de notas", "Nombre Del Producto (Código de producto)", "Fecha de reembolso", "Días Vencidos",
    "Fecha de cancelación a cuenta", "Fecha de creación de la tarea",
    "Fecha de tramitación del caso", "Nombre de la empresa", "Apodo de usuario de cobro",
    "Operar"
];

export const encabezadoGestionDeCuentasDeColección = () => [
    "Seleccionar", "Nombre Personal", "Email Personal", "(Usuario asignado) cuenta", "Origen de la cuenta", "Tipo de grupo",
    "Codificación de roles", "Situación laboral", "Operar"
];

// export const encabezadoGestionDeCuentasDeColección = () => [
//     "Seleccionar", "Cuenta de usuario", "Apodo del usuario", "Codigo del producto", "Codificación de roles",
//     "Tanda Koleksi", "Nombre del rol", "Situación laboral", "Nombre del grupo",
//     "Origen de la cuenta", "Fecha de creación", "Operar"
// ];

export const encabezadoRegistroDeSMS = () => [
    "Seleccionar", "Remitente de sms", "número de teléfono móvil", "Canal de envío",
    "Código de producto", "Contenido", "Fecha de envío", "Estado de envio de SMS"
];

export const encabezadoCobroYValance = () => [
    "Número de préstamo", "ID de sub-factura", "Valor enviado (Liquido)",
    "Valor solicitado (mas interes)", /*"Cantidad recibida"*/, "Nombre del producto", "Número de cuenta",
    "Nombre banco", "Nombre del cliente(Titular de la tarjeta)", "Estado de credito", "operar"
];
export const encabezadoDeAplicaciones = () => ["icon", "Nombre", /*"Valor prestado (mas interes)", "valor Deposito Liquido", "Interes Total","Interes Diario","Valor Prestamo Menos Interes", "Valor Extencion",*/ "Calificacion", "Operar"
];

export const encabezadoDeAplicacion = () => ["nivel de prestamo", "valor Prestado Mas Interes", "Valor Depósito Líquido", "Interés Total", "Interés Diario", "Valor Préstamo Menos Interés", "Valor extencion", "operar"
];

{/* --------------------------------- AUDITORIA DE CREDITOS --------------------------------- */ }

export const encabezadoRegistroHistorico = () => [
    "Seleccionar", "Caso (Descripción de la excepción) [Número de préstamo]", "Asesor (Apodo del usuario) [email asesor]", "Cuenta (Cuenta Personal)",
    "Código de producto", "Operacion (Contenido de la operación)", "Modificacion (Resultados de la operación)",
    "Estado [modificacion]", "Fecha (Tiempo de operación)", "operar"
];

export const encabezadoMonitoreoDeTransacciones = () => [
    "Número de préstamo", "ID de sub-factura", "Valor Solicitado (Cantidad prestada)",
    "Valor Enviado(Cantidad recibida)", "Nombre Del Producto", "Numero De Cuenta (número de tarjeta)", "Nombre Banco (Nombre del banco)",
    "Nombre Del Cliente(Titular de la tarjeta)", "Estado De Credito (Estado final)"
];

export const encabezadoControlDeCumplimiento = () => [
    "cuenta personal auditor", "cuenta operativa auditor [cuenta auditor]", "cuenta personal", "cuenta operativa", "importe multa", "acotacion", "fecha de Operacion","fecha de auditoria",  "operar"
];
{/* <div className=""></div> */}
// [
//     "Seleccionar", "cuentaOperativa", "Apodo de Usuario Cobrador",
//     "DNI del Cobrador", "Casos Asignados al Cobrador", "Reporte", "Telefono", "Operaciones"
// ];

export const encabezadoAuditoriaPeriodica = () => [
    "Seleccionar", "ID auditor", "Nombre del auditor", "Usuario designado",
    "Nombre del operador", "Observación", "Amonestacion", "Valor de multa",
    "Estado de multa", "Fecha de creacion", "Operar"
];
{/* --------------------------------- VERIFICACION DE CREDITOS --------------------------------- */ }
export const encabezadoCasosDeVerificacion = () => {
    const { user } = useAppContext();
    return !user?.rol?.includes('asesor')
        ? [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor solicitado (VS)", "Valor enviado (VE)", "Registro de notas",
            "Nombre del producto", "Fecha de reembolso", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Nombre de la empresa", "Cuenta Verificador (Asesor)",
            "Operar"
        ]
        : [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor solicitado (VS)", "Valor enviado (VE)", "Registro de notas",
            "Nombre del producto", "Fecha de reembolso", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Nombre de la empresa", "Operar"
        ];
};
export const encabezadoListaFinal = () => [
    "Seleccionar", "Numero de Whatsapp *", "Numero de Prestamos", "Estado de Solicitud",
    "Nombre del Cliente", "Numero de Telefono *", "Producto", "Usuario Verificador",
    "Comentario", "Fecha"
];
{/* --------------------------------- GESTION DE ACCESOS --------------------------------- */ }

export const encabezadoGestionDeAccesos = () => [
    "Seleccionar", "Nombre Personal", "Email Personal", "(Usuario asignado) cuenta", "Origen de la cuenta", "Tipo de grupo",
    "Codificación de roles", "Situación laboral", "Operar"
];
export const encabezadoGestionDeAccesosPersonales = () => [
    "Contactos", "Nombre Completo", "Email", "dni", "Numero de Telefono Movil",
    "Operar"
];

export const encabezadoComision = () => [
    "Seleccionar", "segmento", "desde", "hasta", "comision por cobro",
    "Operar"
]




// {/* ---------------------------------COLECCION DE CASOS--------------------------------- */ }
//"Nombre de la empresa", "Apodo de usuario de cobro"
// const encabezadoCasosDeCobranza = !user?.rol?.includes('Usuario')
//     ? [
//         "Contactos",
//         "Seleccionar",
//         "Número de préstamo",
//         "ID de sub-factura",
//         "Estado de reembolso",
//         "Nombre del cliente",
//         "Número de teléfono móvil",
//         "Clientes nuevos",
//         "Importe reembolsable (Rp)",
//         "Importe pagado (Rp)",
//         "Registro de notas",
//         "Nombre del producto",
//         "Fecha de reembolso",
//         "Días Vencidos",
//         "Fecha de cancelación a cuenta",
//         "Fecha de creación de la tarea",
//         "Fecha de tramitación del caso",
//         "Nombre de la empresa",
//         "Apodo de usuario de cobro",
//         "Operar"
//     ]
//     : [
//         "Contactos",
//         "Seleccionar",
//         "Número de préstamo",
//         "ID de sub-factura",
//         "Estado de reembolso",
//         "Nombre del cliente",
//         "Número de teléfono móvil",
//         "Clientes nuevos",
//         "Importe reembolsable (Rp)",
//         "Importe pagado (Rp)",
//         "Registro de notas",
//         "Nombre del producto",
//         "Fecha de reembolso",
//         "Días Vencidos",
//         "Fecha de cancelación a cuenta",
//         "Fecha de creación de la tarea",
//         "Fecha de tramitación del caso",
//         "Nombre de la empresa",
//         "Operar"
//     ];
// const encabezadoIncurrirEnUnaEstaciónDeTrabajo = [
//     "Contactos",
//     "Seleccionar",
//     "Número de préstamo",
//     "ID de sub-factura",
//     "Estado de reembolso",
//     "Nombre del cliente",
//     "Número de teléfono móvil",
//     "Clientes nuevos",
//     "Importe adeudado (MXN)",
//     "Importe pagado (MXN)",
//     "Registro de notas",
//     "Código de producto",
//     "Fecha de reembolso",
//     "Días Vencidos",
//     "Fecha de cancelación a cuenta",
//     "Fecha de creación de la tarea",
//     "Fecha de tramitación del caso",
//     "Nombre de la empresa",
//     "Apodo de usuario de cobro",
//     "Operar"
// ];
// const encabezadoGestionDeCuentasDeColección = [
//     "Cuenta de usuario",
//     "Apodo del usuario",
//     "Codigo del producto",
//     "Codificación de roles",
//     "Tanda Koleksi",
//     "Nombre del rol",
//     "Situación laboral",
//     "Nombre del grupo",
//     "Origen de la cuenta",
//     "Fecha de creación",
//     "Operar"
// ];
// const encabezadoRegistroDeSMS = [
//     "Seleccionar",
//     "Remitente de sms",
//     "número de teléfono móvil",
//     "Canal de envío",
//     "Código de producto",
//     "Contenido",
//     "Fecha de envío",
//     "Estado de envío de SMS",
//     'Estado de llegada por SMS'
// ];
// const encabezadoCobroYValance = [
//     "Seleccionar",
//     "ID de pedido",
//     "ID de préstamo",
//     "Cantidad prestada",
//     "Cantidad recibida",
//     "Código del proyecto",
//     "número de tarjeta",
//     "Nombre del banco",
//     "Titular de la tarjeta",
//     "Estado final"
// ];

// {/* ---------------------------------AUDITORIA Y CONTROL DE CALIDAD--------------------------------- */ }


// const encabezadoRegistroHistorico = [
//     "Descripción de la excepción",
//     "Apodo del usuario",
//     "Código del producto",
//     "Código de operación",
//     "Contenido de la operación",
//     "Resultados de la operación",
//     "Tiempo de operación"
// ];
// const encabezadoMonitoreoDeTransacciones = [
//     "Seleccionar",
//     "ID de pedido",
//     "ID de préstamo",
//     "Cantidad prestada",
//     "Cantidad recibida",
//     "Código del proyecto",
//     "número de tarjeta",
//     "Nombre del banco",
//     "Titular de la tarjeta",
//     "Estado final"
// ];
// const encabezadoControlDeCumplimiento = [
//     "Nombres y apellidos",
//     "Apodo de Usuario Cobrador",
//     "Seleccionar",
//     "DNI del Cobrador",
//     "Casos Asignados al Cobrador",
//     "Reporte",
//     "Telefono",
//     "Operaciones"

// ];
// const encabezadoAuditoriaPeriodica = [
//     "Seleccionar",
//     "ID auditor",
//     "Nombre del auditor",
//     "Usuario designado",
//     "Nombre del operador",
//     "Observación",
//     "Amonestacion",
//     "Valor de multa",
//     "Estado de multa",
//     "Fecha de creacion",
//     "Operar"
// ];

// {/* --------------------------------- VERIFICACION DE CREDITOS--------------------------------- */ }

// const encabezadoCasosDeVerificacion = !user?.rol?.includes('Usuario')
//     ? [
//         "Contactos",
//         "Seleccionar",
//         "Número de préstamo",
//         "ID de sub-factura",
//         "Estado de credito",
//         "Nombre del cliente",
//         "Número de teléfono móvil",
//         "Clientes nuevos",
//         "Valor solicitado (VS)",
//         "Valor enviado (VE)",
//         "Registro de notas",
//         "Nombre del producto",
//         "Fecha de reembolso",
//         "Fecha de creación de la tarea",
//         "Fecha de tramitación del caso",
//         "Nombre de la empresa",
//         "Apodo de usuario de cobro",
//         "Operar"
//     ]
//     : [
//         "Contactos",
//         "Seleccionar",
//         "Número de préstamo",
//         "ID de sub-factura",
//         "Estado de credito",
//         "Nombre del cliente",
//         "Número de teléfono móvil",
//         "Clientes nuevos",
//         "Valor solicitado (VS)",
//         "Valor enviado (VE)",
//         "Registro de notas",
//         "Nombre del producto",
//         "Fecha de reembolso",
//         "Fecha de creación de la tarea",
//         "Fecha de tramitación del caso",
//         "Nombre de la empresa",
//         "Operar"
//     ]
// const encabezadoListaFinal = [
//     "Numero de Whatsapp *",
//     "Seleccionar",
//     "Numero de Prestamos",
//     "Estado de Solicitud",
//     "Nombre del Cliente",
//     "Numero de Telefono *",
//     "Producto",
//     "Usuario Verificador",
//     "Comentario",
//     "Fecha"
// ];

// {/* --------------------------------- GESTION DE ACCESOS--------------------------------- */ }

// const encabezadoGestionDeAccesos = [
//     "Seleccionar",
//     "Nombre completo",
//     "DNI",
//     "Telefono",
//     "Email",
//     "Usuario Asignado",
//     "Rol",
//     "Operaciones"
// ];


// export {
//     encabezadoCasosDeCobranza,
//     encabezadoIncurrirEnUnaEstaciónDeTrabajo,
//     encabezadoGestionDeCuentasDeColección,
//     encabezadoRegistroDeSMS,
//     encabezadoCobroYValance,
//     encabezadoRegistroHistorico,
//     encabezadoMonitoreoDeTransacciones,
//     encabezadoControlDeCumplimiento,
//     encabezadoAuditoriaPeriodica,
//     encabezadoCasosDeVerificacion,
//     encabezadoListaFinal,
//     encabezadoGestionDeAccesos,
// }