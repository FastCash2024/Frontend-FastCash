'use client'

import { useState, useEffect } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast';
import FormLayout from '@/components/formModals/FormLayout'
import Input from '@/components/Input'



export default function AddAccount() {
    const { setAlerta, setModal, setLoader } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({ categoria: 'libre' })
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // console.log("image selected: ", selectedFile)

    console.log("data register: ", data)
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
        setLoader('Guardando...')

        console.log("selectedImage handleSubmit: ", selectedFile);

        if (!selectedFile) {
            alert('Por favor selecciona un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile); // Archivo
        formData.append('nombre', data.nombre); // Datos adicionales
        formData.append('valorPrestado', data.valorPrestado);
        formData.append('valorDepositoLiquido', data.valorDepositoLiquido);
        formData.append('interesTotal', data.interesTotal);
        formData.append('interesDiario', data.interesDiario);
        formData.append('valorPrestamoMenosInteres', data?.valorPrestado * 1 - data?.interesTotal * 1);
        formData.append('valorExtencion', data?.valorPrestado * 1 - data?.valorDepositoLiquido * 1);
        formData.append('calificacion', data.calificacion);

        try {
            // url: https://api.fastcash-mx.com/api/authApk/register
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/applications/register'
                : 'https://api.fastcash-mx.com/api/applications/register', {
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
            console.error('Error al subir archivo:', error.message);
        }
    };



    return (
        <FormLayout>
            <h4 className='w-full text-center text-gray-950'>Añadir aplicacion</h4>
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
                <label htmlFor="nombre" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Nombre:
                </label>
                <Input
                    type="text"
                    name="nombre"
                    onChange={onChangeHandler}
                    placeholder="Nombre"
                    required
                />
            </div>
            <div className='flex justify-between  w-[100%]'>
                <label htmlFor="calificacion" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Calificación:
                </label>
                <Input
                    type="number"
                    name="calificacion"
                    onChange={onChangeHandler}
                    placeholder="calificacion"
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