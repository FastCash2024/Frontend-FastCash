import React from 'react';
import FormLayout from '@/components/formModals/FormLayout';
import { useAppContext } from '@/context/AppContext';

export default function ModalDeleteNewslater() {
    const { setAlerta, newslater, setModal, setLoader } = useAppContext();

    console.log("eliminar aplicacion: ", newslater);
    

    const handleDelete = async () => {
        setLoader('Eliminando...');
        try {
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? `http://localhost:3000/api/newsletter/delete/${newslater._id}`
                : `https://api.fastcash-mx.com/api/newsletter/delete/${newslater._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error en la eliminación`);
            }

            const result = await response.json();
            setModal('');
            setLoader('');
            setAlerta('Aplicación eliminada exitosamente!');
            console.log('Respuesta del servidor:', result);
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
                <p className='text-gray-950'>¿Está seguro de que quiere eliminar esta de <strong>información</strong>?</p>
                <div className="flex justify-center mt-4 space-x-3">
                    <button
                        className="w-full max-w-[100px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={handleDelete}
                    >
                        Sí
                    </button>
                    <button
                        className="w-full max-w-[100px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </FormLayout>
    );
}