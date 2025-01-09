'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Loader from '@/components/Loader'
import SelectSimple from '@/components/SelectSimple'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import InputPass from '@/components/InputPass'
import Table from '@/components/Table'
import TableReporteDiario from '@/components/TableReporteDiario'

// import Velocimetro from '@/components/Velocimetro'
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), { ssr: false, });
import FormAddAccount from '@/components/FormAddAccount'
import FormAddMasiveAccounts from '@/components/FormAddMasiveAccounts'
import FormAddPersonalAccount from '@/components/FormAddPersonalAccount'
import FormAddPersonalData from '@/components/FormAddPersonalData'
import FormAddVerification from '@/components/FormAddVerification'
import FormAdminAccount from '@/components/FormAdminAccount'
import FormAddApplication from '@/components/FormAddApplication'

import FormAsignarAsesor from '@/components/FormAsignarAsesor'
import TableTools from '@/components/TableTools'

import Alert from '@/components/Alert'
import ViewPersonalInfo from '@/components/ViewPersonalInfo'
import {
    refunds, historial,
    menuArray, filtro_1, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso
} from '@/constants/index'
import { useRouter } from 'next/navigation';
import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import Speedometer, {
    Background,
    Arc, DangerPath,
    Needle,
    Progress,
    Marks,
    Indicator,
} from 'react-speedometer';
import {
    encabezadoCasosDeCobranza,
    encabezadoIncurrirEnUnaEstaciónDeTrabajo,
    encabezadoGestionDeCuentasDeColección,
    encabezadoRegistroDeSMS,
    encabezadoCobroYValance,
    encabezadoRegistroHistorico,
    encabezadoMonitoreoDeTransacciones,
    encabezadoControlDeCumplimiento,
    encabezadoAuditoriaPeriodica,
    encabezadoCasosDeVerificacion,
    encabezadoListaFinal,
    encabezadoGestionDeAccesos,
    encabezadoDeAplicaciones
} from '@/constants/TableHeaders.jsx'



export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const router = useRouter()
    const [texto, setTexto] = useState('');
    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const [filter, setFilter] = useState({
        nombreProducto: 'Todo',
        ['Minimo dias vencido']: 0,
        ['Maximo dias vencido']: 10000000000,
        ['Estado de reembolso']: '',
        ['Cliente nuevo']: '',
        ['Nombre del cliente']: '',
        ['Número de teléfono']: ''
    })
    const [filter2, setFilter2] = useState({
        nombreProducto: 'Todo',
        ['Minimo dias vencido']: 0,
        ['Maximo dias vencido']: 10000000000,
        ['Estado de reembolso']: '',
        ['Cliente nuevo']: '',
        ['Nombre del cliente']: '',
        ['Número de teléfono']: ''
    })
    const [state, setState] = useState({})
    const [editItem, setEditItem] = useState(undefined)
    const [remesasDB, setRemesasDB] = useState(undefined)
    const refFirst = useRef(null);
    const [profileIMG, setProfileIMG] = useState('')
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    let menu = user?.rol ? menuArray[user.rol].filter(i => i.hash === seccion) : ''

    function sortArray(x, y) {
        if (x['translation']['spa']['common'].toLowerCase() < y['translation']['spa']['common'].toLowerCase()) { return -1 }
        if (x['translation']['spa']['common'].toLowerCase() > y['translation']['spa']['common'].toLowerCase()) { return 1 }
        return 0
    }
    function handlerSelect(name, i, uuid) {
        setState({ ...state, [uuid]: { [name]: i } })
    }

    function handlerSelected(position, index) {
        if (position === 'LEFT') {
            selectedLeft === index ? setSelectedLeft(-1) : setSelectedLeft(index)
        }
        if (position === 'RIGHT') {
            selectedLeft === index ? setSelectedRight(-1) : setSelectedRight(index)
        }
    }
    const prev = () => {
        requestAnimationFrame(() => {
            if (refFirst.current) {
                const scrollLeft = refFirst.current.scrollLeft;
                // console.log(scrollLeft);
                const itemWidth = screen.width - 50;
                refFirst.current.scrollLeft = scrollLeft - itemWidth;
            }
        });
    };
    const next = () => {
        requestAnimationFrame(() => {
            if (refFirst.current) {
                const scrollLeft = refFirst.current.scrollLeft;
                // console.log(scrollLeft);
                const itemWidth = screen.width - 50;
                // console.log(itemWidth);
                refFirst.current.scrollLeft = scrollLeft + itemWidth;
            }
        });
    };
    function handlerSelectClick(name, i, uuid) {
        setFilter({ ...filter, [name]: i })
    }
    // console.log(filter)
    function onChangeHandler(e) {
        // console.log(e.target.value)
        setFilter({ ...filter, [e.target.name]: e.target.value })
    }
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    function getDay(dias) {
        var dt = new Date();


        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",];

        // // console.log('Fecha Actual: ' + dt);
        //restando los dias deseados
        const dat = dt.setDate(dt.getDate() + dias);
        const index = new Date(dat).getDay()
        //mostrando el resultado
        return { val: formatDate(dt), day: diasSemana[index] }
    }
    //fecha actual
    const [value, setValue] = useState({})
    const [value2, setValue2] = useState('Por favor elige')

    function handlerSelectClick2(name, i, uuid) {
        if (name === 'Tipo de grupo') {
            setValue({ ...value, [name]: i, ['Codificación de roles']: 'Por favor elige' })
        } else {
            setValue({ ...value, [name]: i })
        }

    }
    function handlerSelectClick3(name, i, uuid) {
        setValue2(i)
    }
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);

    function handleCheckboxChange(index) {
        setSelectedCheckbox(index);
    };
    const [isGreen, setIsGreen] = useState(true);
    const handleClick = () => {
        setIsGreen(!isGreen);
    };
    const optionsArray = [
        "Por favor elige",
        "Sin contactar",
        "No contactable",
        "Contactado",
        "Propósito de retrasar",
        "Propósito de pagar",
        "Promete a pagar",
        "Pagará pronto"
    ];

    // console.log(user)

    const copyToClipboard = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(textToCopy);
            setTimeout(() => setCopied(false), 3000); // Ocultar el mensaje después de 2 segundos
        });
    };
    const marks = Array.from({ length: 11 }, (_, i) => i * 10); // Genera marcas cada 10 unidades
    const radius = 100; // Radio del arco del velocímetro
    const manejarCambio = (event) => {
        setTexto(event.target.value);
    };
    const [password, setPassword] = useState('');

    const generarContrasena = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let contrasenaGenerada = '';
        const longitud = 16; // Longitud de la contraseña

        for (let i = 0; i < longitud; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            contrasenaGenerada += caracteres[indice];
        }

        // console.log(contrasenaGenerada);
    };

    function onChangePass(e) {
        setPassword(e.target.value)
    }

    const [showPassword, setShowPassword] = useState(false)
    // console.log(selectedLeft)

    const getBackgroundClass = (estado) => {
        switch (estado) {
            case 'operando':
                return 'bg-green-400';
            case 'atraso-1':
                return 'bg-yellow-400';
            case 'atraso-2':
                return 'bg-orange-400';
            case 'falta':
                return 'bg-red-500';
            case 'libre':
                return 'bg-gray-300';
            default:
                return '';
        }
    };
    const auditoriaPeriodica2 = [
        "16184477",
        "Alan Montenegro",
        "Alan001",
        "Kiara Palacios",
        "Con observacion",
        "Operativa",
        "$ 10.00",
        "Aprobado",
        "12/12/2024 12:00 pm"
    ];
    const [isMounted, setIsMounted] = useState(false);
    // console.log(item)


    const codificacionDeRoles = {
        'Recursos Humanos': ['Recursos Humanos'],
        'Admin': ['Admin'],
        'Manager de Auditoria': ['Manager de Auditoria'],
        'Manager de Cobranza': ['Manager de Cobranza'],
        'Manager de Verificación': ['Manager de Verificación'],
        'Usuario de Auditoria': ['Usuario de Auditoria'],
        'Usuario de Cobranza': [
            'D2 = 2 DIAS ANTES DE LA FECHA DE COBRO',
            'D1 = 1 DIA ANTES DE LA FECHA DE COBRO',
            'D0 = DIA DE LA FECHA DE COBRO',
            'S1 = 1 - 7 DIAS DE MORA EN EL SISTEMA',
            'S2 = 8 - 16 DIAS DE MORA EN EL SISTEMA'
        ],
        'Usuario de Verificación': ['Usuario de Verificación'],
        'Cuenta Personal': ['Cuenta Personal'],
    }






    const trabajo = [
        { nombre: "taipe alejandro cristina magaly", lunes: "libre", martes: "operando", miercoles: "atraso-1", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "porozo aguirre brayan david", lunes: "libre", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "atraso-1", sabado: "falta", domingo: "atraso-2" },
        { nombre: "abad usiña jilson vladimir", lunes: "atraso-1", martes: "libre", miercoles: "atraso-2", jueves: "operando", viernes: "libre", sabado: "falta", domingo: "libre" },
        { nombre: "castillo armas brandon alexis", lunes: "libre", martes: "atraso-2", miercoles: "libre", jueves: "operando", viernes: "atraso-1", sabado: "libre", domingo: "falta" },
        { nombre: "benavides quiroz jazmín carolina", lunes: "operando", martes: "libre", miercoles: "atraso-1", jueves: "falta", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "leon cuchipe lady priscila", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "paucar alquinga andres steven", lunes: "atraso-2", martes: "operando", miercoles: "libre", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "arce mendez cristian santiago", lunes: "falta", martes: "libre", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "murillo jerez josselyne michelle", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "alvarez puente gabriela geomar", lunes: "libre", martes: "atraso-2", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "libre", domingo: "atraso-1" },
        { nombre: "cuaspud gallegos katherine dayana", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "bernal ceron tobias bryan", lunes: "libre", martes: "operando", miercoles: "libre", jueves: "atraso-1", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "jimenez espinoza byron andres", lunes: "libre", martes: "libre", miercoles: "atraso-2", jueves: "operando", viernes: "falta", sabado: "atraso-1", domingo: "libre" },
        { nombre: "ponce murillo yesika ariani", lunes: "atraso-2", martes: "falta", miercoles: "libre", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "quijia sotalin valeria paulina", lunes: "operando", martes: "libre", miercoles: "atraso-1", jueves: "falta", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "encalada quishpe david andres", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "sigcha palango tania selena", lunes: "atraso-1", martes: "libre", miercoles: "libre", jueves: "operando", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "carrasco ortega bryan josue", lunes: "libre", martes: "operando", miercoles: "atraso-1", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "montenegro villacis alan david", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "andrango allauca erick fabricio", lunes: "falta", martes: "libre", miercoles: "atraso-2", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "blasio gonzalez tito jonathan", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "garnica robayo hernan garnica", lunes: "atraso-1", martes: "libre", miercoles: "libre", jueves: "operando", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "ramos sánchez janny joey", lunes: "libre", martes: "falta", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "lobo sanchez miguel eduardo", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "andi andy silvana maritza", lunes: "libre", martes: "operando", miercoles: "falta", jueves: "libre", viernes: "atraso-1", sabado: "atraso-2", domingo: "libre" },
        { nombre: "pulupa cornejo katty pamela", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "lopez morales tifany gissell", lunes: "libre", martes: "atraso-2", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "riera monard dayana andrea", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "marquez ayala marcos jeremias", lunes: "atraso-1", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "lizano arauz fernando daniel", lunes: "libre", martes: "operando", miercoles: "atraso-1", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "balderramo loor xavier sebastian", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "choque quinteros ariana mateo", lunes: "libre", martes: "atraso-1", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "sucari jara edward pablo", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "delgado barros rafael adrian", lunes: "falta", martes: "libre", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "guzman tovar eric adrian", lunes: "libre", martes: "atraso-2", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "velasco masi losy jazmin", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "gonzales perez brayan diego", lunes: "libre", martes: "falta", miercoles: "libre", jueves: "operando", viernes: "atraso-1", sabado: "libre", domingo: "atraso-2" },
        { nombre: "carrasco salazar jaime roberto", lunes: "operando", martes: "atraso-1", miercoles: "falta", jueves: "libre", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "rivadeneira gonzalez laura", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "campos villavicencio brayan alexander", lunes: "libre", martes: "operando", miercoles: "falta", jueves: "atraso-1", viernes: "libre", sabado: "libre", domingo: "atraso-2" },
        { nombre: "quebrada morales solymar", lunes: "atraso-2", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "yucra ordonez jhonny erick", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "salazar rodriguez katherine vitory", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "rodriguez lopez jhonnatthan", lunes: "falta", martes: "libre", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "aillón choque benjamin", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-1", domingo: "libre" },
        { nombre: "acosta ramirez emily", lunes: "libre", martes: "atraso-1", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "libre", domingo: "atraso-2" },
        { nombre: "flores veintimilla jose luis", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "toapanta tulcan nicole", lunes: "atraso-2", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "moreno velasco milena", lunes: "falta", martes: "operando", miercoles: "libre", jueves: "atraso-1", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "verdugo lasso jhonny wilson", lunes: "atraso-1", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "ingacochea haro eliana", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "zapata aguilar cristian edward", lunes: "libre", martes: "atraso-1", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "de la torre muñoz luis andres", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "rios ávila diana carolina", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },

    ]


    const cobradores = [
        {
            id: "S0",
            nombre: "Alvarez Puente Gabriela Geomar",
            usuario: "CobradorA1",
            telefono: "5215838160069",
            extension: "88136193",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 20,
            clientesSinResponder: 3,
            pagosHoy: 5,
            porcentajeHoy: "11.54%",
            ptp2pm: 7,
            ptp6pm: 5,
            porcentajePTP: "26.92%",
            llamadas3pm: 7,
            ptp10am: 6,
            porcentajeLlamadas: "26.92%",
            llamadasElDiaSiguiente: 8,
            llamadasFinales: 7,
            porcentajeFinal: "30.77%",
            tasaFinal: 12,
            porcentajeTasaFinal: "46.15%",
        },
        {
            id: "S0",
            nombre: "Benavides Quiroz Jazmín Carolina",
            usuario: "CobradorA8",
            telefono: "5215838160070",
            extension: "53828419",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 22,
            clientesSinResponder: 4,
            pagosHoy: 5,
            porcentajeHoy: "14.81%",
            ptp2pm: 6,
            ptp6pm: 5,
            porcentajePTP: "22.22%",
            llamadas3pm: 8,
            ptp10am: 5,
            porcentajeLlamadas: "29.63%",
            llamadasElDiaSiguiente: 8,
            llamadasFinales: 4,
            porcentajeFinal: "29.63%",
            tasaFinal: 10,
            porcentajeTasaFinal: "37.04%",
        },
        {
            id: "S0",
            nombre: "Sigcha Palango Tania Selena",
            usuario: "CobradorA9",
            telefono: "5215838160071",
            extension: "97187966",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 22,
            clientesSinResponder: 5,
            pagosHoy: 6,
            porcentajeHoy: "19.23%",
            ptp2pm: 9,
            ptp6pm: 6,
            porcentajePTP: "34.62%",
            llamadas3pm: 10,
            ptp10am: 3,
            porcentajeLlamadas: "38.46%",
            llamadasElDiaSiguiente: 11,
            llamadasFinales: 2,
            porcentajeFinal: "42.31%",
            tasaFinal: 12,
            porcentajeTasaFinal: "46.15%",
        },
        {
            id: "S0",
            nombre: "Jimenez Espinoza Byron Andres",
            usuario: "CobradorA10",
            telefono: "5215838160072",
            extension: "35625589",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 24,
            clientesSinResponder: 5,
            pagosHoy: 0,
            porcentajeHoy: "19.23%",
            ptp2pm: 11,
            ptp6pm: 0,
            porcentajePTP: "42.31%",
            llamadas3pm: 11,
            ptp10am: "",
            porcentajeLlamadas: "42.31%",
            llamadasElDiaSiguiente: 13,
            llamadasFinales: 0,
            porcentajeFinal: "50.00%",
            tasaFinal: 15,
            porcentajeTasaFinal: "57.69%",
        },
        {
            id: "S0",
            nombre: "Garnica Robayo Hernan Garnica",
            usuario: "CobradorA16",
            telefono: "5215838160084",
            extension: "68942789",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 19,
            clientesSinResponder: 0,
            pagosHoy: 4,
            porcentajeHoy: "0.00%",
            ptp2pm: 2,
            ptp6pm: 6,
            porcentajePTP: "7.41%",
            llamadas3pm: 4,
            ptp10am: 2,
            porcentajeLlamadas: "14.81%",
            llamadasElDiaSiguiente: 4,
            llamadasFinales: 6,
            porcentajeFinal: "14.81%",
            tasaFinal: 8,
            porcentajeTasaFinal: "29.63%",
        },
        {
            id: "S0",
            nombre: "Murillo Jerez Josselyne Michelle",
            usuario: "CobradorA17",
            telefono: "5215838160085",
            extension: "69544512",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 18,
            clientesSinResponder: 9,
            pagosHoy: 6,
            porcentajeHoy: "33.33%",
            ptp2pm: 10,
            ptp6pm: 9,
            porcentajePTP: "37.04%",
            llamadas3pm: 10,
            ptp10am: 7,
            porcentajeLlamadas: "37.04%",
            llamadasElDiaSiguiente: 11,
            llamadasFinales: 6,
            porcentajeFinal: "40.74%",
            tasaFinal: 12,
            porcentajeTasaFinal: "44.44%",
        },
        {
            id: "S0",
            nombre: "Lopez Morales Tifany Gissell",
            usuario: "CobradorA18",
            telefono: "5215838160086",
            extension: "62862435",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 21,
            clientesSinResponder: 2,
            pagosHoy: 3,
            porcentajeHoy: "7.41%",
            ptp2pm: 4,
            ptp6pm: 9,
            porcentajePTP: "14.81%",
            llamadas3pm: 6,
            ptp10am: 2,
            porcentajeLlamadas: "22.22%",
            llamadasElDiaSiguiente: 6,
            llamadasFinales: 6,
            porcentajeFinal: "22.22%",
            tasaFinal: 9,
            porcentajeTasaFinal: "33.33%",
        },
        {
            id: "S0",
            nombre: "Andi Andy Silvana Maritza",
            usuario: "CobradorA19",
            telefono: "5215838160087",
            extension: "71868466",
            casos: 21,
            llamadasRealizadas: 16,
            clientesContactados: 16,
            clientesSinResponder: 3,
            pagosHoy: 4,
            porcentajeHoy: "14.29%",
            ptp2pm: 5,
            ptp6pm: 4,
            porcentajePTP: "23.81%",
            llamadas3pm: 6,
            ptp10am: 4,
            porcentajeLlamadas: "28.57%",
            llamadasElDiaSiguiente: 7,
            llamadasFinales: 6,
            porcentajeFinal: "33.33%",
            tasaFinal: 10,
            porcentajeTasaFinal: "47.62%",
        },
        {
            id: "S0",
            nombre: "Carrasco Ortega Bryan Josue",
            usuario: "CobradorA20",
            telefono: "5215838160088",
            extension: "46712168",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 24,
            clientesSinResponder: 1,
            pagosHoy: 6,
            porcentajeHoy: "3.70%",
            ptp2pm: 5,
            ptp6pm: 9,
            porcentajePTP: "18.52%",
            llamadas3pm: 7,
            ptp10am: 6,
            porcentajeLlamadas: "43.75%",
            llamadasElDiaSiguiente: 7,
            llamadasFinales: 5,
            porcentajeFinal: "25.93%",
            tasaFinal: 10,
            porcentajeTasaFinal: "37.04%",
        }
    ];




    function handlerDistribution() {
        Object.values(rolesMenuResult_set).map((i) => { return <a href={`https://m1.prestamomaximo.mx/M1_system/view/main/index.html?time=1731468668303&auditor=M1-fydi01/?v=1731468668303#${i.url}?v=1731468668303`}></a> })
    }






    console.log(user)

    // console.log(modal)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        user === undefined && router.push('/')
    }, [])

    return (
        user?.rol && <main className={` h-full pt-[20px] `}>









            {/* 
            <nav className='fixed left-0 top-[60px] w-full px-5 bg-gray-900 z-20 py-1'>
                {menu.length === 1 && <ul className='flex justify-around space-x-5'>
                    {menu[0].options.map((i, index) => {
                        return <li className='text-gray-300 flex items-center text-[12px] cursor-pointer' onClick={() => router.replace(`/Home?seccion=${menu[0].hash}&item=${i.subtitle}`)}
                        >
                            <span
                                className={`inline-block w-[8px] h-[8px] mr-2 rounded-full cursor-pointer transition-colors duration-300 ${i.subtitle === item ? 'bg-green-500' : 'bg-gray-500'}`}
                            ></span>
                            <span className={` ${i.subtitle === item ? 'text-green-400' : 'text-gray-200'}`}>{i.subtitle}</span> </li>
                    })}
                </ul>}

            </nav> */}



            {modal === 'Guardando...' && <Loader> {modal} </Loader>}





            {user?.rol === 'Cuenta Personal' && item === 'Comision' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                <thead className="text-[10px] text-white uppercase bg-gray-900 z-20">
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">01/12 - 07/12</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>

                        <th></th>
                        <th></th>
                    </tr>
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">DETALLE</th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((-2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((11)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((0)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((1)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((3)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((4)).val}
                        </th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">Porcentaje <br /> semanal alcanzado</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VALOR SEMANAL  <br />  ENTREGADO</th>

                    </tr>
                </thead>
                <tbody>

                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Recoleccion final</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Porcentaje alcanzado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Valor entregado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                    </tr>

                </tbody>
            </table>}
            <br />
            {user?.rol === 'Cuenta Personal' && item === 'Comision' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                <thead className="text-[10px] text-white uppercase bg-gray-900 z-20">
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">01/12 - 07/12</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>

                        <th></th>
                        <th></th>
                    </tr>
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">DETALLE</th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((-2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((11)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((0)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((1)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((3)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((4)).val}
                        </th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">Porcentaje <br /> semanal alcanzado</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VALOR SEMANAL  <br />  ENTREGADO</th>

                    </tr>
                </thead>
                <tbody>

                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Recoleccion final</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Porcentaje alcanzado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Valor entregado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                    </tr>

                </tbody>
            </table>}
            <br />
            {user?.rol === 'Cuenta Personal' && item === 'Comision' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                <thead className="text-[10px] text-white uppercase bg-gray-900  z-20">
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">01/12 - 07/12</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>

                        <th></th>
                        <th></th>
                    </tr>
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">DETALLE</th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((-2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((11)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((0)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((1)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((3)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((4)).val}
                        </th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">Porcentaje <br /> semanal alcanzado</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VALOR SEMANAL  <br />  ENTREGADO</th>

                    </tr>
                </thead>
                <tbody>

                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Recoleccion final</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Porcentaje alcanzado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Valor entregado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                    </tr>

                </tbody>
            </table>}





            {/* ---------------------------------TABLAS--------------------------------- */}

            <div className="overflow-x-auto">
                {isMounted && user?.rol && <div className="max-h-[calc(100vh-90px)] pb-[70px] overflow-y-auto relative scroll-smooth" ref={refFirst}>
                    {/* ---------------------------------COLECCION DE CASOS--------------------------------- */}

                    {user?.rol === 'Cuenta Personal' && !user?.nombreCompleto && <FormAddPersonalData />}
                    {user?.rol === 'Cuenta Personal' && item === 'Control de casos' && <table className="w-full min-w-[1500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">

                            <tr className=' bg-gray-800'>
                                <th className='px-3 py-2'> <input type="checkbox" /></th>
                                <th className="px-4 py-2 text-white">Segmento</th>
                                <th className="px-4 py-2 text-white">Nombre</th>
                                <th className="px-4 py-2 text-white">Usuario asignado</th>
                                <th className="px-4 py-2 text-white">Cantidad de casos</th>
                                <th className="px-4 py-2 text-white">Porcentaje a alcanzar</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 10:00 aM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 2:00 PM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 4:00 PM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2 text-white">Pagos alcanzados</th>
                                <th className="px-4 py-2 text-white">Taza de recuperacion</th>
                            </tr>

                        </thead>
                        <tbody>
                            {cobradores.map((cobrador, index) => (
                                <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2">{cobrador.id}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>
                                    <td className="px-4 py-2">{cobrador.usuario}</td>
                                    <td className="px-4 py-2">{cobrador.casos}</td>

                                    <td className="px-4 py-2">{cobrador.pagosHoy}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.ptp2pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp6pm}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadas3pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp10am}</td>
                                    <td className="px-4 py-2">{cobrador.llamadasElDiaSiguiente}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadasFinales}</td>
                                    <td className="px-4 py-2">{cobrador.tasaFinal}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.porcentajeTasaFinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    {user?.rol === 'Cuenta Personal' && item === 'Asistencia' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">


                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">
                            <tr>

                                <th colSpan="1" className="px-4 py-2 text-white text-center"></th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>
                            </tr>
                            <tr>

                                <th colSpan="1" className="px-4 py-2 text-white text-center">SEMANA</th>
                                <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                    {getDay((-2)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((11)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                    {getDay((0)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((1)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((2)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((3)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((4)).val}
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {trabajo.map((cobrador, index) => (
                                <tr key={index} className='text-[12px]'>

                                    <td className="px-4 py-2 border border-gray-200 bg-gray-300">Semana {index + 1}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.lunes)}`}>{cobrador.lunes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.martes)}`}>{cobrador.martes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.miercoles)}`}>{cobrador.miercoles}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.jueves)}`}>{cobrador.jueves}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.viernes)}`}>{cobrador.viernes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.sabado)}`}>{cobrador.sabado}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.domingo)}`}>{cobrador.domingo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    {user?.rol === 'Cuenta Personal' && item === 'Gestion de auditoria' && <table className="w-full min-w-[1500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">


                            <tr className=' bg-gray-800'>
                                <th className='px-3 py-2'> <input type="checkbox" /></th>
                                <th className="px-4 py-2 text-white">Id Auditor</th>
                                <th className="px-4 py-2 text-white">Nombre del auditor</th>

                                <th className="px-4 py-2 text-white">Usuario asignado</th>


                                <th className="px-4 py-2 text-white">Nombre del operador</th>
                                <th className="px-4 py-2 text-yellow-400">Observacion</th>
                                <th className="px-4 py-2  text-white ">Amonestacion</th>
                                <th className="px-4 py-2 text-yellow-400">Valor de multa</th>
                                <th className="px-4 py-2  text-white">Estado de multa</th>
                                <th className="px-4 py-2 text-white">Fecha de creacion</th>


                            </tr>

                        </thead>
                        <tbody>
                            {cobradores.map((cobrador, index) => (
                                <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2">{cobrador.id}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>
                                    <td className="px-4 py-2">{cobrador.usuario}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>

                                    <td className="px-4 py-2 bg-yellow-400">Con observacion</td>
                                    <td className="px-4 py-2">Operativa</td>
                                    <td className="px-4 py-2 bg-yellow-400"> $ 10</td>
                                    <td className="px-4 py-2">Aprobada</td>
                                    <td className="px-4 py-2">01/12/2024 10:00 am</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    {user?.rol === 'Cuenta Personal' && item === 'Informacion personal' && <ViewPersonalInfo></ViewPersonalInfo>}

                </div>}
            </div>

        </main>
    )
}







