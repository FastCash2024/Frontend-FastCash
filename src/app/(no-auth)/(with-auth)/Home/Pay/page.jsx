'use client'

import { useAppContext } from "@/context/AppContext"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

export default function NamePage() {

  const [itemData, setItemData] = useState(null);
  const searchParams = useSearchParams();
  const seccion = searchParams.get('seccion');
  const item = searchParams.get('item');
  const caso = searchParams.get('caso');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(window?.location?.href.includes('localhost')
        ? `http://localhost:3000/api/verification/${caso}`
        : `https://api.fastcash-mx.com/api/verification/${caso}`)
      const res = await response.json();
      setItemData(res);
    };
    fetchData()
  }, []);

  console.log("item: ", itemData);

  const maskName = (name) => {
    if (!name || name.length < 3) return name;
    const firstPart = name.slice(0, 3);
    const lastPart = name.slice(-3);
    const maskedPart = "*".repeat(name.length - 6);
    return name.length > 6 ? `${firstPart}${maskedPart}${lastPart}` : `${firstPart}***`;
  };  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <img
              src={itemData?.icon}
              alt="icon"
              width={39}
              height={39}
              className="rounded-full"
            />
          </div>
          <span className="text-sm text-gray-600 capitalize">{itemData?.nombreDelProducto}</span>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <div className="text-3xl text-gray-950 font-bold">$ {itemData?.valorSolicitado}</div>
          <div className="text-sm text-gray-500">Fecha de vencimiento: 02-02-2025</div>
          <div className="text-sm text-blue-600">Vencerá en 1 días</div>
        </div>

        {/* Order Details */}
        <div className="space-y-4 text-gray-950">
          <h3 className="font-medium">Detalles del pedido</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Producto</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <img
                    src={itemData?.icon}
                    alt="Product Logo"
                    width={19}
                    height={19}
                    className="rounded-full"
                  />
                </div>
                <span className="capitalize">{itemData?.nombreDelProducto}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Monto</span>
              <span>$ {itemData?.valorSolicitado}</span>
            </div>
            <div className="flex justify-between">
              <span>Nombre</span>
              <span className="uppercase">{maskName(itemData?.nombreDelCliente)}</span>
            </div>
            <div className="flex justify-between">
              <span>Teléfono</span>
              <span>{maskName(itemData?.numeroDeTelefonoMovil)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-950">Método de pago</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer">
              <input type="radio" name="payment" value="spei" defaultChecked className="w-4 h-4 text-blue-600" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-gray-950">SPEI - By Craby</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Recomendado
                  </span>
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-2 text-gray-950 border rounded-lg p-3 cursor-pointer">
              <input type="radio" name="payment" value="oxxo" className="w-4 h-4 text-blue-600" />
              <span className="flex-1">OXXO - By Craby</span>
            </label>
          </div>
        </div>

        {/* Pay Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
          Pagar ahora
        </button>
      </div>
    </div>
  )
}
