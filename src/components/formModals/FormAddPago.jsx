"use client";

import { useAppContext } from "@/context/AppContext";
import Input from "@/components/Input";
import CryptoJS from "crypto-js";
import { getDescripcionDeExcepcion } from "@/utils/utility-tacking";
import { useSearchParams } from "next/navigation";
import { postTracking } from "@/app/service/TrackingApi/tracking.service";
import {obtenerFechaMexicoISO} from "@/utils/getDates";

const SECRET_KEY = "mi-clave-segura";

export default function FormAddPago() {
    const {
        userDB,
        itemSelected,
        setAlerta,
        setModal,
        setLoader
    } = useAppContext();
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')

    async function generateAndCopyURL() {
        if (!itemSelected || !itemSelected._id) {
            setAlerta("Error: No se encontró el préstamo.");
            return;
        }

        const tackingData = {
            descripcionDeExcepcion: getDescripcionDeExcepcion(item),
            subID: itemSelected._id,
            cuentaOperadora: userDB.cuenta,
            cuentaPersonal: userDB.emailPersonal,
            codigoDeSistema: itemSelected.nombreDelProducto,
            codigoDeOperacion: seccion === 'verificacion' ? '00VE' : '00RE',
            contenidoDeOperacion: `se ha generado una linea de pago para el caso ${itemSelected.numeroDePrestamo}.`,
            fechaDeOperacion: obtenerFechaMexicoISO()
        }

        setLoader('Guardando...');
        const encryptedId = CryptoJS.AES.encrypt(itemSelected._id, SECRET_KEY).toString();
        const encodedId = encodeURIComponent(encryptedId);

        const generatedURL = window?.location?.href.includes('localhost')
            ? `https://liga.fastcash-mx.com/pay?caso=${encodedId}&seccion=payment&item=data`
            : `https://liga.fastcash-mx.com/pay?caso=${encodedId}&seccion=payment&item=data`;

        navigator.clipboard.writeText(generatedURL)
            .then(() => setAlerta("¡Enlace copiado al portapapeles!"))
            .catch(() => setAlerta("Error al copiar el enlace"));

        await postTracking(tackingData);

        setAlerta('Operación exitosa!')
        setModal('')
        setLoader('')
    }

    return (
        <div
            className="fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50"
            onClick={() => setModal(false)}
        >
            <div
                className="relative flex flex-col items-center justify-center bg-gray-100 w-[450px] h-[400px] p-5 space-y-5 rounded-[5px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal(false)}
                >
                    X
                </button>
                <h4 className="text-gray-950">Pago</h4>

                {/* Numero de prestamo */}
                <div className="flex justify-between items-center w-[100%]">
                    <label className="mr-5 text-[11px] text-gray-950">Numero de préstamo:</label>
                    <Input type="number" value={itemSelected.numeroDePrestamo} disabled />
                </div>

                {/* Reembolso Completo */}
                <div className="flex justify-between items-center w-[100%]">
                    <label className="mr-5 text-[11px] text-gray-950">Reembolso Completo:</label>
                    <span className="text-[10px] p-3 w-[173px] bg-yellow-500 text-gray-950 rounded-[5px]">
                        {itemSelected?.valorSolicitado || "N/A"}
                    </span>
                </div>

                {/* Importe Adeudado */}
                <div className="flex justify-between items-center w-[100%]">
                    <label className="mr-5 text-[11px] text-gray-950">Importe Adeudado:</label>
                    <Input type="number" value={itemSelected?.valorSolicitado} disabled />
                </div>

                {/* Botón para generar y copiar URL */}
                <button
                    type="button"
                    onClick={generateAndCopyURL}
                    className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}