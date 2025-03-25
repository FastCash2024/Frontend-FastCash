"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { getBackgroundClass } from "@/utils/colors";

export default function FormTimeEntry() {
    const { setAlerta, setLoader, setModal } = useAppContext();
    const [data, setData] = useState({
        horaEntrada: "",
        estadosDeAsistencia: [
            { rango: "No definido", estado: "Operando" },
            { rango: "No definido", estado: "Atraso-1" },
            { rango: "No definido", estado: "Atraso-2" },
            { rango: "No definido", estado: "Falta" }
        ]
    });

    function onChangeHandler(e) {
        const horaEntrada = e.target.value;
        setData({ ...data, horaEntrada });
        calcularEstadosDeAsistencia(horaEntrada);
    }

    function calcularEstadosDeAsistencia(horaEntrada) {
        const [hora, minuto] = horaEntrada.split(":").map(Number);
        const entrada = hora * 60 + minuto;
        const salida = entrada + 8 * 60; // 8 horas después de la entrada

        const estados = [
            { rango: `${formatTime(entrada)}-${formatTime(entrada + 14)}`, estado: "Operando" },
            { rango: `${formatTime(entrada + 15)}-${formatTime(entrada + 20)}`, estado: "Atraso-1" },
            { rango: `${formatTime(entrada + 21)}-${formatTime(entrada + 25)}`, estado: "Atraso-2" },
            { rango: `${formatTime(entrada + 26)}-${formatTime(salida)}`, estado: "Falta" }
        ];

        setData(prevData => ({
            ...prevData,
            estadosDeAsistencia: estados
        }));
    }

    function formatTime(minutes) {
        const h = Math.floor(minutes / 60) % 24; // Ajustar para que no exceda 24 horas
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    // Función para registrar la hora de entrada
    async function updateHour() {
        if (!data.horaEntrada) {
            setAlerta("Falta hora de entrada!");
            return;
        }

        const requestData = {
            horaEntrada: data.horaEntrada,
            estadosDeAsistencia: data.estadosDeAsistencia
        };

        console.log("requestData: ", requestData);

        try {
            setLoader("Guardando...");

            const response = await fetch(window?.location?.href.includes("localhost")
                ? `http://localhost:3006/api/users/entryhour/register`
                : `https://api.fastcash-mx.com/api/users/entryhour/register`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });


            console.log("responseHour: ", response);

            if (!response.ok) {
                setLoader("");
                setAlerta("Error al registrar la hora de entrada");
            }

            setAlerta("Hora de entrada registrada correctamente!");
            setModal("");
            setLoader("");
        } catch (error) {
            setLoader("");
            setAlerta("Hubo un error al registrar la hora de entrada.");
            console.error("Error al registrar la hora de entrada:", error);
        }
    }

    return (
        <div
            className="fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50"
            onClick={() => setModal(false)}
        >
            <div
                className="relative flex flex-col items-center justify-center bg-gray-100 w-[400px] h-[400px] p-5 space-y-5 rounded-[5px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal(false)}
                >
                    X
                </button>
                <h4 className="text-gray-950">Hora de Entrada</h4>

                <div className="relative flex justify-between w-[300px] text-gray-950">
                    <label htmlFor="horaEntrada" className="mr-5 text-[10px]">
                        Hora de Entrada:{" "}
                    </label>
                    <input
                        type="time"
                        name="horaEntrada"
                        value={data.horaEntrada || ""}
                        onChange={onChangeHandler}
                        className="text-[10px] p-2 w-[200px] focus:outline-none bg-gray-100 border-[1px] border-gray-300 rounded-[5px]"
                        required
                    />
                </div>
                <div className="relative flex flex-col w-[300px] text-gray-950">
                    {data.estadosDeAsistencia.map((estado, index) => (
                        <p key={index} className={`p-2 ${getBackgroundClass(estado.estado)}`}>
                            {estado.rango}: {estado.estado}
                        </p>
                    ))}
                </div>

                <button
                    type="button"
                    className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center"
                    onClick={updateHour}
                >
                    Registrar Hora de Entrada
                </button>
            </div>
        </div>
    );
}