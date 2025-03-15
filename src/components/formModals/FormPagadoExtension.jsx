import React from 'react'
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Input from "@/components/Input";
import CryptoJS from "crypto-js";
import { useSearchParams } from "next/navigation";
import { getDescripcionDeExcepcion } from "@/utils/utility-tacking";
import { postTracking } from "@/app/service/TrackingApi/tracking.service";

export default function FormPagadoExtension() {
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
    const [valorDiasDeProrroga, setDiasDeProrroga] = useState("7");

    async function updateCobroExtencion() {
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
            fechaDeOperacion: new Date().toISOString()
        };

        const updateData = {
            estadoDeCredito: 'Pagado con Extensión'
        };

        // Crear una copia del objeto itemSelected y eliminar el campo _id
        const { _id, ...newCreditData } = {
            ...itemSelected,
            estadoDeCredito: 'Dispersado',
            fechaDeReembolso: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
        };

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
                const newCreditResponse = await fetch(
                    window?.location?.href.includes('localhost')
                        ? `http://localhost:3003/api/loans/verification/add`
                        : `https://api.fastcash-mx.com/api/loans/verification/add`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify(newCreditData),
                    }
                );

                if (!newCreditResponse.ok) {
                    setLoader('');
                    setAlerta('Error al duplicar el crédito!');
                    throw new Error('Duplication failed');
                }

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
                <h4 className="text-gray-950">Extension</h4>

                {/* Numero de prestamo */}
                <div className="flex justify-between items-center w-[100%]">
                    <label
                        htmlFor="cantidadAsignacionIgualitaria"
                        className={`mr-5 text-[11px] ${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-gray-950`}
                    >
                        Numero de prestamo:
                    </label>
                    <Input
                        type="number"
                        name="cantidadAsignacionIgualitaria"
                        value={itemSelected.numeroDePrestamo}
                        disabled
                        uuid="123"
                        required
                    />
                </div>
                <div className="flex justify-between items-center w-[100%]">
                    <label
                        htmlFor="cantidadAsignacionIgualitaria"
                        className={`mr-5 text-[11px] ${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-gray-950`}
                    >
                        Importe adeudado:
                    </label>
                    <span className="text-[10px] p-3 w-[173px] bg-yellow-500 text-gray-950 rounded-[5px]">
                        {itemSelected?.valorSolicitado || "N/A"}
                    </span>
                </div>

                {/* Tarifa de prolongación */}
                <div className="flex justify-between items-center w-[100%]">
                    <label
                        htmlFor="cantidadAsignacionIgualitaria"
                        className={`mr-5 text-[11px] ${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-gray-950`}
                    >
                        Importe de extensión:
                    </label>
                    <Input
                        type="number"
                        name="cantidadAsignacionIgualitaria"
                        defaultVlue={itemSelected.valorExtencion}
                        disabled
                        uuid="123"
                        required
                    />
                </div>

                {/* Días de prórroga */}
                <div className="flex justify-between items-center w-[100%]">
                    <label
                        htmlFor="cantidadAsignacionIgualitaria"
                        className={`mr-5 text-[11px] ${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-gray-950`}
                    >
                        Días de prórroga:
                    </label>
                    <Input
                        type="number"
                        name="cantidadAsignacionIgualitaria"
                        value={valorDiasDeProrroga}
                        disabled
                        uuid="123"
                        required
                    />
                </div>

                <button
                    type="button"
                    onClick={updateCobroExtencion}
                    className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}    