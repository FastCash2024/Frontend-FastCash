'use client'

import { useState, useEffect, useRef, useMemo, useContext, createContext } from 'react'
import { useRouter } from 'next/navigation'

// const Context = createContext(
import io from 'socket.io-client';



const AppContext = createContext();


export function AppProvider({ children }) {

	const [user, setUser] = useState(null)
	const [users, setUsers] = useState(null)
	const [userDB, setUserDB] = useState(null)
	const [subItemNav, setSubItemNav] = useState('Casos de Cobranza')
	const [alerta, setAlerta] = useState('')
	const [theme, setTheme] = useState('light');
	const [loader, setLoader] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isOpen2, setIsOpen2] = useState(false);
	const [checkedArr, setCheckedArr] = useState([]);

	const [fondoPrimario, setFondoPrimario] = useState('#000000')
	const [fondoSecundario, setFondoSecundario] = useState('#292929')
	const [fondoTerciario, setFondoTerciario] = useState('')

	const [idioma, setIdioma] = useState('Español')
	const [local, setSever] = useState('')

	const [time_stamp, setTime_stamp] = useState(undefined)
	const [application, setApplication] = useState(undefined)
	const [multa, setMulta] = useState(undefined)
	const [applicationTipo, setApplicationTipo] = useState(undefined)
	const [filtro_1, setFiltro_1] = useState([]);
	const [attendance, setAttendance] = useState(undefined)
	const [newslater, setNewslater,] = useState(undefined)
	const [account, setAccount] = useState(undefined)
	const [appComision, setAppComision] = useState(undefined)
	const [appComisionVerification, setAppComisionVerification] = useState(undefined)

	const [success, setSuccess] = useState(null)
	const [nav, setNav] = useState(false)
	const [userNav, setUserNav] = useState(false)
	const [modal, setModal] = useState('')
	const [isSelect, setIsSelect] = useState(false)
	const [filter, setFilter] = useState(null)
	const [navItem, setNavItem] = useState(undefined)
	const [item, setItem] = useState(null)
	const [itemSelected, setItemSelected] = useState(null)

	const [fecha, setFecha] = useState(null)



	const setUserSuccess = (data) => {

		if (success === null) {
			setSuccess(data)
			const timer = setTimeout(() => {
				setSuccess(null)
				// console.log('timer')
				return clearTimeout(timer)
			}, 6000)

		}

	}

	// const socket = useMemo(() => io("http://localhost:4000"), []);
	const socket = useMemo(() =>
		io("http://localhost:4000", {
			path: "/api/socket",
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 2000,
		})
		, []); 
	const router = useRouter()
	const [usersSystem, setUsersSystem] = useState([]); // Lista de usuarios con sesión activa

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) return;
		console.log("user",user)
		console.log("userDB",userDB)
		// Registrar usuario (asegúrate de que "user" esté definido)
		if (userDB && userDB.id) {
			socket.emit("register", {
				id: userDB.id,
				cuenta: userDB.cuenta,
				rol: userDB.tipoDeGrupo,
				emailPersonal: userDB.emailPersonal,
				numeroDeTelefonoMovil: userDB.numeroDeTelefonoMovil,
				nombrePersonal: userDB.nombrePersonal,
				fotoURL: userDB.fotoURL,
			});
		} else {
			console.error("El usuario no está definido o no tiene un ID válido.");
		}


		// Escuchar el evento de "onlineUsers" para actualizar la lista de usuarios conectados
		socket.on("onlineUsers", (users) => {
			setUsersSystem(users);
			console.log("onlineUsers", users)
		});

		// Escuchar el evento "logout"
		socket.on("logout", () => {
			console.log("🔴 Se ha cerrado la sesión en otro dispositivo.");
			sessionStorage.removeItem("token");
			setUser(null);
			alert("Se ha cerrado sesión en otro dispositivo.");
			router.replace("/");
		});

		return () => {
			socket.off("onlineUsers");
			socket.off("logout");
		};
	}, [socket, router, userDB]);

	useEffect(() => {
		socket.on("onlineUsers", (users) => {
			setUsersSystem(users);
			console.log("🟢 Lista de usuarios online:", users);
		});
		return () => {
			socket.off("onlineUsers");
		};
	}, [socket, router, usersSystem]); // Solo al montar una vez


	const value = useMemo(() => {
		return ({
			user,
			userDB,
			subItemNav, setSubItemNav,
			success,
			nav,
			modal,
			users,
			itemSelected, setItemSelected,
			isOpen, setIsOpen, isOpen2, setIsOpen2,
			loader, setLoader,
			fondoPrimario, setFondoPrimario,
			fondoSecundario, setFondoSecundario,
			fondoTerciario, setFondoTerciario,
			idioma, setIdioma,
			theme, setTheme,
			alerta, setAlerta,
			item, setItem,
			time_stamp, setTime_stamp,
			navItem, setNavItem,
			userNav, setUserNav,
			filter, setFilter,
			isSelect, setIsSelect,
			fecha, setFecha, 
			application, setApplication,
			applicationTipo, setApplicationTipo,
			account, setAccount,
			appComision, setAppComision,
			appComisionVerification, setAppComisionVerification,
			multa, setMulta,
			filtro_1, setFiltro_1,
			attendance, setAttendance,
			local, setSever,
			checkedArr, setCheckedArr,
			newslater, setNewslater,
			setUsers,
			setModal,
			setNav,
			setUser,
			setUserDB,
			setUserSuccess,
			usersSystem
		})

	}, [user, userDB,
		theme,
		alerta,
		fondoPrimario,
		fondoSecundario,
		fondoTerciario, subItemNav, success, 
		nav, userNav, modal, 
		isSelect, 
		users, 
		attendance, applicationTipo, application, multa, filtro_1, 
		item, 
		account,
		appComision,
		appComisionVerification,
		idioma,
		fecha, 
		filter,
		checkedArr,
		newslater,
		local,
		isOpen, 
		isOpen2, 
		navItem, 
		loader,
		time_stamp,
		usersSystem])

	return (
		<AppContext.Provider value={value} >
			{children}
		</AppContext.Provider>
	)
}

export function useAppContext() {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('error')
	}
	return context
}
