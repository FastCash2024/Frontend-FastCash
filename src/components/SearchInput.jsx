import React from 'react'

const SearchInput = ({label, name, value, onChange, theme, placeholder, required = false}) => {
  return (
    <div className='flex justify-between'>
        <label htmlFor={name} className={`mr-5 text-[10px] ${theme === 'light' ? 'text-gray-950' : 'text-gray-950'} dark: text-whithe`}>{label}</label>
        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px] ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white dark:bg-transparent`} 
            name={name}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            required={required}
        />
    </div>
  )
}

export default SearchInput;