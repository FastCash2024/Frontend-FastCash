'use client'
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'

import Loader from '@/components/Loader'
function Home({ children }) {
    const router = useRouter()
    const {  setUser, setUserDB, loader, modal } = useAppContext()
    const pathname = usePathname()
    
    const fetchProfile = async () => {
        const token = sessionStorage.getItem('token'); 
        try {
            const response = await fetch(window?.location?.href.includes('localhost')
                ? 'http://localhost:3002/api/authSystem/validate'
                : 'https://api.fastcash-mx.com/api/authSystem/validate', {
                method: 'GET',
                headers: {
                    'Authorization': token,  
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
                router.replace('/')
            }
        } catch (error) {
            // // console.log('Error al cargar el perfil');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [loader]);

    return (
        <div>
            {modal === 'Guardando...' && <Loader> {modal} </Loader>}
            {children}
        </div>
    )
}

export default Home


