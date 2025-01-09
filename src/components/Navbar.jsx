'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
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
export default function BottomNavigation({ rol }) {
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

    const handlerAsistencia = async () => {
       
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
            <h1 className='16px font-medium text-center text-white py-[10px]'></h1>
            <h3 className={` text-center  ${theme === 'light' ? ' text-black' : 'text-white '} dark:text-white`}>{user.nombreCompleto}</h3>
            <h3 className={` text-center text-[12px]  ${theme === 'light' ? ' text-black' : 'text-white '} dark:text-white`}>{rol}</h3>
            {user?.rol !== "Super Admin" && <div className='mt-3'>
                <Button theme="Success" click={handlerAsistencia}>Marcar asitencia</Button>
            </div>}
        </li>
    }
    return <ul className="space-y-3 text-[16px] flex flex-col  items-center text-gray-600 font-medium ">
        <Header />
        {
            menuArray?.[rol]?.map((element, index) => {
                const Icon = element.icon
                return <>
                    {Object.values(menuArray[rol]).length !== 1 && <button
                        type="button"
                        className="relative inline-flex justify-between w-[90%] rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-gray-100 text-[12px]  font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => focus === element.title ? setFocus('') : setFocus(element.title)}
                    >
                        <span className='flex items-center w-full space-x-1.5'>
                            {element.icon}
                            <span className=''>
                                {element.title}
                            </span>
                        </span>
                        <Arrow_Select />
                    </button>}

                    <div
                        className={`relative block w-[90%] right-0 mt-2  rounded-md transition-all shadow-lg ${Object.values(menuArray[rol]).length === 1 ? '' : 'bg-gray-100'} ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-hidden ${Object.values(menuArray[rol]).length === 1 ? 'h-auto' : focus === element.title ? element.length : 'h-0 overflow-hidden'}`}>
                        <div
                            className={`py-1 ${Object.values(menuArray[rol]).length === 1 && 'space-y-5 rounded-md'}`}>
                            {element.options.map((i, index) => {
                                return <span
                                    onClick={() => router.replace(`/Home?seccion=${element.hash}&item=${i.subtitle}`)}
                                    className={`block px-4 py-2 cursor-pointer text-[12px]  text-gray-700 hover:bg-gray-200 space-y-5 rounded-md ${item === i.subtitle && Object.values(menuArray[rol]).length !== 1 ? ' bg-gray-200' : 'bg-gray-50'} `}
                                >
                                    <span className={`flex items-center w-full space-x-1.5 ${item === i.subtitle && ' [&>*:nth-child(n)]:stroke-blue-600  '}`}>
                                        {i.icon}
                                        <span className={`${item === i.subtitle && 'text-blue-600'}`}>
                                            {i.subtitle}

                                        </span>
                                    </span>
                                </span>
                            })}
                        </div>
                    </div>
                </>
            })
        }


    </ul>






}










