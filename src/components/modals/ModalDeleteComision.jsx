import React from 'react'
import { useAppContext } from '@/context/AppContext';
import FormLayout from '@/components/formModals/FormLayout'

export default function ModalDeleteComision() {
  const { setAlerta, application, setModal, setLoader, appComision } = useAppContext();

  console.log("eliminar aplicacion: ", application);


  const handleDelete = async () => {
    setLoader('Eliminando...');
    try {
      const response = await fetch(window?.location?.href?.includes('localhost')
        ? `http://localhost:3006/api/users/comision/delete/${appComision._id}`
        : `https://api.fastcash-mx.com/api/comision/delete/${appComision._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setLoader('');
        setAlerta("Error al eliminar");
        throw new Error(`Error en la eliminación: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("data comision resultado comision: ", result);
      setModal('');
      setLoader('');
      setAlerta('Comision eliminada exitosamente!');
    } catch (error) {
      setLoader('');
      console.error('Error al eliminar la aplicación:', error.message);
    }
  };

  const handleCancel = () => {
    setModal('');
  };

  return (
    <FormLayout>
      <div className="text-center">
        <p className='text-gray-950'>¿Está seguro de que quiere eliminar la comision con los rangos <strong>{appComision.desde}</strong> - <strong>{appComision.hasta}</strong>?</p>
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