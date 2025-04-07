// hooks/useSocket.js
"use client";
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

import { io } from "socket.io-client";

export const useSocket = (userDB, setUser, setUsersSystem, router) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!userDB || !userDB.id) return;

        // Configura el socket.io
        const socketConnection = io('https://api.fastcash-mx.com', {
        // const socketConnection = io('http://localhost:4000', {

            path: '/api/socket',
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        setSocket(socketConnection);

        // Registrar usuario cuando el socket se conecta

        socketConnection.emit('register', {
            id: userDB.id,
            cuenta: userDB.cuenta,
            rol: userDB.tipoDeGrupo,
            emailPersonal: userDB.emailPersonal,
            numeroDeTelefonoMovil: userDB.numeroDeTelefonoMovil,
            nombrePersonal: userDB.nombrePersonal,
            fotoURL: userDB.fotoURL,
        });

        // Escuchar el evento de "onlineUsers"
        socketConnection.on('onlineUsers', (users) => {
            setUsersSystem(users);
        });

        // Escuchar el evento "logout"
        socketConnection.on('logout', () => {
            sessionStorage.removeItem('token');
            setUser(null);

            alert('Se ha cerrado sesión en otro dispositivo.');
            if (router) {
                router.replace('/');
            } else {
                // Si router no está disponible, usar window.location.href
                window.location.replace('/');
            }
            window.location.reload();
        });

        return () => {
            socketConnection.off('onlineUsers');
            socketConnection.off('logout');
            socketConnection.disconnect();
        };
    }, [userDB, setUser, setUsersSystem, router]);

    return socket;
};
