'use client'

import Button from "@/components/Button";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

export default function ApplicationPage() {

    const { setModal, setApplication } = useAppContext()
    const searchParams = useSearchParams()
    const application = searchParams.get('application')
    const item = searchParams.get('item')
    const [dataAapplication, setDataAapplication] = useState(null)

    // function handlerApplication(modal, i) {
    //     console.log("aplication tipe selected: ", i);
    //     console.log("aplication tipe selected: ", modal);
        
    //     setModal(modal);
    //     setApplication(i);
    //   }

    const fetchDataApplication = async (id) => {
        try {
            const response = await fetch(window?.location?.href.includes('localhost')
                ? `http://localhost:3000/api/applications/aplicationbyid/${id}`
                : `https://api.fastcash-mx.com/api/applications/aplicationbyid/${id}`)
            const res = await response.json();
            setDataAapplication(res);
        } catch (error) {
            throw new Error("Error al realizar la solicitud:", error);
        }
    }

    useEffect(() => {
        if (item === "application") {
            fetchDataApplication(application)
        }
    }, [item])

    console.log("data Application: ", dataAapplication);

    return (
        <div className="flex h-full w-full justify-center">
            <div className="flex flex-col items-center gap-y-6 w-[90%]">
                {/* Sección de título y botón */}
                <div className="flex items-center gap-x-4 mb-6">
                    <img
                        src={dataAapplication?.icon}
                        alt="app"
                        width={80}
                        height={80}
                        className="ml-4" // Espacio a la izquierda
                    />
                    <p className="text-3xl font-bold text-black">{dataAapplication?.nombre}</p>
                </div>

                <div className="pt-3 w-2/3 flex justify-center">
                    <Button type="button" theme="Success" className="w-[50%]">
                        Añadir Aplicación
                    </Button>
                </div>

                {/* Tabla con encabezados */}
                <div className="w-[100%] mt-6 overflow-x-auto">
                    <table className="w-full bg-white border-collapse">
                        {/* Encabezado */}
                        <thead className="bg-[#e0e0e0] text-[10px] uppercase sticky top-[0px]">
                            <tr className="text-gray-700 min-w-[2500px] text-left text-sm border-y ">
                                <th className="p-3 border border-[#e6e6e6] ">Valor Prestado (más interés)</th>
                                <th className="p-3 border border-[#e6e6e6] ">Valor Depósito Líquido</th>
                                <th className="p-3 border border-[#e6e6e6] ">Interés Total</th>
                                <th className="p-3 border border-[#e6e6e6] ">Interés Diario</th>
                                <th className="p-3 border border-[#e6e6e6] ">Valor Préstamo Menos Interés</th>
                                <th className="p-3 border border-[#e6e6e6] ">Valor Extensión</th>
                                <th className="p-3 border border-[#e6e6e6] ">Operacio</th>
                            </tr>
                        </thead>

                        {/* Cuerpo de la tabla */}
                        <tbody className="bg-white text-black">
                            {dataAapplication?.tipos.map((tipo, index) => (
                                <tr key={index} className="border border-[#e6e6e6] text-[12px] border-b">
                                    <td className="px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">{tipo.valorPrestadoMasInteres}</td>
                                    <td className="px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">{tipo.valorDepositoLiquido}</td>
                                    <td className="px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">{tipo.interesTotal}</td>
                                    <td className="px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">{tipo.interesDiario}</td>
                                    <td className="px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">{tipo.valorPrestamoMenosInteres}</td>
                                    <td className="px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">{tipo.valorExtencion}</td>
                                    <td className="p-3 flex gap-x-2 px-3 py-2 text-[12px] border border-[#e6e6e6] text-black">
                                        {/* <button
                                            onClick={() => handlerApplication("Modal Agregar Tipo Aplicaion", tipo)}
                                            className="w-full max-w-[70px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-[10px] px-5 py-2 text-center"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handlerApplication("Eliminar aplicacion", tipo)}
                                            className="w-full max-w-[70px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-[10px] px-5 py-1.5 text-center"
                                        >
                                            Eliminar
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}