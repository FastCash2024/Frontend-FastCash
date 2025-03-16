import React from 'react';
import { useAppContext } from "@/context/AppContext";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
import { getDescripcionDeExcepcion } from "@/utils/utility-tacking";
import { postTracking } from "@/app/service/TrackingApi/tracking.service";
import {obtenerFechaMexicoISO} from "@/utils/getDates";

export default function FormPagado() {
    const {
        user,
        userDB,
        itemSelected,
        setAlerta,
        setModal,
        setLoader,
        theme
    } = useAppContext();
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')

    async function updateCobro() {
        if (!itemSelected || !itemSelected._id) {
            setAlerta("Error: No se encontró el préstamo.");
            return;
        }

        const trackingData = {
            descripcionDeExcepcion: getDescripcionDeExcepcion(itemSelected),
            subID: itemSelected._id,
            cuentaOperadora: userDB.cuenta,
            cuentaPersonal: userDB.emailPersonal,
            codigoDeSistema: itemSelected.nombreDelProducto,
            codigoDeOperacion: seccion === 'verificacion' ? '00VE' : '00RE',
            contenidoDeOperacion: `Se ha registrado el pago para el caso ${itemSelected.numeroDePrestamo}.`,
            fechaDeOperacion: obtenerFechaMexicoISO()
        };

        const updateData = {
            estadoDeCredito: 'Pagado',
            trackingDeOperaciones: [
                ...itemSelected.trackingDeOperaciones,
                trackingData
            ]
        };

        console.log("update Data: ", updateData);

        try {
            setLoader('Guardando...');
            const response = await fetch(
                window?.location?.href.includes('localhost')
                    ? `http://localhost:3003/api/loans/verification/creditoaprobado/${itemSelected._id}`
                    : `https://api.fastcash-mx.com/api/loans/verification/creditoaprobado/${itemSelected._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(updateData),
                }
            );

            console.log("respuesta dispersion: ", response);

            if (!response.ok) {
                setLoader('');
                setAlerta('Error de datos!');
                throw new Error('Registration failed');
            }

            if (response.ok) {
                setAlerta('Operación exitosa!');
                setModal('');
                setLoader('');

                await postTracking(trackingData);
            } else {
                setLoader('');
                setAlerta('Error de datos!');
                throw new Error('Registration failed');
            }
        } catch (error) {
            setLoader('');
            setAlerta('Error de datos!');
            console.error("Error:", error);
        }
    }

    console.log("itemSelected: ", itemSelected);


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
                    <label className="mr-5 text-[11px] text-gray-950">Importe de liquidacion:</label>
                    <Input type="number" defaultVlue={itemSelected?.valorSolicitado} disabled />
                </div>

                {/* Botón para generar y copiar URL */}
                <button
                    type="button"
                    onClick={updateCobro}
                    className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}