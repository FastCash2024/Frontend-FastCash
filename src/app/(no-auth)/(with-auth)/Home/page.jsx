'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext';
import TableTools from '@/components/TableTools'
import MiniNavbar from '@/components/MiniNavbar'
import Modals from '@/components/Modals'
import { useRouter } from 'next/navigation';
import Alerts from '@/components/Alerts'
import TablesAdminAccounts from '@/components/TablesAdminAccounts'
import TablesPersonalAccounts from '@/components/TablesPersonalAccounts'
import Newslater from '@/components/Newslater'
import ReporteDeAccesos from '@/components/ReporteDeAccesos'

export default function Home() {
    const router = useRouter()
    const { user,userDB } = useAppContext()


    // useEffect(() => {
    //     user === undefined && router.push('/')
    // }, [])

    
    return (
        user?.rol &&
        <>










        
            <Alerts />
            {/*--------------------- MODAL FORMS --------------------- */}
            <Modals />
            {/*--------------------- MINI BARRA DE NAVEGACION --------------------- */}
            <MiniNavbar />
            {/* --------------------------------- TABLE TOOLS --------------------------------- */}
            <TableTools />
            {/* ---------------------------------TABLAS--------------------------------- */}
            <TablesAdminAccounts />
            <Newslater />
           {user.rol==="Cuenta Personal"&& <TablesPersonalAccounts />}
        </>
    )
}
