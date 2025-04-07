'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext';
import { menuArray } from '@/constants/index'
import { useRouter } from 'next/navigation';


export default function Home() {
    const router = useRouter()
    const { user } = useAppContext()

    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    let menu = user?.rol ? menuArray[user.rol]?.filter(i => i.hash === seccion) : ''

    useEffect(() => {
        user === undefined && router.push('/')
    }, [])

    return (
        // --------------------- MINI BARRA DE NAVEGACION ---------------------

        <nav className='fixed left-0 top-[60px] w-full px-5 bg-gray-900 z-20 py-1'>
            {menu?.length === 1 && <ul className='flex justify-around space-x-5'>
                {menu[0].options.map((i, index) => {
                    return <li key={index} className='text-gray-300 flex items-center text-[12px] cursor-pointer' onClick={() => router.replace(`/Home?seccion=${menu[0].hash}&item=${i.subtitle}`)}>
                        <span
                            className={`inline-block w-[8px] h-[8px] mr-2 rounded-full cursor-pointer transition-colors duration-300 ${i.subtitle === item ? 'bg-green-500' : 'bg-gray-500'}`}
                        ></span>
                        <span className={` ${i.subtitle === item ? 'text-green-400' : 'text-gray-200'}`}>{i.subtitle}</span>
                    </li>
                })}
            </ul>}
        </nav>
    )
}
