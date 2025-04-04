'use client'
import Wifi from '@/components/Wifi'
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';

// import LoaderWithLogo from '@/components/LoaderWithLogo'
import { useState, useEffect } from 'react'
// import style from './Medico.module.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import BottomNavigation from '@/components/BottomNavigation'
import Navbar from '@/components/Navbar'
import TimeDisplay from '@/components/TimeDisplay'
// import VideoClient from '@/components/Vide'
import { Turret_Road } from 'next/font/google'
// import Whatsapp from '@/components/Whatsapp'
import { MoonIcon, SunIcon, WindowIcon } from '@heroicons/react/24/solid';
import Loader from '@/components/Loader'
function Home({ children }) {
    const router = useRouter()
    const { user, setUser, userDB, setUserDB, setUserProfile, loader, modal } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname()
    const fetchProfile = async () => {
        console.log('fetchProfile')
        const token = sessionStorage.getItem('token'); // Obtener el JWT desde sessionStorage
        console.log('token', token);
        
        try {
            const response = await fetch(window?.location?.href.includes('localhost')
                ? 'http://localhost:3002/api/authSystem/validate'
                : 'https://api.fastcash-mx.com/api/authSystem/validate', {
                method: 'GET',
                headers: {
                    'Authorization': token,  // Enviar el JWT en el encabezado de autorización
                },
            });
            console.log("response",response);
            if (response.ok) {
                const data = await response.json();
                if (data.user.codificacionDeRoles === 'Cuenta Personal') {
                    console.log('user',data.user)
                    setUser({ ...data.user, rol: data.user.codificacionDeRoles })
                        (pathname === '/PersonalAccount' || pathname === '/') && router.replace('/Account')
                } else {
                    setUserDB(data.user)
                    if (data.user?.emailPersonal) {
                        const res = await fetch(window?.location?.href.includes('localhost')
                            ? `http://localhost:3002/api/authSystem/personalAccounts?email=${data.user?.emailPersonal}`
                            : `https://api.fastcash-mx.com/api/authSystem/personalAccounts?email=${data.user?.emailPersonal}`)
                        const resData = await res.json()
                        console.log('restData layour noAuth',resData)
                        setUser({ ...resData[0], rol: data.user.tipoDeGrupo })
                            (pathname === '/PersonalAccount' || pathname === '/') && router.replace('/Home')
                    } else {
                        setUser({ rol: data.user.tipoDeGrupo })
                            (pathname === '/PersonalAccount' || pathname === '/') && router.replace('/Home')
                    }
                }
            } else {
                setUser({ rol: undefined })
            }
        } catch (error) {
            // // console.log('Error al cargar el perfil');
        }
    };
    useEffect(() => {

        fetchProfile();
    }, [loader]);



    console.log(user)
    // useEffect(() => {
    //     user?.rol && user?.rol !== undefined
    //         ? pathname !== '/Newslater' && router.replace('/Home')
    //         : pathname !== '/PersonalAccount' && router.replace('/')
    // }, [user])

    return (
        <div>
            {modal === 'Guardando...' && <Loader> {modal} </Loader>}

            {children}
        </div>
    )
}

export default Home


