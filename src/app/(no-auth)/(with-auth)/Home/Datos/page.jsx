'use client'
import React, { useState, useEffect } from 'react';
import ImageCard from '@/components/ImageCard'
import Link from 'next/link';
import { PhoneIcon, XIcon, DocumentTextIcon, DevicePhoneMobileIcon, StatusOnlineIcon, DevicePhoneIcon, DocumentDuplicateIcon, KeyIcon, ClipboardListIcon, GlobeAltIcon, CheckCircleIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation'
import SelectSimple from '@/components/SelectSimple'
import { useAppContext } from '@/context/AppContext';
import { formatearFecha } from '@/utils';
import { fetchAuditById } from '@/lib';


const PaymentInfoCard = () => {

    const [value, setValue] = useState('Por favor elige')
    const { setModal, setItemSelected, modal } = useAppContext();
    // const [modal, setModal] = useState()
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const caso = searchParams.get('caso')
    const [caseData, setcaseData] = useState(null)
    const [clientData, setClientData] = useState(null)
    const [phone, setPhone] = useState(null)
    const [casesData, setCasesData] = useState([])
    const [audit, setAudit] = useState({});

    useEffect(() => {
        fetchAuditById(caso)
            .then(setAudit)
    }, []);
    const paymentInfo = {
        clientId: 'f5d743b5ed45489798e0c445b030d5a4',
        orderId: '15160932',
        phone: '522201279963',
        rootStatus: null,
        auditors: null,
        productName: 'Buen Crédito',
        requestStatus: 'Pago exitoso',
        applicationTime: '',
        userLevel: 1,
        rejectionReasons: '',
        rejectionType: '',
        appPackageName: 'com.xmdeapp.mxgxlie',
        deviceBrand: 'HUAWEI',
        deviceModel: 'YAL-L21',
        platform: '',
        privateDataAuthorization: null,
        admissionTime: '',
        appChannel: '',
        appVersion: 3,
        isDeviceReplaced: 'NO',
        isEmulator: null,
        channelCode: 'SIP',
        isBlacklisted: 'Sí',
        systemRemarks: 'overdue day more than 5 day'
    };

    const renderValue = (value, defaultValue = 'No disponible') => (value !== null && value !== '' ? value : defaultValue);

    const handleWhatsAppMessage = (phone) => {
        const whatsappUrl = `https://wa.me/${phone}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCall = (phone) => {
        const callUrl = `tel:${phone}`;
        window.location.href = callUrl;
    };
    // Datos de ejemplo
    const data = [
        {
            orderId: '15160932',
            taskId: '5244351',
            orderStatus: 'Pago exitoso',
            refundStatus: 'ovdue0',
            daysOverdue: '253',
            operatorNickname: 'system',
            operate: 'Rechazar',
            operationalStatus: 'Aprobar',
            labelReview: 'Guide suggest pay order',
            record: '2023-12-12 10:13'
        }
        // Puedes agregar más objetos aquí
    ];

    const loanData3 = {
        loanType: '0',
        loanAmount: '1,600',
        repaymentType: '',
        period: '6',
        applicationPurpose: '',
        applicationChannel: '',
        rejectionReason: '',
        serviceCharge: '0',
        interestRate: '0.44',
        observation: '',
        cardNumber: '012792015738860887',
    };

    function handlerCobranza(i) {
        setItemSelected(i);
        setModal("Registrar Cobranza");
    }

    function calcularEdad(fechaNacimiento) {
        // Dividir la fecha en día, mes y año
        const [dia, mes, año] = fechaNacimiento?.split('/').map(Number);

        // Crear un objeto de fecha para la fecha de nacimiento
        const fechaNacimientoDate = new Date(año, mes - 1, dia); // Mes empieza en 0 (enero)

        // Obtener la fecha actual
        const fechaActual = new Date();

        // Calcular la edad
        let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();

        // Ajustar si no ha cumplido años este año
        const mesActual = fechaActual.getMonth();
        const diaActual = fechaActual.getDate();

        if (
            mesActual < fechaNacimientoDate.getMonth() ||
            (mesActual === fechaNacimientoDate.getMonth() && diaActual < fechaNacimientoDate.getDate())
        ) {
            edad--;
        }

        return edad;
    }
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(window?.location?.href.includes('localhost')
                ? `http://localhost:3003/api/loans/verification/${caso}`
                : `https://api.fastcash-mx.com/api/loans/verification/${caso}`)
            const res = await response.json();
            setcaseData(res);
            setPhone(res?.numeroDeTelefonoMovil);

            const phone = res?.numeroDeTelefonoMovil;
            const response2 = await fetch(window?.location?.href.includes('localhost')
                ? `http://localhost:3004/api/authApk/usersApkFromWeb?phoneNumber=${phone}`
                : `https://api.fastcash-mx.com/api/authApk/usersApkFromWeb?phoneNumber=${phone}`)
            const res2 = await response2.json();
            setClientData(res2);

            const response3 = await fetch(window?.location?.href.includes('localhost')
                ? `http://localhost:3003/api/loans/verification/phone?numeroDeTelefonoMovil=${phone}`
                : `https://api.fastcash-mx.com/api/loans/verification/phone?numeroDeTelefonoMovil=${phone}`)
            const res3 = await response3.json();
            setCasesData(res3);
        };

        fetchData();
    }, [])

    console.log("CLientDATA", clientData)
    console.log("photoURL", clientData?.photoURLs?.[0])


    return (
        <div className="mx-auto bg-gray-100 ">
            {/* {
                modal && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal(false)}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-100 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal(false)}
                        >
                            X
                        </button>
                        <h4 className="text-gray-950">Registro de cobro</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className="mr-5 text-[10px]">
                                Estado de credito:
                            </label>
                            <SelectSimple arr={optionsArray} name='Estado de reembolso' click={handlerSelectClick} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg='white' required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className="mr-5 text-[10px]">
                                Registro por:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-100 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>
                        <button type="button" className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal(true)}>Registro de cobro</button>
                    </div>
                </div>
            } */}


            <ul className="flex ">
                <li className="-mb-px mr-1">
                    <Link className={` inline-block border-l border-t border-r py-2 px-4 transition-all rounded-t-[5px] ${seccion === 'info' ? 'text-blue-700 font-semibold bg-white' : 'text-gray-700 font-semibold'}`} href={`?caso=${caso}&seccion=info`}>Información basica</Link>
                </li>
                <li className="mr-1">
                    <Link className={` inline-block border-l border-t border-r py-2 px-4 transition-all rounded-t-[5px]   ${seccion === 'otros' ? 'text-blue-700 font-semibold bg-white' : 'text-gray-700 font-semibold'}`} href={`?caso=${caso}&seccion=otros`}>Otros datos</Link>
                </li>
                <li className="mr-1">
                    <Link className={` inline-block border-l border-t border-r py-2 px-4  transition-all  rounded-t-[5px] ${seccion === 'contactos' ? 'text-blue-700 font-semibold bg-white' : 'text-gray-700 font-semibold'}`} href={`?caso=${caso}&seccion=contactos`}>Contactos</Link>
                </li>
                <li className="mr-1">
                    <Link className={` inline-block border-l border-t border-r py-2 px-4  transition-all  rounded-t-[5px] ${seccion === 'sms' ? 'text-blue-700 font-semibold bg-white' : 'text-gray-700 font-semibold'}`} href={`?caso=${caso}&seccion=sms`}>SMS</Link>
                </li>
                {
                    item === 'Cobranza' &&
                    <li className="mr-1">
                        <button type="button" className="w-full mt-2 text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => handlerCobranza(caseData)} >Registro de cobro</button>
                    </li>
                }

            </ul>
            {seccion === 'info' && <div className={`mx-auto bg-white shadow-lg rounded-b-lg overflow-hidden`}>

                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Información basica</h3>

                    <div className="space-y-2 grid text-gray-950 grid-cols-3">
                        <p><strong>ID de Cliente:</strong> {caseData?._id}</p>
                        <p><strong>ID de Pedido:</strong> {paymentInfo.orderId}</p>
                        <p><strong>Teléfono:</strong> {paymentInfo.phone}</p>
                        <p><strong>Rootear o no:</strong> {paymentInfo.rootStatus !== null ? paymentInfo.rootStatus : 'No disponible'}</p>
                        <p><strong>Auditores:</strong> {paymentInfo.auditors !== null ? paymentInfo.auditors : 'No disponible'}</p>
                        <p><strong>Nombre del Producto:</strong> {paymentInfo.productName}</p>
                        <p><strong>Estado de la Solicitud:</strong> {paymentInfo.requestStatus}</p>
                        <p><strong>Tiempo de Aplicación:</strong> {paymentInfo.applicationTime || 'No disponible'}</p>
                        <p><strong>Nivel de Usuario:</strong> {paymentInfo.userLevel}</p>
                        <p><strong>Razones para el Rechazo del Sistema:</strong> {paymentInfo.rejectionReasons || 'No disponible'}</p>
                        <p><strong>Tipo de Rechazo del Sistema:</strong> {paymentInfo.rejectionType || 'No disponible'}</p>
                        <p><strong>Nombre del Paquete APP:</strong> {paymentInfo.appPackageName}</p>
                        <p><strong>Marca del Dispositivo:</strong> {paymentInfo.deviceBrand}</p>
                        <p><strong>Modelo del Dispositivo:</strong> {paymentInfo.deviceModel}</p>
                        <p><strong>Plataforma Entrante:</strong> {paymentInfo.platform || 'No disponible'}</p>
                        <p><strong>Autorizar Datos Privados:</strong> {paymentInfo.privateDataAuthorization !== null ? paymentInfo.privateDataAuthorization : 'No disponible'}</p>
                        <p><strong>Hora de Admisión:</strong> {paymentInfo.admissionTime || 'No disponible'}</p>
                        <p><strong>Canal de Aplicación:</strong> {paymentInfo.appChannel || 'No disponible'}</p>
                        <p><strong>Número de Versión de la Aplicación:</strong> {paymentInfo.appVersion}</p>
                        <p><strong>¿Se ha Reemplazado el Equipo?:</strong> {paymentInfo.isDeviceReplaced}</p>
                        <p><strong>Si es un Emulador:</strong> {paymentInfo.isEmulator !== null ? paymentInfo.isEmulator : 'No disponible'}</p>
                        <p><strong>Código de Canal:</strong> {paymentInfo.channelCode}</p>
                        <p><strong>Lista Negra:</strong> {paymentInfo.isBlacklisted}</p>
                        <p><strong>Observaciones sobre el Apagón del Sistema:</strong> {paymentInfo.systemRemarks}</p>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Datos personales</h3>
                    <div className="space-y-2 text-gray-950 grid grid-cols-3">
                        <p><strong>Nombre:</strong> {clientData?.nombres} {clientData?.apellidos}</p>
                        <p><strong>Número de Cédula de Identidad:</strong> {clientData?.numeroDeCedulaDeIdentidad}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {clientData?.fechaNacimiento && calcularEdad(clientData.fechaNacimiento)}</p>
                        <p><strong>Genero:</strong> {clientData?.sexo}</p>
                        <p><strong>Estado Civil:</strong>{clientData?.estadoCivil}</p>
                        <p><strong>Provincia/Ciudad:</strong> {clientData?.provinciaCiudad}</p>
                        <p><strong>Nivel Educativo:</strong> {clientData?.nivelEducativo}</p>
                        <p><strong>Número de Tarjeta Bancaria:</strong> {clientData?.numeroDeTarjetaBancari || 'No disponible'}</p>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Información de empleo</h3>
                    <div className="space-y-2 text-gray-950 grid grid-cols-3 gap-4">
                        <p><strong>Trabajo Actual :</strong> {clientData?.trabajo}</p>
                        <p><strong>Ingreso Mensual:</strong> {clientData?.ingreso}</p>
                        <p><strong>Nombre del Banco:</strong> {clientData?.nombreBanco}</p>
                        <p><strong>Tipo de Cuenta:</strong> {clientData?.tipoCuenta}</p>
                        <p><strong>Cantidad de Préstamos:</strong> {clientData?.cantidadPrestamos}</p>
                        <p><strong>Préstamo en Línea?:</strong> {renderValue(clientData?.prestamoEnLinea)}</p>
                        <p><strong>Préstamos Pendientes:</strong> {clientData?.prestamosPendientes}</p>
                    </div>
                </div>

                <div className=" grid grid-cols-3">
                    <div className="p-6">
                        <ImageCard
                            imageUrl={clientData?.photoURLs?.[0]}
                            altText="Descripción de la imagen"
                        />
                    </div>
                    <div className="p-6">
                        <ImageCard
                            imageUrl={clientData?.photoURLs?.[1]}
                            altText="Descripción de la imagen"
                        />
                    </div>
                    <div className="p-6">
                        <ImageCard
                            imageUrl={clientData?.photoURLs?.[2]}
                            altText="Descripción de la imagen"
                        />
                    </div>
                </div>
            </div>}


            {seccion === 'otros' &&
                <>
                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Registro histórico de revisión de aplicaciones</h3>
                    <div className="relative w-[100%] overflow-auto ">

                        {/* <table className="relative divide-y divide-gray-200  ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de pedido</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de tarea</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado del pedido</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de reembolso</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días vencidos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apodo del operador</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado operativo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revisión de etiquetas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de asignación</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de tramitación</th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{item.orderId}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.taskId}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.orderStatus}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.refundStatus}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.daysOverdue}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.operatorNickname}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.operate}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.operationalStatus}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.labelReview}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{ }</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.record}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.record}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                        {console.log("cases", casesData)}

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numero de Prestamo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor (mas interes)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta de Verificador</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de Credito</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de creacion</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de tramitacion</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {casesData.filter(item => item.estadoDeCredito === "Reprobado" || item.estadoDeCredito === "Dispersado").map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{item.numeroDePrestamo}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.nombreDelProducto}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.valorSolicitado} MX</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.cuentaVerificador}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.estadoDeCredito === "Dispersado" ? "Aprobado" : item.estadoDeCredito}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{formatearFecha(item.fechaDeCreacionDeLaTarea)}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{formatearFecha(item.fechaDeTramitacionDelCaso)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Registros de cobro</h3>

                    <table className="w-full  overflow-x-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUENTA OPERATIVA</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMERO DE PRESTÁMO</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGISTRO</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FECHA</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {audit?.acotacionesCobrador?.map((item, index) => (
                                <tr key={index} className='w-full '>
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{audit.cuentaCobrador}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{audit.numeroDePrestamo}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.acotacion}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.fecha}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Información de la tarjeta bancaria</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del banco</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular de la tarjeta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de tarjeta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de verificación</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de adición</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari) && (
                                <tr key={casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).numeroDeCuenta}>
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                        {casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).nombreBanco}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                        {casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).nombreDelCliente}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                        {casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).numeroDeCuenta}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                        {casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).estadoDeCredito}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                        {formatearFecha(casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).fechaDeDispersion)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                        {formatearFecha(casesData.find(item => item.numeroDeCuenta === clientData.numeroDeTarjetaBancari).fechaDeDispersion)}
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Registro de préstamos</h3>
                    <table className="w-full  overflow-x-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de pedido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de préstamo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad prestada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad recibida</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código del proyecto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de tarjeta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del banco</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular de la tarjeta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado final</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {casesData.map((data, index) => (
                                (data.estadoDeCredito === "Dispersado" || data.estadoDeCredito === "Pagado") && <tr key={index}>
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{data.numeroDePrestamo}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.idDeSubFactura}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.cantidadDispersada}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.cantidadDispersada}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.nombreDelProducto}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.numeroDeCuenta}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.nombreBanco}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.nombreDelCliente}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{data.estadoDeCredito}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-xl font-semibold mb-4 text-white bg-gray-900 px-5 py-3">Información sobre el préstamo</h3>

                    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
                        <ul className="space-y-4 grid grid-cols-3 gap-3 place-items-center w-full">


                            <div className="space-y-4  w-full">
                                <li className="">
                                    <span className="font-semibold">Nombre del producto:</span>
                                    <span>{caseData.nombreDelProducto}</span>
                                </li>
                                <li className="">
                                    <span className="font-semibold">Periodo:</span>
                                    <span>7 dias</span>
                                </li>
                                <li className="">
                                    <span className="font-semibold">Estado de credito:</span>
                                    <span>{caseData.estadoDeCredito}</span>
                                </li>
                            </div>
                            <div className="space-y-4  w-full">
                                <li className="">
                                    <span className="font-semibold">Monto de prestamo:</span>
                                    <span>{caseData.valorSolicitado}</span>
                                </li>
                                <li className="">
                                    <span className="font-semibold">Monto liquido de dispersion:</span>
                                    <span>{caseData.valorPrestamoMenosInteres}</span>
                                </li>
                                <li className="">
                                    <span className="font-semibold">Valor de extencion:</span>
                                    <span>{caseData.valorExtension}</span>
                                </li>


                            </div>
                            <div className="space-y-4  w-full">

                                <li className="">
                                    <span className="font-semibold">Tasa de interes:</span>
                                    <span>{caseData.valorPrestamoMenosInteres/7}</span>
                                </li>
                                <li className="">
                                    <span className="font-semibold">Nombre de banco:</span>
                                    <span>{caseData.nombreBanco}</span>
                                </li>
                                <li className="">
                                    <span className="font-semibold">Numero de tarjeta bancaria:</span>
                                    <span>{caseData.numeroDeCuenta}</span>
                                </li>
                            </div>
                        </ul>
                    </div>


                </>}

            {seccion === 'contactos' && <div className={`mx-auto bg-white shadow-lg rounded-b-lg overflow-hidden`}>
                <div className="p-6">
                    {/* <h3 className="text-xl font-semibold mb-4 ">Información de Pago</h3> */}
                    <div className="p-4">
                        <table className="w-full  overflow-x-auto border">
                            <thead>
                                <tr className='text-white bg-gray-900 '>
                                    <th className="py-2 px-4 text-white text-left border-b">Nombre</th>
                                    <th className="py-2 px-4 text-white text-left border-b">Teléfono</th>
                                    <th className="py-2 px-4 text-white text-left border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {caseData?.contactos.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-100 text-gray-950">
                                        <td className="py-2 px-4 border-b">{contact.name}</td>
                                        <td className="py-2 px-4 border-b">{contact.phoneNumber}</td>
                                        <td className="py-2 px-4 border-b flex items-center space-x-2">
                                            <button
                                                onClick={() => handleWhatsAppMessage(contact.phoneNumber)}
                                                className=" text-white px-3 py-1 rounded "
                                                title="Enviar mensaje por WhatsApp"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                                                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleCall(contact.phoneNumber)}
                                                className="bg-blue-500 text-white px-3 py-3 inline rounded hover:bg-blue-600"
                                                title="Llamar"
                                            >
                                                <PhoneIcon className="w-5 h-5 stroke-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>}

            {seccion === 'sms' && <div className={`mx-auto bg-white shadow-lg rounded-b-lg overflow-hidden`}>
                <div className="p-6">
                    {/* <h3 className="text-xl font-semibold mb-4 ">Información de Pago</h3> */}
                    <div className="p-4">
                        <table className="w-full  overflow-x-auto border">
                            <thead>
                                <tr className='text-white bg-gray-900 '>
                                    <th className="py-2 px-4 text-white text-left border-b">Nombre</th>
                                    <th className="py-2 px-4 text-white text-left border-b">Teléfono</th>
                                    {/* <th className="py-2 px-4 text-white text-left border-b">Acciones</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {caseData?.sms.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-100 text-gray-950">
                                        <td className="py-2 px-4 border-b">{contact.sender}</td>
                                        <td className="py-2 px-4 border-b">{contact.body}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default PaymentInfoCard;

