'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link'
import Modal from '@/components/Modal'
import { Arrow_Select } from '@/icons_SVG'
import {
    CircleStackIcon as OutlineCircleStackIcon,
    PresentationChartLineIcon as OutlinePresentationChartLineIcon,
    DocumentCheckIcon as OutlineDocumentCheckIcon,
    IdentificationIcon as OutlineIdentificationIcon,
    UsersIcon as OutlineUsersIcon,
    ArchiveBoxIcon as OutlineArchiveBoxIcon,
    OfficeBuildingIcon as OutlineOfficeBuildingIcon,
    UserGroupIcon as OutlineUserGroupIcon,
    CheckCircleIcon as OutlineCheckCircleIcon,
    DocumentTextIcon as OutlineDocumentTextIcon,
    ChatIcon
} from '@heroicons/react/24/outline';
import {

    ArchiveBoxIcon,
    OfficeBuildingIcon,
    UserGroupIcon,
    CheckCircleIcon,
    DocumentTextIcon, MoonIcon, SunIcon, WindowIcon, CircleStackIcon, IdentificationIcon, DocumentCheckIcon, PresentationChartLineIcon, NumberedListIcon, AdjustmentsHorizontalIcon, ChartBarIcon, CalendarDaysIcon, UsersIcon
} from '@heroicons/react/24/solid';
import { menuArray } from '@/constants'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';
export default function Navbar({ rol }) {
    const { user, userDB, modal, setModal, subItemNav, setSubItemNav, setUserProfile, businessData, setUserData, setUserProduct, setRecetaDB, setUserCart, setUserDistributorPDB, filter, setFilter, nav, setNav } = useAppContext()
    const { theme, toggleTheme } = useTheme();

    const router = useRouter()
    const [focus, setFocus] = useState('')
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const redirectHandler = (ref) => {
        router.push(ref)
    }

    console.log("user navbar: ", user);


    const handlerAsistencia = async () => {
        try {
            const userId = userDB?.id || user?.id;
            console.log("userId", userId);

            const urlLocal = "http://localhost:3000";
            const urlServer = "https://api.fastcash-mx.com";

            const url = window?.location?.href?.includes("localhost")
                ? `${urlLocal}/api/attendance/registerAttendance`
                : `${urlServer}/api/attendance/registerAttendance`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.status === 200) {
                alert('Error en la solicitud');
            }

            const result = await response.json();
            console.log('result:', result.message);

            alert(result.message);
        } catch (error) {
            alert('Error al enviar la asistencia:', error);
        }
    }

    const redirectHandlerWindow = () => {
        window.open(`https://api.whatsapp.com/send?phone=${businessData.whatsapp.replaceAll(' ', '')}&text=hola%20necesito%20un%20implante%20de%20osteosintesis%20¿Pueden%20ayudarme?%20`, '_blank')
        setNav(false)
        // setWhatsapp(!whatsapp)
    }
    console.log(user)
    const Header = () => {
        return <li className="flex flex-col justify-center items-center px-[10px] py-5 border-b border-gray-[1px]  w-full">
            <img src={user.fotoURL} className='h-[150px] w-[150px] rounded-full' alt="" />
            <h1 className='16px font-medium text-center text-gray-100 py-[10px]'></h1>
            <h3 className={` text-center  ${theme === 'light' ? ' text-black' : 'text-gray-100 '} dark:text-gray-100`}>{user.nombreCompleto}</h3>
            <h3 className={` text-center text-[12px]  ${theme === 'light' ? ' text-black' : 'text-gray-100 '} dark:text-gray-100`}>{rol}</h3>
            {user?.rol !== "Super Admin" && user?.rol !== "Cuenta Personal" && <div className='mt-3'>
                <Button theme="Success" click={handlerAsistencia}>Marcar asitencia</Button>
            </div>}
        </li>
    }
    return <ul className=" text-[16px] flex flex-col items-center bg-gray-800 font-medium ">
        <Header />
        {
            menuArray?.[rol]?.map((element, index) => (
                <React.Fragment key={index}>
                    {Object.values(menuArray[rol]).length !== 1 && (
                        <button
                            type="button"
                            className={`relative inline-flex justify-between w-[90%] rounded-md  shadow-sm px-2 py-2 text-[12px]  font-medium text-gray-700 hover:bg-gray-800 focus:outline-none ${focus == element.title ? 'bg-gray-800' : 'bg-gray-800'}`}
                            onClick={() => focus === element.title ? setFocus('') : setFocus(element.title)}
                        >
                            <span className='flex items-center w-full space-x-1.5 text-gray-100'>
                                {element.icon}
                                <span className=''>
                                    {element.title}
                                </span>
                            </span>
                            <Arrow_Select />
                        </button>
                    )}

                    <div
                        className={`relative block w-[100%] right-0 mt-2 rounded-md transition-all shadow-lg ${Object.values(menuArray[rol]).length === 1 ? '' : 'bg-gray-950'} ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-hidden ${Object.values(menuArray[rol]).length === 1 ? 'h-auto' : focus === element.title ? element.length : 'h-0 overflow-hidden'}`}>
                        <div
                            className={`py-1 ${Object.values(menuArray[rol]).length === 1 && ' rounded-md'} text-gray-100`}>
                            {element.options.map((i, subIndex) => (
                                <span
                                    key={subIndex}
                                    onClick={() => router.replace(`/Home?seccion=${element.hash}&item=${i.subtitle}`)}
                                    className={`block px-4 py-2 cursor-pointer text-[12px]  text-gray-50 space-y-5 rounded-md ${item === i.subtitle ? ' bg-blue-500' : 'bg-gray-950'} `}
                                >
                                    <span className={`flex items-center w-full space-x-1.5 text-gray-100 ${item === i.subtitle && ' [&>*:nth-child(n)]:stroke-white  '}`}>
                                        {i.icon}
                                        <span className={`hover:text-white ${item === i.subtitle ? ' text-white' : 'text-gray-300'}`}>
                                            {i.subtitle}
                                        </span>
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </React.Fragment>
            ))
        }


    </ul>

}










