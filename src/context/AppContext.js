'use client'

import { useState, useRef, useMemo, useContext, createContext } from 'react'

// const Context = createContext(



const AppContext = createContext();


export function AppProvider({ children }) {

	const [user, setUser] = useState(null)
	const [users, setUsers] = useState(null)
	const [userDB, setUserDB] = useState({cuenta: 'tester'})
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
	const [divisas, setDivisas] = useState(undefined)
	const [envios, setEnvios] = useState(undefined)
	const [exchange, setExchange] = useState(undefined)
	const [destinatario, setDestinatario] = useState(undefined)
	const [destinatarios, setDestinatarios] = useState(undefined)

	const [enviosDB, setEnviosDB] = useState(undefined)
	const [cambiosDB, setCambiosDB] = useState(undefined)

	const [success, setSuccess] = useState(null)
	const [state, setState] = useState('Remesas')
	const [nav, setNav] = useState(false)
	const [userNav, setUserNav] = useState(false)
	const [modal, setModal] = useState('')
	const [currency, setCurrency] = useState("BOB");
	const [select, setSelect] = useState('BOB')
	const [select2, setSelect2] = useState('USD')
	const [select3, setSelect3] = useState('USA')
	const [countries, setCountries] = useState("BOL");

	const [isSelect, setIsSelect] = useState(false)
	const [isSelect2, setIsSelect2] = useState(false)
	const [isSelect3, setIsSelect3] = useState(false)
	const [isSelect4, setIsSelect4] = useState(false)
	const [isSelect5, setIsSelect5] = useState(false)

	const [notificaciones, setNotificaciones] = useState(false)
	const [webScann, setWebScann] = useState(null)
	const [filter, setFilter] = useState(null)
	const [filterQR, setFilterQR] = useState(null)
	const [transactionDB, setTransactionDB] = useState(undefined)
	const [navItem, setNavItem] = useState(undefined)

	const [transferencia, setTransferencia] = useState('')
	const [comision, setComision] = useState('')
	const [item, setItem] = useState(null)

	const [itemSelected, setItemSelected] = useState(null)
	const [qr, setQr,] = useState(null)
	const [QRurl, setQRurl,] = useState(null)

	const [fecha, setFecha] = useState(null)

	const [image1, setImage1] = useState(null)
	const [image2, setImage2] = useState(null)
	const [image3, setImage3] = useState(null)

	const webcamRef1 = useRef(null);
	const webcamRef2 = useRef(null);
	const webcamRef3 = useRef(null);






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

	const value = useMemo(() => {
		return ({
			user,
			userDB,
			subItemNav, setSubItemNav,
			success,
			state,
			nav,
			modal,
			transferencia,
			currency,
			select,
			users,
			destinatario,
			itemSelected, setItemSelected,
			isOpen, setIsOpen, isOpen2, setIsOpen2,
			loader, setLoader,
			fondoPrimario, setFondoPrimario,
			fondoSecundario, setFondoSecundario,
			fondoTerciario, setFondoTerciario,
			idioma, setIdioma,
			theme, setTheme,
			alerta, setAlerta,
			image1, setImage1, image2, setImage2, image3, setImage3,
			webcamRef1, item, setItem,
			webcamRef2,
			webcamRef3,
			time_stamp, setTime_stamp,
			notificaciones, setNotificaciones,
			navItem, setNavItem,
			transactionDB, setTransactionDB,
			comision, setComision,
			userNav, setUserNav,
			exchange, setExchange,
			webScann, setWebScann,
			filter, setFilter,
			filterQR, setFilterQR,
			envios, setEnvios,
			divisas, setDivisas,
			select2, setSelect2,
			isSelect, setIsSelect,
			isSelect2, setIsSelect2,
			isSelect3, setIsSelect3,
			isSelect4, setIsSelect4,
			isSelect5, setIsSelect5,
			fecha, setFecha, qr, setQr, QRurl,
			select3, setSelect3,
			countries, setCountries,
			destinatarios, setDestinatarios,
			enviosDB, setEnviosDB,
			cambiosDB, setCambiosDB,
			setQRurl,
			local, setSever,
			checkedArr, setCheckedArr,
			setDestinatario,
			setUsers,
			setSelect,
			setCurrency,
			setTransferencia,
			setModal,
			setNav,
			setState,
			setUser,
			setUserDB,
			setUserSuccess

		})

	}, [user, userDB,
		theme,
		alerta,
		fondoPrimario,
		fondoSecundario,
		fondoTerciario, subItemNav, success, state, nav, userNav, modal, transferencia, currency, select, select2, select3, isSelect, isSelect2, isSelect3, isSelect4, isSelect5, users, destinatario, image1, image2, image3, item, webcamRef1,
		webcamRef2,
		idioma,
		webcamRef3,
		fecha, qr, QRurl, divisas, envios,
		webScann,
		filter,
		checkedArr,
		local,
		filterQR, exchange, countries, isOpen, isOpen2, destinatarios, transactionDB, navItem, comision,
		enviosDB,
		loader,
		cambiosDB, time_stamp,
		notificaciones])


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
