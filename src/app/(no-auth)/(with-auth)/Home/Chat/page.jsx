'use client';
import React, { useState, useEffect } from "react";
import { Paginator } from "../../../../../components/Paginator";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const { loader, setLoader, setAlerta } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const searchParams = useSearchParams();
  const caso = searchParams.get("caso");
  
  
  
  const fetchData = async (limit, page, id) => {
    try {
      
      const finalURL = window?.location?.href?.includes("localhost")
      ? `http://localhost:3000/api/notifications/chat/${id}?limit=${limit}&page=${page}`
      : `https://api.fastcash-mx.com/api/notifications/chat/${id}?limit=${limit}&page=${page}`;
      
      const res = await fetch(finalURL);
      const response = await res.json();
      setMessages(response.mensajes);
      setTotalDocuments(response.totalDocuments);
      setTotalPages(response.totalPages ?? 0);
      setCurrentPage(response.currentPage ?? 1);
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
    }
  };

  useEffect(() => {
    fetchData(itemsPerPage, currentPage, caso);
  }, [loader, itemsPerPage, currentPage, searchParams]);

  // useEffect(() => {
  //         handlerFetch(itemsPerPage, currentPage)
  //     }, [loader, searchParams, itemsPerPage, currentPage])
  
  console.log("total docs: ", totalDocuments);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleSendResponse = async () => {
    if (response.trim() === "") {
      alert("Por favor, escribe una respuesta antes de enviar.");
      return;
    }

    const subId = caso;
    const sender = "Respuesta";
    const body = response;
    const messageData = {
      subId: subId,
      sender: sender,
      body: body,
    };

    const apiUrl = window?.location?.href?.includes("localhost")
      ? "http://localhost:3000/api/notifications/chat/savechat"
      : "https://api.fastcash-mx.com/api/notifications/chat/savechat";

    try {
      setLoader("Guardando....");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setAlerta("Operación exitosa!");
        setLoader("");
        setShowModal(false);
        setResponse("");
      } else {
        setLoader("");
        setAlerta("Error de datos!");
        throw new Error("Error al guardar la respuesta");
      }
    } catch (error) {
      setLoader("");
      setAlerta("Error de datos!");
      console.error("Error al enviar la respuesta:", error);
    }
  };

  const handleCancelResponse = () => {
    setShowModal(false); 
    setResponse(""); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl text-gray-500 font-bold mb-4">Bandeja de Mensajes</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-4 py-2 text-left">Remitente</th>
                <th className="px-4 py-2 text-left">Mensaje</th>
                <th className="px-4 py-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {messages?.map((message) => (
                <tr
                  key={message._id}
                  onClick={() => {
                    setActiveMessage(message);
                    setShowModal(true);
                  }}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2 text-gray-500">{message.sender}</td>
                  <td className="px-4 py-2 text-gray-500 truncate">
                    {message.body.length > 50 ? `${message.body.slice(0, 50)}...` : message.body}
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(message.fecha).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-gray-100">
            <Paginator
              totalItems={totalDocuments}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>

        {showModal && (
          <div
            className="fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="relative flex flex-col items-center justify-center bg-gray-200 w-[400px] p-5 space-y-5 rounded-[5px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                onClick={handleCancelResponse}
              >
                X
              </button>

              <h4 className="text-gray-950 font-bold text-lg">Mensaje de {activeMessage.sender}</h4>
              <p className="text-gray-600">{new Date(activeMessage.fecha).toLocaleString()}</p>
              <p className="text-gray-600">{activeMessage.body}</p>

              <textarea
                value={response}
                rows="4"
                maxLength={250}
                placeholder="Escribe tu respuesta aquí..."
                className="text-[10px] p-2 w-full focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px] text-black"
                onChange={(e) => setResponse(e.target.value)}
              />

              <button
                type="button"
                className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-[10px] px-5 py-1.5 text-center"
                onClick={handleSendResponse}
              >
                Enviar Respuesta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
