import React from 'react'
import SelectSimple from '@/components/SelectSimple'

const SelectField = ({ label, name, arr, click, defaultValue, uuid, position, bg, theme, required = false}) => {
  return (
    <div className='flex justify-end items-center'>
        <label htmlFor={name} className={`mr-2 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
            {label}
        </label>
        <SelectSimple
            arr={arr}
            name={name}
            click={click}
            defaultValue={defaultValue}
            uuid={uuid}
            label={label}
            position={position}
            bg={bg}
            required={required}
        />
    </div>
    )
}

export default SelectField;