'use client'

import { useEffect, useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import FormLayout from '@/components/formModals/FormLayout'
import Input from "@/components/Input";

export default function FormUpdateAplication() {
    const { setAlerta, application, setModal, setLoader } = useAppContext()

    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({ categoria: 'libre' })
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (application) {
            setData({
                nombre: application.nombre,
                valorPrestado: application.valorPrestado,
                valorDepositoLiquido: application.valorDepositoLiquido,
                interesTotal: application.interesTotal,
                interesDiario: application.interesDiario,
                calificacion: application.calificacion,
                categoria: application.categoria,
            });
            if (application.icon) {
                setSelectedImage(application.icon);
            }
        }
    }, [application]);

    console.log("data update: ", data)
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

    console.log("File selected: ", selectedFile)
    console.log("Image selected: ", selectedImage)

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
    function handlerSelectClick2(name, i, uuid) {
        setData({ ...data, [name]: i })

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader('Guardando...')

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
        formData.append('categoria', data.categoria);

        try {
            // url: https://api.fastcash-mx.com/api/authApk/register
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? `http://localhost:3006/api/users/applications/update/${application._id}`
                : `https://api.fastcash-mx.com/api/users/applications/update/${application._id}`, {
                method: 'PUT',
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
    console.log(selectedImage)
    return (
        <FormLayout>
            <h4 className='w-full text-center text-gray-950'>Editar Aplicación</h4>
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
                <Input
                    name='nombre'
                    onChange={onChangeHandler}
                    value={data.nombre || ''}
                    placeholder='Fast Money'
                    required
                />
            </div>
            {/* <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor Prestamo:
                </label>
                <Input
                    type="number"
                    name='valorPrestado'
                    onChange={onChangeHandler}
                    value={data.valorPrestado || ''}
                    placeholder='5000'
                    required />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor depositado liquido:
                </label>
                <Input
                    type="number"
                    name='valorDepositoLiquido'
                    onChange={onChangeHandler}
                    value={data.valorDepositoLiquido || ''}
                    placeholder='1200'
                    required
                />
            </div>

            <div className='flex justify-between w-[100%]'>
                <label htmlFor="interesTotal" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Interes Total:
                </label>
                <Input
                    type="text"
                    name='interesTotal'
                    onChange={onChangeHandler}
                    value={data.interesTotal || ''}
                    placeholder='5000'
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="interesDiario" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Interes Diario:
                </label>
                <input
                    name='interesDiario'
                    className={`h-[25px] max-w-[173px] w-full text-black px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    value={data.interesDiario || ''}
                    readOnly
                    placeholder='Mathew'
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="valorDepositoLiquido" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Prestamo menos interes:
                </label>
                <Input
                    type="number"
                    name="prestamoMenosInteres"
                    value={data?.valorPrestado * 1 - data?.interesTotal * 1}
                    onChange={onChangeHandler}
                    placeholder="Valor de deposito liquido"
                    required
                />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="valorDepositoLiquido" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Extension de pago:
                </label>
                <Input
                    type="number"
                    name="extencionDePago"
                    value={data?.valorPrestado * 1 - data?.valorDepositoLiquido * 1}
                    onChange={onChangeHandler}
                    placeholder="Valor de deposito liquido"
                    required
                />
            </div> */}
            <div className='flex justify-between  w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Calificación:
                </label>
                <Input
                    type="text"
                    name='calificacion'
                    onChange={onChangeHandler}
                    value={data.calificacion || ''}
                    placeholder='4.3'
                    required />
            </div>
            <button type="button"
                className="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={handleSubmit}>Actualizar Aplicación
            </button>
        </FormLayout>
    );
}