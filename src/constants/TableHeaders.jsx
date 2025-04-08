import { useAppContext } from '@/context/AppContext'
export const encabezadoCasosDeCobranza = () => {
    const { user } = useAppContext();
    return !user?.rol?.includes('Usuario')
        ? [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor Enviado", "Importe pagado (Rp)", "Nombre del producto",
            "Días Vencidos", "Fecha de creación de la tarea", "Fecha de tramitación del caso",
            "fecha de tramitacion de cobro", "Fecha de cobro", "Fecha de reembolso", "Nombre de la empresa", "Cuenta Cobrador (Asesor)",
            "Operar"
        ]
        : [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor Enviado", "Importe pagado (Rp)",
            "nombreDelProducto", "Fecha de reembolso",
            "Días Vencidos", "fecha de tramitacion de cobro", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Nombre de la empresa", "Operar"
        ];
};

export const encabezadoIncurrirEnUnaEstaciónDeTrabajo = () => [
    "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
    "Estado de credito", "Nombre del cliente", "Número de teléfono móvil",
    "Cliente nuevo", "valor solicitado (Importe adeudado MXN)", "Cantidad dispersada (Importe pagado MXN)",
    "Nombre Del Producto (Código de producto)", "Días Vencidos", "Fecha de creación de la tarea",  "fecha De Dispersion", "Fecha de tramitación del caso",
    "fecha de tramitacion de cobro", "Fecha de cobro", "Fecha de reembolso", "Nombre de la empresa",
    "Operar"
];

export const encabezadoGestionDeCuentasDeColección = () => [
    "Seleccionar", "Nombre Personal", "Email Personal", "(Usuario asignado) cuenta", "Origen de la cuenta", "Tipo de grupo",
    "Codificación de roles", "Situación laboral", "Operar"
];

export const encabezadoRegistroDeSMS = () => [
    "Remitente de sms", "número de teléfono móvil", "Canal de envío",
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
    "descripcion de excepcion", "cuenta operadora", "cuenta personal", "codigo de sistema",
    "codigo de operacion", "contenido de operacion", "fecha de operacion"
];

export const encabezadoMonitoreoDeTransacciones = () => [
    "Número de préstamo", "ID de sub-factura", "Valor Solicitado (Cantidad prestada)",
    "Valor Enviado(Cantidad recibida)", "Nombre Del Producto", "Numero De Cuenta (número de tarjeta)", "Nombre Banco (Nombre del banco)",
    "Nombre Del Cliente(Titular de la tarjeta)", "Estado De Credito (Estado final)", "fecha de operación [fecha de reembolso]"
];

export const encabezadoControlDeCumplimiento = () => [
    "cuenta personal auditor", "cuenta operativa auditor [cuenta auditor]", "cuenta personal", "cuenta operativa", "importe multa", "acotacion", "fecha de Operacion", "fecha de auditoria", "operar"
];

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
            "Cliente nuevo", "Valor solicitado (VS)", "Valor enviado (VE)",
            "Nombre del producto", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Fecha de reembolso", "Nombre de la empresa", "Cuenta Verificador (Asesor)",
            "Operar"
        ]
        : [
            "Seleccionar", "Contactos", "Número de préstamo", "ID de sub-factura",
            "Estado de credito", "Nombre del cliente", "Número de teléfono móvil",
            "Cliente nuevo", "Valor solicitado (VS)", "Valor enviado (VE)",
            "Nombre del producto", "Fecha de creación de la tarea",
            "Fecha de tramitación del caso", "Fecha de reembolso", "Nombre de la empresa", "Operar"
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


