 'use client'
 
 import { useEffect, useState } from "react"
 import { useAppContext } from '@/context/AppContext'
 import { useTheme } from '@/context/ThemeContext';
 import SelectSimple from '@/components/SelectSimple'
 import FormLayout from '@/components/formModals/FormLayout'
 
 export default function Attendance() {
     const { setAlerta, setModal, setLoader, attendance } = useAppContext()
     const { theme, toggleTheme } = useTheme();
     const [data, setData] = useState({estadoDeAsistencia:''})
 
    useEffect(() => {
            if (attendance) {
                setData({
                    id: attendance.userId,
                    estadoDeAsistencia: attendance.status,
                    fecha: attendance.date
                });
            }
    }, [attendance]);

    console.log("attendance: ", data);
    
     function onChangeHandler(e) {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }    

    function handlerSelectClick2(name, i, uuid) {
         setData({ ...data, [name]: i })
     }
 
     
    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoader('Guardando...');
        
        if (!data.id || !data.fecha || !data.estadoDeAsistencia) {
            alert('Por favor, complete todos los campos');
            setLoader('');
            return;
        }
    
        const requestData = {
            userId: data.id,
            fecha: data.fecha, 
            EstadoDeAsistencia: data.estadoDeAsistencia,
            observaciones: data.observaciones || '',
        };
    
        try {
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/attendance/update'
                : 'https://api.fastcash-mx.com/api/attendance/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
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
            console.error('Error al actualizar la asistencia:', error.message);
            setLoader('');  // Quitar el loader en caso de error
            alert('Hubo un error al actualizar la asistencia.');
        }
    };
    
  
     return (
         <FormLayout>
             <h4 className='w-full text-center text-gray-950'>Añadir cuenta</h4>
             <div className='flex justify-between  w-[100%]'>
                 <label htmlFor="calificacion" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Observación:
                 </label>
                 <textarea
                     className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'}  dark:bg-transparent`}
                     type="textarea"
                     name="observaciones"
                     onChange={onChangeHandler}
                     placeholder="observaciones" 
                     required
                 />
             </div>
             <div className='relative flex justify-between  w-[100%]'>
                 <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                     Estado de asistencia:
                 </label>
                 <SelectSimple
                     arr={['Libre', 'Operando', 'Atraso-1', 'Atraso-2', 'Falta']}
                     name='estadoDeAsistencia'
                     click={handlerSelectClick2}
                     defaultValue={data?.estadoDeAsistencia ? data?.estadoDeAsistencia : 'Seleccionar'}
                     uuid='123'
                     label='Filtro 1'
                     position='absolute left-0 top-[25px]'
                     bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                     required />
             </div>
             <button type="button"
                 class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                 onClick={handleSubmit}>Registrar Asistencia
             </button>
         </FormLayout>
     )
 }