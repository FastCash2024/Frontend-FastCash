'use client'
import { useAppContext } from '@/context/AppContext'
import Loader from '@/components/Loader'
import Alert from '@/components/Alert'

export default function Home() {
    const {  alerta, setAlerta, modal, loader } = useAppContext()

    return (
        <>
            {alerta === 'Operación exitosa!' && <Alert
                type={'success'}
                duration={5000}
                onClose={() => setAlerta('')}
            >{alerta}</Alert>}
            {alerta === 'Error de datos!' && <Alert
                type={'error'}
                duration={5000}
                onClose={() => setAlerta('')}
            >{alerta}</Alert>}
            {loader === 'Guardando...' && <Loader>Guardando...</Loader>}
            {modal === 'Guardando...' && <Loader> {modal} </Loader>}
        </>
    )
}



