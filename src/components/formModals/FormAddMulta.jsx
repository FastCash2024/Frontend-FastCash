'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import Input from "@/components/Input";


export default function FormAddMulta() {
    const { user, userDB, itemSelected, setAlerta, users, modal, setModal, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({})

    console.log("item selected: ", itemSelected);
    
    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const saveMulta = async (e) => {
        e.preventDefault();
        try {
            if (!selectedFile) {
                alert('Por favor selecciona un archivo');
                return;
            }

            setLoader('Guardando...')
            const formData = new FormData();
            formData.append('file', selectedFile); // Archivo
            formData.append('nombreCompleto', data.nombreCompleto); // Datos adicionales
            formData.append('dni', data.dni);
            formData.append('numeroDeTelefonoMovil', data.numeroDeTelefonoMovil);
            const id = userDB.id ?? user.id;
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? `http://localhost:3000/api/auth/registerPersonal/${id}`
                : `https://api.fastcash-mx.com/api/auth/registerPersonal/${id}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
            const result = await response.json();
            console.log(result);
            setAlerta('Operación exitosa!')
            setModal('')
            setLoader('')
            // navigate('/dashboard');
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')
        }
    };

    return (
        <div
            className="fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50"
            onClick={() => setModal(false)}
        >
            <div
                className="relative flex flex-col items-center justify-center bg-gray-100 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal(false)}
                >
                    X
                </button>
                <h4 className="text-gray-950">Registro de cobro</h4>
                <div className='flex justify-between w-[300px]'>
                    <label htmlFor="importeMulta" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                        Importe multa:
                    </label>
                    <Input
                        type="number"
                        name="importeMulta"
                        onChange={onChangeHandler}
                        placeholder="132123"
                        required
                    />
                </div>
                <div className="relative flex justify-between w-[300px] text-gray-950">
                    <label htmlFor="" className="mr-5 text-[10px]">
                        Registro por:
                    </label>
                    <textarea
                        name="acotacion"
                        className="text-[10px] p-2 w-[200px] focus:outline-none bg-gray-100 border-[1px] border-gray-300 rounded-[5px]" onChange={onChangeHandler}
                    ></textarea>
                </div>
                <button
                    type="button"
                    className="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                    onClick={saveMulta}
                >
                    Registrar
                </button>
            </div>
        </div>
    );
}
