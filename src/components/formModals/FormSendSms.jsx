'use client'
import { postTracking } from '@/app/service/TrackingApi/tracking.service';
import { useAppContext } from '@/context/AppContext.js'
import { getDescripcionDeExcepcion } from '@/utils/utility-tacking';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react'
import {obtenerFechaMexicoISO} from "@/utils/getDates";

const templates = [
    "Plantilla 1: Recordatorio amistoso\nHola, [name]. Te recordamos que el pago de [producto], con vencimiento el [fecha], está pendiente por un valor de [valor_de_pago]. Por favor, realiza tu pago para evitar inconvenientes. Si ya lo hiciste, ¡ignora este mensaje! 😊",
    "Plantilla 2: Aviso de vencimiento próximo\nHola, [name]. Queremos informarte que el pago de [producto] vence el [fecha]. El monto es de [valor_de_pago]. Por favor, realiza tu pago antes de la fecha indicada para mantener todo en orden.",
    "Plantilla 3: Pago vencido\nHola, [name]. El pago de [producto], con vencimiento el [fecha], aún no ha sido registrado. El monto pendiente es de [valor_de_pago]. Por favor, ponte en contacto con nosotros para regularizarlo lo antes posible.",
    "Plantilla 4: Recordatorio firme\n[name], te recordamos que el pago de [producto] por un valor de [valor_de_pago], con vencimiento el [fecha], sigue pendiente. Es necesario que regularices tu situación inmediatamente para evitar acciones adicionales.",
    "Plantilla 5: Última advertencia antes de medidas\nHola, [name]. El pago de [producto] con vencimiento el [fecha] aún no ha sido recibido. El monto pendiente es de [valor_de_pago]. Si no se realiza el pago, tomaremos medidas adicionales.",
    "Plantilla 6: Notificación urgente\n[name], este es un aviso final sobre tu deuda de [producto], vencida desde el [fecha]. El monto de [valor_de_pago] debe ser pagado inmediatamente. De lo contrario, iniciaremos procedimientos de recuperación."
];

const templateIds = [
    "7992bee2",
    "5731a165",
    "fae02113",
    "231bfb0c",
    "5452a72b",
    "a82fda1d"
];

export default function FormSendSms() {

    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setCheckedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [smsText, setSmsText] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('');

    async function sendSmsHandler() {
        const smsData = {
            telefono: destinatario.numeroDeTelefonoMovil,
            message: smsText,
            codigoDeProducto: destinatario.nombreDelProducto,
            remitenteDeSms: userDB.cuenta,
            producto: destinatario.nombreDelProducto
        };

        // Registrar el seguimiento
        const trackingData = {
            descripcionDeExcepcion: getDescripcionDeExcepcion(item),
            subID: destinatario._id,
            cuentaOperadora: userDB.cuenta,
            cuentaPersonal: userDB.emailPersonal,
            codigoDeSistema: destinatario.nombreDelProducto,
            codigoDeOperacion: seccion === 'verificacion' ? '00VE' : '00RE',
            contenidoDeOperacion: `Se ha enviado un sms al caso ${destinatario.numeroDePrestamo}.`,
            fechaDeOperacion: obtenerFechaMexicoISO(),
        };

        try {
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3005/api/notifications/sms/smsSend'
                : 'https://api.fastcash-mx.com/api/notifications/sms/smsSend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(smsData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await response.json();

            await postTracking(trackingData);
            setAlerta('Operación exitosa!')
            setModal('')
            setLoader('')
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')
            console.error('Error:', error);
        }
    }


    function onChangeHandler(e) {
        const value = e.target.value
        setSmsText(value)
    }

    function onTemplateChange(e) {
        const templateIndex = e.target.value;
        setSelectedTemplate(templateIndex);
        const template = templates[templateIndex];

        const templateLines = template.split('\n');
        templateLines.shift();
        const templateWithoutTitle = templateLines.join('\n');
        console.log("template: ", templateWithoutTitle);


        const filledTemplate = templateWithoutTitle
            .replace('[name]', destinatario.nombreDelCliente)
            .replace('[producto]', destinatario.nombreDelProducto)
            .replace('[fecha]', destinatario.fechaDeReembolso)
            .replace('[valor_de_pago]', destinatario.valorEnviado);
        setSmsText(filledTemplate);
    }

    console.log("destinatario: ", destinatario);


    return (
        <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
            <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal('')}
                >
                    X
                </button>

                <h4 className="text-gray-950">Enviar SMS</h4>

                <div className='relative flex flex-col w-full'>
                    <label htmlFor="templateSelect" className="mr-5 text-[10px] pb-2 text-black">
                        Seleccionar Plantilla
                    </label>
                    <select id="templateSelect" className='text-[10px] p-2 w-full focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px] text-black' onChange={onTemplateChange}>
                        {templates.map((template, index) => (
                            <option key={index} value={index}>{template.split('\n')[0]}</option>
                        ))}
                    </select>
                </div>

                <div className='relative flex flex-col w-full'>
                    <label htmlFor="smsContent" className="mr-5 text-[10px] pb-2 text-black">
                        Contenido {smsText.length}/50
                    </label>
                    <textarea id="smsContent" maxLength={50} value={smsText} className='text-[10px] p-2 w-full focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px] text-black' onChange={onChangeHandler}></textarea>
                </div>

                <button type="button" className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center mr-2 mb-2"
                    onClick={sendSmsHandler}>Enviar SMS</button>
            </div>
        </div>
    )
}