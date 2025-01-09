'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import InputPass from '@/components/InputPass'
import Table from '@/components/Table'
import TableReporteDiario from '@/components/TableReporteDiario'

// import Velocimetro from '@/components/Velocimetro'
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), { ssr: false, });


import {
    refunds, historial,
    menuArray, filtro_1, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso
} from '@/constants/index'
import { useRouter } from 'next/navigation';
import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';



export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const router = useRouter()
    const [texto, setTexto] = useState('');
    const { user, userDB, } = useAppContext()

    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [data, setData] = useState([]);


    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    //fecha actual
    const [value, setValue] = useState({})


    async function handlerFetch() {
        const res = await fetch(window?.location?.href.includes('localhost')
            ? `http://localhost:3000/api/auth/users?emailPersonal=${user?.email}`
            : `https://api.fastcash-mx.com/api/auth/users?emailPersonal=${user?.email}`)
        const resData = await res.json()
        setData(resData)
    }




    useEffect(() => {
        user === undefined && router.push('/')
        user && user?.email && handlerFetch()
    }, [user])

    return (
        user?.rol === 'Cuenta Personal' && item === 'Informacion personal' && <div className='relative w-full h-full items-center flex flex-col justify-center'>
            <div className={`relative w-[450px] h-auto rounded-[20px]  items-center flex flex-col justify-center space-y-3  ${theme === 'light' ? 'relative bg-white shadow-2xl shadow-gray-500' : ' relative bg-white shadow-2xl shadow-gray-500 '} p-5 py-10 dark:shadow-none dark:bg-gray-900`}>
                <div><img src={user.fotoURL} className='h-[150px] rounded-full' /></div>
                <div className='relative w-[350px]  items-between flex   justify-between'>
                    <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`}> Nombre:</span>
                    <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > {user?.nombreCompleto}</span>
                </div >
                <div className='relative w-[350px]  items-between flex   justify-between'>
                    <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > DNI:</span>
                    <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > {user?.dni}</span>
                </div >
                <div className='relative w-[350px]  items-between flex   justify-between'>
                    <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > Correo:</span>
                    <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > {user?.email}</span>
                </div >
                {
                    data.map(item => {
                        return <div className='relative w-[350px]  items-between flex   justify-between'>
                            <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > Rol asignado hoy:</span>
                            <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > {item.cuenta}</span>
                        </div >
                    })
                }
            </div>
        </div>
    )
}







