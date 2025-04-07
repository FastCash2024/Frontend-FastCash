// pages/index.js o algún componente
'use client';
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

export default function Home() {

    const {usersSystem} = useAppContext()

    // const [usersSystem, setUsersSystem] = useState([]); // Lista de usuarios con sesión activa
    // const [socket, setSocket] = useState(null);  // Estado para almacenar el socket

    // console.log("usersSystem", usersSystem)

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const socketInstance = io(
    //             window?.location?.href.includes("localhost")
    //                 ? "http://localhost:4000/api/socket"
    //                 : "https://api.fastcash-mx.com/api/socket", {
    //             path: "/api/socket",
    //             transports: ["websocket"], // Solo WebSocket, si no quieres otros protocolos como long polling
    //         }
    //         );
    //         setSocket(socketInstance);  // Asignamos el socket al estado
    //     }
    // }, [userDB]); // Solo se ejecuta en el cliente


    // useEffect(() => {
    //     if (!socket) return; // Asegúrate de que el socket esté definido
    //     socket.on("onlineUsers", (users) => {
    //         setUsersSystem(users);
    //         console.log("🟢 Lista de usuarios online:", users);
    //     });
    //     return () => {
    //         socket.off("onlineUsers");
    //     };
    // }, [socket, router, usersSystem]); // Solo al montar una vez






    return (
        <div>
            <div className="max-h-[calc(100vh-120px)] pb-2 overflow-y-auto relative scroll-smooth drop-shadow-2xl border">
                <table className="min-w-full shadow border-collapse drop-shadow-2xl ">
                    <thead className="bg-[#e0e0e0] text-[10px] uppercase sticky top-[0px] z-10">
                        <tr className="text-gray-700 min-w-[2500px]">
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">ID</th>
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">Cuenta</th>
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">Rol</th>
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">Email Personal</th>
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">Teléfono</th>
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">Nombre</th>
                            <th className="w-[50px] px-3 py-3 text-gray-950 border border-[#e6e6e6] ">Foto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersSystem?.map((user) => (
                            user.id && <tr
                                key={user?.id}
                                className="text-[12px] border-b bg-white"
                            >
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>{user?.id}</td>
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>{user?.cuenta}</td>
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>{user?.rol}</td>
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>{user?.emailPersonal}</td>
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>
                                    {user?.numeroDeTelefonoMovil}
                                </td>
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>{user?.nombrePersonal}</td>
                                <td className={` px-3 py-2 text-[12px] border border-[#e6e6e6] text-black    `}>
                                    <img
                                        src={user?.fotoURL}
                                        alt={user?.nombrePersonal}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
