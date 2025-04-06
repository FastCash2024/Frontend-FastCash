'use client'
import { useAppContext } from '@/context/AppContext'
import React from 'react'
import TableTools from '@/components/TableTools'
import MiniNavbar from '@/components/MiniNavbar'
import Modals from '@/components/Modals'
import Alerts from '@/components/Alerts'
import TablesAdminAccounts from '@/components/TablesAdminAccounts'
import TablesPersonalAccounts from '@/components/TablesPersonalAccounts'
import Newslater from '@/components/Newslater'

export default function Home() {
    const { user, userDB } = useAppContext()
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
            <Newslater />
            {
                user.rol === "Cuenta Personal"
                    ? <TablesPersonalAccounts />
                    : <TablesAdminAccounts />
            }
        </>
    )
}
