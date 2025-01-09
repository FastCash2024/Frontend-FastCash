'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';


export default function Select({ arr, name, click, defaultValue, uuid, label, position, bg, required }) {
    const { theme, toggleTheme } = useTheme();

    const router = useRouter()
    const { select, setSelect, languaje, success} = useAppContext()
    const [state, setState] = useState(defaultValue ? defaultValue : arr[0])
    function handlerSelect() {
        select === name ? setSelect('') : setSelect(name)

    }
    function handlerUserState(name, i) {
        setState(i)
        click(name, i, uuid)
    }
    return (
        <div className='relative '>
                <div id={label}
                    className={`relative  border border-gray-400  pt-.5 mb-0   w-full text-[10px] h-[25px]  px-5 cursor-pointer max-w-[173px] ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-gray-950 bg-gray-200 '} dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-0  peer rounded-[5px]`}
                    onClick={handlerSelect}>
                    {defaultValue === 'Seleccionar' && <span className='absolute top-2'>Seleccionar</span>}
                    <input type="text" readonly className='relative top-[0px] w-full h-full border-transparent outline-none focus:outline-none bg-transparent caret-transparent cursor-pointer' value={defaultValue !== undefined && defaultValue !== 'Seleccionar' ? defaultValue : arr[0]} minLength={2} required={required} />
                    <span className={select === name ? `absolute top-[4px] right-[10px] rotate-[270deg]  ${theme === 'light' ? ' text-gray-950' : ' text-white'} dark:text-white` : `absolute top-[4.5px] right-[10px] rotate-90 ${theme === 'light' ? ' text-gray-950' : ' text-white'} dark:text-white`}>{'>'}</span>
                    <ul
                        className={` ${position ? position : 'relative'} ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-gray-950  bg-gray-200 '} dark:text-white mt-0  transition-all rounded-[5px]  w-full  ${select === name ? ` ${arr.length > 2 && 'h-[75px] border-t z-10 border border-gray-400   overflow-auto '} ${arr.length == 2 && 'h-[48px] border-t overflow-hidden border border-gray-400   z-10'} ${arr.length == 1 && 'h-[25px] border-t overflow-hidden border border-gray-400   z-10'}  ` : 'h-[0] overflow-hidden'}`}  >
                        {
                            arr?.map((i, index) => <li key={index} className='flex items-center hover:bg-gray-100 text-black border-b cursor-pointer px-2 py-1' onClick={() => handlerUserState(name, i)}> {i} </li>)
                        }
                    </ul>
                </div>
                {/* {label && <label htmlFor={label} className={`z-50 peer-focus:font-medium shadow-white shadow-2xl absolute text-[10px] ${select === name ? 'text-blue-600' : 'text-[#6b7280]'} bg-white px-5 mx-2 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600  peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>{label}</label>} */}
        </div>
    )
}












