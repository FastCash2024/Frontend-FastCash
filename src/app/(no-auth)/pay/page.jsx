"use client";

import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/utils/getDates";

const SECRET_KEY = "mi-clave-segura";

export default function PayPage() {
    const [itemData, setItemData] = useState(null);
    const [copied, setCopied] = useState(false);
    const searchParams = useSearchParams();
    const seccion = searchParams.get('seccion');
    const item = searchParams.get('item');
    const caso = searchParams.get('caso');
    const [id, setId] = useState(null);

    useEffect(() => {
        if (caso) {
            try {
                // Desencriptar el ID
                const bytes = CryptoJS.AES.decrypt(decodeURIComponent(caso), SECRET_KEY);
                const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
                setId(decryptedId);
            } catch (error) {
                console.error("Error al desencriptar:", error);
            }
        }
    }, [caso]);

    console.log("id caso: ", id);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(window?.location?.href.includes('localhost')
                ? `http://localhost:3003/api/loans/verification/${id}`
                : `https://api.fastcash-mx.com/api/loans/verification/${id}`)
            const res = await response.json();
            setItemData(res);
        };
        fetchData()
    }, [id, searchParams]);

    console.log("item caso: ", itemData);

    const maskName = (name) => {
        if (!name || name.length < 3) return name;
        const firstPart = name.slice(0, 3);
        const lastPart = name.slice(-3);
        const maskedPart = "*".repeat(name.length - 6);
        return name.length > 6 ? `${firstPart}${maskedPart}${lastPart}` : `${firstPart}***`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(itemData?.idDeSubFactura);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Error al copiar:", error);
        }
    };

    const getVencimientoStatus = (fechaVencimiento) => {
        if (!fechaVencimiento) return null;

        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diferenciaDias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

        if (diferenciaDias > 1) {
            return { texto: `Vencerá en ${diferenciaDias} días`, color: "text-blue-600" };
        } else if (diferenciaDias === 1) {
            return { texto: "Vencerá en 1 día", color: "text-blue-600" };
        } else if (diferenciaDias === 0) {
            return { texto: "Vence hoy", color: "text-red-600 font-bold" };
        } else {
            return { texto: "Vencido", color: "text-gray-600" };
        }
    };

    const vencimiento = getVencimientoStatus(itemData?.fechaDeReembolso);


    return (
        <div className="bg-gradient-to-b from-blue-500 to-white min-h-screen w-full flex justify-center items-center">
            {(seccion?.toLowerCase() === "payment" ||
                seccion?.toLowerCase() === "extension") &&
                item === "data" ? (
                <div className="w-[24%] mx-auto m-4 bg-white shadow-2xl">
                    <main className="flex-grow">
                        <div className="bg-[radial-gradient(circle_at_center,#cde9fe_0%,#3b82f6_100%)] px-2 pb-4">
                            {/* Logo */}
                            <div className="flex justify-center mb-6 pt-3 w-full ">
                                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden">
                                    {itemData?.icon ? (
                                        <img
                                            src={itemData?.icon}
                                            alt="icon"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-black text-sm">
                                            N/A
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-xl text-center text-black mb-4 font-bold">
                                {itemData?.nombreDelProducto || "Producto"}
                            </h2>
                        </div>

                        <div className="border bg-gradient-to-b from-[#ffffff]  to-[#ebebeb]">
                            <div className="p-3 bg-gradient-to-b from-[#ffffff]  to-[#ebebeb] w-[95%] mx-auto -mt-5 ">
                                {/* Payment Amount Card */}
                                <div className="bg-blue-500 text-white p-3 mb-5 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="text-sm opacity-90 capitalize">
                                                {seccion === "payment"
                                                    ? "Monto de prestamo"
                                                    : "Pago para extension"}
                                            </div>
                                            <div className="text-lg font-semibold">
                                                ${" "}
                                                {seccion === "payment"
                                                    ? itemData?.valorEnviado
                                                    : itemData?.valorExtencion}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Card */}
                                <div className="bg-white p-3 mb-3 rounded-lg ">
                                    <div className="space-y-3 text-sm ">
                                        <div className="flex justify-between border-b border-spacing-1 pb-2">
                                            <div className="text-gray-900 font-bold ">
                                                Producto
                                            </div>
                                            <div className="text-gray-500">
                                                {itemData?.nombreDelProducto}
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-b border-spacing-1 pb-2">
                                            <div className="text-gray-900 font-bold">
                                                {seccion === "payment"
                                                    ? "Importe a Pagar"
                                                    : "Pago por Extension"}
                                            </div>
                                            <div className="text-gray-500">
                                                {seccion === "payment"
                                                    ? itemData?.valorEnviado
                                                    : itemData?.valorExtencion}
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-b border-spacing-1 pb-2">
                                            <div className="text-gray-900 font-bold">
                                                Dias vencimiento
                                            </div>
                                            <div
                                                className={`text-gray-500 ${vencimiento?.color}`}
                                            >
                                                {vencimiento?.texto}
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-b border-spacing-1 pb-2">
                                            <div className="text-gray-900 font-bold">
                                                Fecha de Vencimiento
                                            </div>
                                            <div className="text-gray-500">
                                                {itemData?.fechaDeReembolso}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Card */}
                                <div className="bg-white p-3 mb-4 rounded-lg">
                                    <h3 className="text-sm font-semibold mb-3 text-gray-950">
                                        Elige el metodo de pago
                                    </h3>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="font-medium text-gray-950">
                                            SPEI
                                        </div>
                                        <div className="text-gray-500 ">
                                            {itemData?.idDeSubFactura}
                                        </div>
                                    </div>
                                </div>
                                {/* Confirm Button */}
                                <Link href={`/pay?caso=${encodeURIComponent(caso)}&seccion=${seccion}&item=info`}>

                                    <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-4 text-base rounded-full ">
                                        Confirmar
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </main>
                </div>
            ) : (
                <div className="max-w-md mx-auto p-4 m-4 bg-white bg-gradient-to-b from-blue-500 to-blue-600 rounded">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg overflow-hidden">
                            <img
                                src={itemData?.icon || "/fastcash-logo.png"}
                                alt="icon"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-100">Pagar con SPEI</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-bold text-gray-950">
                                ${" "}
                                {seccion === "payment"
                                    ? itemData?.valorEnviado
                                    : itemData?.valorExtencion}
                            </span>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-100">
                                Código de pago
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-sm bg-gray-50 px-2 py-1 rounded text-gray-950">
                                    {itemData?.idDeSubFactura}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="bg-gray-800 text-white h-7 px-3 rounded transition-colors hover:bg-gray-700"
                                >
                                    {copied ? "Copiado" : "Copiar"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="relative pl-10 space-y-8">
                        {[
                            "Abre tu banca móvil",
                            "Pegar el código de pago",
                            "Ingresar el monto",
                        ].map((step, index) => (
                            <div className="relative" key={index}>
                                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium mb-2">{step}</p>
                                    <p className="text-sm text-gray-100 mb-4">
                                        {index === 0
                                            ? "Abre tu banca móvil y entra en la página de transferencias"
                                            : index === 1
                                                ? "Pegar el código de pago y se te asociarán automáticamente los datos bancarios"
                                                : "Ingresar el monto a pagar y completar la transferencia"}
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900 text-center">
                                        {index === 1 ? "CLABE" : "Importe"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Back Button */}
                    <Link
                        href={`/pay?caso=${encodeURIComponent(caso)}&seccion=${seccion}&item=data`}
                    >
                        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-4 text-base rounded-full mt-8">
                            Volver
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
