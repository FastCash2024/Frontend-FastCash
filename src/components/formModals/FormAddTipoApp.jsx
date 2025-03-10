'use client'

import { useState, useEffect } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import FormLayout from '@/components/formModals/FormLayout'
import Input from '@/components/Input'



export default function FormAddTipoApp() {
    const { setAlerta, setModal, setLoader, applicationTipo } = useAppContext()
    const { theme } = useTheme();
    const [data, setData] = useState({ categoria: 'libre' })

    console.log("application: ", applicationTipo.data.length)

   

    function onChangeHandler(e) {
        const { name, value } = e.target;
        const updatedData = { ...data, [name]: value };

        if (name === 'interesTotal') {
            const dias = 7;
            const interesTotal = parseFloat(value);
            const interesDiario = (interesTotal / dias).toFixed(2);
            updatedData.interesDiario = interesDiario;
        }
        setData(updatedData)
    }



    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader('Guardando...');
    
        const payload = {
            valorPrestadoMasInteres: data.valorPrestadoMasInteres,
            valorDepositoLiquido: data.valorDepositoLiquido,
            interesTotal: data.interesTotal,
            interesDiario: data.interesDiario,
            valorPrestamoMenosInteres: data.valorPrestamoMenosInteres,
            valorExtencion: data.valorExtencion,
            nivelDePrestamo: data.nivelDePrestamo,
        };
        
        console.log("data enviada: ", payload);
        
        try {
            const urlBase = window?.location?.href?.includes('localhost')
                ? `http://localhost:3006/api/users/applications/addtipoaplicacion`
                : `https://api.fastcash-mx.com/api/users/applications/addtipoaplicacion`;
    
            const response = await fetch(`${urlBase}/${applicationTipo._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`Error en la carga: ${response.statusText}`);
            }
    
            const result = await response.json();
            setModal('');
            setLoader('');
            setAlerta('Operación exitosa!');
            console.log('Respuesta del servidor:', result);
        } catch (error) {
            console.error('Error al agregar nivel:', error.message);
            setLoader('');
            setAlerta('Error al agregar el nivel');
        }
    };
    

    console.log("data add nivel: ", data);
    

    return (
        <FormLayout>
            <h4 className='w-full text-center text-gray-950'>Añadir nivel de aplicacion</h4>

            <div className='flex justify-between w-[100%]'>
                <label htmlFor="valorPrestadoMasInteres" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor Prestamo mas interes:
                </label>
                <Input
                    type="number"
                    name="valorPrestadoMasInteres"
                    onChange={onChangeHandler}
                    placeholder="Valor prestado"
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="valorDepositoLiquido" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor depositado liquido:
                </label>
                <Input
                    type="number"
                    name="valorDepositoLiquido"
                    onChange={onChangeHandler}
                    placeholder="Valor de deposito liquido"
                    required
                />
            </div>

            <div className='flex justify-between w-[100%]'>
                <label htmlFor="interesTotal" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Interes Total:
                </label>
                <Input
                    type="text"
                    name="interesTotal"
                    onChange={onChangeHandler}
                    value={data.interesTotal}
                    placeholder="Interes Total"
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="interesDiario" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Interes Diario:
                </label>
                <input
                    name='interesDiario'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'}  dark:bg-transparent`}
                    value={data.interesDiario}
                    readOnly
                    placeholder='Mathew'
                    required
                />
            </div>

            <div className='flex justify-between w-[100%]'>
                <label htmlFor="valorPrestamoMenosInteres" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor Prestamo menos interes:
                </label>
                <Input
                    type="number"
                    name="valorPrestamoMenosInteres"
                    onChange={onChangeHandler}
                    placeholder="Valor prestado"
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="valorExtencion" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor de extension:
                </label>
                <Input
                    type="number"
                    name="valorExtencion"
                    onChange={onChangeHandler}
                    placeholder="Valor prestado"
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="nivelDePrestamo" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Nivel:
                </label>
                <Input
                    type="number"
                    name="nivelDePrestamo"
                    onChange={onChangeHandler}
                    placeholder="1"
                    required
                />
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={handleSubmit}>Registrar Aplicacion
            </button>
        </FormLayout>
    )
}