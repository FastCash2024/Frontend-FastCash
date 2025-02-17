import React from 'react';

const MultipleInput = ({ theme, handlerSelectClick, handlerSelectClick2, label, name1, name2, defaultValue1, defaultValue2, required1 = false, required2 = false }) => {
    return (
        <div className='flex justify-end items-center'>
            <label htmlFor="" className={`mr-2 w-14 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                {label}
            </label>
            <div className='grid grid-cols-2 gap-2'>
                <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px] text-gray-950" 
                    name={name1} 
                    onChange={handlerSelectClick} 
                    defaultValue={defaultValue1}   
                    required={required1} 
                />
                <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-gray-400 rounded-[5px] text-[10px] text-gray-950" 
                    name={name2} 
                    onChange={handlerSelectClick2} 
                    defaultValue={defaultValue2}   
                    required={required2} 
                />
            </div>
        </div>
    );
};

export default MultipleInput;