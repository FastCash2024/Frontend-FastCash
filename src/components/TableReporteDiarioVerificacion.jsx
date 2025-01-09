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
// import Velocimetro from '@/components/Velocimetro'
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), { ssr: false, });
import FormAddAccount from '@/components/FormAddAccount'
import FormAddMasiveAccounts from '@/components/FormAddMasiveAccounts'
import FormAddPersonalAccount from '@/components/FormAddPersonalAccount'
import FormAddPersonalData from '@/components/FormAddPersonalData'
import FormAddVerification from '@/components/FormAddVerification'
import FormAdminAccount from '@/components/FormAdminAccount'

import TableTools from '@/components/TableTools'

import Alert from '@/components/Alert'

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
} from '@/constants/TableHeaders.jsx'



export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const router = useRouter()
    const [texto, setTexto] = useState('');
    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setCheckedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const [cases, setCases] = useState([])

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
    const [data, setData] = useState([])

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

    function handlerSelectCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            setCheckedArr([...checkedArr, i]);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr(checkedArr.filter(item => item.cuenta !== i.cuenta));
        }
    }

    console.log(checkedArr)
    async function handlerFetch() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/auth/users?tipoDeGrupo=Asesor%20de%20Verificación'
                : 'https://api.fastcash-mx.com/api/auth/users?tipoDeGrupo=Asesor%20de%20Verificación')
        const data = await res.json()
        // console.log(data)
        setData(data)
    }

    async function handlerFetchVerification() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/verification?estadoDeCredito=Pendiente'
                : 'https://api.fastcash-mx.com/api/verification?estadoDeCredito=Pendiente')
        const data = await res.json()
        // console.log(data)
        setCases(data)
    }
    function handlerSelectAllCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            setCheckedArr(data);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr([]);
        }

    }
    useEffect(() => {
        handlerFetch()
        handlerFetchVerification()
    }, [loader])

    useEffect(() => {
        setCheckedArr([])
    }, [])
    return (
        <table className="w-full min-w-[2000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
            <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">

                <tr className=' bg-gray-800'>
                    <th className='px-3 py-2'>
                        <input type="checkbox" onClick={(e) => handlerSelectAllCheck(e)} />
                    </th>
                    <th className="px-4 py-2 text-white">SEGMENTO</th>
                    <th className="px-4 py-2 text-white">Nombres</th>

                    <th className="px-4 py-2 text-white">Cuenta</th>

                    <th className="px-4 py-2 text-white">CASOS</th>

                    <th className="px-4 py-2 text-green-400 ">APROBADOS 10:00 am</th>
                    <th className="px-4 py-2 text-red-400 ">REPROBADOS 10:00 am</th>

                    <th className="px-4 py-2 text-green-400 ">APROBADOS 12:00 am</th>
                    <th className="px-4 py-2 text-red-400 ">REPROBADOS 12:00 am</th>

                    <th className="px-4 py-2 text-green-400 ">APROBADOS 14:00 am</th>
                    <th className="px-4 py-2 text-red-400 ">REPROBADOS 14:00 am</th>

                    <th className="px-4 py-2 text-green-400 ">APROBADOS 16:00 am</th>
                    <th className="px-4 py-2 text-red-400 ">REPROBADOS 16:00 am</th>


                    <th className="px-4 py-2 text-green-400">APROBADOS TOTAL</th>
                    <th className="px-4 py-2 text-red-400">REPROBADOS TOTAL</th>

                </tr>
            </thead>
            <tbody>
                {data.map((i, index) => (
                    <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>

                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                            <input type="checkbox"
                                checked={checkedArr.some(value => value._id === i._id)}
                                onClick={(e) => handlerSelectCheck(e, i)} />
                        </td>
                        <td className="px-4 py-2">{i.id}</td>
                        <td className="px-4 py-2">{i.nombrePersonal}</td>
                        <td className="px-4 py-2">{i.cuenta}</td>

                        <td className="px-4 py-2">{cases?.filter(it => it.cuentaVerificador === i.cuenta).length}</td>
                        <td className="px-4 py-2  bg-yellow-400">{i.clientesSinResponder}</td>
                        <td className="px-4 py-2">{i.VERIFICACIONESHoy}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.ptp2pm}</td>
                        <td className="px-4 py-2">{i.ptp6pm}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.llamadas3pm}</td>
                        <td className="px-4 py-2">{i.ptp10am}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.llamadasFinales}</td>
                        <td className="px-4 py-2">{i.tasaFinal}</td>

                        <td className="px-4 py-2 bg-yellow-400">{i.porcentajeTasaFinal}</td>
                        <td className="px-4 py-2">{i.tasaFinal}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    )
}








