import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log(`Socket conectado: ${socket.id}`);
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión al socket:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log(`Socket desconectado: ${reason}`);
});

const useSessionWatcher = (userId, router, setUser) => {
  useEffect(() => {
    if (!userId) return;

    console.log(`useSessionWatcher activo para userId=${userId}`);

    if (socket.connected) {
      console.log(`Socket ya está conectado: ${socket.id}`);
    } else {
      console.log("Intentando conectar socket...");
      socket.connect();
    }

    socket.emit("registerSession", userId);
    console.log(`📡 Enviado registerSession para userId=${userId}`);

    // Escuchamos el evento de override
    socket.on("sessionOverrideRequest", (data) => {
      console.log(`¡Sesión socket duplicada detectada! Mensaje: ${data.message}`);
      const keepSession = confirm(data.message); // Pregunta al usuario si desea permanecer
      console.log(`Respuesta del usuario: keepSession=${keepSession}`);

      socket.emit("sessionOverrideResponse", { keepSession });
    });

    // Escuchamos si la sesión debe cerrarse
    socket.on("sessionExpired", (data) => {
      console.log(`Sesión expirada socket: ${data.message}`);
      
      // Mostramos un alert primero
      alert("Tu sesión ha sido cerrada en otro dispositivo.");
      
      // Luego, preguntamos con un confirm si desean continuar o no
      const keepSession = confirm("¿Deseas mantener tu sesión activa?");
      
      // Si el usuario decide cerrar la sesión, eliminamos el usuario y redirigimos
      if (!keepSession) {
        setUser(null); // Limpiamos el usuario del estado
        router.push("/"); // Redirigimos al usuario a la página de inicio
      } else {
        console.log("Usuario ha decidido mantener la sesión activa.");
        // Si el usuario decide mantener la sesión activa, puede continuar normalmente
        // No hacemos nada más en este caso, ya que el usuario permanecería logueado
      }
    });

    return () => {
      socket.off("sessionOverrideRequest");
      socket.off("sessionExpired");
    };
  }, [userId, router, setUser]); // Asegúrate de pasar 'setUser' correctamente
};

export default useSessionWatcher;
