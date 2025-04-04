import React from 'react';
import FormLayout from '@/components/formModals/FormLayout';
import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import { postTracking } from '@/app/service/TrackingApi/tracking.service';
import { obtenerFechaMexicoISO } from '@/utils/getDates';
import { getDescripcionDeExcepcion } from '@/utils/utility-tacking';

export default function ModalDeleteTipoApp() {
    const { setAlerta, applicationTipo, setModal, setLoader, userDB } = useAppContext();
    const searchParams = useSearchParams()
    const applicationId = searchParams.get('application');

    const handleDelete = async () => {
        setLoader('Eliminando...');
        try {
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? `http://localhost:3006/api/users/applications/deletetipoaplicacion/${applicationId}/${applicationTipo.tipo}`
                : `https://api.fastcash-mx.com/api/users/applications/deletetipoaplicacion/${applicationId}/${applicationTipo.tipo}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error en la eliminación: ${response.statusText}`);
            }

            await response.json();
            const tackingData = {
                descripcionDeExcepcion: getDescripcionDeExcepcion(item),
                cuentaOperadora: userDB.cuenta,
                cuentaPersonal: userDB.emailPersonal,
                codigoDeSistema: applicationTipo.nombre,
                codigoDeOperacion: 'CC09APPEDC',
                contenidoDeOperacion: `El usuario ${userDB.emailPersonal} ha eliminado el nivel para la aplicación ${applicationTipo.nombre}`,
                fechaDeOperacion: obtenerFechaMexicoISO()
            }
            await postTracking(tackingData);
            setModal('');
            setLoader('');
            setAlerta('Tipo de Aplicación eliminada exitosamente!');
            // console.log('Respuesta del servidor:', result);
        } catch (error) {
            console.error('Error al eliminar la aplicación:', error.message);
        }
    };

    const handleCancel = () => {
        setModal('');
    };

    return (
        <FormLayout>
            <div className="text-center">
                <p className='text-gray-950'>¿Está seguro de que quiere eliminar el tipo <strong>{applicationTipo.tipo}</strong> de la aplicación?</p>
                <div className="flex justify-center mt-4 space-x-3">
                    <button
                        className="w-full max-w-[70px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center"
                        onClick={handleDelete}
                    >
                        Sí
                    </button>
                    <button
                        className="w-full max-w-[70px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </FormLayout>
    );
}