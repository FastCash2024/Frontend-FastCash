'use client'

import { useState, useEffect, useRef, useMemo, useContext, createContext } from 'react'
import { useRouter } from 'next/navigation'
// import dynamic from 'next/dynamic';
// const io = dynamic(() => import('socket.io-client'), { ssr: false });

// import { io } from "socket.io-client";
// import dynamic from 'next/dynamic';
// const io = dynamic(() => import('socket.io-client').then(mod => mod.io), { ssr: false });
import dynamic from 'next/dynamic';

// const io = dynamic(() => import('socket.io-client').then((module) => module), { ssr: false });
// console.log('io',io)


const io = dynamic(() => import('socket.io-client').then(mod => mod.default), { 
  ssr: false,
});

import { useSocket } from './useSocket'

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
	const [select, setSelect] = useState('');

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
		const [usersSystem, setUsersSystem] = useState([]); // Lista de usuarios con sesión activa
	const router = useRouter()

	const socket = useSocket(userDB, setUser, setUsersSystem, router);

	const value = useMemo(() => {
		return ({
			user,
			userDB,
			subItemNav, setSubItemNav,
			success,
			nav,
			modal,
			users,
			select, setSelect,
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
		select,
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
