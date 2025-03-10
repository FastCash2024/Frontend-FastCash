import { useEffect, useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import FormLayout from '@/components/formModals/FormLayout'
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";

export default function FormUpdateTipoApp() {
    const { setAlerta, applicationTipo, setModal, setLoader } = useAppContext()

    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({ categoria: 'libre' })
    const searchParams = useSearchParams()
    const applicationId = searchParams.get('application');

    useEffect(() => {
        if (applicationTipo) {
            setData({
                valorDepositoLiquido: applicationTipo.valorDepositoLiquido,
                valorPrestadoMasInteres: applicationTipo.valorPrestadoMasInteres,
                interesDiario: applicationTipo.interesDiario,
                interesTotal: applicationTipo.interesTotal,
                valorPrestamoMenosInteres: applicationTipo.valorPrestamoMenosInteres,
                valorExtencion: applicationTipo.valorExtencion,
                nivelDePrestamo: applicationTipo.nivelDePrestamo,
            });
        }
    }, [applicationTipo]);

    console.log("data update: ", data)


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
            valorDepositoLiquido: data.valorDepositoLiquido,
            valorPrestadoMasInteres: data.valorPrestadoMasInteres,
            interesDiario: data.interesDiario,
            interesTotal: data.interesTotal,
            valorPrestamoMenosInteres: data.valorPrestamoMenosInteres,
            valorExtencion: data.valorExtencion,
            nuevoNivelDePrestamo: data.nivelDePrestamo
        };

        console.log("data enviar: ", payload);


        try {
            const urlBase = window?.location?.href?.includes('localhost')
                ? `http://localhost:3006/api/users/applications/updatetipoaplicacion`
                : `https://api.fastcash-mx.com/api/users/applications/updatetipoaplicacion`;

            const response = await fetch(`${urlBase}/${applicationId}/${applicationTipo.nivelDePrestamo}`, {
                method: 'PUT',
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
            console.error('Error al actualizar:', error.message);
            setLoader('');
            setAlerta('Error en la actualización');
        }
    };


    return (
        <FormLayout>
            <h4 className='w-full text-center text-gray-950'>Editar Tipo Aplicación</h4>

            <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor Prestamo mas interes:
                </label>
                <Input
                    type="number"
                    name='valorPrestadoMasInteres'
                    onChange={onChangeHandler}
                    value={data.valorPrestadoMasInteres || ''}
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
                <label htmlFor="valorPrestamoMenosInteres" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Prestamo menos interes:
                </label>
                <Input
                    type="number"
                    name='valorPrestamoMenosInteres'
                    onChange={onChangeHandler}
                    value={data.valorPrestamoMenosInteres || ''}
                    placeholder='5000'
                    required />

            </div>

            <div className='flex justify-between w-[100%]'>
                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Valor Extencion:
                </label>
                <Input
                    type="number"
                    name='valorExtencion'
                    onChange={onChangeHandler}
                    value={data.valorExtencion || ''}
                    placeholder='5000'
                    required />
            </div>
            <div className='flex justify-between w-[100%]'>
                <label htmlFor="nivelDePrestamo" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Nivel:
                </label>
                <Input
                    type="number"
                    name="nivelDePrestamo"
                    onChange={onChangeHandler}
                    value={data.nivelDePrestamo || ''}
                    placeholder="1"
                    required
                />
            </div>
            <button type="button"
                className="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={handleSubmit}>Actualizar Aplicación
            </button>
        </FormLayout>
    );
}