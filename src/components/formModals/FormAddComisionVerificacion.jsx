import React, { useState } from 'react'
import FormLayout from '@/components/formModals/FormLayout'
import Input from '@/components/Input'
import { useAppContext } from '@/context/AppContext';

export default function FormAddComisionVerificacion() {
    const { setLoader, setAlerta, setModal } = useAppContext();
    const [data, setData] = useState({})

    function onChangeHandler(e) {
        const { name, value } = e.target;
        const updatedData = { ...data, [name]: value };
        setData(updatedData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (value2 === "Por favor elige") {
            setAlerta("Falta Observaciones!");
            return;
          }
          setLoader("Guardando...");
          const dataComision = {
            segmento: value2,
            ...data
          }
          console.log("data comision: ", dataComision);
    
          const url = window?.location?.href?.includes('localhost')
            ? 'http://localhost:3006/api/users/comision'
            : 'https://api.fastcash-mx.com/api/users/comision';
    
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataComision),
          });
    
          if (!response.ok) {
            setLoader('');
            setAlerta("Error de datos!");
            throw new Error('Error al Registrar');
          }
    
          const result = await response.json();
          console.log("data comision resultado comision: ", result);
    
          setModal('');
          setLoader('');
          setAlerta('Operación exitosa!');
        } catch (error) {
          setLoader('');
          setAlerta('Error al registra comision');
        }
      }

    return (
        <FormLayout>
            <p className='w-full text-center text-gray-950'>Añadir comisión Verificación</p>
            <div className='flex flex-row justify-between w-full gap-4'>
                <div className='flex flex-row justify-center items-center'>
                    <label htmlFor="comisionPorCobro" className={`mr-1 text-[10px] text-gray-950`}>
                        Comisión por Aprobación:
                    </label>
                    <Input
                        type="number"
                        name="comisionPorCobro"
                        onChange={onChangeHandler}
                        placeholder="0.1"
                        step="0.01"
                        required
                    />
                </div>
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={handleSubmit}>Registrar Comisión
            </button>
        </FormLayout>
    )
}