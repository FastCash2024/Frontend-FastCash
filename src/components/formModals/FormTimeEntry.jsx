"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function FormTymeEntry() {
    const { setAlerta, setLoader, setModal } = useAppContext();
    const [data, setData] = useState({
        horaEntrada: "",
    });

    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    // Función para registrar la hora de entrada
    async function updateHour() {
        if (!data.horaEntrada) {
            setAlerta("Falta hora de entrada!");
            return;
        }

        const requestData = {
            horaEntrada: data.horaEntrada,
        };

        console.log("requestData: ", requestData);
        

        try {
            setLoader("Guardando...");

            const response = await fetch(window?.location?.href.includes("localhost")
                ? `http://localhost:3000/api/entryhour/register`
                : `https://api.fastcash-mx.com/api/entryhour/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });

          
            console.log("response: ", response);
            
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
                className="relative flex flex-col items-center justify-center bg-gray-100 w-[400px] h-[200px] p-5 space-y-5 rounded-[5px]"
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
