'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';

import { useRouter } from 'next/navigation';

export default function Home() {

    const router = useRouter()
    const { user, userDB } = useAppContext()

    const searchParams = useSearchParams()
    const { theme } = useTheme();
    const item = searchParams.get('item')
    const [data, setData] = useState([]);

    async function handlerFetch() {
        const res = await fetch(window?.location?.href.includes('localhost')
            ? `http://localhost:3002/api/authSystem/users?emailPersonal=${userDB?.email || user?.email}`
            : `https://api.fastcash-mx.com/api/authSystem/users?emailPersonal=${userDB?.email || user?.email}`)
        const resData = await res.json()
        setData(resData)
    }

    useEffect(() => {

        if (item === "Informacion personal") {
            (userDB && user) === undefined && router.push('/')
            if (userDB?.email || user?.email) {
                handlerFetch()
            }

        }
    }, [userDB, user])
    return (
        user?.rol === 'Cuenta Personal' && item === 'Informacion personal' && <div className='relative w-full h-full items-center flex flex-col justify-center'>

            <div className={`relative w-[450px] h-auto rounded-[20px] items-center flex flex-col justify-center space-y-3 ${theme === 'light' ? 'relative bg-white shadow-2xl shadow-gray-500' : 'relative bg-white shadow-2xl shadow-gray-500'} p-5 py-10 dark:shadow-none dark:bg-gray-900`}>
                <div className='relative w-[150px] h-[150px] bottom-4'>
                    <img src={userDB?.fotoURL || user.fotoURL} className='w-full h-full object-cover rounded-full' />
                </div>
                <div className='relative w-[350px] items-between flex justify-between '>
                    <span className={`${theme === 'light' ? 'text-green-500' : 'text-green-500'} dark:text-green-500`}> Nombre:</span>
                    <span className={`${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-white`}> {userDB?.nombreCompleto || user.nombreCompleto}</span>
                </div>
                <div className='relative w-[350px] items-between flex justify-between'>
                    <span className={`${theme === 'light' ? 'text-green-500' : 'text-green-500'} dark:text-green-500`}> DNI:</span>
                    <span className={`${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-white`}> {userDB?.dni || user.dni}</span>
                </div>
                <div className='relative w-[350px] items-between flex justify-between'>
                    <span className={`${theme === 'light' ? 'text-green-500' : 'text-green-500'} dark:text-green-500`}> Correo:</span>
                    <span className={`${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-white`}> {userDB?.email || user.email}</span>
                </div>
                {
                    data?.data?.map((item, index) => {
                        return <div key={index} className='relative w-[350px] items-between flex justify-between'>
                            <span className={`${theme === 'light' ? 'text-green-500' : 'text-green-500'} dark:text-green-500`}> Rol asignado hoy:</span>
                            <span className={`${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark:text-white`}> {item.cuenta}</span>
                        </div>
                    })
                }
            </div>
        </div>
    )
}







