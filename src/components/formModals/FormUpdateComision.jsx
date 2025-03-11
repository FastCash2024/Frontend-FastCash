import React, { useEffect, useState } from 'react'
import SelectSimple from '@/components/SelectSimple'
import FormLayout from '@/components/formModals/FormLayout'
import Input from '@/components/Input'
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { extraerCodigo } from '@/utils/tableTools';

const dataRoles = [
  'D2 = 2 DIAS ANTES DE LA FECHA DE COBRO',
  'D1 = 1 DIA ANTES DE LA FECHA DE COBRO',
  'D0 = DIA DE LA FECHA DE COBRO',
  'S1 = 1 - 7 DIAS DE MORA EN EL SISTEMA',
  'S2 = 8 - 16 DIAS DE MORA EN EL SISTEMA'
]


export default function FormUpdateComision() {
  const { theme, setLoader, setAlerta, setModal, appComision } = useAppContext();
  const searchParams = useSearchParams()
  const seccion = searchParams.get('seccion')
  const item = searchParams.get('item')
  const [data, setData] = useState({})
  const [value, setValue] = useState('Por favor elige')
  const [value2, setValue2] = useState('Por favor elige')

  function onChangeHandler(e) {
    const { name, value } = e.target;
    const updatedData = { ...data, [name]: value };
    setData(updatedData)
  }

  function handlerSelectClick2(name, i, uuid) {
    if (name === "aplicacion") {
      setValue(i);
      setData((prevData) => ({
        ...prevData,
        aplicacion: i,
      }));
    } else {
      setValue2(i);
      setData((prevData) => ({
        ...prevData,
        segmento: i,
      }));
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (value === "Por favor elige" || value2 === "Por favor elige") {
        setAlerta("Falta Observaciones!");
        return;
      }
      setLoader("Guardando...");
      const dataComision = {
        ...data
      }
      console.log("data comision: ", dataComision);

      const url = window?.location?.href?.includes('localhost')
        ? `http://localhost:3006/api/users/comision/${appComision._id}`
        : `https://api.fastcash-mx.com/api/users/comision${appComision._id}`;

      const response = await fetch(url, {
        method: 'PUT',
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
      <p className='w-full text-center text-gray-950'>Editar comisión</p>
      <div className='flex flex-row justify-between w-full'>
        <label htmlFor="segmento" className={`mr-5 text-[10px] text-gray-950`}>
          Segmento de Cobranza:
        </label>
        <SelectSimple
          arr={dataRoles.map(item => extraerCodigo(item))}
          name='segmento'
          click={handlerSelectClick2}
          defaultValue={data.segmento}
          uuid='123'
          label='Filtro 1'
          position='absolute left-0 top-[25px]'
          bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
          required />
      </div>
      <div className='flex flex-row justify-between w-full gap-4'>
        <div className='flex flex-row justify-center items-center'>
          <label htmlFor="desde" className={`mr-1 text-[10px] text-gray-950`}>
            Desde:
          </label>
          <Input
            type="text"
            name="desde"
            value={data.desde || ""}
            onChange={onChangeHandler}
            placeholder="30%"
            required
          />
        </div>
        <div className='flex flex-row justify-center items-center'>
          <label htmlFor="hasta" className={`mr-1 text-[10px] text-gray-950`}>
            Hasta:
          </label>
          <Input
            type="text"
            name="hasta"
            value={data.hasta || ""}
            onChange={onChangeHandler}
            placeholder="40%"
            required
          />
        </div>
      </div>
      <div className='flex flex-row justify-between w-full gap-4'>
        <div className='flex flex-row justify-center items-center'>
          <label htmlFor="comisionPorCobro" className={`mr-1 text-[10px] text-gray-950`}>
            Comisión por cobro:
          </label>
          <Input
            type="number"
            name="comisionPorCobro"
            value={data.comisionPorCobro || ""}
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
