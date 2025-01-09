'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast';
import FormLayout from '@/components/FormLayout'



export default function AddAccount() {
    const { user, userDB, setUserProfile, setAlerta, users, modal, setModal, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({categoria:'libre'})
    const [value1, setValue1] = useState('Por favor elige')
    const [value2, setValue2] = useState('Por favor elige')
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const searchParams = useSearchParams()

    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')

    console.log(data)
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file); // Mostrar vista previa
        if (file) {
            const reader = new FileReader();
            // Convertir la imagen a Base64
            reader.onload = () => {
                const base64String = reader.result.split(",")[1]; // Eliminar el encabezado de Base64
                setSelectedImage(reader.result); // Mostrar vista previa
            };
            reader.readAsDataURL(file); // Leer la imagen como una URL Base64
        }
    };
    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    function handlerSelectClick2(name, i, uuid) {
        setData({ ...data, [name]: i })

    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader('Guardando...')

        if (!selectedFile) {
            alert('Por favor selecciona un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile); // Archivo
        formData.append('nombre', data.nombre); // Datos adicionales
        formData.append('prestamoMaximo', data.prestamoMaximo);
        formData.append('interesDiario', data.interesDiario);
        formData.append('calificacion', data.calificacion);
        formData.append('categoria', data.categoria);

        try {
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/applications/register'
                : 'https://api.fastcash-mx.com/api/authApk/register', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error en la carga: ${response.statusText}`);
            }

            const result = await response.json();
            setModal('')
            setLoader('')
            setAlerta('Operación exitosa!')
            console.log('Respuesta del servidor:', result);
        } catch (error) {
            console.error('Error al subir archivo:', error);
        }
    };
 
    return (
        <FormLayout>
            <h4 className='w-full text-center text-gray-950'>Añadir cuenta</h4>
            <div className="relative left-0 right-0 mx-auto w-[100px] h-[100px] flex flex-col items-center justify-center border border-dotted border-gray-700 rounded-lg bg-gray-100 hover:bg-gray-200">
                <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center p-2"
                >
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="absolute top-0 w-[100px] h-[100px] object-cover rounded-md shadow-md"
                        />
                    ) : (
                        <div className="flex flex-col justify-center items-center text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <p className=" text-[10px]">Cargar icono de app</p>
                        </div>
                    )}
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Nombre:
                </label>
                <input name='nombre' className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='Mathew' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Prestamo Maximo:
                </label>
                <input name='prestamoMaximo' className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='Mathew' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Interes Diario:
                </label>
                <input name='interesDiario' className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='Mathew' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>
            <div className='flex justify-between  w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Calificación:
                </label>
                <input name='calificacion' className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='Mathew' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>
            <div className='relative flex justify-between  w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Acceso a usuarios:
                </label>
                <SelectSimple
                    arr={['libre', 'estandar', 'premium']}
                    name='categoria'
                    click={handlerSelectClick2}
                    defaultValue={data?.categoria ? data?.categoria : 'Seleccionar'}
                    uuid='123'
                    label='Filtro 1'
                    position='absolute left-0 top-[25px]'
                    bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                    required />
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={handleSubmit}>Registrar Aplicacion
            </button>
        </FormLayout>)
}