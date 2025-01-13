import React from 'react'

const SelectField = ({ label, name, arr, click, defaultValue, uuid, position, bg, theme, required = false}) => {
  return (
    <div className='flex justify-between'>
        <label htmlFor={name} className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
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