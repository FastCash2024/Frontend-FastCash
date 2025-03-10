'use client'

import { useEffect, useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import Input from "@/components/Input";
import SelectSimple from "@/components/SelectSimple";
import { useSearchParams } from "next/navigation";

const optionsArray = [
    "Sin Observaciones",
    "Con Observaciones",
];

export default function FormAddMulta() {
    const { user, userDB, itemSelected, setAlerta, users, modal, setModal, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({})
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [dataUser, setDataUser] = useState([]);
    const [value, setValue] = useState("Por favor elige");

    console.log("item selected: ", userDB);

    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    function handlerSelectClick(name, i, uuid) {
        setValue(i);
        setData((prevData) => ({
            ...prevData,
            observaciones: i,
        }));
    }

    async function handlerFetch(limit, page) {
        const res = await fetch(
            window?.location?.href?.includes("localhost")
                ? "http://localhost:3002/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Cobranza"
                : "https://api.fastcash-mx.com/api/authSystem/users?tipoDeGrupo=Asesor%20de%20Cobranza"
        );
        const result = await res.json();
        console.log("data item selected: ", result);
        setDataUser(result);
    }

    // async function handlerFetchDetails() {
    //     const res = await fetch(
    //         window?.location?.href?.includes('localhost')
    //             ? 'http://localhost:3000/api/loans/verification/reportecobrados?estadoDeCredito=Pagado'
    //             : 'https://api.fastcash-mx.com/api/loans/verification/reportecobrados?estadoDeCredito=Pagado')
    //     const data = await res.json()
    //     console.log("data detalle: ", data)
    //     setDetails(data.data)
    // }

    useEffect(() => {
        handlerFetch();
    }, [loader]);

    const saveMulta = async (e) => {
        e.preventDefault();
        try {
            setLoader('Guardando...');
            if (data.observaciones === "Por favor elige") {
                setAlerta("Falta Observaciones!");
                return;
            }

            const multaData = {
                importeMulta: data.importeMulta,
                cuentaOperativa: itemSelected.cuenta,
                cuentaPersonal: itemSelected.emailAsesor ?? itemSelected.emailPersonal,
                fechaDeOperacion: itemSelected.fecha ?? new Date().toISOString(),
                fechaDeAuditoria: new Date().toISOString(),
                acotacion: data.acotacion,
                cuentaPersonalAuditor: userDB.emailPersonal,
                cuentaAuditor: userDB.cuenta,
                observaciones: data.observaciones,
                seccionMulta: item
            };
            console.log("data a enviar: ", multaData);

            const response = await fetch(window?.location?.href?.includes('localhost')
                ? `http://localhost:3006/api/users/multas/multas`
                : `https://api.fastcash-mx.com/api/users/multas/multas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(multaData),
            });

            if (!response.ok) {
                setLoader('');
                setAlerta('Error de datos!');
                throw new Error('Registration failed');
            }

            const result = await response.json();
            console.log(result);
            setAlerta('Operación exitosa!');
            setModal('');
            setLoader('');
            // navigate('/dashboard');
        } catch (error) {
            setLoader('');
            setAlerta('Error de datos!');
        }
    };

    return (
        <div
            className="fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50"
            onClick={() => setModal(false)}
        >
            <div
                className="relative flex flex-col items-center justify-center bg-gray-100 w-[400px] h-[400px] p-5 space-y-5 rounded-[5px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal(false)}
                >
                    X
                </button>
                <h4 className="text-gray-950">Multa</h4>
                <div className='flex justify-between w-[300px]'>
                    <label htmlFor="cuentaPersonal" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                        Cuenta Personal:
                    </label>
                    <Input
                        type="text"
                        name="cuentaPersonal"
                        value={itemSelected.cuenta || ""}
                        placeholder="132123"
                        disabled
                        required
                    />
                </div>
                <div className='flex justify-between w-[300px]'>
                    <label htmlFor="cuentaPersonal" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                        Cuenta Operativa:
                    </label>
                    <Input
                        type="text"
                        name="cuentaPersonal"
                        value={(itemSelected.emailAsesor ?? itemSelected.emailPersonal) || ""}
                        disabled
                        placeholder=""
                        required
                    />
                </div>
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
                        Observaciones:
                    </label>
                    <SelectSimple
                        arr={optionsArray}
                        name="observaciones"
                        click={handlerSelectClick}
                        defaultValue={value}
                        uuid="123"
                        label="Filtro 1"
                        position="absolute left-0 top-[25px]"
                        bg="white"
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
