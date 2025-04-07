'use client'
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext'
import SelectSimple from '@/components/SelectSimple'
import { useSearchParams } from 'next/navigation'
import Velocimetro from '@/components/Velocimetro'
import Button from '@/components/Button'
import Link from 'next/link';
import SearchInput from "@/components/SearchInput";
import MultipleInput from '@/components/MultipleInput';

const ControlCasesTools = () => {
    const { checkedArr, setModal, loader, setLoader, user } = useAppContext()
    const searchParams = useSearchParams()
    const { theme, toggleTheme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [filter, setFilter] = useState({})
    const [query, setQuery] = useState('')
    const [filtro_1, setFiltro_1] = useState([]);

    function onChangeHandler(e) {
        const db = { ...filter, [e.target.name]: e.target.value }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    function onChangeHandlerDate(e) {
        const { name, value } = e.target;

        setFilter((prevFilter) => {
            const prevValue = prevFilter[name] ? prevFilter[name].split(", ") : [];

            let updatedValues;
            if (prevValue.length >= 2) {
                updatedValues = [prevValue[0], value];
            } else {
                updatedValues = [...prevValue, value];
            }

            const updatedFilter = { ...prevFilter, [name]: updatedValues.join(", ") };
            setQuery(objectToQueryString(updatedFilter));
            return updatedFilter;
        });
    }


    function handlerSelectClick(name, i, uuid) {
        const db = { ...filter, [name]: i }
        setFilter(db)
        setQuery(objectToQueryString(db))
    }

    console.log('query:', setQuery);


    function objectToQueryString(obj) {
        if (!obj || typeof obj !== "object") {
            throw new Error("La entrada debe ser un objeto.");
        }
        return Object.keys(obj)
            .filter(key => obj[key] !== undefined && obj[key] !== null) // Filtrar valores nulos o indefinidos
            .map(key => `filter[${encodeURIComponent(key)}]=${encodeURIComponent(obj[key])}`) // Codificar clave=valor
            .join("&"); // Unir con &
    }

    function resetFilter() {
        setFilter({});
        setQuery('');
    }


    function handlerFetch() {
        setLoader(true)
    }
    return (
        <div>
            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}
            <div>
                <div className="w-full   relative  scroll-smooth mb-2 ">
                    <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <SearchInput
                                label="Cuenta Operativa:"
                                name="cuenta"
                                value={filter['cuenta'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Cuenta opera.."
                                required
                            />
                            <SearchInput
                                label="Nombre Personal:"
                                name="nombrePersonal"
                                value={filter['nombrePersonal'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Juan Perez"
                                required
                            />

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <SearchInput
                                label="Cuenta Auditora:"
                                name="cuentaAuditor"
                                value={filter['cuentaAuditor'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                placeholder="Cuenta audit...."
                                required
                            />
                            <SearchInput
                                label="Segmento:"
                                name="segmento"
                                value={filter['segmento'] || ''}
                                onChange={onChangeHandler}
                                theme={theme}
                                type="text"
                                placeholder="Buscar por segmento"
                                required
                            />
                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-start items-center'>
                                <label htmlFor="" className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Filtar por fecha:
                                </label>
                                <input
                                    type='date'
                                    className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px]"
                                    name='fechaDeAuditoria'
                                    onChange={onChangeHandler}
                                    value={filter['fechaDeAuditoria'] || ''}
                                    required
                                />
                            </div>
                            <div className='flex gap-2 space-x-3'>
                                <Link href={`?seccion=${seccion}&item=${item}&${query}`}>
                                    <Button type="button" theme={'Success'} >Consultar</Button>
                                </Link>
                                <Link href={`?seccion=${seccion}&item=${item}`}>
                                    <Button type="button" theme={'MiniPrimary'} click={resetFilter} >Restablecer</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {!user.rol.includes("Asesor") && item === "Control de Cumplimiento" && (

                        <div className='grid grid-cols-3 gap-x-0 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <div className='flex justify-between space-x-3'>
                                    <Button type="button" theme={'Success'} click={() => setModal('Distribuir Casos Auditoria')}>Distribuir</Button>
                                    <Button type="button" theme={checkedArr.length > 0 ? 'Success' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Asignar Cuenta Auditoria')}>Asignar cuenta</Button>
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between space-x-3'>
                                    <Button type="button" theme={checkedArr.length > 0 ? 'Danger' : 'Disable'} click={() => checkedArr.length > 0 && setModal('Restablecimiento Masivo Auditoria')}>Restablecimiento Masivo</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlCasesTools;
