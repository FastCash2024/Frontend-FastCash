'use client';
// import style from '@/app/(layout)/style.module.css'

export default function Button({ theme, styled, click, children, type }) {


    switch (theme) {
        case 'Transparent':
            return <button
                type={type ? type : "submit"}
                className=" bg-transparent border-[1px] border-gray-50 text-white  hover:bg-transparent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-[14px] w-[100%] sm:max-w-[380px] px-5 py-3 text-center"

                onClick={click}
            >
                {children}
            </button>
            break
        case 'Primary':
            return <button
                type={type ? type : "submit"}

                className={`text-white bg-[#3FA2DA] inline-block border-[1px] border-gray-50  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-[14px]  w-full px-5 py-3 text-center cursor-pointer`}

                // className="text-white bg-violet-700 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[14px] w-full sm:w-auto px-5 py-3.5 text-center 
                // dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={click}
            >
                {children}
            </button>
            break
        case 'Secondary':
            return <button
                type={type ? type : "submit"}
                className="nhn text-white bg-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-[14px] w-full sm:w-[250px] px-5 py-3 text-center"
                // className="text-white bg-violet-700 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[14px] w-full sm:w-auto px-5 py-3.5 text-center 
                // dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={click}
            >
                {children}
            </button>
        case 'MiniPrimary':
            return <button
                type={type ? type : "submit"}

                className="w-full text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2  transition-all"

                // className="text-white bg-violet-700 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[14px] w-full sm:w-auto px-5 py-3.5 text-center 
                // dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={click}
            >
                {children}
            </button>
        case 'Success':
            return <button
                type={type ? type : "submit"}

                className="w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2  transition-all"

                // className="text-white bg-violet-700 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[14px] w-full sm:w-auto px-5 py-3.5 text-center 
                // dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={click}
            >
                {children}
            </button>

        case 'Disable':
            return <button
                type={type ? type : "submit"}
                className={`w-full text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2  transition-all`}
                // className="text-white bg-violet-700 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[14px] w-full sm:w-auto px-5 py-3.5 text-center 
                // dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={click}
            >
                {children}
            </button>
        case 'Danger':
            return <button
                type={type ? type : "submit"}
                className="w-full text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2  transition-all"
                onClick={click}
            >
                {children}
            </button>
        default:

    }
}