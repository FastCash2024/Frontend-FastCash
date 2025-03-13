"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import SelectSimple from "@/components/SelectSimple";
import { postTracking } from "@/app/service/TrackingApi/tracking.service";
import { getDescripcionDeExcepcion } from "@/utils/utility-tacking";
import { useSearchParams } from "next/navigation";
import { getLocalISOString } from "@/utils/getDates";

const optionsArray = [
    "Por favor elige",
    "Sin contactar",
    "No contactable",
    "Contactado",
    "Propósito de retrasar",
    "Propósito de pagar",
    "Promete a pagar",
    "Pagará pronto",
];

export default function FormAddCobranza() {
    const {
        user,
        userDB,
        itemSelected,
        setAlerta,
        setModal,
        setLoader,
    } = useAppContext();
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [data, setData] = useState({});
    const [value, setValue] = useState("Por favor elige");

    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    function handlerSelectClick(name, i, uuid) {
        setValue(i);
        setData((prevData) => ({
            ...prevData,
            estadoDeCredito: i,
        }));
    }

    async function updateCobro() {
        if (!data.acotacionCobrador) {
            setAlerta("Falta acotación!");
            return;
        }
        if (value === "Por favor elige") {
            setAlerta("Falta estado de verificación!");
            return;
        }

        const nuevasAcotaciones = [...(itemSelected?.acotacionesCobrador || [])];
        nuevasAcotaciones.push({
            acotacion: data.acotacionCobrador,
            cuenta: userDB.cuenta,
            asesor: user.nombreCompleto,
            emailAsesor: user.email,
            fecha: getLocalISOString(),
        });

        console.log("nuevas acotaciones: ", nuevasAcotaciones);

        const upadateData = {
            fechaRegistroComunicacion: getLocalISOString(),
            estadoDeComunicacion: value,
            acotacionesCobrador: nuevasAcotaciones
        };
        console.log("update data: ", upadateData);

        try {
            setLoader("Guardando...");
            const response = await fetch(
                window?.location?.href.includes("localhost")
                    ? `http://localhost:3003/api/loans/verification/${itemSelected._id}`
                    : `https://api.fastcash-mx.com/api/loans/verification/${itemSelected._id}`,
                {
                    method: "PUT", // El método es PUT para actualizar
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Si estás usando JWT
                    },
                    body: JSON.stringify(upadateData), // Los datos que queremos actualizar
                }
            );

            // console.log("response cobrador: ", response.ok, response.status);

            // Verificar si la respuesta es exitosa
            if (response.ok) {
                // console.log("response ok: ", response);

                setAlerta("Operación exitosa!");
                setModal("");
                setLoader("");

                // Registrar el seguimiento
                const trackingData = {
                    descripcionDeExcepcion: getDescripcionDeExcepcion(item),
                    subID: itemSelected._id,
                    cuentaOperadora: userDB.cuenta,
                    cuentaPersonal: userDB.emailPersonal,
                    codigoDeSistema: itemSelected.nombreDelProducto,
                    codigoDeOperacion: seccion === 'verificacion' ? '00VE' : '00RE',
                    contenidoDeOperacion: `Se ha enviado un sms al caso ${itemSelected.numeroDePrestamo}.`,
                    fechaDeOperacion: new Date().toISOString(),
                };

                await postTracking(trackingData);
                // console.log("resp cobrador tacking: ", resp);

            }
        } catch (error) {
            setLoader("");
            setAlerta("Error de datos!");
            console.error("Error:", error); // Agregar un log para el error
        }
    }

    return (
        <div
            className="fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50"
            onClick={() => setModal(false)}
        >
            <div
                className="relative flex flex-col items-center justify-center bg-gray-100 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal(false)}
                >
                    X
                </button>
                <h4 className="text-gray-950">Registro de cobro</h4>
                <div className="relative flex justify-between w-[300px] text-gray-950">
                    <label htmlFor="" className="mr-5 text-[10px]">
                        Estado de reembolso:{" "}
                    </label>
                    <SelectSimple
                        arr={optionsArray}
                        name="estadodeReembolso"
                        click={handlerSelectClick}
                        defaultValue={value}
                        uuid="123"
                        label="Filtro 1"
                        position="absolute left-0 top-[25px]"
                        bg="white"
                        required
                    />
                </div>
                <div className="relative flex justify-between w-[300px] text-gray-950">
                    <label htmlFor="" className="mr-5 text-[10px]">
                        Registro por:
                    </label>
                    <textarea
                        name="acotacionCobrador"
                        className="text-[10px] p-2 w-[200px] focus:outline-none bg-gray-100 border-[1px] border-gray-300 rounded-[5px]" onChange={onChangeHandler}
                    ></textarea>
                </div>
                <button
                    type="button"
                    className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                    onClick={updateCobro}
                >
                    Registrar
                </button>
            </div>
        </div>
    );
}
