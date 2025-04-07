import { useTheme } from '@/context/ThemeContext';
import React from 'react'

export default function SelectSegment({ label, options, name, onChangeHandler, selectedValue, uuid }) {
    const { theme, toggleTheme } = useTheme();
    return (
        <select
            name={name}
            value={selectedValue}
            onChange={(e) => onChangeHandler(name, e.target.value, uuid)}
            className={`relative top-[0px] w-full text-[10px] h-[25px]  px-5 border border-gray-400 bg-white  outline-none focus:outline-none bg-transparent caret-transparent cursor-pointer text-gray-950 ${theme === 'light' ? 'text-gray-950 bg-white' : 'text-gray-950 bg-gray-200'} bg-white dark:bg-gray-800 dark:text-white peer rounded-[5px]`}
        >
            {options.map((option) => (
                <option key={option} value={option} className="text-[10px] border-b border-gray-300">
                    {option}
                </option>
            ))}
        </select>

    );
};