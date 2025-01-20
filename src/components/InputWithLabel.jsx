export default function InputWithLabels({ label, onchange, arr }) {
    return (
        <div className='flex justify-between'>
            <label htmlFor={htmlFor} className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                {label}
            </label>
            <input className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  
                ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-black bg-gray-200'} dark:text-white  dark:bg-transparent`}
                onChange={onchange}
                defaultValue={defaultValue}
                uuid='123'
                label='Filtro 1'
                position='absolute left-0 top-[25px]'
                bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}
            />
        </div>)
}