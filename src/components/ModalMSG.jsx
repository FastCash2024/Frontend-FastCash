'use client'
// import style from '../styles/Loader.module.css' 
import { useAppContext } from '@/context/AppContext.js'
import Button from '@/components/Button'
import TextEditor from '@/components/TextEditor'
import { useState } from 'react'
import style from '@/components/ModatMSG.module.css'

export default function Modal({ children, theme, button, funcion, alert }) {
    const { nav, setNav, user, userDB, setUserProfile, state, setState, modal, setModal } = useAppContext()

    const [textEditor, setTextEditor] = useState("")


    function handlerTextEditorOnChange(content, delta, source, editor) {
        // console.log(editor.getHTML())
        setTextEditor(editor.getHTML())

    }


    return (
        <div className="fixed top-0 left-0 w-screen min-h-screen z-50"
            style={{
                backgroundImage: 'url(/background.png)',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}>
            <div className={`h-screen w-screen flex justify-center items-center  fixed top-0 left-0  z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 bg-[#000000c7]`}>



                <div className={`relative max-w-[600px] w-full ${theme == 'Success' && 'bg-[#29802731]'}  ${theme == 'Danger' && 'bg-[#AF3D5231]'} rounded-lg shadow p-5 `}>
                   
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-[#FFF500] hover:bg-gray-200 hover:text-gray-900 rounded-lg text-[14px] w-8 h-8 ml-auto inline-flex justify-center items-center  dark:hover:text-white" onClick={() => setModal('')}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className=" text-center">
                        <div className={style.editor}>
                            <TextEditor setValue={handlerTextEditorOnChange} value={textEditor ? textEditor : 'nada'} edit={true} />
                        </div>
                        {/* <Button theme='Blank' click={() => setModal('')}></Button> */}
                        <br /> <br />
                        <Button theme="Primary" click={funcion}>Enviar</Button>
                    </div>
                </div>




            </div>
        </div>
    )
}




























// 'use client'
// // import style from '../styles/Loader.module.css'
// import { useAppContext } from '@/context/AppContext.js'
// import Button from '@/components/Button'
// import TextEditor from '@/components/TextEditor'
// import {useState} from 'react'
// import style from '@/components/ModatMSG.module.css'

// export default function Modal({ children, theme, button, funcion, alert }) {
//     const { nav, setNav, user, userDB, setUserProfile, state, setState, modal, setModal } = useAppContext()

//     const [textEditor, setTextEditor] = useState("")


//     function handlerTextEditorOnChange(content, delta, source, editor) {
//         // console.log(editor.getHTML())
//         setTextEditor(editor.getHTML())
//     }



//     return (
//         <div className="fixed top-0 left-0 w-screen min-h-screen z-50"
//             style={{
//                 backgroundImage: 'url(/background.png)',
//                 backgroundAttachment: 'fixed',
//                 backgroundPosition: 'center',
//                 backgroundSize: 'cover',
//             }}>
//             <div className={`h-screen w-screen flex justify-center items-center  fixed top-0 left-0  z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 bg-[#000000c7]`}>
//                 <div className={`relative max-w-[500px] w-full ${theme == 'Success' && 'bg-[#29802731]'}  ${theme == 'Danger' && 'bg-[#AF3D5231]'} rounded-lg shadow p-5 `}>
//                     <div className='w-full flex justify-center'>
//                         <img src="/logo.svg" className='w-[100px]' alt="User" />
//                     </div>
//                     <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-[#FFF500] hover:bg-gray-200 hover:text-gray-900 rounded-lg text-[14px] w-8 h-8 ml-auto inline-flex justify-center items-center  dark:hover:text-white" onClick={() => setModal('')}>
//                         <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//                             <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
//                         </svg>
//                         <span className="sr-only">Close modal</span>
//                     </button>
//                     <div className="p-6 text-center">
//                     <div className={style.editor}>
//                         {/* <TextEditor value={handlerTextEditorOnChange} setValue={textEditor ? textEditor : 'nada'} edit={true} /> */}
//                     </div>
//                         {/* <Button theme='Blank' click={() => setModal('')}></Button> */}
//                         <Button theme={theme} click={funcion}>Enviar</Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
