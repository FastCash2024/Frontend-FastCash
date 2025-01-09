const encabezadoCasosDeCobranza = !user?.rol?.includes('Usuario')
    ? [
        "Contactos",
        "Seleccionar",
        "Número de préstamo",
        "Id de sub-factura",
        "Estado de reembolso",
        "Nombre del cliente",
        "Número de teléfono móvil",
        "Clientes nuevos",
        "Importe reembolsable (Rp)",
        "Importe pagado (Rp)",
        "Registro de notas",
        "Nombre del producto",
        "Fecha de reembolso",
        "Días VencIdos",
        "Fecha de cancelación a cuenta",
        "Fecha de creación de la tarea",
        "Fecha de tramitación del caso",
        "Nombre de la empresa",
        "Apodo de usuario de cobro",
        "Operar"
    ]
    : [
        "Contactos",
        "Seleccionar",
        "Número de préstamo",
        "Id de sub-factura",
        "Estado de reembolso",
        "Nombre del cliente",
        "Número de teléfono móvil",
        "Clientes nuevos",
        "Importe reembolsable (Rp)",
        "Importe pagado (Rp)",
        "Registro de notas",
        "Nombre del producto",
        "Fecha de reembolso",
        "Días VencIdos",
        "Fecha de cancelación a cuenta",
        "Fecha de creación de la tarea",
        "Fecha de tramitación del caso",
        "Nombre de la empresa",
        "Operar"
    ]
    ;
const encabezadoIncurrirEnUnaEstaciónDeTrabajo = [
    "Contactos",
    "Seleccionar",
    "Número de préstamo",
    "Id de sub-factura",
    "Estado de reembolso",
    "Nombre del cliente",
    "Número de teléfono móvil",
    "Clientes nuevos",
    "Importe adeudado (MXN)",
    "Importe pagado (MXN)",
    "Registro de notas",
    "Código de producto",
    "Fecha de reembolso",
    "Días VencIdos",
    "Fecha de cancelación a cuenta",
    "Fecha de creación de la tarea",
    "Fecha de tramitación del caso",
    "Nombre de la empresa",
    "Apodo de usuario de cobro",
    "Operar"
];
const encabezadoGestionDeCuentasDeColección = [
    "Cuenta de usuario",
    "Apodo del usuario",
    "Codigo del producto",
    "Codificación de roles",
    "Tanda Koleksi",
    "Nombre del rol",
    "Situación laboral",
    "Nombre del grupo",
    "Origen de la cuenta",
    "Fecha de creación",
    "Operar"
];
const encabezadoCasosDeVerificacion = !user?.rol?.includes('Usuario')
    ? [
        "Contactos",
        "Seleccionar",
        "Número de préstamo",
        "Id de sub-factura",
        "Estado de credito",
        "Nombre del cliente",
        "Número de teléfono móvil",
        "Clientes nuevos",
        "Valor solicitado (VS)",
        "Valor enviado (VE)",
        "Registro de notas",
        "Nombre del producto",
        "Fecha de reembolso",
        "Fecha de creación de la tarea",
        "Fecha de tramitación del caso",
        "Nombre de la empresa",
        "Apodo de usuario de cobro",
        "Operar"
    ]
    : [
        "Contactos",
        "Seleccionar",
        "Número de préstamo",
        "Id de sub-factura",
        "Estado de credito",
        "Nombre del cliente",
        "Número de teléfono móvil",
        "Clientes nuevos",
        "Valor solicitado (VS)",
        "Valor enviado (VE)",
        "Registro de notas",
        "Nombre del producto",
        "Fecha de reembolso",
        "Fecha de creación de la tarea",
        "Fecha de tramitación del caso",
        "Nombre de la empresa",
        "Operar"
    ]


    ;
const encabezadoListaFinal = [
    "Numero de Whatsapp *",
    "Seleccionar",
    "Numero de Prestamos",
    "Estado de Solicitud",
    "Nombre del Cliente",
    "Numero de Telefono *",
    "Producto",
    "Usuario Verificador",
    "Comentario",
    "Fecha"
];
const encabezadoResgistroDeUsuarios = [
    "Nombres y apellIdos",
    "Apodo de Usuario Cobrador",
    "Seleccionar",
    "DNI del Cobrador",
    "Casos Asignados al Cobrador",
    "Reporte",
    "Telefono",
    "Operaciones"

];
const encabezadoUsuarios = [
    "Seleccionar",
    "Nombre completo",
    "DNI",
    "Telefono",
    "Email",
    "Usuario Asignado",
    "Operaciones"

];

const encabezadoAccesos = [
    "Seleccionar",
    "Nombre Personal",
    "Email Personal",
    // "DNI",
    // "Telefono",
    "Usuario Asignado",
    "Rol",
    "Estado de cuenta",
    "Operaciones"
]
const gestionDeRoles = {
    ['Manager de Auditoria']: ['Asesor de Auditoria'],
    ['Admin']: ['Manager de Auditoria', 'Manager de Cobranza', 'Manager de Verificación', 'Asesor de Auditoria', 'Asesor de Cobranza', 'Asesor de Verificación'],
    ['Recursos Humanos']: ['Admin', 'Manager de Auditoria', 'Manager de Cobranza', 'Manager de Verificación', 'Asesor de Auditoria', 'Asesor de Cobranza', 'Asesor de Verificación'],
    ['Super Admin']: ['RH', 'Admin', 'Manager de Auditoria', 'Manager de Cobranza', 'Manager de Verificación', 'Asesor de Auditoria', 'Asesor de Cobranza', 'Asesor de Verificación']
}


