'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';


export default function Input({click, value, type, name, onChange,reference, placeholder, required}) {
    const { theme, toggleTheme } = useTheme();

    const router = useRouter()


    function handlerButton(e) {
        e.preventDefault(e)
        router.push(click)
    }


    return (
        <input
            type={type}
            name={name}
            className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'}  dark:bg-transparent`}
            // className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3
            //  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={onChange}
            value={value}
            // style={{...styled}}
            required={required}
            ref={reference}
            placeholder={placeholder}
          />
    )
}